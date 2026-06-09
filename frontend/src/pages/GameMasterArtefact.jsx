import Layout from "../components/Layout/Layout.jsx";
import GMALogin from "../../../docs/images/gamemaster/GMA-login&roll.gif";
import GMALogout from "../../../docs/images/gamemaster/GMA-logout&query.gif";
import GMAUser from "../../../docs/images/gamemaster/GMA-User&Sheet.gif";
import { commandsList } from "../lib/data/listCommands.js";
import { useState } from "react";
import ContainerBox from "../components/ContainerBox/ContainerBox.jsx";
import ItemProjectContainer from "../components/ContainerBox/ItemProjectContainer.jsx";

export default function GameMasterArtefact() {
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

  // useEffect(() => {
  //   console.log("Current slide:", currentSlide, "path:", location.pathname);
  // }, [currentSlide, location.pathname]);

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
          description={
            <p>
              GameMasterArtefact est un bot Discord conçue pour les maîtres de
              jeu et les joueurs de jeux de rôle en ligne. Elle permet de gérer
              les personnages, les feuilles de personnage, et d'exécuter des
              commandes spécifiques pour faciliter le déroulement des sessions
              de jeu.
            </p>
          }
          fonctionsTitle="Principales commandes :"
          projectNote={
            <p>
              Il est possible d'avoir plus d'informations sur les commandes en
              cliquant sur la flèche à côté du nom de la commande.
            </p>
          }
        ></ItemProjectContainer>
      </div>
    </Layout>
  );
}
