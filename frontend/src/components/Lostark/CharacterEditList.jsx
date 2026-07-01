import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Plus } from "lucide-react";
import CharacterForm from "./CharacterForm.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";

export default function CharacterEditList({ accountId, characters, onCharactersUpdate, onRefresh, refreshing }) {
  const { t } = useTranslation();
  const [editTarget, setEditTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleAdd(payload) {
    try {
      const res = await fetch(`/lostark/accounts/${accountId}/characters`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setShowAdd(false);
        onRefresh?.();
      }
    } catch {}
  }

  async function handleEdit(payload) {
    if (!editTarget) return;
    try {
      const res = await fetch(
        `/lostark/accounts/${accountId}/characters/${editTarget.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.ok) {
        onCharactersUpdate(data.character);
        setEditTarget(null);
      }
    } catch {}
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await fetch(`/lostark/accounts/${accountId}/characters/${deleteTarget}`, {
        method: "DELETE",
        credentials: "include",
      });
      onCharactersUpdate(null, null, deleteTarget);
    } catch {}
    setDeleteTarget(null);
  }

  const sorted = [...characters].sort((a, b) => b.ilvl - a.ilvl);

  if (refreshing) {
    return (
      <div className="la-char-list-loader">
        <div className="la-spinner" />
        <p>{t("lostark.refreshing")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="la-char-list">
        {sorted.map((char) => {
          const progressPct =
            char.goal_cp && char.goal_cp > 0
              ? Math.min(100, Math.round((char.current_cp / char.goal_cp) * 100))
              : null;
          return (
            <div key={char.id} className={`la-char-row${char.is_main ? " la-char-row--main" : ""}`}>
              <div className="la-char-row__info">
                <div className="la-char-row__header">
                  <span className="la-char-row__name">{char.name}</span>
                  {char.is_main && (
                    <span className="la-char-row__main-badge">{t("lostark.characterList.mainBadge")}</span>
                  )}
                </div>
                <div className="la-char-row__stats">
                  <span className="la-char-row__chip">Lv.{char.level}</span>
                  <span className="la-char-row__chip la-char-row__chip--ilvl">ilvl {char.ilvl}</span>
                  <span className="la-char-row__chip">
                    {char.current_cp.toLocaleString()} CP
                    {char.goal_cp ? ` / ${char.goal_cp.toLocaleString()}` : ""}
                  </span>
                </div>
                {progressPct !== null && (
                  <div className="la-char-row__progress">
                    <div
                      className="la-char-row__progress-fill"
                      style={{ width: `${progressPct}%` }}
                    />
                    <span className="la-char-row__progress-label">{progressPct}%</span>
                  </div>
                )}
              </div>
              <div className="la-char-row__actions">
                <button className="la-icon-btn" title={t("lostark.characterList.edit")} onClick={() => setEditTarget(char)}>
                  <Pencil size={14} />
                </button>
                <button className="la-icon-btn la-icon-btn--danger" title={t("lostark.delete")} onClick={() => setDeleteTarget(char.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        <button className="la-add-char-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> {t("lostark.characterList.addCharacter")}
        </button>
      </div>

      <CharacterForm
        isOpen={showAdd}
        initial={null}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
      />
      <CharacterForm
        isOpen={!!editTarget}
        initial={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
      />
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        message={t("lostark.characterForm.deleteMessage")}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
