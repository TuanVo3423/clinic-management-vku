import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

function HeaderBar({ patientInfo, onLoginClick, onLogout }) {
  return (
    <div
      style={{
        backgroundColor: "#e6f4ff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
      }}
    >
      <h3 style={{ margin: 0 }}>🏥 Clinic Management</h3>
      {patientInfo ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>
            Xin chào, 
            {" "}
            <b>{patientInfo.fullName}</b>
          </span>
          <Button type="link" onClick={onLogout}>
            Đăng xuất
          </Button>
        </div>
      ) : (
        <Button type="primary" onClick={onLoginClick}>
          Đăng nhập
        </Button>
      )}
    </div>
  );
}
HeaderBar.propTypes = {
  patientInfo: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  onLoginClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default HeaderBar;
