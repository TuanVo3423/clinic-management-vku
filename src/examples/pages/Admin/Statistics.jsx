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
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { Column } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";


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
      const bedsRes = await axios.get("http://localhost:3000/beds");
      setBeds(bedsRes.data.beds);

      // Fetch services
      const servicesRes = await axios.get(
        "http://localhost:3000/services?minPrice=0&maxPrice=500000"
      );
      setServices(servicesRes.data.services || []);

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
    <div style={{ padding: "20px", height: "100vh", overflow: "scroll" }}>
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
          {/* Thống kê trạng thái */}
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
                  title="Đã hoàn thành"
                  value={stats.completed}
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

          {/* Thống kê doanh thu */}
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={revenueStats.totalRevenue}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                  suffix="đ"
                  formatter={(value) => value.toLocaleString("vi-VN")}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title={`Đã thanh toán (${revenueStats.paidCount} đơn)`}
                  value={revenueStats.paidRevenue}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                  suffix="đ"
                  formatter={(value) => value.toLocaleString("vi-VN")}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title={`Chưa thanh toán (${revenueStats.unpaidCount} đơn)`}
                  value={revenueStats.unpaidRevenue}
                  prefix={<WalletOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                  suffix="đ"
                  formatter={(value) => value.toLocaleString("vi-VN")}
                />
              </Card>
            </Col>
          </Row>

          {/* Chi tiết thanh toán */}
          <Card style={{ marginBottom: 20 }}>
            <Tabs
              defaultActiveKey="paid"
              items={[
                {
                  key: "paid",
                  label: `Đã thanh toán (${paidAppointments.length})`,
                  children: (
                    <div>
                      <Space style={{ marginBottom: 16 }}>
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
                      <Space style={{ marginBottom: 16 }}>
                        <Input
                          placeholder="Tìm kiếm bệnh nhân..."
                          prefix={<SearchOutlined />}
                          value={unpaidSearchText}
                          onChange={(e) => setUnpaidSearchText(e.target.value)}
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
        </>
      )}
    </div>
  );
};

export default Statistics;
