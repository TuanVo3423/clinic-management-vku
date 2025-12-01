/* eslint-disable */
import React from "react";
import { Card, Descriptions, Tag, Space } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AppointmentInfoCard = ({
  appointment,
  patient,
  bed,
  availableServices,
  getStatusColor,
  getStatusText,
}) => {
  return (
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
            {dayjs(appointment.appointmentStartTime).format("DD/MM/YYYY HH:mm")}
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
  );
};

export default AppointmentInfoCard;
