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
  Tag,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/beds`
      );
      // Handle both array and object responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.beds || response.data?.data || [];
      setBeds(data);
    } catch (error) {
      message.error("Không thể tải danh sách giường bệnh");
      console.error("Error fetching beds:", error);
      setBeds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBed(null);
    form.resetFields();
    form.setFieldsValue({ isAvailable: true });
    setModalVisible(true);
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    form.setFieldsValue({
      bedNumber: bed.bedNumber,
      bedName: bed.bedName,
      department: bed.department,
      description: bed.description,
      isAvailable: bed.isAvailable !== undefined ? bed.isAvailable : true,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_BE_URL}/beds/${id}`);
      message.success("Xóa giường bệnh thành công");
      fetchBeds();
    } catch (error) {
      message.error("Không thể xóa giường bệnh");
      console.error("Error deleting bed:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBed) {
        // Update
        await axios.put(
          `${process.env.REACT_APP_BASE_BE_URL}/beds/${editingBed._id}`,
          values
        );
        message.success("Cập nhật giường bệnh thành công");
      } else {
        // Create
        await axios.post(`${process.env.REACT_APP_BASE_BE_URL}/beds`, values);
        message.success("Thêm giường bệnh thành công");
      }
      setModalVisible(false);
      form.resetFields();
      fetchBeds();
    } catch (error) {
      message.error(
        editingBed
          ? "Không thể cập nhật giường bệnh"
          : "Không thể thêm giường bệnh"
      );
      console.error("Error saving bed:", error);
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
      title: "Số giường",
      dataIndex: "bedNumber",
      key: "bedNumber",
      width: 120,
      align: "center",
      sorter: (a, b) => a.bedNumber - b.bedNumber,
      render: (bedNumber) => <strong>#{bedNumber}</strong>,
    },
    {
      title: "Tên giường",
      dataIndex: "bedName",
      key: "bedName",
      sorter: (a, b) => a.bedName.localeCompare(b.bedName),
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
      width: 150,
      filters: [
        { text: "VIP", value: "VIP" },
        { text: "Nội khoa", value: "Nội khoa" },
        { text: "Ngoại khoa", value: "Ngoại khoa" },
        { text: "Sản", value: "Sản" },
        { text: "Nhi", value: "Nhi" },
      ],
      onFilter: (value, record) => record.department === value,
      render: (department) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: 130,
      align: "center",
      filters: [
        { text: "Có sẵn", value: true },
        { text: "Không khả dụng", value: false },
      ],
      onFilter: (value, record) =>
        (record.isAvailable !== undefined ? record.isAvailable : true) ===
        value,
      render: (isAvailable) =>
        isAvailable !== false ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Có sẵn
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Không khả dụng
          </Tag>
        ),
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
            description="Bạn có chắc chắn muốn xóa giường bệnh này?"
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
    <div className="bed-management">
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MedicineBoxOutlined style={{ fontSize: "20px" }} />
            <span>Quản lý giường bệnh</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            Thêm giường bệnh mới
          </Button>
        }
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={beds}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} giường bệnh`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editingBed ? "Cập nhật giường bệnh" : "Thêm giường bệnh mới"}
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
            name="bedNumber"
            label="Số giường"
            rules={[
              { required: true, message: "Vui lòng nhập số giường" },
              {
                type: "number",
                min: 1,
                message: "Số giường phải lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              placeholder="11"
              style={{ width: "100%" }}
              size="large"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="bedName"
            label="Tên giường"
            rules={[{ required: true, message: "Vui lòng nhập tên giường" }]}
          >
            <Input placeholder="Ví dụ: Bed 11 - VIP Room" size="large" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Khoa"
            rules={[{ required: true, message: "Vui lòng nhập tên khoa" }]}
          >
            <Input
              placeholder="Ví dụ: VIP, Nội khoa, Ngoại khoa"
              size="large"
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              placeholder="Mô tả chi tiết về giường bệnh"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="isAvailable"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Có sẵn"
              unCheckedChildren="Không khả dụng"
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
                {editingBed ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BedManagement;
