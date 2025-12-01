/* eslint-disable */
import React from "react";
import { Card, Timeline, Tag, Space } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AppointmentHistoryCard = ({ history, getActionText, getActionColor }) => {
  return (
    <Card
      title={
        <Space>
          <HistoryOutlined />
          <span>Lịch sử thay đổi</span>
        </Space>
      }
    >
      {history && history.length > 0 ? (
        <Timeline
          items={history.map((item, index) => ({
            color: getActionColor(item.action),
            children: (
              <div key={index}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <Tag color={getActionColor(item.action)}>
                      {getActionText(item.action)}
                    </Tag>
                    <span style={{ color: "#999" }}>
                      {dayjs(item.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                    </span>
                  </Space>
                  <div>
                    <strong>Người thực hiện:</strong> {item.by || "System"}
                  </div>
                  <div>
                    <strong>Chi tiết:</strong> {item.details || "Không có"}
                  </div>
                </Space>
              </div>
            ),
          }))}
        />
      ) : (
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          Chưa có lịch sử thay đổi
        </p>
      )}
    </Card>
  );
};

export default AppointmentHistoryCard;
