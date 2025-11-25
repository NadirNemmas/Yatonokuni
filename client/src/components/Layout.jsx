import NavBar from "./Navbar";
import Footer from "./Footer";
import RouteBackground from "./RouteBackground";

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
