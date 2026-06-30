import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../i18n/i18n.js";
import "./styles/language-switcher.scss";

const SELECT_THRESHOLD = 3;

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  if (LANGUAGES.length > SELECT_THRESHOLD) {
    return (
      <div className="lang-switcher lang-switcher--select">
        <Globe size={16} className="lang-icon" />
        <span className="lang-label">{t("lang.label")}</span>
        <select
          value={current}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="lang-select"
        >
          {LANGUAGES.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="lang-switcher">
      <Globe size={16} className="lang-icon" />
      {LANGUAGES.map((lng, index) => (
        <span key={lng.code} className="lang-btn-group">
          {index > 0 && <span className="lang-sep">|</span>}
          <button
            className={current === lng.code ? "active" : ""}
            onClick={() => i18n.changeLanguage(lng.code)}
          >
            {lng.code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
