import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout/Layout.jsx";
import DailiesTable from "../components/Lostark/DailiesTable.jsx";
import CharacterEditList from "../components/Lostark/CharacterEditList.jsx";
import { ChevronLeft } from "lucide-react";
import "../components/Lostark/styles/lostark.scss";

export default function LostarkAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [account, setAccount] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState("dailies"); // "dailies" | "edit"

  useEffect(() => {
    if (!id) return;
    fetch(`/lostark/accounts/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setAccount(d.account);
          setCharacters(d.account.lostark_characters ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function refreshCharacters() {
    setRefreshing(true);
    try {
      const res = await fetch(`/lostark/accounts/${id}`, { credentials: "include" });
      const d = await res.json();
      if (d.ok) setCharacters(d.account.lostark_characters ?? []);
    } catch {}
    setRefreshing(false);
  }

  function handleCharacterUpdate(updatedChar, newList = null, deletedId = null) {
    if (newList) {
      setCharacters(newList);
    } else if (deletedId) {
      setCharacters((prev) => prev.filter((c) => c.id !== deletedId));
    } else if (updatedChar) {
      setCharacters((prev) =>
        prev.map((c) => (c.id === updatedChar.id ? updatedChar : c))
      );
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="la-page">
          <p style={{ color: "#9ca3af" }}>{t("lostark.loading")}</p>
        </div>
      </Layout>
    );
  }

  if (!account) {
    return (
      <Layout>
        <div className="la-page">
          <p style={{ color: "#e53e3e" }}>{t("lostark.accountNotFound")}</p>
          <button className="la-back-btn" onClick={() => navigate("/lostark")}>
            <ChevronLeft size={15} /> {t("lostark.back")}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="la-page">
        <div className="la-account-header">
          <button className="la-back-btn" onClick={() => navigate("/lostark")}>
            <ChevronLeft size={15} /> {t("lostark.back")}
          </button>
          <h1>{account.region}</h1>
          <div className="la-mode-switch">
            <button
              className={mode === "dailies" ? "active" : ""}
              onClick={() => setMode("dailies")}
            >
              {t("lostark.modeDailies")}
            </button>
            <button
              className={mode === "edit" ? "active" : ""}
              onClick={() => setMode("edit")}
            >
              {t("lostark.modeEdit")}
            </button>
          </div>
        </div>

        {characters.length === 0 && mode === "dailies" ? (
          <p style={{ color: "#9ca3af" }}>{t("lostark.noCharacters")}</p>
        ) : mode === "dailies" ? (
          <DailiesTable
            accountId={id}
            characters={characters}
            onCharactersUpdate={handleCharacterUpdate}
          />
        ) : (
          <CharacterEditList
            accountId={id}
            characters={characters}
            onCharactersUpdate={handleCharacterUpdate}
            onRefresh={refreshCharacters}
            refreshing={refreshing}
          />
        )}
      </div>
    </Layout>
  );
}
