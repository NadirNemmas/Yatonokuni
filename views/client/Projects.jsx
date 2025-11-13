import Navbar from "./components/Navbar.jsx";
import GMAIntro from "../../docs/images/gamemaster/GMA-Introduction.png";
import { Link } from "react-router-dom";
const projects = [
  {
    id: 1,
    title: "Yatonokuni",
    route: "/",
    description:
      "This project was created to learn different skills in the front-end, back-end and authentication.",
    image: "/docs/images/project-yatonokuni.jpg",
    techs: ["React", "Node.js", "Express", "SupabaseSQL"],
  },
  {
    id: 2,
    title: "GameMasterArtefact",
    route: "/projects/gamemasterartefact",
    description:
      "GameMasterArtefact — bot Discord pour gérer des personnages de jeu de rôle : comptes, sessions (ID Discord)," +
      "fiches de personnages, jets de compétences et commandes d'administration. Stockage simple via fichiers JSON, mot de passe hashé (bcrypt) et commandes slash pour consulter/metre à jour les fiches.",
    image: GMAIntro,
    techs: ["JavaScript", "Discord.js", "bcrypt", "JSON", "Node.js"],
  },
  {
    id: 3,
    title: "Projet 3",
    route: "/projet3",
    description: "Description du projet 3.",
    image: "/docs/images/project-3.jpg",
    techs: ["Svelte", "Go"],
  },
];

export default function Projets() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="projects-container">
        <div className="div-box-container">
          <div className="projects-intro">
            <h2>Mes projets</h2>
            <p>
              Bienvenue sur ma page de projets. Cette page présente mon travail
              et met en valeur mes compétences.
            </p>
          </div>
        </div>

        <div className="projects-list">
          {projects.map((p) => (
            <div className="div-box-container" key={p.id}>
              <article className="project-item">
                <div className="project-left">
                  <h2 className="project-title">
                    <Link to={p.route} target="_blank">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="project-description">{p.description}</p>
                  <div className="project-techs">
                    <h3>Technologies utilisées</h3>
                    <ul className="tech-list">
                      {p.techs.map((t) => (
                        <li className="tech-badge" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="project-right">
                  <img src={p.image} alt={p.title} className="project-image" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
