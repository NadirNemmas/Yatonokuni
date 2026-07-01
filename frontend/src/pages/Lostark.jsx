import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout/Layout.jsx";
import AccountCard from "../components/Lostark/AccountCard.jsx";
import AccountForm from "../components/Lostark/AccountForm.jsx";
import DeleteConfirmModal from "../components/Lostark/DeleteConfirmModal.jsx";
import { Plus } from "lucide-react";
import "../components/Lostark/styles/lostark.scss";

export default function Lostark() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch("/lostark/accounts", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setAccounts(d.accounts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleAccountCreated(account) {
    setAccounts((prev) => [...prev, account]);
    setShowForm(false);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await fetch(`/lostark/accounts/${deleteTarget}`, {
        method: "DELETE",
        credentials: "include",
      });
      setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget));
    } catch {}
    setDeleteTarget(null);
  }

  return (
    <Layout>
      <div className="la-page">
        <div className="la-header">
          <h1>{t("lostark.title")}</h1>
          <button className="la-add-btn" onClick={() => setShowForm(true)}>
            <Plus size={16} /> {t("lostark.addAccount")}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>{t("lostark.loading")}</p>
        ) : accounts.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>{t("lostark.noAccounts")}</p>
        ) : (
          <div className="la-accounts-grid">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onClick={() => navigate(`/lostark/account/${acc.id}`)}
                onDelete={() => setDeleteTarget(acc.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AccountForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleAccountCreated}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        message={t("lostark.deleteAccountMessage")}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}
