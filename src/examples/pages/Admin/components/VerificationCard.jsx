/* eslint-disable */
import React from "react";
import { Card, Space, Tag, Button } from "antd";
import {
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const VerificationCard = ({ verificationStatus, verifyLoading, onVerify }) => {
  if (!verificationStatus) return null;

  const isValid = verificationStatus.isValid;

  return (
    <Card
      className={`verification-card ${isValid ? "valid" : "invalid"}`}
      bordered={false}
    >
      <div className="verification-content">
        <div className="verification-left">
          <div
            className={`verification-icon-wrapper ${
              isValid ? "valid" : "invalid"
            }`}
          >
            <SafetyOutlined className="verification-icon" />
          </div>
          <div className="verification-info">
            <h4 className="verification-title">Xác thực Blockchain</h4>
            <Space size="small">
              {isValid ? (
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  className="verification-tag"
                >
                  Dữ liệu hợp lệ
                </Tag>
              ) : (
                <Tag
                  color="error"
                  icon={<WarningOutlined />}
                  className="verification-tag"
                >
                  Dữ liệu bị thay đổi trái phép
                </Tag>
              )}
            </Space>
          </div>
        </div>
        <Button
          icon={<SyncOutlined />}
          loading={verifyLoading}
          onClick={onVerify}
          className="verify-button"
        >
          Kiểm tra lại
        </Button>
      </div>
    </Card>
  );
};

export default VerificationCard;
