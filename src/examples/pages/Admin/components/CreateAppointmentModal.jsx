/* eslint-disable */
import React from "react";
import { Modal, Form, Skeleton } from "antd";
import PatientFormSection from "./PatientFormSection";
import AppointmentFormSection from "./AppointmentFormSection";

const CreateAppointmentModal = ({
  visible,
  loading,
  onCancel,
  onOk,
  patientMode,
  onPatientModeChange,
  existingPatients,
  selectedPatientId,
  onPatientSelect,
  newPatientForm,
  onNewPatientChange,
  beds,
  tempEvent,
  availableServices,
  selectedServices,
  onServicesChange,
  totalPrice,
  formValues,
  onFormValuesChange,
}) => {
  return (
    <Modal
      title="Thêm lịch khám mới"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Skeleton loading={loading} active>
        <Form layout="vertical">
          <PatientFormSection
            patientMode={patientMode}
            onPatientModeChange={onPatientModeChange}
            existingPatients={existingPatients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={onPatientSelect}
            newPatientForm={newPatientForm}
            onNewPatientChange={onNewPatientChange}
          />

          <AppointmentFormSection
            beds={beds}
            selectedBedId={tempEvent?.slotId}
            availableServices={availableServices}
            selectedServices={selectedServices}
            onServicesChange={onServicesChange}
            totalPrice={totalPrice}
            formValues={formValues}
            onFormValuesChange={onFormValuesChange}
            bedDisabled={true}
          />
        </Form>
      </Skeleton>
    </Modal>
  );
};

export default CreateAppointmentModal;
