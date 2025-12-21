import React, { useState, useEffect } from "react";
import { Tabs, Badge, Dropdown, Avatar, Card } from "antd";
import {
  CalendarOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  RobotOutlined,
  DollarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ClassBased from "./class-based";
import ListView from "./ListView";
import Statistics from "./Statistics";
import AdminChatbot from "../../components/AdminChatbot";
import NotificationBell from "../../components/NotificationBell";
import ServiceManagement from "./ServiceManagement";
import BedManagement from "./BedManagement";
import "./admin.css";
import axios from "axios";
import dayjs from "dayjs";

const { TabPane } = Tabs;

function Admin() {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("adminActiveTab") || "timeline"
  );
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load doctor info from localStorage
    const doctor = localStorage.getItem("doctor");
    if (doctor) {
      setDoctorInfo(JSON.parse(doctor));
    }

    fetchAppointmentCount();
    console.log("re-render");
    // Refresh count every 30 seconds
    const interval = setInterval(fetchAppointmentCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Lưu activeTab vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const fetchAppointmentCount = async () => {
    try {
      const startDate = dayjs()
        .subtract(7, "day")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm:ss");
      const url = `http://localhost:3000/appointments/by-time-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
      const res = await axios.get(url);
      setAppointmentCount(res.data.appointments.length);
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("doctor");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header-gradient">
        <div className="admin-header-content">
          <div className="header-left">
            <div className="brand-section">
              <div className="brand-icon">
                <MedicineBoxOutlined />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">Hệ thống quản lý khám bệnh</h1>
                <p className="brand-subtitle">Trang quản lý dành cho bác sĩ</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <NotificationBell />
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div className="user-profile-dropdown">
                <Avatar
                  icon={<UserOutlined />}
                  className="user-avatar"
                  size="large"
                />
                <div className="user-info">
                  <div className="user-name">
                    {doctorInfo?.name || "Bác sĩ"}
                  </div>
                  <div className="user-role">
                    {doctorInfo?.specialization || "Chuyên khoa"}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="admin-content-wrapper">
        <Card className="admin-tabs-card" bordered={false}>
          {/* <div className="quick-stats">
            <div className="stat-item">
              <CalendarOutlined className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">{appointmentCount}</div>
                <div className="stat-label">Lịch khám gần đây</div>
              </div>
            </div>
          </div> */}

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="admin-tabs"
            size="large"
          >
            <TabPane
              tab={
                <span className="tab-label">
                  <CalendarOutlined className="tab-icon" />
                  <span>Lịch khám</span>
                </span>
              }
              key="timeline"
            >
              <div className="tab-content scheduler-container">
                <ClassBased />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="tab-label">
                  <UnorderedListOutlined className="tab-icon" />
                  <span>Danh sách</span>
                  {appointmentCount > 0 && (
                    <Badge
                      count={appointmentCount}
                      className="tab-badge"
                      overflowCount={999}
                    />
                  )}
                </span>
              }
              key="list"
            >
              <div className="tab-content">
                <ListView />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="tab-label">
                  <BarChartOutlined className="tab-icon" />
                  <span>Thống kê</span>
                </span>
              }
              key="statistics"
            >
              <div className="tab-content">
                <Statistics />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="tab-label">
                  <DollarOutlined className="tab-icon" />
                  <span>Dịch vụ</span>
                </span>
              }
              key="services"
            >
              <div className="tab-content">
                <ServiceManagement />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="tab-label">
                  <HomeOutlined className="tab-icon" />
                  <span>Giường bệnh</span>
                </span>
              }
              key="beds"
            >
              <div className="tab-content">
                <BedManagement />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="tab-label">
                  <RobotOutlined className="tab-icon" />
                  <span>AI Assistant</span>
                </span>
              }
              key="chatbot"
            >
              <div className="tab-content">
                <AdminChatbot />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default Admin;
