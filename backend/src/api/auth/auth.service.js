import { supabase, supabaseAdmin } from "../../supabaseClient.js";

// Sign up the user
export async function signupUser({ email, password, firstName, lastName }) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { firstName, lastName },
  });

  if (error) throw error;

  const authUser = data.user;

  const { error: profileError } = await supabaseAdmin.from("users").insert([
    {
      auth_id: authUser.id,
      email,
      first_name: firstName,
      last_name: lastName,
    },
  ]);

  if (profileError) {
    // Rollback: supprimer l'auth user créé pour éviter un état incohérent
    await supabase.auth.admin.deleteUser(authUser.id).catch(() => {});
    throw profileError;
  }

  return authUser;
}

// Login the user
export const loginUser = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const e = new Error(error.message || "Authentication failed");
      e.status = error.status || 401;
      throw e;
    }

    // Supabase peut renvoyer data.user/data.session ou data.user null si non confirmé
    if (!data || !data.session) {
      const e = new Error(
        "No session returned (user might not be confirmed or credentials invalid)"
      );
      e.status = 401;
      throw e;
    }

    return { session: data.session, user: data.user };
  } catch (err) {
    // Log complet et rethrow
    console.error("loginUser thrown error:", err && (err.stack || err));
    const e = err instanceof Error ? err : new Error(String(err));
    if (!e.status) e.status = 401;
    throw e;
  }
};

// Update user profile (crée le profil s'il n'existe pas encore)
export const updateUserProfile = async (uid, fields) => {
  const optional = [
    "username", "date_of_birth",
    "github_url", "linkedin_url", "instagram_url", "website_url",
    "avatar_url",
  ];
  const updates = {};
  if (fields.email) updates.email = fields.email;
  for (const key of optional) {
    if (fields[key] !== undefined) {
      // Convertit les chaînes vides en null pour les champs optionnels
      updates[key] = fields[key] === "" ? null : fields[key];
    }
  }

  // Tenter la mise à jour
  const { data: rows, error: updateErr } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("auth_id", uid)
    .select();

  if (updateErr) throw updateErr;

  // Si aucune ligne mise à jour → l'utilisateur n'a pas encore de profil, on le crée
  if (!rows?.length) {
    const { data: authData } = await supabase.auth.admin.getUserById(uid);
    const meta = authData?.user?.user_metadata || {};

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("users")
      .insert([{
        auth_id:    uid,
        email:      updates.email || authData?.user?.email || "",
        first_name: meta.firstName || "",
        last_name:  meta.lastName  || "",
        ...updates,
      }])
      .select()
      .single();

    if (insertErr) throw insertErr;
    return inserted;
  }

  return rows[0];
};

// Upload avatar to Supabase Storage and return public URL
export const uploadAvatar = async (uid, base64Data) => {
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error("Format image invalide");

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const ext = mimeType.split("/")[1];
  const path = `${uid}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, buffer, { contentType: mimeType, upsert: true });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
};

// Fetch profile row by Supabase auth UID
export const getUserProfileById = async (uid) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("auth_id", uid)
    .single();

  if (error) return null;
  return data;
};

// Logout the user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

