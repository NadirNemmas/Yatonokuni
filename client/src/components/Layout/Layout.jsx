import NavBar from "../NavBar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import RouteBackground from "../Background/RouteBackground.jsx";

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <RouteBackground>
        <main> {children} </main>
      </RouteBackground>
      <Footer />
    </>
  );
}
