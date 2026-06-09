import NavBar from "../NavBar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import RouteBackground from "../Background/RouteBackground.jsx";
export default function Layout({ children }) {
  return (
    <div className="app-container">
      <NavBar />
      <div className="page-container">
        <RouteBackground>
          <main> {children} </main>
        </RouteBackground>
      </div>

      <Footer />
    </div>
  );
}
