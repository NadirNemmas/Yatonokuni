import { useTranslation } from "react-i18next";
import { Github, Linkedin, Mail } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher.jsx";
import "./styles/footer.scss";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="https://www.linkedin.com/in/an-nemmas/" target="_blank" rel="noopener noreferrer" className="footer-name">
          <Linkedin size={12} /> Nadir Nemmas
        </a>
        <a href="https://github.com/NadirNemmas" target="_blank" rel="noopener noreferrer">
          <Github size={12} /> github.com/NadirNemmas
        </a>
      </div>

      <div className="footer-center">
        <a href="/licence" target="_blank" rel="noopener noreferrer">
          {t("footer.copyright")}
        </a>
      </div>

      <div className="footer-right">
        <a href="mailto:ahmed-nadir.nemmas.1@ens.etsmtl.ca">
          <Mail size={12} /> {t("home.contact.schoolEmail")}
        </a>
        <a href="mailto:nadirne91@gmail.com">
          <Mail size={12} /> {t("home.contact.personalEmail")}
        </a>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
