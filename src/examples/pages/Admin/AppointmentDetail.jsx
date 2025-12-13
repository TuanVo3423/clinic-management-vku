/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Modal,
  Form,
  message,
  Spin,
  Row,
  Col,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import VerificationCard from "./components/VerificationCard.jsx";
import AppointmentInfoCard from "./components/AppointmentInfoCard.jsx";
import AppointmentHistoryCard from "./components/AppointmentHistoryCard.jsx";
import EditAppointmentDetailModal from "./components/EditAppointmentDetailModal.jsx";
import "./AppointmentDetail.css";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [beds, setBeds] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointmentDetail();
      fetchBeds();
      fetchServices();
      verifyAppointment();
    }
  }, [id]);

  const fetchAppointmentDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/appointments/${id}`
      );

      console.log("response 123", response.data.appointment);
      setAppointment(response.data.appointment);
    } catch (error) {
      message.error("Không thể tải thông tin lịch khám!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async () => {
    try {
      const bedsRes = await axios.get("http://localhost:3000/beds");
      setBeds(bedsRes.data.beds);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/services?minPrice=0&maxPrice=500000"
      );
      setAvailableServices(res.data.services || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách dịch vụ:", err);
    }
  };

  const verifyAppointment = async () => {
    setVerifyLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/appointments/${id}/verify`
      );
      console.log("response", response);

      if (response.data.isPendingSavingToBlockchain) {
        Modal.info({
          title: "ℹ️ Thông tin",
          content:
            "Dữ liệu lịch khám đang được xử lý và lưu trữ lên Blockchain sau khi bạn tạo và cập nhật.",
        });
        return;
      }
      setVerificationStatus(response.data);

      // Hiển thị cảnh báo nếu dữ liệu bị thay đổi trái phép
      if (response.data.isValid === false) {
        Modal.warning({
          title: "⚠️ Cảnh báo bảo mật!",
          content: "Dữ liệu lịch khám đã bị thay đổi trái phép!",
          okText: "Đã hiểu",
          width: 500,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xác thực lịch khám:", error);
      // Không hiển thị lỗi cho người dùng nếu API verify không khả dụng
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleEdit = () => {
    if (!appointment) return;

    form.setFieldsValue({
      bedId: appointment.bedId,
      appointmentStartTime: dayjs(appointment.appointmentStartTime),
      appointmentEndTime: dayjs(appointment.appointmentEndTime),
      status: appointment.status,
      note: appointment.note,
      serviceIds: appointment.serviceIds || [],
      isCheckout: appointment.isCheckout,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa lịch khám này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/appointments/${id}`);
          message.success("Đã xóa lịch khám!");
          navigate("/admin");
        } catch (error) {
          message.error("Không thể xóa lịch khám!");
          console.error(error);
        }
      },
    });
  };

  const handleUpdate = async (values) => {
    try {
      const payload = {
        bedId: values.bedId,
        patientId: appointment.patientId,
        serviceIds: values.serviceIds || [],
        appointmentStartTime: values.appointmentStartTime.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        appointmentEndTime: values.appointmentEndTime.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        status: values.status,
        note: values.note,
        isCheckout: values.isCheckout,
      };

      await axios.patch(`http://localhost:3000/appointments/${id}`, payload);
      message.success("Đã cập nhật lịch khám!");
      setIsEditModalVisible(false);

      // Reload appointment detail
      fetchAppointmentDetail();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật!");
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "gold";
      case "confirmed":
        return "green";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case "created":
        return "Tạo mới";
      case "updated":
        return "Cập nhật";
      case "cancelled":
        return "Hủy bỏ";
      case "completed":
        return "Hoàn thành";
      default:
        return action;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "green";
      case "updated":
        return "blue";
      case "cancelled":
        return "red";
      case "completed":
        return "purple";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="appointment-detail-container">
        <div className="loading-container">
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="appointment-detail-container">
        <div className="empty-container">
          <p>Không tìm thấy thông tin lịch khám</p>
          <Button onClick={() => navigate(-1)} size="large" type="primary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const patient = appointment.patient?.[0] || {};
  const bed = beds.find((b) => b._id === appointment.bedId);

  return (
    <div className="appointment-detail-container">
      <div className="appointment-detail-wrapper">
        {/* Modern Header Card */}
        <Card className="detail-header-card" bordered={false}>
          <div className="detail-header-content">
            <Space size="middle" className="header-left-section">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="back-button"
                size="large"
              >
                Quay lại
              </Button>
              <div className="header-title-section">
                <h1 className="detail-page-title">Chi tiết lịch khám</h1>
                <p className="detail-page-subtitle">
                  Thông tin chi tiết và lịch sử thay đổi
                </p>
              </div>
            </Space>
            <Space size="middle" className="header-actions">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                size="large"
                className="edit-button"
              >
                Chỉnh sửa
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                size="large"
                className="delete-button"
              >
                Xóa
              </Button>
            </Space>
          </div>
        </Card>

        {/* Content Grid */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Main Info */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Verification Status Card */}
              <VerificationCard
                verificationStatus={verificationStatus}
                verifyLoading={verifyLoading}
                onVerify={verifyAppointment}
              />

              {/* Main Info Card */}
              <AppointmentInfoCard
                appointment={appointment}
                patient={patient}
                bed={bed}
                availableServices={availableServices}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            </Space>
          </Col>

          {/* Right Column - History */}
          <Col xs={24} lg={8}>
            <AppointmentHistoryCard
              history={appointment.history}
              getActionText={getActionText}
              getActionColor={getActionColor}
            />
          </Col>
        </Row>
      </div>

      {/* Edit Modal */}
      <EditAppointmentDetailModal
        visible={isEditModalVisible}
        form={form}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onSubmit={handleUpdate}
        beds={beds}
        availableServices={availableServices}
      />
    </div>
  );
};

export default AppointmentDetail;
