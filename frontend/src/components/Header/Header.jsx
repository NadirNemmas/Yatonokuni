import RouteBackground from "../Background/RouteBackground";
import "./styles/header.scss";
export default function Header({ title, children }) {
  return (
    <RouteBackground>
      <div className="header">
        <div className="header-content">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </RouteBackground>
  );
}
