/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Timeline,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Spin,
  Divider,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HistoryOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";

const { Option } = Select;

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

      if(response.data.isPendingSavingToBlockchain) {
        Modal.info({
          title: "ℹ️ Thông tin",
          content: "Dữ liệu lịch khám đang được xử lý và lưu trữ lên Blockchain sau khi bạn tạo và cập nhật.",})
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
        doctorId: appointment.doctorId || "655f8c123456789012345679",
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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Không tìm thấy thông tin lịch khám</p>
        <Button onClick={() => navigate("/admin")}>Quay lại</Button>
      </div>
    );
  }

  const patient = appointment.patient?.[0] || {};
  const bed = beds.find((b) => b._id === appointment.bedId);

  return (
    <div
      style={{
        padding: "20px",
        margin: "0 auto",
        height: "100vh",
        overflow: "scroll",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin")}
          >
            Quay lại
          </Button>
          <h2 style={{ margin: 0 }}>Chi tiết lịch khám</h2>
        </Space>
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Xóa
          </Button>
        </Space>
      </div>

      {/* Verification Status Card */}
      {verificationStatus && (
        <Card
          style={{ marginBottom: 20 }}
          bordered={!verificationStatus.isValid}
          styles={{
            body: {
              backgroundColor: verificationStatus.isValid
                ? "#f6ffed"
                : "#fff2e8",
            },
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <SafetyOutlined style={{ fontSize: "16px" }} />
                <strong>Trạng thái xác thực Blockchain:</strong>
                {verificationStatus.isValid ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Dữ liệu hợp lệ
                  </Tag>
                ) : (
                  <Tag color="error" icon={<WarningOutlined />}>
                    Dữ liệu bị thay đổi trái phép
                  </Tag>
                )}
              </Space>
              <Button
                size="small"
                loading={verifyLoading}
                onClick={verifyAppointment}
              >
                Kiểm tra lại
              </Button>
            </div>
          </Space>
        </Card>
      )}

      {/* Main Info Card */}
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Thông tin lịch khám</span>
          </Space>
        }
        style={{ marginBottom: 20 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã lịch khám" span={2}>
            {appointment._id}
          </Descriptions.Item>

          <Descriptions.Item label="Bệnh nhân">
            {patient.fullName || "Không rõ"}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại">
            {patient.phone || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày sinh">
            {patient.dateOfBirth
              ? dayjs(patient.dateOfBirth).format("DD/MM/YYYY")
              : "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Giới tính">
            {patient.gender === "male"
              ? "Nam"
              : patient.gender === "female"
              ? "Nữ"
              : "Khác"}
          </Descriptions.Item>

          <Descriptions.Item label="Giường khám">
            {bed ? `${bed.bedName} - ${bed.department}` : appointment.bedId}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian bắt đầu">
            <Space>
              <ClockCircleOutlined />
              {dayjs(appointment.appointmentStartTime).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian kết thúc">
            <Space>
              <ClockCircleOutlined />
              {dayjs(appointment.appointmentEndTime).format("DD/MM/YYYY HH:mm")}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Dịch vụ" span={2}>
            {appointment.serviceIds && appointment.serviceIds.length > 0 ? (
              <Space wrap>
                {appointment.serviceIds.map((serviceId) => {
                  const service = availableServices.find(
                    (s) => s._id === serviceId
                  );
                  return service ? (
                    <Tag key={serviceId} color="blue">
                      {service.name} - {service.price.toLocaleString("vi-VN")}đ
                    </Tag>
                  ) : (
                    <Tag key={serviceId}>{serviceId}</Tag>
                  );
                })}
              </Space>
            ) : (
              "Không có dịch vụ"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Đã thanh toán">
            <Tag color={appointment.isCheckout ? "green" : "red"}>
              {appointment.isCheckout ? "Đã thanh toán" : "Chưa thanh toán"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={2}>
            {appointment.note || "Không có ghi chú"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* History Card */}
      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>Lịch sử thay đổi</span>
          </Space>
        }
      >
        {appointment.history && appointment.history.length > 0 ? (
          <Timeline
            items={appointment.history.map((item, index) => ({
              color: getActionColor(item.action),
              children: (
                <div key={index}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <Tag color={getActionColor(item.action)}>
                        {getActionText(item.action)}
                      </Tag>
                      <span style={{ color: "#999" }}>
                        {dayjs(item.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    </Space>
                    <div>
                      <strong>Người thực hiện:</strong> {item.by || "System"}
                    </div>
                    <div>
                      <strong>Chi tiết:</strong> {item.details || "Không có"}
                    </div>
                  </Space>
                </div>
              ),
            }))}
          />
        ) : (
          <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
            Chưa có lịch sử thay đổi
          </p>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa lịch khám"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="bedId"
            label="Giường khám"
            rules={[{ required: true, message: "Vui lòng chọn giường!" }]}
          >
            <Select placeholder="Chọn giường khám">
              {beds.map((bed) => (
                <Option key={bed._id} value={bed._id}>
                  {bed.bedName} - {bed.department}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="serviceIds"
            label="Dịch vụ"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các dịch vụ"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {availableServices.map((service) => (
                <Option key={service._id} value={service._id}>
                  {service.name} - {service.price.toLocaleString("vi-VN")}đ (
                  {service.duration} phút)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="appointmentStartTime"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="appointmentEndTime"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="completed">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
          </Form.Item>

          <Form.Item name="isCheckout" label="Đã thanh toán">
            <Select>
              <Option value={true}>Có</Option>
              <Option value={false}>Không</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentDetail;
