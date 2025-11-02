/* eslint-disable */
import React, { useState } from "react";
import { Modal, Input, Button, Form, DatePicker, Select, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const AuthPatientModal = ({ visible, onSuccess, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [form] = Form.useForm();

  // 👉 Hàm đăng nhập bằng SĐT
  const handleLogin = async () => {
    if (!phone.trim()) {
      message.warning("Vui lòng nhập số điện thoại!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/patients/phone/${phone}`);
      const patient = res.data.patient;

      if (patient) {
        localStorage.setItem("patient", JSON.stringify(patient));
        message.success(`Xin chào, ${patient.fullName}!`);
        onSuccess(patient);
      } else {
        message.warning("Không tìm thấy bệnh nhân. Vui lòng đăng ký mới!");
        setRegisterMode(true);
      }
    } catch (err) {
      console.warn("Patient not found -> switching to register mode");
      setRegisterMode(true);
    } finally {
      setLoading(false);
    }
  };

  // 👉 Hàm đăng ký bệnh nhân mới
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || "",
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
        gender: values.gender,
      };

      const res = await axios.post("http://localhost:3000/patients", payload);
      const patient = res.data.patient;

      localStorage.setItem("patient", JSON.stringify(patient));
      message.success("Đăng ký thành công!");
      onSuccess(patient);
    } catch (err) {
      console.error("❌ Register failed:", err);
      message.error("Đăng ký thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={registerMode ? "Đăng ký bệnh nhân mới" : "Đăng nhập bằng số điện thoại"}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      {!registerMode ? (
        <>
          <Input
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose}>Đóng</Button>
            <Button type="primary" loading={loading} onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>
        </>
      ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleRegister}
          initialValues={{ phone }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setRegisterMode(false)}>Quay lại</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng ký
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default AuthPatientModal;
