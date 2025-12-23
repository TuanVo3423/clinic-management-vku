import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import axios from "axios";

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BE_URL}/doctors/login`,
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data && response.data.data) {
        const { accessToken, refreshToken, doctor } = response.data.data;

        // Lưu tokens vào localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("doctor", JSON.stringify(doctor));

        message.success("Đăng nhập thành công!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        message.error(error.response.data?.message || "Đăng nhập thất bại!");
      } else {
        message.error("Không thể kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>Đăng Nhập Admin</Title>
          <p>Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-button"
            >
              Đăng Nhập
            </Button>
          </Form.Item>

          <div className="login-footer">
            <span>Chưa có tài khoản? </span>
            <Link to="/admin/register">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
