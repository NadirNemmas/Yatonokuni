import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import Header from "../components/Header/Header.jsx";
import ContainerBox from "../components/ContainerBox/ContainerBox.jsx";
import SectionDots from "../components/SectionDots/SectionDots.jsx";
import { projects } from "../lib/data/listProjects.js";
import "../components/ContainerBox/styles/project-container.scss";
import "./styles/pages.scss";

// Chaque projet devient une section pour les dots de navigation
const projectSections = projects.map((p) => ({
  id: `project-${p.id}`,
  label: p.title,
}));

export default function Projets() {
  const navigate = useNavigate();

  return (
    <Layout>
      <SectionDots sections={projectSections} />

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
            <ContainerBox
              key={p.id}
              id={`project-${p.id}`}
              onClick={() => navigate(p.route)}
            >
              <article className="project-item">
                <div className="project-left">
                  <h2 className="project-title">{p.title}</h2>
                  <p className="project-description">{p.description}</p>
                  <div className="project-techs">
                    <h3>Technologies utilisées</h3>
                    <ul className="tech-list">
                      {p.techs.map((t) => (
                        <li className="tech-badge" key={t}>{t}</li>
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
