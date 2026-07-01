import { useState } from "react";
import { useTranslation } from "react-i18next";
import REGIONS from "../../data/lostark-regions.json";

export default function AccountForm({ isOpen, onClose, onSave }) {
  const { t } = useTranslation();
  const [region, setRegion] = useState(REGIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/lostark/accounts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: REGIONS.find((r) => r.id === region)?.name ?? region }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Erreur");
      onSave(data.account);
      setRegion(REGIONS[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="la-overlay" onClick={onClose}>
      <div className="la-modal" onClick={(e) => e.stopPropagation()}>
        <p className="la-modal__title">{t("lostark.accountForm.title")}</p>
        <form className="la-form" onSubmit={handleSubmit}>
          <div className="la-form__field">
            <label>{t("lostark.accountForm.region")}</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          {error && <p style={{ color: "#e53e3e", fontSize: "0.82rem" }}>{error}</p>}
          <div className="la-form__actions">
            <button type="submit" className="button" disabled={loading}>
              {loading ? t("lostark.accountForm.creating") : t("lostark.accountForm.create")}
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
