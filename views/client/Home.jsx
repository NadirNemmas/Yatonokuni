import Layout from "./components/Layout.jsx";
export default function Home() {
  return (
    <Layout>
      <div className="page-container">
        <div id="about" className="page-container-section div-about">
          <div className="div-box-container">
            <h2 className="div-title">About me</h2>
            <p className="div-description">
              This is a web application built with React. It regroups some of my
              projects, repositories, and showcases my work. Feel free to
              explore the features and learn more about what I do. Account
              creation is undergoing some improvements and will be available
              soon.
            </p>
          </div>
        </div>

        <div id="features" className="page-container-section div-features">
          <div className="div-box-container">
            <h2 className="div-title">Features</h2>
            <p className="div-description">
              {" "}
              The current feature right now are limited, the current undergoing
              feature is Lost Ark integration. Please note that some features
              may not be fully functional yet or may require a login.
            </p>
          </div>
        </div>

        <div id="contact" className="page-container-section div-contact">
          <div className="div-box-container">
            <h2 className="div-title">Contact</h2>
            <p className="div-description">
              If you have any questions, feel free to reach out!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
