/*eslint-disable*/
import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Avatar,
  Tag,
  Table,
  Statistic,
  Row,
  Col,
  message,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./AdminChatbot.css";

const { TextArea } = Input;

// Export functions
const exportToExcel = async (data) => {
  try {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

    const fileName = `appointments_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    message.success(`Đã tải file ${fileName} thành công!`);
  } catch (error) {
    console.error("Export error:", error);
    message.error("Lỗi khi xuất file Excel");
  }
};

const exportToCSV = (data) => {
  try {
    if (!data || data.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointments_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    message.success("Đã tải file CSV thành công!");
  } catch (error) {
    console.error("Export error:", error);
    message.error("Lỗi khi xuất file CSV");
  }
};

const exportToPDF = async (data) => {
  try {
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("DANH SÁCH LỊCH HẸN", 14, 15);

    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 14, 22);

    doc.autoTable({
      head: [
        [
          "Bệnh nhân",
          "SĐT",
          "Bác sĩ",
          "Ngày",
          "Giờ",
          "Trạng thái",
          "Giá (VNĐ)",
        ],
      ],
      body: data.map((apt) => [
        apt.patientName || "",
        apt.patientPhone || "",
        apt.doctorName || "",
        apt.appointmentDate || "",
        apt.startTime || "",
        apt.status || "",
        apt.price ? apt.price.toLocaleString("vi-VN") : "",
      ]),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const fileName = `appointments_${new Date().getTime()}.pdf`;
    doc.save(fileName);

    message.success(`Đã tải file ${fileName} thành công!`);
  } catch (error) {
    console.error("Export error:", error);
    message.error("Lỗi khi xuất file PDF");
  }
};

const AdminChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat history từ localStorage khi component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("adminChatHistory");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, []);

  // Save chat history vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("adminChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Các câu hỏi gợi ý
  const quickSuggestions = [
    {
      text: "Cho tôi xem lịch hẹn hôm nay",
      icon: <CalendarOutlined />,
    },
    {
      text: "Doanh thu tháng này là bao nhiêu?",
      icon: <DollarOutlined />,
    },
    {
      text: "Xuất file Excel lịch hẹn tuần này",
      icon: <FileExcelOutlined />,
    },
    // {
    //   text: "Tìm lịch hẹn pending",
    //   icon: <ClockCircleOutlined />,
    // },
  ];

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_BE_URL + "/admin-chatbot/query",
        {
          message: messageText,
        }
      );

      const botMessage = {
        type: "bot",
        data: response.data.result,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      message.error("Không thể kết nối đến server");

      const errorMessage = {
        type: "bot",
        data: {
          message: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("adminChatHistory");
    message.success("Đã xóa lịch sử chat");
  };

  return (
    <div className="admin-chatbot-container">
      <Card className="chatbot-card" bordered={false}>
        <div className="chatbot-header">
          <Avatar
            size={40}
            icon={<RobotOutlined />}
            className="chatbot-avatar"
          />
          <div className="chatbot-header-text">
            <h3>AI Assistant</h3>
            <p>Trợ lý thông minh cho quản lý lịch hẹn</p>
          </div>
          {messages.length > 0 && (
            <Tooltip title="Xóa lịch sử chat">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={clearHistory}
                className="clear-history-btn"
                danger
              />
            </Tooltip>
          )}
        </div>

        {messages.length === 0 && (
          <div className="chatbot-welcome">
            <RobotOutlined className="welcome-icon" />
            <h3>Xin chào! Tôi có thể giúp gì cho bạn?</h3>
            <p>Hãy thử các câu hỏi gợi ý bên dưới hoặc nhập câu hỏi của bạn</p>
          </div>
        )}

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <MessageItem key={idx} message={msg} />
          ))}
          {loading && (
            <div className="bot-message-container">
              <Avatar icon={<RobotOutlined />} className="message-avatar" />
              <div className="bot-message">
                <Spin /> Đang xử lý...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          <p className="quick-actions-title">Câu hỏi gợi ý:</p>
          <div className="quick-actions-buttons">
            {quickSuggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                icon={suggestion.icon}
                onClick={() => handleQuickAction(suggestion.text)}
                className="quick-action-btn"
              >
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>

        <div className="chatbot-input-container">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="chatbot-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage()}
            loading={loading}
            disabled={!input.trim()}
            className="send-button"
          >
            Gửi
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Component hiển thị từng message
const MessageItem = ({ message }) => {
  if (message.type === "user") {
    return (
      <div className="user-message-container">
        <div className="user-message">{message.text}</div>
        <Avatar icon={<UserOutlined />} className="message-avatar" />
      </div>
    );
  }

  const { intent, data, message: botMessage, actionData } = message.data;

  return (
    <div className="bot-message-container">
      <Avatar icon={<RobotOutlined />} className="message-avatar" />
      <div className="bot-message">
        <BotResponseRenderer
          intent={intent}
          data={data}
          message={botMessage}
          actionData={actionData}
        />
      </div>
    </div>
  );
};

// Component render response theo intent
const BotResponseRenderer = ({
  intent,
  data,
  message: botMessage,
  actionData,
}) => {
  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", text: "Chờ xác nhận" },
      confirmed: { color: "blue", text: "Đã xác nhận" },
      completed: { color: "green", text: "Hoàn thành" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  switch (intent) {
    case "get_appointments":
      if (!data || !data.appointments || data.appointments.length === 0) {
        return (
          <div>
            <p>{botMessage}</p>
            <Empty description="Không có lịch hẹn nào" />
          </div>
        );
      }

      const columns = [
        {
          title: "Bệnh nhân",
          dataIndex: ["patient", "name"],
          key: "patient",
          width: 150,
        },
        {
          title: "SĐT",
          dataIndex: ["patient", "phone"],
          key: "phone",
          width: 120,
        },
        {
          title: "Bác sĩ",
          dataIndex: ["doctor", "name"],
          key: "doctor",
          width: 150,
        },
        {
          title: "Ngày",
          dataIndex: "appointmentDate",
          key: "date",
          width: 110,
          render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
          title: "Giờ",
          key: "time",
          width: 100,
          render: (_, record) =>
            `${record.appointmentStartTime} - ${record.appointmentEndTime}`,
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          key: "status",
          width: 130,
          render: (status) => getStatusTag(status),
        },
        {
          title: "Giá",
          dataIndex: "price",
          key: "price",
          width: 120,
          render: (price) => `${price?.toLocaleString("vi-VN")} đ`,
        },
      ];

      return (
        <div className="appointments-response">
          <p className="response-message">{botMessage}</p>

          {data.statistics && (
            <Row gutter={16} className="statistics-row">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tổng số"
                    value={data.statistics.total}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Chờ xác nhận"
                    value={data.statistics.byStatus?.pending || 0}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đã xác nhận"
                    value={data.statistics.byStatus?.confirmed || 0}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Hoàn thành"
                    value={data.statistics.byStatus?.completed || 0}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>
          )}

          <Table
            columns={columns}
            dataSource={data.appointments}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 900 }}
            size="small"
            className="appointments-table"
          />
        </div>
      );

    case "get_appointment_revenue":
      if (!data) {
        return <p>{botMessage}</p>;
      }

      return (
        <div className="revenue-response">
          <p className="response-message">{botMessage}</p>

          <Row gutter={16} className="statistics-row">
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={data.totalRevenue}
                  suffix="đ"
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Doanh thu TB/lịch"
                  value={data.averageRevenue}
                  suffix="đ"
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng lịch hẹn"
                  value={data.totalAppointments}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {data.revenueByDate && data.revenueByDate.length > 0 && (
            <div className="revenue-by-date">
              <h4>Chi tiết doanh thu theo ngày:</h4>
              <Table
                columns={[
                  {
                    title: "Ngày",
                    dataIndex: "date",
                    key: "date",
                    render: (date) =>
                      new Date(date).toLocaleDateString("vi-VN"),
                  },
                  {
                    title: "Doanh thu",
                    dataIndex: "revenue",
                    key: "revenue",
                    render: (revenue) => `${revenue.toLocaleString("vi-VN")} đ`,
                  },
                ]}
                dataSource={data.revenueByDate}
                rowKey="date"
                pagination={{ pageSize: 7 }}
                size="small"
              />
            </div>
          )}
        </div>
      );

    case "export_appointments":
      const handleDownload = () => {
        const format = actionData?.format;
        if(format?.toUpperCase()) {
          message.info(`Đang tải file ${format?.toUpperCase()}...`);
        switch (format) {
          case "excel":
            exportToExcel(data);
            break;
          case "pdf":
            exportToPDF(data);
            break;
          case "csv":
            exportToCSV(data);
            break;
          default:
            message.error("Định dạng file không được hỗ trợ");
        }
          
        }
        message.info(`File không có dữ liệu để tải xuống!`);
        
      };

      const getFileIcon = (format) => {
        switch (format) {
          case "excel":
            return <FileExcelOutlined style={{ color: "#52c41a" }} />;
          case "pdf":
            return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
          case "csv":
            return <FileTextOutlined style={{ color: "#1890ff" }} />;
          default:
            return <DownloadOutlined />;
        }
      };

      return (
        <div className="export-response">
          <p className="response-message">{botMessage}</p>
          <div className="export-info">
            <div className="export-file-card">
              <div className="file-icon">{getFileIcon(actionData?.format)}</div>
              <div className="file-details">
                <p className="file-name">
                  File {actionData?.format?.toUpperCase()} của bạn đã sẵn sàng
                </p>
                <p className="file-meta">
                  {actionData?.totalRecords} bản ghi •{" "}
                  {actionData?.format?.toUpperCase()}
                </p>
              </div>
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="download-btn"
              block
            >
              Tải xuống file {actionData?.format?.toUpperCase()}
            </Button>
          </div>
        </div>
      );

    case "search_appointments":
      if (!data || !data.results || data.results.length === 0) {
        return (
          <div>
            <p>{botMessage}</p>
            <Empty description="Không tìm thấy kết quả nào" />
          </div>
        );
      }

      const searchColumns = [
        {
          title: "Bệnh nhân",
          dataIndex: ["patient", "name"],
          key: "patient",
        },
        {
          title: "SĐT",
          dataIndex: ["patient", "phone"],
          key: "phone",
        },
        {
          title: "Bác sĩ",
          dataIndex: ["doctor", "name"],
          key: "doctor",
        },
        {
          title: "Ngày",
          dataIndex: "appointmentDate",
          key: "date",
          render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
          title: "Giờ",
          key: "time",
          render: (_, record) =>
            `${record.appointmentStartTime} - ${record.appointmentEndTime}`,
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          key: "status",
          render: (status) => getStatusTag(status),
        },
      ];

      return (
        <div className="search-response">
          <p className="response-message">{botMessage}</p>
          {data.searchCriteria && (
            <div className="search-criteria">
              <Tag color="blue">Tìm theo: {data.searchCriteria.searchBy}</Tag>
              <Tag color="green">Từ khóa: {data.searchCriteria.query}</Tag>
            </div>
          )}
          <Table
            columns={searchColumns}
            dataSource={data.results}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            size="small"
            scroll={{ x: 800 }}
          />
        </div>
      );

    default:
      return <p className="default-message">{botMessage}</p>;
  }
};

export default AdminChatbot;
