import RouteBackground from "../Background/RouteBackground";

export default function Header() {
  return (
    <RouteBackground>
      <div className="header">
        <div className="div-box-container header-content">
          <h1> Yato no kuni</h1>
          <h2>Bienvenue dans l'application React Yato no kuni !</h2>
          <p>
            Ceci est un site web construit principalement pour ma vie
            quotidienne, me permettant d'accéder à mes choses n'importe où.
            Essentiellement une sorte de site web cloud.
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
        </div>
      </div>
    </RouteBackground>
  );
}
