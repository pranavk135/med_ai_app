import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { supabase } from "./supabaseClient";
import { Auth } from "./components/Auth";
import { UpdatePassword } from "./components/UpdatePassword";
import { Loader2 } from "lucide-react";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check if we're in recovery mode from the URL hash or state
    if (window.location.hash && window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      } else if (event === "SIGNED_IN") {
        // Only turn off recovery if we just signed in normally
        // But if we are in recovery, we stay there until password updated
      } else if (event === "USER_UPDATED" && isRecovery) {
        setIsRecovery(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isRecovery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isRecovery) {
    return (
      <>
        <UpdatePassword />
        <Toaster position="top-right" expand={true} richColors />
      </>
    );
  }

  // Gate removed as requested - the app is now accessible without mandatory login
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" expand={true} richColors />
    </>
  );
}
