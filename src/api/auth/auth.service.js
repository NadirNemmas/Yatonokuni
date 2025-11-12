import { supabase } from "../../supabaseClient.js";
import jwt from "jsonwebtoken";

const { SUPABASE_JWT_SECRET } = process.env;
if (!SUPABASE_JWT_SECRET) {
  console.error("SUPABASE_JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

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
    // Debug log
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

/**
 * getUserByToken
 * - accepte soit :
 *    * soit JWT signé localement (cookie access_token_jwt) -> on vérifie et on prend decoded.sub (UID)
 *    * soit un access_token Supabase (session.access_token) -> on appelle supabase.auth.getUser({ access_token })
 * - retourne { authUser, profile } ou lance une erreur
 */
export const getUserByToken = async (tokenOrJwtOrUid) => {
  if (!tokenOrJwtOrUid) throw new Error("No token provided");

  let uid = null;
  let authUser = null;

  // 1) Si on reçoit explicitement un UID (cas d'appel interne possible), accepte-le
  if (
    typeof tokenOrJwtOrUid === "string" &&
    // heuristique simple : un uid supabase (UUID) contient des tirets et n'est pas un JWT (JWT a deux points '.')
    !tokenOrJwtOrUid.includes(".") &&
    tokenOrJwtOrUid.includes("-")
  ) {
    uid = tokenOrJwtOrUid;
  } else {
    // 2) On essaie d'abord de voir si c'est notre JWT signé localement
    try {
      const decoded = jwt.verify(tokenOrJwtOrUid, SUPABASE_JWT_SECRET, {
        algorithms: ["HS256"],
      });
      // decoded.sub devrait être l'UID Supabase
      if (!decoded || !decoded.sub) {
        throw new Error("JWT valide mais sans claim 'sub'");
      }
      uid = decoded.sub;
      // On reconstruit un objet authUser minimal à partir des claims (utile pour retourner quelque chose)
      authUser = {
        id: decoded.sub,
        email: decoded.email,
        user_metadata: {
          display_name: decoded.display_name || null,
        },
      };
    } catch (jwtErr) {
      // Si ce n'était pas un JWT signé par nous, on considère que c'est possiblement
      // un access_token Supabase et on appelle supabase.auth.getUser(...)
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser({
            access_token_jwt: tokenOrJwtOrUid,
          });
        if (authError) throw authError;
        authUser = authData?.user;
        if (!authUser)
          throw new Error("Invalid Supabase access token (no user)");
        uid = authUser.id;
      } catch (supabaseErr) {
        // Si les deux méthodes échouent, on renvoie l'erreur originelle (JWT) ou l'erreur supabase
        const combinedMessage = `Token is neither a valid local JWT nor a valid Supabase access token: ${
          jwtErr.message
        }; ${supabaseErr?.message || ""}`;
        const e = new Error(combinedMessage);
        e.status = 401;
        throw e;
      }
    }
  }

  // 3) Récupère le profil dans la table `users` (champ auth_id)
  try {
    const { data: userRecord, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", uid)
      .single();

    if (dbError) {
      // possible que l'utilisateur soit créé côté Auth mais pas dans la table `users`
      // on renvoie quand même authUser si présent, sinon erreur.
      if (authUser) {
        return { authUser, profile: null };
      }
      throw dbError;
    }

    return { authUser, profile: userRecord };
  } catch (err) {
    console.error("getUserByToken -> DB error:", err && (err.stack || err));
    throw err;
  }
};
