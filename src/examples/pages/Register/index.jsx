import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import axios from "axios";

const { Title } = Typography;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      };
      const response = await axios.post("http://localhost:3000/doctors/register", registerData);

      if (response.data && response.data.data) {
        const { accessToken, refreshToken, doctor } = response.data.data;

        // Lưu tokens vào localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("doctor", JSON.stringify(doctor));

        message.success("Đăng ký thành công!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Register error:", error);
      if (error.response) {
        message.error(error.response.data?.message || "Đăng ký thất bại!");
      } else {
        message.error("Không thể kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <div className="register-header">
          <Title level={2}>Đăng Ký Admin</Title>
          <p>Tạo tài khoản mới để quản lý phòng khám</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên!" },
              { min: 3, message: "Họ tên phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Bác sĩ Nguyễn Văn A"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="doctor@clinic.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="0123456789"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="register-button"
            >
              Đăng Ký
            </Button>
          </Form.Item>

          <div className="register-footer">
            <span>Đã có tài khoản? </span>
            <Link to="/admin/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
