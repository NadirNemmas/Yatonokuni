import Header from "./components/Header.jsx";
import Layout from "./components/Layout.jsx";
export default function Home() {
  return (
    <div className="app-container">
      <Header />
      <Layout>
        <div className="page-container">
          <div id="about" className="page-container-section div-about">
            <div className="div-box-container">
              <h2 className="div-title">À propos</h2>
              <p className="div-description">
                Bienvenue sur ma plateforme web construite avec React.
                <br /> Ce site regroupe certains de mes projets et mes dépôts,
                et met en avant mon travail.
                <br /> N'hésitez pas à explorer les fonctionnalités et à en
                apprendre plus sur ce que je fais.
                <br /> La création de compte est en cours d'amélioration et sera
                bientôt disponible.
              </p>
            </div>
          </div>

          <div id="features" className="page-container-section div-features">
            <div className="div-box-container">
              <h2 className="div-title">Fonctionnalités</h2>
              <p className="div-description">
                Les fonctionnalités actuelles sont pour le moment limitées.
                <br />
                L'authentification des utilisateurs (inscription, connexion) est
                en place.
                <br />
                Une fois connecté, vous pourrez accéder à des fonctionnalités
                supplémentaires et des contenus exclusifs.
                <br />
                Veuillez noter que certaines fonctionnalités peuvent ne pas être
                entièrement opérationnelles ou peuvent nécessiter une connexion.
                <br />
                L'intégration Lost Ark est actuellement en développement.
              </p>
            </div>
          </div>

          <div id="contact" className="page-container-section div-contact">
            <div className="div-box-container">
              <h2 className="div-title">Contact</h2>
              <p className="div-description">
                If you have any questions, feel free to reach out!
                <br />
                Émail d'école :{" "}
                <a href="mailto:ahmed-nadir.nemmas.1@ens.etsmtl.ca">
                  ahmed-nadir.nemmas.1@ens.etsmtl.ca
                </a>
                <br /> Émail personnel :{" "}
                <a href="mailto:nadirne91@gmail.com">nadirne91@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
