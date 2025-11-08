import Navbar from "./components/Navbar.jsx";
export default function Projets() {
  return (
    <>
      <Navbar />
      <div className="projects-container">
        <div className="div-box-container">
          <div className="projects-intro">
            <h1>Mes Projets</h1>
            <p>Bienvenue sur la page de mes projets.</p>
          </div>
        </div>
        <div className="projects-list">
          <div className="div-box-container">
            <div className="project-item">
              <h2>Projet 1</h2>
              <p>Description du projet 1.</p>
            </div>
          </div>
          <div className="div-box-container">
            <div className="project-item">
              <h2>Projet 2</h2>
              <p>Description du projet 2.</p>
            </div>
          </div>
          <div className="div-box-container">
            <div className="project-item">
              <h2>Projet 3</h2>
              <p>Description du projet 3.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
