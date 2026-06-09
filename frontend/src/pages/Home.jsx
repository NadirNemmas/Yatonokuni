import Header from "../components/Header/Header.jsx";
import Layout from "../components/Layout/Layout.jsx";
import SectionBackground from "../components/Background/SectionBackground.jsx";
export default function Home() {
  return (
    <Layout>
      <Header title="Yato no kuni">
        <h2>Bienvenue dans l'application React Yato no kuni !</h2>
        <p>
          Ceci est un site web construit principalement pour ma vie quotidienne,
          me permettant d'accéder à mes choses n'importe où. Essentiellement une
          sorte de site web cloud.
        </p>
        <p>
          <a
            target="_blank"
            href="https://eportfolio.etsmtl.ca/Portfolio/Clef/FpX7fDj0zplsdZZdVmN3"
          >
            Lien vers mon porfolio ÉTS
          </a>
        </p>
        <p>
          <a target="_blank" href="https://github.com/NadirNemmas/Yatonokuni">
            Lien vers le dépot GitHub du projet
          </a>
        </p>
      </Header>
      <div className="page-container">
        <div id="about" className="page-container-section div-about">
          <div className="div-box-container">
            <h2 className="div-title">À propos</h2>
            <p className="div-description">
              Bienvenue sur ma plateforme web construite avec React.
              <br /> Ce site regroupe certains de mes projets et mes dépôts, et
              met en avant mon travail.
              <br /> N'hésitez pas à explorer les fonctionnalités et à en
              apprendre plus sur ce que je fais.
              <br /> La création de compte est en cours d'amélioration et sera
              bientôt disponible.
            </p>
          </div>
        </div>

        <SectionBackground
          sectionKey="features"
          className="page-container-section div-features"
          id="features"
        >
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
        </SectionBackground>

        <SectionBackground
          sectionKey="contact"
          className="page-container-section div-contact"
          id="contact"
        >
          <div className="div-box-container">
            <h2 className="div-title">Contact</h2>
            <p className="div-description">
              Si vous avez des questions, des suggestions ou si vous souhaitez
              me contacter, n'hésitez pas à le faire via :
              <br />
              Émail d'école :{" "}
              <a href="mailto:ahmed-nadir.nemmas.1@ens.etsmtl.ca">
                ahmed-nadir.nemmas.1@ens.etsmtl.ca
              </a>
              <br /> Émail personnel :{" "}
              <a href="mailto:nadirne91@gmail.com">nadirne91@gmail.com</a>.
            </p>
          </div>
        </SectionBackground>
      </div>
    </Layout>
  );
}
