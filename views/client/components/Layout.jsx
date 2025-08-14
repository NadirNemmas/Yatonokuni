import NavBar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Header />
      <main> {children} </main>
      <Footer />
    </>
  );
}
