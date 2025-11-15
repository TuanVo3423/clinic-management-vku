import React from "react";
import { Badge, Tooltip, Button } from "antd";
import { BellOutlined, WifiOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import "./NotificationBell.css";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount, isConnected } = useNotification();

  const handleClick = () => {
    navigate("/admin/notifications");
  };

  return (
    <div className="notification-bell-container">
      <Tooltip
        title={isConnected ? "Xem thông báo" : "Chưa kết nối realtime"}
        placement="bottom"
      >
        <Badge
          count={unreadCount}
          offset={[-5, 5]}
          className={`notification-badge ${!isConnected ? "disconnected" : ""}`}
        >
          <Button
            type="text"
            icon={<BellOutlined className="bell-icon" />}
            onClick={handleClick}
            className="bell-button"
          />
        </Badge>
      </Tooltip>
      {isConnected && (
        <div className="connection-indicator">
          <WifiOutlined className="wifi-icon" />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
