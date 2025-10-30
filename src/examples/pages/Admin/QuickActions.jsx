/* eslint-disable */
import React from "react";
import { Card, Row, Col, Button, Space } from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const QuickActions = ({ onCreateAppointment }) => {
  return (
    <Card title="⚡ Thao tác nhanh" style={{ marginBottom: 20 }} size="small">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            block
            icon={<PlusOutlined />}
            onClick={onCreateAppointment}
          >
            Tạo lịch mới
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button block icon={<CalendarOutlined />}>
            Xem lịch hôm nay
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button block icon={<FileTextOutlined />}>
            Xuất báo cáo
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button block icon={<SettingOutlined />}>
            Cài đặt
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default QuickActions;
