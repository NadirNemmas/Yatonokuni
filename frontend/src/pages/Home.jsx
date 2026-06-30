import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header.jsx";
import Layout from "../components/Layout/Layout.jsx";
import SectionBackground from "../components/Background/SectionBackground.jsx";
import SectionDots from "../components/SectionDots/SectionDots.jsx";
import "./styles/pages.scss";

export default function Home() {
  const { t } = useTranslation();

  const HOME_SECTIONS = [
    { id: null, label: t("home.sections.top") },
    { id: "about", label: t("home.sections.about") },
    { id: "features", label: t("home.sections.features") },
    { id: "contact", label: t("home.sections.contact") },
  ];

  return (
    <Layout>
      <SectionDots sections={HOME_SECTIONS} />

      <Header title="Yato no kuni">
        <h2>{t("home.welcome")}</h2>
        <p>{t("home.intro")}</p>
        <p>
          <a target="_blank" href="https://eportfolio.etsmtl.ca/Portfolio/Clef/FpX7fDj0zplsdZZdVmN3">
            {t("home.portfolioLink")}
          </a>
        </p>
        <p>
          <a target="_blank" href="https://github.com/NadirNemmas/Yatonokuni">
            {t("home.githubLink")}
          </a>
        </p>
      </Header>

      <div className="page-container">
        <SectionBackground
          sectionKey="about"
          className="page-container-section div-about"
          id="about"
        >
          <div className="div-box-container">
            <h2 className="div-title">{t("home.about.title")}</h2>
            <p className="div-description" style={{ whiteSpace: "pre-line" }}>
              {t("home.about.description")}
            </p>
          </div>
        </SectionBackground>

        <SectionBackground
          sectionKey="features"
          className="page-container-section div-features"
          id="features"
        >
          <div className="div-box-container">
            <h2 className="div-title">{t("home.features.title")}</h2>
            <p className="div-description" style={{ whiteSpace: "pre-line" }}>
              {t("home.features.description")}
            </p>
          </div>
        </SectionBackground>

        <SectionBackground
          sectionKey="contact"
          className="page-container-section div-contact"
          id="contact"
        >
          <div className="div-box-container">
            <h2 className="div-title">{t("home.contact.title")}</h2>
            <p className="div-description">
              {t("home.contact.intro")}
              <br />
              {t("home.contact.schoolEmail")} :{" "}
              <a href="mailto:ahmed-nadir.nemmas.1@ens.etsmtl.ca">
                ahmed-nadir.nemmas.1@ens.etsmtl.ca
              </a>
              <br />
              {t("home.contact.personalEmail")} :{" "}
              <a href="mailto:nadirne91@gmail.com">nadirne91@gmail.com</a>
            </p>
          </div>
        </SectionBackground>
      </div>
    </Layout>
  );
}
