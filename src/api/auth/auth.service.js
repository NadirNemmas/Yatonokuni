import { supabase } from "../../supabaseClient.js";

// Create a new user
export const createUser = async ({
  email,
  password,
  first_name,
  last_name,
}) => {
  // 1. Sign up with Supabase Auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) throw signUpError;

  const authId = data.user.id;

  // 2. Insert user info into your `users` table
  const { data: user, error: dbError } = await supabase
    .from("users")
    .insert([{ auth_id: authId, first_name, last_name }])
    .single();

  if (dbError) throw dbError;

  return { user, auth: data.user };
};

export const loginUser = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // log utile pour debug (console serveur)
    console.log("Supabase signInWithPassword -> data:", data, "error:", error);

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

// Logout user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

export const getUserByToken = async (token) => {
  if (!token) throw new Error("No token provided");

  // Récupère l'utilisateur à partir d'un access token (shape attendu par supabase-js v2)
  const { data: authData, error: authError } = await supabase.auth.getUser({
    access_token: token,
  });
  if (authError) throw authError;
  const authUser = authData?.user;
  if (!authUser) throw new Error("Invalid token or user not found");

  // Récupère le profil dans la table users (champ auth_id)
  const { data: userRecord, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authUser.id)
    .single();

  if (dbError) {
    // possible que l'utilisateur soit créé côté Auth mais pas dans la table `users`
    throw dbError;
  }

  return { authUser, profile: userRecord };
};
