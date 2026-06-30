import Layout from "../components/Layout/Layout.jsx";
import ProfileCard from "../components/ProfileCard/ProfileCard.jsx";
import "./styles/profile.scss";

export default function Profile() {
  return (
    <Layout>
      <div className="page-container-section profile-page">
        <ProfileCard />
      </div>
    </Layout>
  );
}
