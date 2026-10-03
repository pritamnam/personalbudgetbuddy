import { createClient } from "@supabase/supabase-js";

// Your personal Supabase project.
// Note: createClient needs the project BASE url — it appends /rest/v1/ itself,
// so the RESTful url (".../rest/v1/") would double the path and break every call.
const supabaseUrl = "https://mfdeotdrhdtxxbboufli.supabase.co";
const supabaseKey = "sb_publishable_6jIYsDBpCmrJgdGXetlpdw_tzxolvlg"; // public key, safe in code

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "spendsmart-auth" },
});
