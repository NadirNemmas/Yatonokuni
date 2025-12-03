import "./projectContainer.css";
import ImageSlider from "./ImageSlider";
import BackButton from "../Buttons/BackButton";
import ContainerBox from "./ContainerBox";
import { useState } from "react";

export default function ItemProjectContainer({
  imageSlider,
  fonctionsList,
  title,
  link,
  description,
  fonctionsTitle,
  projectNote,
}) {
  const initialCollapsed = fonctionsList.reduce((acc, cmd) => {
    acc[cmd.id] = true;
    return acc;
  }, {});

  const [collapsed, setCollapsed] = useState(initialCollapsed);
  return (
    <div className="projects-container">
      <ContainerBox>
        <BackButton />

        <a
          className="project-link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <div className="project-item">
          <div className="project-left">
            <h3 className="project-title">Description</h3>
            <div className="project-description">{description}</div>
            <h3 className="project-subtitle">{fonctionsTitle}</h3>
            <div className="commands-list">
              {fonctionsList.map((cmd) => {
                const isCollapsed = !!collapsed?.[cmd.id];
                return (
                  <div key={cmd.id} className="command-item">
                    <div className="command-header">
                      <h4 className="command-name">{cmd.commandName}</h4>

                      <button
                        type="button"
                        className="cmd-toggle"
                        aria-expanded={!isCollapsed}
                        onClick={() =>
                          setCollapsed((prev) => ({
                            ...(prev || {}),
                            [cmd.id]: !prev?.[cmd.id],
                          }))
                        }
                      >
                        <span className="arrow" aria-hidden="true">
                          ▸
                        </span>
                      </button>
                    </div>

                    <div className="command-description">{cmd.description}</div>

                    {/* only show fields block when NOT collapsed */}
                    {!isCollapsed && (
                      <>
                        <div className="command-fields">
                          <strong>Champs requis :</strong>
                          {cmd.required_fields &&
                          cmd.fields_required &&
                          cmd.fields_required.length > 0 ? (
                            <ul className="fields-list">
                              {cmd.fields_required.map((field, index) => (
                                <span key={index}>
                                  {Object.entries(field).map(([key, value]) => (
                                    <li key={key}>
                                      <strong>{key}</strong> : {value}
                                    </li>
                                  ))}
                                </span>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-fields">Aucun</p>
                          )}
                        </div>

                        <div className="command-fields">
                          <strong>Champs optionnels :</strong>
                          {cmd.optional_fields &&
                          cmd.optional_fields.length > 0 ? (
                            <ul className="fields-list">
                              {cmd.optional_fields.map((field, index) => (
                                <span key={index}>
                                  {Object.entries(field).map(([key, value]) => (
                                    <li key={key}>
                                      <strong>{key}</strong> : {value}
                                    </li>
                                  ))}
                                </span>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-fields">Aucun</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="project-note">{projectNote}</div>
          </div>
          <div className="project-right">
            <ImageSlider imageSlider={imageSlider}></ImageSlider>
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
