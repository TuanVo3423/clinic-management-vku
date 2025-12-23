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
  Tabs,
  Input,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  WalletOutlined,
  SearchOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { Column } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";
import "./Statistics.css";

const { RangePicker } = DatePicker;

const Statistics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [services, setServices] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [paidSearchText, setPaidSearchText] = useState("");
  const [unpaidSearchText, setUnpaidSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch beds
      const bedsRes = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/beds`
      );
      setBeds(bedsRes.data.beds);

      // Fetch services
      const servicesRes = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/services?minPrice=0&maxPrice=500000`
      );
      setServices(servicesRes.data.services || []);

      // Fetch appointments
      const startDate = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
      const endDate = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
      const url = `${
        process.env.REACT_APP_BASE_BE_URL
      }/appointments/by-time-range?startDate=${encodeURIComponent(
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

  // Helper function to calculate appointment total price
  const calculateAppointmentPrice = (appointment) => {
    if (!appointment.serviceIds || appointment.serviceIds.length === 0) {
      return 0;
    }
    return appointment.serviceIds.reduce((total, serviceId) => {
      const service = services.find((s) => s._id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  // Calculate statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  // Calculate revenue statistics
  const revenueStats = {
    totalRevenue: appointments.reduce(
      (sum, appt) => sum + calculateAppointmentPrice(appt),
      0
    ),
    paidRevenue: appointments
      .filter((a) => a.isCheckout)
      .reduce((sum, appt) => sum + calculateAppointmentPrice(appt), 0),
    unpaidRevenue: appointments
      .filter((a) => !a.isCheckout)
      .reduce((sum, appt) => sum + calculateAppointmentPrice(appt), 0),
    paidCount: appointments.filter((a) => a.isCheckout).length,
    unpaidCount: appointments.filter((a) => !a.isCheckout).length,
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
  const revenueByDate = {};

  appointments.forEach((appt) => {
    const date = dayjs(appt.appointmentStartTime).format("YYYY-MM-DD");
    if (!dateStats[date]) {
      dateStats[date] = 0;
      revenueByDate[date] = 0;
    }
    dateStats[date]++;
    revenueByDate[date] += calculateAppointmentPrice(appt);
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

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({
      date: dayjs(date).format("DD/MM"),
      revenue: revenue,
    }))
    .sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("-");
      const dateB = b.date.split("/").reverse().join("-");
      return dateA.localeCompare(dateB);
    });

  // Prepare appointment tables data
  const paidAppointments = appointments
    .filter((a) => a.isCheckout)
    .filter((a) => {
      if (!paidSearchText) return true;
      const patientName = a.patient?.[0]?.fullName || "";
      return patientName.toLowerCase().includes(paidSearchText.toLowerCase());
    });

  console.log("paidAppointments", paidAppointments);

  const unpaidAppointments = appointments
    .filter((a) => !a.isCheckout)
    .filter((a) => {
      if (!unpaidSearchText) return true;
      const patientName = a.patient?.[0]?.fullName || "";
      return patientName.toLowerCase().includes(unpaidSearchText.toLowerCase());
    });

  const appointmentColumns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient",
      key: "patientName",
      render: (patient) => patient?.[0]?.fullName || "-",
    },
    {
      title: "Giường",
      dataIndex: "bedId",
      key: "bedId",
      render: (bedId) => {
        const bed = beds.find((b) => b._id === bedId);
        return bed ? bed.bedName : "-";
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "appointmentStartTime",
      key: "appointmentStartTime",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "appointmentEndTime",
      key: "appointmentEndTime",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "gold",
          confirmed: "green",
          cancelled: "red",
          completed: "blue",
        };
        const labels = {
          pending: "Chờ xác nhận",
          confirmed: "Đã xác nhận",
          cancelled: "Đã hủy",
          completed: "Hoàn thành",
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
    },
    {
      title: "Số tiền",
      dataIndex: "_id",
      key: "price",
      render: (_, record) => {
        const price = calculateAppointmentPrice(record);
        return `${price.toLocaleString("vi-VN")}đ`;
      },
      sorter: (a, b) =>
        calculateAppointmentPrice(a) - calculateAppointmentPrice(b),
    },
  ];

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

  const revenueConfig = {
    data: revenueChartData,
    xField: "date",
    yField: "revenue",
    label: {
      position: "top",
      style: {
        fill: "#000000",
        opacity: 0.6,
      },
      formatter: (datum) => {
        return `${(datum.revenue / 1000).toFixed(0)}k`;
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
      revenue: {
        alias: "Doanh thu (VNĐ)",
        formatter: (v) => `${v.toLocaleString("vi-VN")}đ`,
      },
    },
    columnStyle: {
      fill: "#52c41a",
    },
  };

  return (
    <div className="statistics-container">
      {/* Header Section */}
      <div className="statistics-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-wrapper">
              <BarChartOutlined className="header-icon" />
            </div>
            <div>
              <h2 className="statistics-title">Thống kê & Báo cáo</h2>
              <p className="statistics-subtitle">
                Phân tích dữ liệu và theo dõi hiệu suất
              </p>
            </div>
          </div>
          <div className="header-right">
            <Space size="middle">
              <span className="date-label">Khoảng thời gian:</span>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates)}
                format="DD/MM/YYYY"
                className="date-range-picker"
                size="large"
              />
            </Space>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
        </div>
      ) : (
        <>
          {/* Thống kê trạng thái */}
          <div className="stats-section">
            <h3 className="section-title">
              <CalendarOutlined /> Tổng quan lịch khám
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8} xl={4}>
                <Card className="stat-card total" bordered={false}>
                  <div className="stat-icon-wrapper total">
                    <CalendarOutlined />
                  </div>
                  <Statistic
                    title="Tổng lịch khám"
                    value={stats.total}
                    valueStyle={{ color: "#1e3c72", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8} xl={4}>
                <Card className="stat-card pending" bordered={false}>
                  <div className="stat-icon-wrapper pending">
                    <ClockCircleOutlined />
                  </div>
                  <Statistic
                    title="Chờ xác nhận"
                    value={stats.pending}
                    valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8} xl={4}>
                <Card className="stat-card confirmed" bordered={false}>
                  <div className="stat-icon-wrapper confirmed">
                    <CheckCircleOutlined />
                  </div>
                  <Statistic
                    title="Đã xác nhận"
                    value={stats.confirmed}
                    valueStyle={{ color: "#52c41a", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8} xl={4}>
                <Card className="stat-card completed" bordered={false}>
                  <div className="stat-icon-wrapper completed">
                    <CheckCircleOutlined />
                  </div>
                  <Statistic
                    title="Đã hoàn thành"
                    value={stats.completed}
                    valueStyle={{ color: "#1890ff", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8} xl={4}>
                <Card className="stat-card cancelled" bordered={false}>
                  <div className="stat-icon-wrapper cancelled">
                    <CloseCircleOutlined />
                  </div>
                  <Statistic
                    title="Đã hủy"
                    value={stats.cancelled}
                    valueStyle={{ color: "#ff4d4f", fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Thống kê doanh thu */}
          <div className="stats-section">
            <h3 className="section-title">
              <DollarOutlined /> Tổng quan doanh thu
            </h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card className="revenue-card total" bordered={false}>
                  <div className="revenue-icon-wrapper total">
                    <DollarOutlined />
                  </div>
                  <Statistic
                    title="Tổng doanh thu"
                    value={revenueStats.totalRevenue}
                    valueStyle={{
                      color: "#1e3c72",
                      fontWeight: 700,
                      fontSize: 28,
                    }}
                    suffix="đ"
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                  <div className="revenue-subtitle">
                    {appointments.length} lịch khám
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="revenue-card paid" bordered={false}>
                  <div className="revenue-icon-wrapper paid">
                    <CheckCircleOutlined />
                  </div>
                  <Statistic
                    title="Đã thanh toán"
                    value={revenueStats.paidRevenue}
                    valueStyle={{
                      color: "#52c41a",
                      fontWeight: 700,
                      fontSize: 28,
                    }}
                    suffix="đ"
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                  <div className="revenue-subtitle">
                    {revenueStats.paidCount} đơn đã thanh toán
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="revenue-card unpaid" bordered={false}>
                  <div className="revenue-icon-wrapper unpaid">
                    <WalletOutlined />
                  </div>
                  <Statistic
                    title="Chưa thanh toán"
                    value={revenueStats.unpaidRevenue}
                    valueStyle={{
                      color: "#ff4d4f",
                      fontWeight: 700,
                      fontSize: 28,
                    }}
                    suffix="đ"
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                  <div className="revenue-subtitle">
                    {revenueStats.unpaidCount} đơn chưa thanh toán
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Chi tiết thanh toán */}
          <div className="stats-section">
            <Card className="payment-details-card" bordered={false}>
              <Tabs
                defaultActiveKey="paid"
                className="payment-tabs"
                style={{ padding: "0 10px" }}
                size="large"
                items={[
                  {
                    key: "paid",
                    label: `Đã thanh toán (${paidAppointments.length})`,
                    children: (
                      <div>
                        <Space style={{ marginBottom: 16, marginTop: 16 }}>
                          <Input
                            placeholder="Tìm kiếm bệnh nhân..."
                            prefix={<SearchOutlined />}
                            value={paidSearchText}
                            onChange={(e) => setPaidSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                          />
                        </Space>
                        <Table
                          columns={appointmentColumns}
                          dataSource={paidAppointments}
                          rowKey="_id"
                          onRow={(record) => ({
                            onClick: () => {
                              navigate(`/admin/appointment/${record._id}`);
                            },
                            style: { cursor: "pointer" },
                          })}
                          pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Tổng ${total} lịch khám`,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20", "50"],
                          }}
                          scroll={{ x: 800 }}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "unpaid",
                    label: `Chưa thanh toán (${unpaidAppointments.length})`,
                    children: (
                      <div>
                        <Space style={{ marginBottom: 16, marginTop: 16 }}>
                          <Input
                            placeholder="Tìm kiếm bệnh nhân..."
                            prefix={<SearchOutlined />}
                            value={unpaidSearchText}
                            onChange={(e) =>
                              setUnpaidSearchText(e.target.value)
                            }
                            style={{ width: 250 }}
                            allowClear
                          />
                        </Space>
                        <Table
                          columns={appointmentColumns}
                          dataSource={unpaidAppointments}
                          onRow={(record) => ({
                            onClick: () => {
                              navigate(`/admin/appointment/${record._id}`);
                            },
                            style: { cursor: "pointer" },
                          })}
                          rowKey="_id"
                          pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Tổng ${total} lịch khám`,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20", "50"],
                          }}
                          scroll={{ x: 800 }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
