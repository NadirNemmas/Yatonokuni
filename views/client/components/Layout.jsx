import NavBar from "./navbar";
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <NavBar />
      <main> {children} </main>
      <Footer />
    </>
  );
}
