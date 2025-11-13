import Layout from "./components/Layout.jsx";
import GMAIntro from "../../docs/images/gamemaster/GMA-Introduction.png";
import YatoKuniIntro from "../../docs/images/yatonokuni-project/yatonokuni-project-intro.png";
import { Link } from "react-router-dom";
const projects = [
  {
    id: 1,
    title: "Yatonokuni",
    route: "/",
    description:
      "Une application web créé afin d'approfondir mes compétences en développement full-stack, apprendre React.js, Vite.js, et Supabase. " +
      "\nL'application permet aux utilisateurs de créer un compte, se connecter." +
      "\nLe but principal est de montrer mes projets personnels et compétences en développement web. " +
      "\nL'application à des fonctionnalités cachées accessibles uniquement aux utilisateurs connectés. Ces fonctionnalités sont principalement prévues pour moi-même.",
    image: YatoKuniIntro,
    techs: ["React.js", "Node.js", "Express", "SupabaseSQL"],
  },
  {
    id: 2,
    title: "GameMasterArtefact",
    route: "/projects/gamemasterartefact",
    description:
      "Ce projet est un bot Discord pour gérer des personnages de jeu de rôle : comptes, sessions (ID Discord), " +
      "fiches de personnages, jets de compétences et commandes d'administration. Stockage simple via fichiers JSON, mot de passe hashé (bcrypt) et commandes slash pour consulter/metre à jour les fiches.",
    image: GMAIntro,
    techs: ["JavaScript", "Discord.js", "bcrypt", "JSON", "Node.js"],
  },
  {
    // id: 3,
    // title: "Projet 3",
    // route: "/projet3",
    // description: "Description du projet 3.",
    // image: "/docs/images/project-3.jpg",
    // techs: ["Svelte", "Go"],
  },
];
// Ajout de classe CSS en fonction de la route
const routeClass = location.pathname
  .replace(/^\//, "")
  .replace(/\//g, "-")
  .replace(/[^a-zA-Z0-9-_]/g, "");

export default function Projets() {
  return (
    <div className={`app-container ${routeClass}`}>
      <Layout>
        <div className="projects-container">
          <div className="header">
            <div className="header-content">
              <h2>Mes projets</h2>
              <p>
                Bienvenue sur ma page de projets. Cette page présente mon
                travail et met en valeur mes compétences.
              </p>
            </div>
          </div>

          <div className="projects-list">
            {projects.map((p) => (
              <div className="div-box-container" key={p.id}>
                <article className="project-item">
                  <div className="project-left">
                    <h2 className="project-title">
                      <Link to={p.route}>{p.title}</Link>
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
                    <img
                      src={p.image}
                      alt={p.title}
                      className="project-image"
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
}
