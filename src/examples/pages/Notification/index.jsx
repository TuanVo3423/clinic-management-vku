import React, { useState, useEffect } from "react";
import {
  List,
  Badge,
  Typography,
  Card,
  Tag,
  Empty,
  Spin,
  Button,
  message,
  Avatar,
  Tabs,
} from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import "./notification.css";
import { useNotification } from "../../contexts/NotificationContext";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;

const Notification = () => {
  const [notificationsUnRead, setNotificationsUnRead] = useState([]);
  const [notificationsRead, setNotificationsRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("unread");
  const navigate = useNavigate();
  const { unreadCount, minusUnreadCount } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMaskReadNotification = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:3000/notifications/${notificationId}/read`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Không thể đánh dấu thông báo là đã đọc");
    }
  };

  const fetchNotificationUnread = async () => {
    try {
      console.log("cc tao")
      const res = await axios.get(`http://localhost:3000/notifications/status/false`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.data && res.data.notifications) {
        setNotificationsUnRead(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  };

  const fetchNotificationCountRead = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/notifications/status/true`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.data && res.data.notifications) {
        setNotificationsRead(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching read notification count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      Promise.all([fetchNotificationUnread(), fetchNotificationCountRead()]).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment_created":
        return <CalendarOutlined style={{ color: "#52c41a" }} />;
      case "appointment_updated":
        return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
      case "appointment_cancelled":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "appointment_created":
        return "success";
      case "appointment_updated":
        return "processing";
      case "appointment_cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "appointment_created":
        return "Lịch hẹn mới";
      case "appointment_updated":
        return "Cập nhật lịch hẹn";
      case "appointment_cancelled":
        return "Hủy lịch hẹn";
      default:
        return "Thông báo";
    }
  };

  const getChannelIcon = (channel) => {
    return channel === "sms" ? "📱" : "📧";
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  const handleNavigateToDetailPage = async (appointmentId, notificationId) => {
    await handleMaskReadNotification(notificationId);
    minusUnreadCount(1);
    navigate(`/admin/appointment/${appointmentId}`);
  }

  return (
    <div className="notification-page">
      <Card
        className="notification-card"
        title={
          <div className="notification-header">
            <div className="header-left">
              <BellOutlined className="header-icon" />
              <Title level={3} style={{ margin: 0 }}>
                Thông báo
              </Title>
              <Badge
                count={unreadCount.length}
                style={{ backgroundColor: "#1890ff" }}
              />
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchNotifications}
              loading={loading}
            >
              Tải lại
            </Button>
          </div>
        }
        extra={
          <Button type="link" onClick={() => navigate("/admin")}>
            Quay lại
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "unread",
              label: (
                <span>
                  Chưa đọc 
                  <Badge count={notificationsUnRead.length} style={{ backgroundColor: "#1890ff", marginLeft: 8 }} />
                </span>
              ),
              children: loading ? (
                <div className="loading-container">
                  <Spin size="large" tip="Đang tải thông báo..." />
                </div>
              ) : notificationsUnRead.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có thông báo chưa đọc"
                />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={notificationsUnRead}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: notificationsUnRead.length,
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageChange,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} thông báo`,
                    pageSizeOptions: ["5", "10", "20", "50"],
                  }}
                  renderItem={(item) => (
                    <List.Item className={`notification-item ${item.isRead ? "read" : "unread"}`} onClick={() => handleNavigateToDetailPage(item.appointmentId, item._id)} key={item._id}>
                      <List.Item.Meta
                        avatar={
                          <div style={{ position: "relative" }}>
                            <Avatar
                              icon={getNotificationIcon(item.type)}
                              size={48}
                              style={{
                                backgroundColor:
                                  item.type === "appointment_created"
                                    ? "#f6ffed"
                                    : item.type === "appointment_updated"
                                    ? "#e6f7ff"
                                    : item.type === "appointment_cancelled"
                                    ? "#fff1f0"
                                    : "#fafafa",
                              }}
                            />
                            {!item.isRead && (
                              <span className="unread-dot" />
                            )}
                          </div>
                        }
                        title={
                          <div className="notification-title">
                            <Text strong={!item.isRead}>{getNotificationTitle(item.type)}</Text>
                            <Tag color={getNotificationColor(item.type)}>
                              {item.recipientType === "patient"
                                ? "Bệnh nhân"
                                : "Bác sĩ"}
                            </Tag>
                            <span className="channel-icon">
                              {getChannelIcon(item.channel)}
                            </span>
                          </div>
                        }
                        description={
                          <div className="notification-content">
                            <Text>{item.message}</Text>
                            <div className="notification-footer">
                              <Text type="secondary" className="notification-time">
                                <ClockCircleOutlined />
                                {dayjs(item.createdAt).fromNow()}
                              </Text>
                              {item.status && (
                                <Tag
                                  icon={
                                    item.status === "sent" ? (
                                      <CheckCircleOutlined />
                                    ) : (
                                      <CloseCircleOutlined />
                                    )
                                  }
                                  color={item.status === "sent" ? "success" : "error"}
                                >
                                  {item.status === "sent" ? "Đã gửi" : "Thất bại"}
                                </Tag>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: "read",
              label: (
                <span>
                  Đã đọc 
                  <Badge count={notificationsRead.length} style={{ backgroundColor: "#52c41a", marginLeft: 8 }} />
                </span>
              ),
              children: loading ? (
                <div className="loading-container">
                  <Spin size="large" tip="Đang tải thông báo..." />
                </div>
              ) : notificationsRead.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có thông báo đã đọc"
                />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={notificationsRead}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: notificationsRead.length,
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageChange,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} thông báo`,
                    pageSizeOptions: ["5", "10", "20", "50"],
                  }}
                  renderItem={(item) => (
                    <List.Item className={`notification-item ${item.isRead ? "read" : "unread"}`} onClick={() => handleNavigateToDetailPage(item.appointmentId, item._id)} key={item._id}>
                      <List.Item.Meta
                        avatar={
                          <div style={{ position: "relative" }}>
                            <Avatar
                              icon={getNotificationIcon(item.type)}
                              size={48}
                              style={{
                                backgroundColor:
                                  item.type === "appointment_created"
                                    ? "#f6ffed"
                                    : item.type === "appointment_updated"
                                    ? "#e6f7ff"
                                    : item.type === "appointment_cancelled"
                                    ? "#fff1f0"
                                    : "#fafafa",
                              }}
                            />
                            {!item.isRead && (
                              <span className="unread-dot" />
                            )}
                          </div>
                        }
                        title={
                          <div className="notification-title">
                            <Text strong={!item.isRead}>{getNotificationTitle(item.type)}</Text>
                            <Tag color={getNotificationColor(item.type)}>
                              {item.recipientType === "patient"
                                ? "Bệnh nhân"
                                : "Bác sĩ"}
                            </Tag>
                            <span className="channel-icon">
                              {getChannelIcon(item.channel)}
                            </span>
                          </div>
                        }
                        description={
                          <div className="notification-content">
                            <Text>{item.message}</Text>
                            <div className="notification-footer">
                              <Text type="secondary" className="notification-time">
                                <ClockCircleOutlined />
                                {dayjs(item.createdAt).fromNow()}
                              </Text>
                              {item.status && (
                                <Tag
                                  icon={
                                    item.status === "sent" ? (
                                      <CheckCircleOutlined />
                                    ) : (
                                      <CloseCircleOutlined />
                                    )
                                  }
                                  color={item.status === "sent" ? "success" : "error"}
                                >
                                  {item.status === "sent" ? "Đã gửi" : "Thất bại"}
                                </Tag>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Notification;
