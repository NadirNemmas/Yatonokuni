import { supabase } from "./supabaseClient.js";

/**
 * Insert a character into the characters table.
 */
export async function insertCharacter(userId, name, statsOrItemLevel) {
  const payload = {
    name,
    item_level: typeof statsOrItemLevel === "number" ? statsOrItemLevel : null,
    user_id: userId || null,
  };

  const { data, error } = await supabase
    .from("characters")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Get characters for a given user.
 */
export async function getCharactersByUser(userId) {
  if (!userId) {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a user by their Supabase auth id (auth_id)
 */
export async function getUserByAuthId(authId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();
  if (error) throw error;
  return data;
}

export const db = {
  insertCharacter,
  getCharactersByUser,
  getUserByAuthId,
};
