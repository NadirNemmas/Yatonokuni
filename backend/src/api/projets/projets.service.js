import { supabase } from "../../supabaseClient.js";

export async function getAllProjets() {
  const { data, error } = await supabase
    .from("projets")
    .select("id, name, slug, description, technologies, git_repo")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}
