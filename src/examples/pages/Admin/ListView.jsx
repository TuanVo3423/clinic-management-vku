/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  Space,
  message,
  Radio,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const ListView = () => {
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  
  // New patient mode states
  const [patientMode, setPatientMode] = useState("existing");
  const [existingPatients, setExistingPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: "",
    phone: "",
    gender: "male",
  });

  useEffect(() => {
    fetchData();
    fetchExistingPatients();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch beds
      const bedsRes = await axios.get("http://localhost:3000/beds");
      setBeds(bedsRes.data.beds);

      // Fetch appointments (last 30 days)
      const startDate = dayjs()
        .subtract(30, "day")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm:ss");
      const url = `http://localhost:3000/appointments/by-time-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;

      const apptRes = await axios.get(url);
      setAppointments(apptRes.data.appointments);
    } catch (error) {
      message.error("Không thể tải dữ liệu!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/patients");
      setExistingPatients(response.data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      message.error("Không thể tải danh sách bệnh nhân!");
    }
  };

  const handleAdd = () => {
    setEditingAppointment(null);
    form.resetFields();
    setPatientMode("existing");
    setSelectedPatientId(null);
    setNewPatientForm({ fullName: "", phone: "", gender: "male" });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAppointment(record);
    form.setFieldsValue({
      bedId: record.bedId,
      patientName: record.patient?.[0]?.fullName || "",
      appointmentStartTime: dayjs(record.appointmentStartTime),
      appointmentEndTime: dayjs(record.appointmentEndTime),
      status: record.status,
      note: record.note,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
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

          // Lưu tab hiện tại và reload trang
          localStorage.setItem("adminActiveTab", "list");
          window.location.reload();
        } catch (error) {
          message.error("Không thể xóa lịch khám!");
          console.error(error);
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      let patientId = null;

      if (editingAppointment) {
        // Update mode - use existing patientId
        patientId = editingAppointment.patientId || "68eb572c67c485c17868fe9b";
      } else {
        // Create mode - handle patient selection/creation
        if (patientMode === "existing") {
          if (!selectedPatientId) {
            message.error("Vui lòng chọn bệnh nhân!");
            return;
          }
          patientId = selectedPatientId;
        } else {
          // Mode new patient - validate and create
          if (
            !newPatientForm.fullName.trim() ||
            !newPatientForm.phone.trim() ||
            !newPatientForm.gender
          ) {
            message.error("Vui lòng điền đầy đủ thông tin bệnh nhân!");
            return;
          }

          // Create new patient first
          try {
            const createPatientResponse = await axios.post(
              "http://localhost:3000/patients",
              {
                fullName: newPatientForm.fullName.trim(),
                phone: newPatientForm.phone.trim(),
                gender: newPatientForm.gender,
              }
            );

            patientId = createPatientResponse.data.patient._id;
            console.log("✅ New patient created:", patientId);

            // Refresh patient list
            await fetchExistingPatients();
          } catch (err) {
            console.error("Error creating patient:", err);
            message.error(
              "Không thể tạo bệnh nhân mới. " +
                (err.response?.data?.message || "Vui lòng thử lại!")
            );
            return;
          }
        }
      }

      const payload = {
        bedId: values.bedId,
        patientId: patientId,
        doctorId: "655f8c123456789012345679", // Default doctor
        serviceId: "655f8c12345678901234567a", // Default service
        appointmentStartTime: values.appointmentStartTime.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        appointmentEndTime: values.appointmentEndTime.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        status: values.status || "pending",
        note: values.note,
      };

      if (editingAppointment) {
        // Update
        await axios.patch(
          `http://localhost:3000/appointments/${editingAppointment._id}`,
          payload
        );
        message.success("Đã cập nhật lịch khám!");
      } else {
        // Create
        await axios.post("http://localhost:3000/appointments", payload);
        message.success("Đã tạo lịch khám mới!");
      }

      setIsModalVisible(false);
      form.resetFields();
      setPatientMode("existing");
      setSelectedPatientId(null);
      setNewPatientForm({ fullName: "", phone: "", gender: "male" });

      // Lưu tab hiện tại và reload trang
      localStorage.setItem("adminActiveTab", "list");
      window.location.reload();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
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

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bệnh nhân",
      dataIndex: ["patient", 0, "fullName"],
      key: "patientName",
      render: (name) => name || "Không rõ",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        const patientName = record.patient?.[0]?.fullName || "";
        return patientName.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Giường",
      dataIndex: "bedId",
      key: "bedId",
      render: (bedId) => {
        const bed = beds.find((b) => b._id === bedId);
        return bed ? bed.bedName : bedId;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "appointmentStartTime",
      key: "start",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) =>
        dayjs(a.appointmentStartTime).unix() -
        dayjs(b.appointmentStartTime).unix(),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "appointmentEndTime",
      key: "end",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "Chờ xác nhận", value: "pending" },
        { text: "Đã xác nhận", value: "confirmed" },
        { text: "Đã hủy", value: "cancelled" },
        { text: "Hoàn thành", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Input
            placeholder="Tìm kiếm bệnh nhân..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button onClick={() => setSearchText("")}>Xóa bộ lọc</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm lịch khám
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} lịch khám`,
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={
          editingAppointment ? "Chỉnh sửa lịch khám" : "Thêm lịch khám mới"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setPatientMode("existing");
          setSelectedPatientId(null);
          setNewPatientForm({ fullName: "", phone: "", gender: "male" });
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {!editingAppointment && (
            <>
              <Form.Item label="Loại bệnh nhân">
                <Radio.Group
                  value={patientMode}
                  onChange={(e) => {
                    setPatientMode(e.target.value);
                    setSelectedPatientId(null);
                    setNewPatientForm({
                      fullName: "",
                      phone: "",
                      gender: "male",
                    });
                  }}
                >
                  <Radio value="existing">Bệnh nhân có sẵn</Radio>
                  <Radio value="new">Bệnh nhân mới</Radio>
                </Radio.Group>
              </Form.Item>

              {patientMode === "existing" ? (
                <>
                  <Form.Item label="Chọn bệnh nhân" required>
                    <Select
                      placeholder="Chọn bệnh nhân"
                      value={selectedPatientId}
                      onChange={(value) => setSelectedPatientId(value)}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {existingPatients.map((patient) => (
                        <Option key={patient._id} value={patient._id}>
                          {patient.fullName} - {patient.phone}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {selectedPatientId && (
                    <>
                      <Form.Item label="Họ tên">
                        <Input
                          value={
                            existingPatients.find(
                              (p) => p._id === selectedPatientId
                            )?.fullName || ""
                          }
                          disabled
                        />
                      </Form.Item>

                      <Form.Item label="Số điện thoại">
                        <Input
                          value={
                            existingPatients.find(
                              (p) => p._id === selectedPatientId
                            )?.phone || ""
                          }
                          disabled
                        />
                      </Form.Item>

                      <Form.Item label="Ngày sinh">
                        <Input
                          value={
                            existingPatients.find(
                              (p) => p._id === selectedPatientId
                            )?.dateOfBirth
                              ? dayjs(
                                  existingPatients.find(
                                    (p) => p._id === selectedPatientId
                                  )?.dateOfBirth
                                ).format("DD/MM/YYYY")
                              : ""
                          }
                          disabled
                        />
                      </Form.Item>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Form.Item label="Họ tên" required>
                    <Input
                      value={newPatientForm.fullName}
                      onChange={(e) =>
                        setNewPatientForm({
                          ...newPatientForm,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Nhập họ tên bệnh nhân"
                    />
                  </Form.Item>

                  <Form.Item label="Số điện thoại" required>
                    <Input
                      value={newPatientForm.phone}
                      onChange={(e) =>
                        setNewPatientForm({
                          ...newPatientForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>

                  <Form.Item label="Giới tính" required>
                    <Select
                      value={newPatientForm.gender}
                      onChange={(value) =>
                        setNewPatientForm({
                          ...newPatientForm,
                          gender: value,
                        })
                      }
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </>
              )}
            </>
          )}

          {editingAppointment && (
            <Form.Item name="patientName" label="Tên bệnh nhân">
              <Input placeholder="Nhập tên bệnh nhân" disabled />
            </Form.Item>
          )}

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

          <Form.Item name="status" label="Trạng thái" initialValue="pending">
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
        </Form>
      </Modal>
    </div>
  );
};

export default ListView;
