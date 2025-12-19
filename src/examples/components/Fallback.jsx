import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
      color: "#52c41a",
    }}
    spin
  />
);

function Fallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ed 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "60px 80px",
          boxShadow: "0 10px 40px rgba(82, 196, 26, 0.15)",
          textAlign: "center",
          animation: "fadeIn 0.5s ease-in",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <Spin indicator={antIcon} />
        </div>
        <h2
          style={{
            color: "#52c41a",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "12px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Đang tải...
        </h2>
        <p
          style={{
            color: "#8c8c8c",
            fontSize: "16px",
            margin: 0,
            lineHeight: "1.6",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Vui lòng đợi trong giây lát
        </p>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#52c41a",
              animation: "bounce 1.4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#73d13d",
              animation: "bounce 1.4s ease-in-out 0.2s infinite",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#95de64",
              animation: "bounce 1.4s ease-in-out 0.4s infinite",
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

export default Fallback;
