import NavBar from "./components/Navbar";
import GMALogin from "../../docs/images/gamemaster/GMA-login&roll.gif";
import GMALogout from "../../docs/images/gamemaster/GMA-logout&query.gif";
import GMAUser from "../../docs/images/gamemaster/GMA-User&Sheet.gif";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const imageSlider = [
  { id: 1, src: GMALogin, alt: "GMA Login and Roll Command" },
  { id: 2, src: GMALogout, alt: "GMA Logout and Query Command" },
  { id: 3, src: GMAUser, alt: "GMA User and Sheet Command" },
];
const commandsList = [
  {
    id: 1,
    commandName: "/login",
    description: "Permet à un utilisateur de se connecter à son compte.",
    required_fields: true,
    fields_required: [
      {
        username:
          "nom d'utilisateur (est généralement le même que le nom de personnage)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 2,
    commandName: "/register",
    description:
      "Permet de créer un nouveau compte utilisateur, un personnage et sa fiche.",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
  {
    id: 3,
    commandName: "/logout",
    description: "Déconnecte l'utilisateur actuel.",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
  {
    id: 4,
    commandName: "/update",
    description: "Met à jour une statistique ou une information du personnage.",
    required_fields: true,
    fields_required: [
      {
        champ: "Nom du champ (ex: corps ou corps-combat à distance)",
        valeur: "Nouvelle valeur à attribuer au champ (ex: 12)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 5,
    commandName: "/sheet",
    description: "Affiche la fiche de personnage de l'utilisateur.",
    required_fields: false,
    fields_required: "",
    optional_fields: [
      {
        stat: "nom de la statistique",
        stats:
          "nom des statistiques d'un personnage (force, dexterité, intelligence, etc.) séparées par des virgules",
        user: "nom du personnage d'un utilisateur (commande accéssible seulement pour le maitre de jeu)",
        query:
          " nom du perssone suivi d'une statistique spécifique. Ex: nom_utilisateur:stat",
      },
    ],
  },
  {
    id: 6,
    commandName: "/roll",
    description:
      "Fait un jet de compétence ou de caractéristique ou lance un dé à X faces.",
    required_fields: true,
    fields_required: [
      {
        x: "Jet libre, nombre de faces du dé (ex: 6, 20, 100...)",
        d: "Nombre de faces du dé (ex: 6, 20, 100...)",
        competence:
          "Nom de la compétence ou de la caractéristique à tester (ex: force, dexterité, intelligence, etc.)",
        mod: "Bonus ou malus à appliquer (ex: -3 ou +2)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 7,
    commandName: "/clear",
    description:
      "Efface tout les messages des utilisateurs dans le canal. (Cette commande est réservée au maitre de jeu)",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
];

export default function GameMasterArtefact() {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [collapsed, setCollapsed] = useState({});

  // 🔍 Debug temporaire (facultatif)
  useEffect(() => {
    console.log("Current slide:", currentSlide, "path:", location.pathname);
  }, [currentSlide, location.pathname]);

  // Ajout de classe CSS en fonction de la route
  const routeClass = location.pathname
    .replace(/^\//, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  const plusSlides = (n) =>
    setCurrentSlide(
      (prev) => (prev + n + imageSlider.length) % imageSlider.length
    );

  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className={`app-container ${routeClass}`}>
      <NavBar />
      <div className="projects-container">
        <div className="div-box-container">
          <h2>GameMasterArtefact</h2>
          <div className="project-item">
            <div className="project-left">
              <h3 className="project-title">Description :</h3>
              <p className="project-description">
                GameMasterArtefact est un bot Discord conçue pour les maîtres de
                jeu et les joueurs de jeux de rôle en ligne. Elle permet de
                gérer les personnages, les feuilles de personnage, et d'exécuter
                des commandes spécifiques pour faciliter le déroulement des
                sessions de jeu.
              </p>
              <h3 className="project-subtitle">Principales commandes :</h3>
              <div className="commands-list">
                {commandsList.map((cmd) => {
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

                      <p className="command-description">{cmd.description}</p>

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
                                    {Object.entries(field).map(
                                      ([key, value]) => (
                                        <li key={key}>
                                          <strong>{key}</strong> : {value}
                                        </li>
                                      )
                                    )}
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
                                    {Object.entries(field).map(
                                      ([key, value]) => (
                                        <li key={key}>
                                          <strong>{key}</strong> : {value}
                                        </li>
                                      )
                                    )}
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
              <p className="project-note">
                Il est possible d'avoir plus d'informations sur les commandes en
                cliquant sur la flèche à côté du nom de la commande.
              </p>
            </div>

            <div className="project-right">
              <div
                className="slideshow-container"
                aria-roledescription="carousel"
              >
                {imageSlider.map((img, index) => (
                  <div
                    key={img.id}
                    className={`slide ${
                      index === currentSlide ? "active" : ""
                    }`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${imageSlider.length}`}
                  >
                    <img src={img.src} alt={img.alt} />
                  </div>
                ))}

                <button
                  className="prev"
                  onClick={() => plusSlides(-1)}
                  aria-label="Previous slide"
                  type="button"
                >
                  ❮
                </button>
                <button
                  className="next"
                  onClick={() => plusSlides(1)}
                  aria-label="Next slide"
                  type="button"
                >
                  ❯
                </button>
              </div>

              <div
                className="dots-container"
                role="tablist"
                aria-label="Slide navigation"
              >
                {imageSlider.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`dot ${index === currentSlide ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={index === currentSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
