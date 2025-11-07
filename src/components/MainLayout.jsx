import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import HeaderBar from "./HeaderBar";
import AuthPatientModal from "./AuthPatientmModal";
import PropTypes from "prop-types";

const { Content } = Layout;

function MainLayout({ children }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState(
    JSON.parse(localStorage.getItem("patientInfo")) || null
  );

  useEffect(() => {
    if (!patientInfo) setShowAuthModal(true);
  }, []);

  const handleLoginSuccess = patient => {
    setPatientInfo(patient);
    setShowAuthModal(false);
    localStorage.setItem("patientInfo", JSON.stringify(patient));
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <HeaderBar
        patientInfo={JSON.parse(localStorage.getItem("patientInfo"))}
        onLoginClick={() => window.dispatchEvent(new CustomEvent("openLoginModal"))}
        onLogout={() => {
          localStorage.removeItem("patientInfo");
          alert("Bạn đã đăng xuất thành công!");
          window.location.reload();
        }}
      />

      <Content style={{ padding: 16, backgroundColor: "#fff" }}>
        {React.isValidElement(children)
          ? React.cloneElement(children, {
            patientInfo,
            onLoginClick: () => setShowAuthModal(true),
          })
          : children}
      </Content>

      <AuthPatientModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </Layout>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
