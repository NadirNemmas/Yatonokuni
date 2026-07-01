import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AccountCard({ account, onClick, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="la-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <button
        className="la-card__delete"
        title={t("lostark.delete")}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <Trash2 size={15} />
      </button>

      <div className="la-card__region">{account.region}</div>

      <div className="la-card__stats">
        <div className="la-card__stat">
          <span className="la-card__stat-label">{t("lostark.accountCard.characters")}</span>
          <span className="la-card__stat-value">{account.character_count}</span>
        </div>
        <div className="la-card__stat">
          <span className="la-card__stat-label">{t("lostark.accountCard.avgCp")}</span>
          <span className="la-card__stat-value">
            {account.avg_cp > 0 ? account.avg_cp.toLocaleString() : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
