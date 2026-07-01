import { supabaseAdmin } from "../../supabaseClient.js";

async function resolveUserId(authUid) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("auth_id", authUid)
    .single();
  if (error || !data) throw Object.assign(new Error("Utilisateur introuvable"), { status: 401 });
  return data.id;
}

async function verifyOwnership(accountId, userId) {
  const { data, error } = await supabaseAdmin
    .from("lostark_accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();
  if (error || !data) throw Object.assign(new Error("Account introuvable"), { status: 404 });
}

// ── Accounts ────────────────────────────────────────────────────────────────

export async function getAccounts(authUid) {
  const userId = await resolveUserId(authUid);
  const { data, error } = await supabaseAdmin
    .from("lostark_accounts")
    .select("id, region, created_at, lostark_characters(id, current_cp)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map((acc) => {
    const chars = acc.lostark_characters ?? [];
    return {
      id: acc.id,
      region: acc.region,
      created_at: acc.created_at,
      character_count: chars.length,
      avg_cp:
        chars.length > 0
          ? Math.round(chars.reduce((s, c) => s + (c.current_cp || 0), 0) / chars.length)
          : 0,
    };
  });
}

export async function createAccount(authUid, { region }) {
  const userId = await resolveUserId(authUid);
  const { data, error } = await supabaseAdmin
    .from("lostark_accounts")
    .insert([{ user_id: userId, region }])
    .select()
    .single();
  if (error) throw error;
  return { ...data, character_count: 0, avg_cp: 0 };
}

export async function deleteAccount(accountId, authUid) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);
  const { error } = await supabaseAdmin
    .from("lostark_accounts")
    .delete()
    .eq("id", accountId);
  if (error) throw error;
}

export async function getAccountWithCharacters(accountId, authUid) {
  const userId = await resolveUserId(authUid);
  const { data, error } = await supabaseAdmin
    .from("lostark_accounts")
    .select("id, region, created_at, lostark_characters(*)")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();
  if (error || !data) throw Object.assign(new Error("Account introuvable"), { status: 404 });
  return data;
}

// ── Characters ───────────────────────────────────────────────────────────────

export async function createCharacter(accountId, authUid, fields) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);
  const { name, level, ilvl, current_cp, goal_cp } = fields;
  if (!name) throw Object.assign(new Error("Nom requis"), { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("lostark_characters")
    .insert([{
      account_id: accountId,
      name,
      level:      level      ?? 1,
      ilvl:       ilvl       ?? 0,
      current_cp: current_cp ?? 0,
      goal_cp:    goal_cp    ?? null,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCharacter(charId, accountId, authUid, fields) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);
  const allowed = ["name", "level", "ilvl", "current_cp", "goal_cp"];
  const updates = {};
  for (const key of allowed) {
    if (fields[key] !== undefined)
      updates[key] = fields[key] === "" ? null : fields[key];
  }
  const { data, error } = await supabaseAdmin
    .from("lostark_characters")
    .update(updates)
    .eq("id", charId)
    .eq("account_id", accountId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCharacter(charId, accountId, authUid) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);
  const { error } = await supabaseAdmin
    .from("lostark_characters")
    .delete()
    .eq("id", charId)
    .eq("account_id", accountId);
  if (error) throw error;
}

// ── Main 6 ───────────────────────────────────────────────────────────────────

export async function updateMain6(accountId, authUid, characterIds) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);
  if (characterIds.length > 6)
    throw Object.assign(new Error("Maximum 6 personnages principaux"), { status: 400 });

  const { error: resetErr } = await supabaseAdmin
    .from("lostark_characters")
    .update({ is_main: false })
    .eq("account_id", accountId);
  if (resetErr) throw resetErr;

  if (characterIds.length > 0) {
    const { error } = await supabaseAdmin
      .from("lostark_characters")
      .update({ is_main: true })
      .in("id", characterIds)
      .eq("account_id", accountId);
    if (error) throw error;
  }
}

// ── Dailies / Raids ──────────────────────────────────────────────────────────

export async function updateRaidStatus(charId, accountId, authUid, { raidId, done }) {
  const userId = await resolveUserId(authUid);
  await verifyOwnership(accountId, userId);

  const { data: char, error: fetchErr } = await supabaseAdmin
    .from("lostark_characters")
    .select("raids_done")
    .eq("id", charId)
    .eq("account_id", accountId)
    .single();
  if (fetchErr || !char) throw Object.assign(new Error("Personnage introuvable"), { status: 404 });

  const raidsDone = { ...(char.raids_done || {}) };
  if (done) raidsDone[raidId] = new Date().toISOString();
  else delete raidsDone[raidId];

  const { data, error } = await supabaseAdmin
    .from("lostark_characters")
    .update({ raids_done: raidsDone })
    .eq("id", charId)
    .eq("account_id", accountId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
