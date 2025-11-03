import { supabase } from "../supabaseClient.js";

export async function checkDatabaseStatus() {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    return { online: true, message: "Database reachable ✅" };
  } catch (err) {
    return { online: false, message: `Error: ${err.message}` };
  }
}
