import React, { useState, useEffect } from "react";
import { Tabs, Badge, Dropdown, Avatar } from "antd";
import {
  CalendarOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ClassBased from "./class-based";
import ListView from "./ListView";
import Statistics from "./Statistics";
import NotificationBell from "../../components/NotificationBell";
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
      <div className="admin-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>🏥 Quản lý lịch khám - Trang bác sĩ</h1>
            <p style={{ margin: 0, color: "#666" }}>
              Xem và quản lý lịch khám, điều chỉnh giờ khám, theo dõi thống kê
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <NotificationBell />
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                  size="large"
                />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, color: "#262626" }}>
                    {doctorInfo?.name || "Bác sĩ"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    {doctorInfo?.specialization || "Chuyên khoa"}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="admin-tabs"
      >
        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              Timeline
            </span>
          }
          key="timeline"
        >
          <div className="scheduler-container">
            <ClassBased />
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <UnorderedListOutlined />
              Danh sách
              {appointmentCount > 0 && (
                <Badge
                  count={appointmentCount}
                  style={{ marginLeft: 8 }}
                  overflowCount={999}
                />
              )}
            </span>
          }
          key="list"
        >
          <ListView />
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Thống kê
            </span>
          }
          key="statistics"
        >
          <Statistics />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Admin;
