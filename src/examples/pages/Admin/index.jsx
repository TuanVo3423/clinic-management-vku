import React, { useState, useEffect } from "react";
import { Tabs, Badge } from "antd";
import { CalendarOutlined, UnorderedListOutlined, BarChartOutlined } from "@ant-design/icons";
import ClassBased from "./class-based";
import ListView from "./ListView";
import Statistics from "./Statistics";
import "./admin.css";
import axios from "axios";
import dayjs from "dayjs";

const { TabPane } = Tabs;

function Admin() {
  const [activeTab, setActiveTab] = useState("timeline");
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    fetchAppointmentCount();
    console.log("re-render")
    // Refresh count every 30 seconds
    const interval = setInterval(fetchAppointmentCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointmentCount = async () => {
    try {
      const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD HH:mm:ss");
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

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🏥 Quản lý lịch khám - Trang bác sĩ</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Xem và quản lý lịch khám, điều chỉnh giờ khám, theo dõi thống kê
        </p>
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
