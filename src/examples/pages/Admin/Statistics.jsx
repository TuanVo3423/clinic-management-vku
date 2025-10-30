/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Space,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { Column } from "@ant-design/plots";

const { RangePicker } = DatePicker;

const Statistics = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch beds
      const bedsRes = await axios.get("http://localhost:3000/beds");
      setBeds(bedsRes.data.beds);

      // Fetch appointments
      const startDate = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
      const endDate = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
      const url = `http://localhost:3000/appointments/by-time-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;

      const apptRes = await axios.get(url);
      setAppointments(apptRes.data.appointments);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  // Appointments by bed
  const bedStats = beds.map((bed) => {
    const bedAppointments = appointments.filter((a) => a.bedId === bed._id);
    return {
      bedName: bed.bedName,
      department: bed.department,
      total: bedAppointments.length,
      pending: bedAppointments.filter((a) => a.status === "pending").length,
      confirmed: bedAppointments.filter((a) => a.status === "confirmed").length,
      cancelled: bedAppointments.filter((a) => a.status === "cancelled").length,
      completed: bedAppointments.filter((a) => a.status === "completed").length,
    };
  });

  // Appointments by date
  const dateStats = {};
  appointments.forEach((appt) => {
    const date = dayjs(appt.appointmentStartTime).format("YYYY-MM-DD");
    if (!dateStats[date]) {
      dateStats[date] = 0;
    }
    dateStats[date]++;
  });

  const chartData = Object.entries(dateStats)
    .map(([date, count]) => ({
      date: dayjs(date).format("DD/MM"),
      count,
    }))
    .sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("-");
      const dateB = b.date.split("/").reverse().join("-");
      return dateA.localeCompare(dateB);
    });

  const bedColumns = [
    {
      title: "Giường",
      dataIndex: "bedName",
      key: "bedName",
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Chờ xác nhận",
      dataIndex: "pending",
      key: "pending",
      render: (val) => <Tag color="gold">{val}</Tag>,
    },
    {
      title: "Đã xác nhận",
      dataIndex: "confirmed",
      key: "confirmed",
      render: (val) => <Tag color="green">{val}</Tag>,
    },
    {
      title: "Đã hủy",
      dataIndex: "cancelled",
      key: "cancelled",
      render: (val) => <Tag color="red">{val}</Tag>,
    },
    {
      title: "Hoàn thành",
      dataIndex: "completed",
      key: "completed",
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
  ];

  const config = {
    data: chartData,
    xField: "date",
    yField: "count",
    label: {
      position: "top",
      style: {
        fill: "#000000",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      date: {
        alias: "Ngày",
      },
      count: {
        alias: "Số lịch khám",
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: 20 }}>
        <Space>
          <span>Chọn khoảng thời gian:</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates)}
            format="DD/MM/YYYY"
          />
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng lịch khám"
                  value={stats.total}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ xác nhận"
                  value={stats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã xác nhận"
                  value={stats.confirmed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã hủy"
                  value={stats.cancelled}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* <Card
            title="Biểu đồ lịch khám theo ngày"
            style={{ marginBottom: 20 }}
          >
            {chartData.length > 0 ? (
              <Column {...config} height={300} />
            ) : (
              <div
                style={{ textAlign: "center", padding: "50px", color: "#999" }}
              >
                Không có dữ liệu trong khoảng thời gian này
              </div>
            )}
          </Card>

          <Card title="Thống kê theo giường">
            <Table
              columns={bedColumns}
              dataSource={bedStats}
              rowKey="bedName"
              pagination={false}
            />
          </Card> */}
        </>
      )}
    </div>
  );
};

export default Statistics;
