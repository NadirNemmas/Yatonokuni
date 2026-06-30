import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProjects } from "../context/ProjectsContext.jsx";
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
  const { t } = useTranslation();
  const { projects, fetchProjects } = useProjects();
  const loading = projects === null;
  const projectList = projects ?? [];

  useEffect(() => {
    fetchProjects();
  }, []);

  const projectSections = projectList.map((p) => ({
    id: `project-${p.id}`,
    label: p.name,
  }));

  return (
    <Layout>
      <SectionDots sections={projectSections} />

      <div className="projects-container">
        <Header title={t("projects.title")}>
          <p>{t("projects.intro")}</p>
        </Header>

        {loading ? (
          <div className="loading-overlay">
            <div className="loader" />
            <p>{t("projects.loading")}</p>
          </div>
        ) : (
          <div className="projects-list">
            {projectList.map((p) => (
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
                      <h3>{t("projects.technologies")}</h3>
                      <ul className="tech-list">
                        {p.technologies.map((tech) => (
                          <li className="tech-badge" key={tech}>
                            {tech}
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
                          {t("projects.gitLink")}
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
