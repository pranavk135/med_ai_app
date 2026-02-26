import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Admin client for user creation
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Sign up route
app.post("/make-server-57da0870/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user profile in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      name,
      email,
      createdAt: new Date().toISOString(),
      role: 'patient',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.6
      }
    });

    return c.json({ user: data.user });
  } catch (err) {
    console.log(`Unexpected error during signup: ${err}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Protected route example: Get user profile/data
app.get("/make-server-57da0870/profile", async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return c.json({ error: "Unauthorized" }, 401);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user specific data from KV store
  const userData = await kv.get(`user_profile:${user.id}`);
  return c.json({ user, profile: userData || {} });
});

// Update user data
app.post("/make-server-57da0870/update-profile", async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return c.json({ error: "Unauthorized" }, 401);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  await kv.set(`user_profile:${user.id}`, body);
  return c.json({ success: true });
});

Deno.serve(app.fetch);
