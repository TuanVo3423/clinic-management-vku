/* eslint-disable */
import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const EditAppointmentDetailModal = ({
  visible,
  form,
  onCancel,
  onSubmit,
  beds,
  availableServices,
}) => {
  return (
    <Modal
      title="Chỉnh sửa lịch khám"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
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
  );
};

export default EditAppointmentDetailModal;
