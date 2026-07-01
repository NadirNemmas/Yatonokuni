import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const EMPTY = { name: "", level: "", ilvl: "", current_cp: "", goal_cp: "" };

export default function CharacterForm({ isOpen, initial, onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initial
        ? { name: initial.name, level: initial.level, ilvl: initial.ilvl,
            current_cp: initial.current_cp, goal_cp: initial.goal_cp ?? "" }
        : EMPTY);
      setError(null);
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError(t("lostark.characterForm.nameRequired")); return; }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name:       form.name.trim(),
        level:      parseInt(form.level, 10) || 1,
        ilvl:       parseInt(form.ilvl, 10) || 0,
        current_cp: parseInt(form.current_cp, 10) || 0,
        goal_cp:    form.goal_cp !== "" ? parseInt(form.goal_cp, 10) : null,
      };
      onSave(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="la-overlay" onClick={onClose}>
      <div className="la-modal" onClick={(e) => e.stopPropagation()}>
        <p className="la-modal__title">
          {initial ? t("lostark.characterForm.editTitle") : t("lostark.characterForm.addTitle")}
        </p>
        <form className="la-form" onSubmit={handleSubmit}>
          <div className="la-form__field">
            <label>{t("lostark.characterForm.name")}</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder={t("lostark.characterForm.namePlaceholder")} autoFocus />
          </div>
          <div className="la-form__row">
            <div className="la-form__field">
              <label>{t("lostark.characterForm.level")}</label>
              <input name="level" type="number" min="1" max="70" value={form.level} onChange={handleChange} placeholder="60" />
            </div>
            <div className="la-form__field">
              <label>{t("lostark.characterForm.itemLevel")}</label>
              <input name="ilvl" type="number" min="0" value={form.ilvl} onChange={handleChange} placeholder="1600" />
            </div>
          </div>
          <div className="la-form__row">
            <div className="la-form__field">
              <label>{t("lostark.characterForm.currentCp")}</label>
              <input name="current_cp" type="number" min="0" value={form.current_cp} onChange={handleChange} placeholder="0" />
            </div>
            <div className="la-form__field">
              <label>
                {t("lostark.characterForm.goalCp")}{" "}
                <span style={{ fontWeight: 400, color: "#d1d5db" }}>
                  {t("lostark.characterForm.optional")}
                </span>
              </label>
              <input name="goal_cp" type="number" min="0" value={form.goal_cp} onChange={handleChange} placeholder="0" />
            </div>
          </div>
          {error && <p style={{ color: "#e53e3e", fontSize: "0.82rem" }}>{error}</p>}
          <div className="la-form__actions">
            <button type="submit" className="button" disabled={loading}>
              {loading ? "..." : initial ? t("lostark.characterForm.save") : t("lostark.characterForm.add")}
            </button>
            <button type="button" className="button button--secondary" onClick={onClose}>
              {t("lostark.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
