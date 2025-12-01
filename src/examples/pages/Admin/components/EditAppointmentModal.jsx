/* eslint-disable */
import React from "react";
import { Modal, Form, Input, Skeleton } from "antd";
import AppointmentFormSection from "./AppointmentFormSection";

const EditAppointmentModal = ({
  visible,
  loading,
  onCancel,
  onOk,
  selectedEvent,
  beds,
  availableServices,
  selectedServices,
  onServicesChange,
  totalPrice,
  formValues,
  onFormValuesChange,
}) => {
  return (
    <Modal
      title="Chỉnh sửa lịch khám"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Skeleton loading={loading} style={{ minHeight: 300 }} active>
        <Form layout="vertical">
          <Form.Item label="Tên bệnh nhân">
            <Input value={selectedEvent?.patientName || ""} disabled />
          </Form.Item>

          <Form.Item label="Số điện thoại">
            <Input value={selectedEvent?.phone || ""} disabled />
          </Form.Item>

          <AppointmentFormSection
            beds={beds}
            selectedBedId={selectedEvent?.resourceId}
            availableServices={availableServices}
            selectedServices={selectedServices}
            onServicesChange={onServicesChange}
            totalPrice={totalPrice}
            formValues={formValues}
            onFormValuesChange={onFormValuesChange}
            bedDisabled={true}
            status={formValues.status}
          />
        </Form>
      </Skeleton>
    </Modal>
  );
};

export default EditAppointmentModal;
