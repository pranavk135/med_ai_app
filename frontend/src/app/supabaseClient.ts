import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServerUrl = (route: string) => {
  return `https://${projectId}.supabase.co/functions/v1/make-server-57da0870/${route}`;
};
