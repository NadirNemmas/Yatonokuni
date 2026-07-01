import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import RAIDS from "../../data/lostark-raids.json";
import { getRaidDone } from "../../lib/lostark.js";
import Main6Modal from "./Main6Modal.jsx";

// Always shown, always enabled (no ilvl requirement)
const FIXED_IDS = new Set(RAIDS.filter((r) => r.ilvl === 0).map((r) => r.id));
// Always shown, enabled only when char.ilvl >= raid.ilvl (e.g. Timeglass)
const THRESHOLD_IDS = new Set(RAIDS.filter((r) => r.default && r.ilvl > 0).map((r) => r.id));
// Weekly raids subject to top-3 per character — reversed so end-of-list raids win ilvl ties
const POOL_RAIDS = RAIDS.filter((r) => r.type === "weekly" && r.ilvl > 0 && !r.default).reverse();

function RaidHeader({ raid }) {
  const displayName = raid.slot ? `${raid.name} ${raid.slot}` : raid.name;
  const diffKey = raid.difficulty?.toLowerCase() ?? raid.type;
  const badgeLabel = raid.difficulty ?? (raid.type === "weekly" ? "Weekly" : "Daily");
  return (
    <div className="la-raid-header">
      <span className="la-raid-header__name">{displayName}</span>
      <span className={`la-raid-header__badge la-raid-header__badge--${diffKey}`}>
        {badgeLabel}
      </span>
      {raid.ilvl > 0 && <span className="la-raid-header__ilvl">{raid.ilvl}</span>}
    </div>
  );
}

export default function DailiesTable({ accountId, characters, onCharactersUpdate }) {
  const { t } = useTranslation();
  const [showMain6Modal, setShowMain6Modal] = useState(false);
  const [filterMain, setFilterMain] = useState(false);
  const [sortCp, setSortCp] = useState(null);
  const [sortIlvl, setSortIlvl] = useState(null);

  const main6 = characters.filter((c) => c.is_main);
  const hasMain6 = main6.length > 0;

  // For each character: top-3 pool raids closest to (≤) their ilvl
  const charRaidSets = useMemo(() => {
    const map = new Map();
    for (const char of characters) {
      const top3 = POOL_RAIDS.filter((r) => char.ilvl >= r.ilvl)
        .sort((a, b) => b.ilvl - a.ilvl)
        .slice(0, 3)
        .map((r) => r.id);
      map.set(char.id, new Set(top3));
    }
    return map;
  }, [characters]);

  // Display columns = fixed + threshold + union of all characters' top-3, in original RAIDS order
  const displayRaids = useMemo(() => {
    const union = new Set();
    charRaidSets.forEach((s) => s.forEach((id) => union.add(id)));
    return RAIDS.filter((r) => FIXED_IDS.has(r.id) || THRESHOLD_IDS.has(r.id) || union.has(r.id));
  }, [charRaidSets]);

  let rows = filterMain ? main6 : [...characters].sort((a, b) => b.is_main - a.is_main);
  if (sortCp) {
    rows = [...rows].sort((a, b) =>
      sortCp === "asc" ? a.current_cp - b.current_cp : b.current_cp - a.current_cp
    );
  }
  if (sortIlvl) {
    rows = [...rows].sort((a, b) =>
      sortIlvl === "asc" ? a.ilvl - b.ilvl : b.ilvl - a.ilvl
    );
  }

  function cycleSort(current, set, reset) {
    const next = current === null ? "desc" : current === "desc" ? "asc" : null;
    set(next);
    if (next !== null) reset(null);
  }

  function sortLabel(key, current) {
    if (current === null) return key;
    return current === "desc" ? `${key} ↓` : `${key} ↑`;
  }

  function isEnabled(char, raid) {
    if (FIXED_IDS.has(raid.id)) return true;
    if (THRESHOLD_IDS.has(raid.id)) return char.ilvl >= raid.ilvl;
    return charRaidSets.get(char.id)?.has(raid.id) ?? false;
  }

  async function toggleRaid(charId, raidId, isDaily, currentDone) {
    try {
      const res = await fetch(
        `/lostark/accounts/${accountId}/characters/${charId}/raid`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raidId, done: !currentDone }),
        }
      );
      const data = await res.json();
      if (data.ok) onCharactersUpdate(data.character);
    } catch {}
  }

  async function handleMain6Save(characterIds) {
    try {
      const res = await fetch(`/lostark/accounts/${accountId}/main6`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterIds }),
      });
      const data = await res.json();
      if (data.ok) {
        onCharactersUpdate(null, data.account.lostark_characters);
        setShowMain6Modal(false);
      }
    } catch {}
  }

  return (
    <>
      <div className="la-filters">
        <button
          className={`la-filter-btn${filterMain ? " active" : ""}`}
          onClick={() => setFilterMain((v) => !v)}
          disabled={!hasMain6}
        >
          {t("lostark.table.filterMain6")}
        </button>
        <button
          className={`la-filter-btn${sortCp ? " active" : ""}`}
          onClick={() => cycleSort(sortCp, setSortCp, setSortIlvl)}
        >
          {sortLabel(t("lostark.table.cp"), sortCp)}
        </button>
        <button
          className={`la-filter-btn${sortIlvl ? " active" : ""}`}
          onClick={() => cycleSort(sortIlvl, setSortIlvl, setSortCp)}
        >
          {sortLabel("ilvl", sortIlvl)}
        </button>
      </div>

      <div className="la-table-wrap">
        <table className="la-table">
          <thead>
            <tr>
              <th>{t("lostark.table.character")}</th>
              {displayRaids.map((raid, i) => {
                const prev = displayRaids[i - 1];
                const isSectionBorder = raid.type === "weekly" && prev?.type === "daily";
                return (
                  <th key={raid.id} className={isSectionBorder ? "la-section-border" : ""}>
                    <RaidHeader raid={raid} />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((char) => (
              <tr key={char.id}>
                <td>
                  <div className="la-char-cell">
                    <div className="la-char-cell__header">
                      <span className="la-char-cell__name">{char.name}</span>
                      {char.is_main && (
                        <span className="la-char-cell__main-star" title="Main 6">★</span>
                      )}
                    </div>
                    <span className="la-char-cell__level">Lv.{char.level} · ilvl {char.ilvl}</span>
                    <span className="la-char-cell__cp">{char.current_cp.toLocaleString()} CP</span>
                  </div>
                </td>
                {displayRaids.map((raid, i) => {
                  const prev = displayRaids[i - 1];
                  const isSectionBorder = raid.type === "weekly" && prev?.type === "daily";
                  const enabled = isEnabled(char, raid);
                  const isDaily = raid.type === "daily";
                  const done = enabled && getRaidDone(char, raid.id, isDaily);
                  const title = !enabled
                    ? char.ilvl < raid.ilvl
                      ? t("lostark.table.ilvlRequired", { ilvl: raid.ilvl })
                      : t("lostark.table.notInTop3")
                    : raid.name;
                  return (
                    <td key={raid.id} className={isSectionBorder ? "la-section-border" : ""}>
                      <button
                        className={`la-check-btn${done ? " done" : ""}`}
                        disabled={!enabled}
                        onClick={() => toggleRaid(char.id, raid.id, isDaily, done)}
                        title={title}
                      >
                        {done ? "✓" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="la-table-footer">
        <button className="la-main6-btn" onClick={() => setShowMain6Modal(true)}>
          {hasMain6 ? t("lostark.table.editMain6") : t("lostark.table.chooseMain6")}
        </button>
      </div>

      <Main6Modal
        isOpen={showMain6Modal}
        characters={characters}
        onClose={() => setShowMain6Modal(false)}
        onSave={handleMain6Save}
      />
    </>
  );
}
