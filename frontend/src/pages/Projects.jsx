import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import Header from "../components/Header/Header.jsx";
import ContainerBox from "../components/ContainerBox/ContainerBox.jsx";
import SectionDots from "../components/SectionDots/SectionDots.jsx";
import YatoKuniIntro from "../../../docs/images/yatonokuni-project/yatonokuni-project-intro.png";
import GMAIntro from "../../../docs/images/gamemaster/GMA-Introduction.png";
import "../components/ContainerBox/styles/project-container.scss";
import "./styles/pages.scss";

const introBySlug = {
  "/": { src: YatoKuniIntro, alt: "Yatonokuni" },
  "/projects/gamemasterartefact": { src: GMAIntro, alt: "GameMasterArtefact" },
};

export default function Projets() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/projets")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  const projectSections = projects.map((p) => ({
    id: `project-${p.id}`,
    label: p.name,
  }));

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

        {loading ? (
          <div className="projects-loading">
            <div className="loading-spinner" />
            <p>Chargement des projets...</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((p) => (
              <ContainerBox
                key={p.id}
                id={`project-${p.id}`}
                onClick={() => navigate(p.slug)}
              >
                <article className="project-item">
                  <div className="project-left">
                    <h2 className="project-title">{p.name}</h2>
                    <p className="project-description">{p.description}</p>
                    <div className="project-techs">
                      <h3>Technologies utilisées</h3>
                      <ul className="tech-list">
                        {p.technologies.map((t) => (
                          <li className="tech-badge" key={t}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {introBySlug[p.slug] && (
                    <div className="project-right">
                      <img
                        src={introBySlug[p.slug].src}
                        alt={introBySlug[p.slug].alt}
                        className="project-image"
                      />
                      {p.git_repo && (
                        <a
                          href={p.git_repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-git-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Vers le dépôt Git →
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </ContainerBox>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
