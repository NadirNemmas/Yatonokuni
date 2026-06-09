import Layout from "../components/Layout/Layout.jsx";
import Header from "../components/Header/Header.jsx";
import { Link } from "react-router-dom";
import { projects } from "../lib/data/listProjects.js";
import ContainerBox from "../components/ContainerBox/ContainerBox.jsx";
import "../components/ContainerBox/styles/project-container.scss";
import "./styles/pages.scss";

export default function Projets() {
  return (
    <Layout>
      <div className="projects-container">
        <Header title="Mes projets personnels">
          <p>
            Bienvenue sur ma page de projets personnels. Cette page présente une
            sélection de projets que j'ai développés pour approfondir mes
            compétences en programmation et explorer de nouvelles technologies.
            Chaque projet reflète ma passion pour le développement logiciel et
            mon engagement envers l'apprentissage continu.
          </p>
        </Header>

        <div className="projects-list">
          {projects.map((p) => (
            <ContainerBox>
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
                  <img src={p.image} alt={p.title} className="project-image" />
                </div>
              </article>
            </ContainerBox>
          ))}
        </div>
      </div>
    </Layout>
  );
}
