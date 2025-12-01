/* eslint-disable */
import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const AppointmentFormSection = ({
  beds,
  selectedBedId,
  availableServices,
  selectedServices,
  onServicesChange,
  totalPrice,
  formValues,
  onFormValuesChange,
  bedDisabled = false,
}) => {
  return (
    <>
      <Form.Item
        label="Giường khám"
        rules={[{ required: true, message: "Vui lòng chọn giường!" }]}
      >
        <Select
          placeholder="Chọn giường khám"
          value={selectedBedId}
          disabled={bedDisabled}
        >
          {beds.map((bed) => (
            <Option key={bed._id} value={bed._id}>
              {bed.bedName} - {bed.department}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Dịch vụ"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn ít nhất một dịch vụ!",
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Chọn các dịch vụ"
          value={selectedServices.map((s) => s._id)}
          onChange={onServicesChange}
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

      <Form.Item label="Tổng giá dịch vụ">
        <Input
          value={`${totalPrice.toLocaleString()} đ`}
          disabled
          style={{ fontWeight: "bold", color: "#d4380d" }}
        />
      </Form.Item>

      <Form.Item
        label="Thời gian bắt đầu"
        rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
      >
        <DatePicker
          showTime
          format="DD/MM/YYYY HH:mm"
          style={{ width: "100%" }}
          value={formValues.start ? dayjs(formValues.start) : null}
          onChange={(value) =>
            onFormValuesChange({ ...formValues, start: value })
          }
        />
      </Form.Item>

      <Form.Item
        label="Thời gian kết thúc"
        rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
      >
        <DatePicker
          showTime
          format="DD/MM/YYYY HH:mm"
          style={{ width: "100%" }}
          value={formValues.end ? dayjs(formValues.end) : null}
          onChange={(value) =>
            onFormValuesChange({ ...formValues, end: value })
          }
        />
      </Form.Item>

      <Form.Item label="Trạng thái">
        <Select
          value={formValues.status}
          onChange={(value) =>
            onFormValuesChange({ ...formValues, status: value })
          }
        >
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="confirmed">Đã xác nhận</Option>
          <Option value="cancelled">Đã hủy</Option>
          <Option value="completed">Hoàn thành</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Đã thanh toán">
          <Select
            value={formValues.isCheckout}
            onChange={(value) =>
              onFormValuesChange({ ...formValues, isCheckout: value })
            }
          >
            <Option value={true}>Có</Option>
            <Option value={false}>Không</Option>
          </Select>
        </Form.Item>

      <Form.Item label="Ghi chú">
        <Input.TextArea
          rows={3}
          placeholder="Nhập ghi chú..."
          value={formValues.title}
          onChange={(e) =>
            onFormValuesChange({ ...formValues, title: e.target.value })
          }
        />
      </Form.Item>
    </>
  );
};

export default AppointmentFormSection;
