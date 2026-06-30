import Layout from "../components/Layout/Layout.jsx";
import "./styles/pages.scss";
import GMALogin from "../../../docs/images/gamemaster/GMA-login&roll.gif";
import GMALogout from "../../../docs/images/gamemaster/GMA-logout&query.gif";
import GMAUser from "../../../docs/images/gamemaster/GMA-User&Sheet.gif";
import { commandsList } from "../lib/data/listCommands.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ItemProjectContainer from "../components/ContainerBox/ItemProjectContainer.jsx";

export default function GameMasterArtefact() {
  const { t } = useTranslation();

  const imageSlider = [
    { id: 1, src: GMALogin, alt: "GMA Login and Roll Command" },
    { id: 2, src: GMALogout, alt: "GMA Logout and Query Command" },
    { id: 3, src: GMAUser, alt: "GMA User and Sheet Command" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const initialCollapsed = commandsList.reduce((acc, cmd) => {
    acc[cmd.id] = true;
    return acc;
  }, {});

  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const plusSlides = (n) =>
    setCurrentSlide(
      (prev) => (prev + n + imageSlider.length) % imageSlider.length
    );

  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <Layout>
      <div className="projects-container">
        <ItemProjectContainer
          imageSlider={imageSlider}
          fonctionsList={commandsList}
          title="GameMasterArtefact"
          link="https://github.com/NadirNemmas/GameMasterArtefact"
          description={<p>{t("gma.description")}</p>}
          fonctionsTitle={t("gma.fonctionsTitle")}
          projectNote={<p>{t("gma.note")}</p>}
        />
      </div>
    </Layout>
  );
}
