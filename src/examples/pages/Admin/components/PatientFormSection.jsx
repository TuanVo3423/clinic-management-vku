/* eslint-disable */
import React from "react";
import { Form, Input, Select, Radio } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const PatientFormSection = ({
  patientMode,
  onPatientModeChange,
  existingPatients,
  selectedPatientId,
  onPatientSelect,
  newPatientForm,
  onNewPatientChange,
}) => {
  return (
    <>
      <Form.Item label="Loại bệnh nhân">
        <Radio.Group value={patientMode} onChange={onPatientModeChange}>
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
              onChange={onPatientSelect}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                    existingPatients.find((p) => p._id === selectedPatientId)
                      ?.fullName || ""
                  }
                  disabled
                />
              </Form.Item>

              <Form.Item label="Số điện thoại">
                <Input
                  value={
                    existingPatients.find((p) => p._id === selectedPatientId)
                      ?.phone || ""
                  }
                  disabled
                />
              </Form.Item>

              <Form.Item label="Ngày sinh">
                <Input
                  value={
                    existingPatients.find((p) => p._id === selectedPatientId)
                      ?.dateOfBirth
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
                onNewPatientChange({
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
                onNewPatientChange({
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
                onNewPatientChange({
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
  );
};

export default PatientFormSection;
