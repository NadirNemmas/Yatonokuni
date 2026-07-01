// Returns true if isoString is the same UTC day as today
export function isToday(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

// Lost Ark weekly reset = Wednesday 10:00 UTC
export function getLastWeeklyReset() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun … 3=Wed
  const daysAgo = day >= 3 ? day - 3 : day + 4;
  const reset = new Date(now);
  reset.setUTCDate(reset.getUTCDate() - daysAgo);
  reset.setUTCHours(10, 0, 0, 0);
  if (reset > now) reset.setUTCDate(reset.getUTCDate() - 7);
  return reset;
}

export function isThisWeek(isoString) {
  if (!isoString) return false;
  return new Date(isoString) > getLastWeeklyReset();
}

export function getRaidDone(character, raidId, isDaily) {
  const ts = character?.raids_done?.[raidId];
  if (!ts) return false;
  return isDaily ? isToday(ts) : isThisWeek(ts);
}
