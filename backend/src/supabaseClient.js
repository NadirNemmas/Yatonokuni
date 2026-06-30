import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables"
  );
}

// Client pour les opérations auth (signInWithPassword, signOut, admin.*)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Client pour les requêtes DB — n'appelle jamais signInWithPassword,
// donc le service role key ne sera jamais remplacé par un JWT utilisateur.
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${supabaseKey}` } },
});
