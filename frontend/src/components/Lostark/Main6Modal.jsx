import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Main6Modal({ isOpen, characters, onClose, onSave }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(
    () => characters.filter((c) => c.is_main).map((c) => c.id)
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function toggle(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 6) return prev;
      return [...prev, id];
    });
  }

  async function handleSave() {
    setLoading(true);
    try {
      await onSave(selected);
    } finally {
      setLoading(false);
    }
  }

  const sorted = [...characters].sort((a, b) => b.ilvl - a.ilvl);

  return (
    <div className="la-overlay" onClick={onClose}>
      <div className="la-modal" style={{ width: "min(500px, 100%)" }} onClick={(e) => e.stopPropagation()}>
        <p className="la-modal__title">{t("lostark.main6Modal.title")}</p>
        <p className="la-main6-hint">{t("lostark.main6Modal.selected", { count: selected.length })}</p>

        <div className="la-main6-list">
          {sorted.map((char) => {
            const isSel = selected.includes(char.id);
            const disabled = !isSel && selected.length >= 6;
            return (
              <div
                key={char.id}
                className={`la-main6-item${isSel ? " selected" : ""}${disabled ? " disabled" : ""}`}
                onClick={() => !disabled && toggle(char.id)}
              >
                <div className="la-main6-item__dot">{isSel ? "✓" : ""}</div>
                <span className="la-main6-item__name">{char.name}</span>
                <span className="la-main6-item__stats">
                  Lv.{char.level} · {char.ilvl} ilvl
                </span>
              </div>
            );
          })}
        </div>

        <div className="la-form__actions">
          <button className="button" onClick={handleSave} disabled={loading}>
            {loading ? "..." : t("lostark.main6Modal.confirm")}
          </button>
          <button className="button button--secondary" onClick={onClose}>
            {t("lostark.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
