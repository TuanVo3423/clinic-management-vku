import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/services`
      );
      // Handle both array and object responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.services || response.data?.data || [];
      setServices(data);
    } catch (error) {
      message.error("Không thể tải danh sách dịch vụ");
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_BE_URL}/services/${id}`);
      message.success("Xóa dịch vụ thành công");
      fetchServices();
    } catch (error) {
      message.error("Không thể xóa dịch vụ");
      console.error("Error deleting service:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingService) {
        // Update
        await axios.patch(
          `${process.env.REACT_APP_BASE_BE_URL}/services/${editingService._id}`,
          values
        );
        message.success("Cập nhật dịch vụ thành công");
      } else {
        // Create
        await axios.post(
          `${process.env.REACT_APP_BASE_BE_URL}/services`,
          values
        );
        message.success("Thêm dịch vụ thành công");
      }
      setModalVisible(false);
      form.resetFields();
      fetchServices();
    } catch (error) {
      message.error(
        editingService ? "Không thể cập nhật dịch vụ" : "Không thể thêm dịch vụ"
      );
      console.error("Error saving service:", error);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "duration",
      key: "duration",
      width: 150,
      align: "center",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="service-management">
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarOutlined style={{ fontSize: "20px" }} />
            <span>Quản lý dịch vụ</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            Thêm dịch vụ mới
          </Button>
        }
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={services}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} dịch vụ`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editingService ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
          >
            <Input placeholder="Ví dụ: Khám và châm cứu" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea
              placeholder="Mô tả chi tiết về dịch vụ"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian (phút)"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian" },
              {
                type: "number",
                min: 1,
                message: "Thời gian phải lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              placeholder="60"
              style={{ width: "100%" }}
              size="large"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              {
                type: "number",
                min: 0,
                message: "Giá phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              placeholder="300000"
              style={{ width: "100%" }}
              size="large"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
                size="large"
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                {editingService ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
