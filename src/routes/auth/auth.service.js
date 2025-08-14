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

// Login user
export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // Return session and user info
  return { session: data.session, user: data.user };
};

// Logout user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

// Retrieve full user info from your table using Supabase Auth UID
export const getUserByToken = async (token) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError) throw authError;

  const { data: userRecord, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (dbError) throw dbError;

  return userRecord;
};
