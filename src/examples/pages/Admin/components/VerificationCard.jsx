/* eslint-disable */
import React from "react";
import { Card, Space, Tag, Button } from "antd";
import {
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const VerificationCard = ({ verificationStatus, verifyLoading, onVerify }) => {
  if (!verificationStatus) return null;

  return (
    <Card
      style={{ marginBottom: 20 }}
      bordered={!verificationStatus.isValid}
      styles={{
        body: {
          backgroundColor: verificationStatus.isValid ? "#f6ffed" : "#fff2e8",
        },
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <SafetyOutlined style={{ fontSize: "16px" }} />
            <strong>Trạng thái xác thực Blockchain:</strong>
            {verificationStatus.isValid ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Dữ liệu hợp lệ
              </Tag>
            ) : (
              <Tag color="error" icon={<WarningOutlined />}>
                Dữ liệu bị thay đổi trái phép
              </Tag>
            )}
          </Space>
          <Button size="small" loading={verifyLoading} onClick={onVerify}>
            Kiểm tra lại
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default VerificationCard;
