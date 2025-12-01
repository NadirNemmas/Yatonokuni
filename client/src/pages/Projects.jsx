import Layout from "../components/Layout/Layout.jsx";
import { Link } from "react-router-dom";
import { projects } from "../lib/data/listProjects.js";

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
              <h2>Mes projets personnels</h2>
              <p>
                Bienvenue sur ma page de projets personnels. Cette page présente
                une sélection de projets que j'ai développés pour approfondir
                mes compétences en programmation et explorer de nouvelles
                technologies. Chaque projet reflète ma passion pour le
                développement logiciel et mon engagement envers l'apprentissage
                continu.
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
