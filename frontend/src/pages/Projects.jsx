import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import Header from "../components/Header/Header.jsx";
import ContainerBox from "../components/ContainerBox/ContainerBox.jsx";
import SectionDots from "../components/SectionDots/SectionDots.jsx";
import ImageSlider from "../components/ContainerBox/ImageSlider.jsx";
import YatoKuniIntro from "../../../docs/images/yatonokuni-project/yatonokuni-project-intro.png";
import GMAIntro from "../../../docs/images/gamemaster/GMA-Introduction.png";
import GMAUserSheet from "../../../docs/images/gamemaster/GMA-User&Sheet.gif";
import GMALoginRoll from "../../../docs/images/gamemaster/GMA-login&roll.gif";
import GMALogoutQuery from "../../../docs/images/gamemaster/GMA-logout&query.gif";
import "../components/ContainerBox/styles/project-container.scss";
import "./styles/pages.scss";

const imagesBySlug = {
  "/": [{ id: 1, src: YatoKuniIntro, alt: "Yatonokuni" }],
  "/projects/gamemasterartefact": [
    { id: 1, src: GMAIntro, alt: "GameMasterArtefact introduction" },
    { id: 2, src: GMAUserSheet, alt: "GameMasterArtefact user & sheet" },
    { id: 3, src: GMALoginRoll, alt: "GameMasterArtefact login & roll" },
    { id: 4, src: GMALogoutQuery, alt: "GameMasterArtefact logout & query" },
  ],
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

                  {imagesBySlug[p.slug] && (
                    <div className="project-right">
                      {imagesBySlug[p.slug].length > 1 ? (
                        <ImageSlider imageSlider={imagesBySlug[p.slug]} />
                      ) : (
                        <img
                          src={imagesBySlug[p.slug][0].src}
                          alt={imagesBySlug[p.slug][0].alt}
                          className="project-image"
                        />
                      )}
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
