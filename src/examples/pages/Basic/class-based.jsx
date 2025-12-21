/* eslint-disable */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-render-return-value */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-set-state */
import React, { Component } from "react";
import { Modal, Form, Input, DatePicker, Spin, message, Button } from "antd";
import { Scheduler, SchedulerData, ViewType, wrapperFun } from "../../../index";
import AuthPatientModal from "../../../components/AuthPatientmModal.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import axios from "axios";
import SiteLayout from "../SiteLayout.jsx";

class Basic extends Component {
  constructor(props) {
    super(props);
    const todayVN = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
    const schedulerData = new SchedulerData(
      todayVN,
      ViewType.Day,
      false,
      false,
      {
        besidesWidth: 50,
        schedulerContentHeight: "100%",
        resourceName: "Bed No.",
        dayMaxEvents: 99,
        viewChangeEnabled: false,
        eventItemPopoverTrigger: "none",
        dayStartFrom: 16,
        dayStopTo: 22,
        minuteStep: 30,
        nonAgendaDayCellHeaderFormat: "HH:mm",
        dayCellWidth: 90,
        schedulerContentWidth: "100%",
        nonWorkingTimeHeadStyle: { backgroundColor: "#fff" },
        nonWorkingTimeBodyBgColor: "#fff",
        eventItemLineHeight: 40,
        // responsiveByParent: true,
      }
    );

    const storedInfo = localStorage.getItem("patientInfo");
    const parsedInfo = storedInfo ? JSON.parse(storedInfo) : null;
    const safePatientInfo = parsedInfo?.data?.patient || null;

    this.state = {
      viewModel: schedulerData,
      loading: true,
      isModalVisible: false,
      formValues: {
        title: "",
        start: null,
        end: null,
      },
      tempEvent: null,
      editModalVisible: false,
      selectedEvent: null,
      showAuthModal: false,
      patientInfo: safePatientInfo,
      isEmergency: false,
      availableServices: [],
      selectedServices: [],
      totalPrice: 0,
      showDeleteConfirm: false,
    };
  }
  isLoggedIn = () => {
    return !!(
      this.state.patientInfo || JSON.parse(localStorage.getItem("patientInfo"))
    );
  };

  // helper: determine ownership from event/appt object
  isOwnerOf = (evtOrAppt) => {
    const current =
      this.state.patientInfo || JSON.parse(localStorage.getItem("patientInfo"));
    if (!current) return false;
    const ownerId =
      evtOrAppt.ownerId ||
      evtOrAppt.patientId ||
      (evtOrAppt.patient &&
        Array.isArray(evtOrAppt.patient) &&
        evtOrAppt.patient[0]?._id) ||
      (evtOrAppt.patient && evtOrAppt.patient._id);
    if (!ownerId) return false;
    return String(ownerId) === String(current._id);
  };

  async componentDidMount() {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    const { viewModel } = this.state;
    await this.fetchAppointmentsByRange(viewModel.startDate, viewModel.endDate);
  }
  fetchServices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/services?minPrice=0&maxPrice=500000"
      );
      this.setState({ availableServices: res.data.services });
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách dịch vụ:", err);
    }
  };

  fetchAppointmentsByRange = async (start, end) => {
    try {
      this.setState({ loading: true });
      const { viewModel } = this.state;

      const bedsRes = await axios.get("http://localhost:3000/beds");
      const beds = bedsRes.data.beds.map((bed) => ({
        id: bed._id,
        name: bed.bedName,
        department: bed.department,
      }));
      const currentPatient =
        this.state.patientInfo ||
        JSON.parse(localStorage.getItem("patientInfo"));
      let startDate = dayjs(start)
        .tz("Asia/Ho_Chi_Minh")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      let endDate = dayjs(start)
        .tz("Asia/Ho_Chi_Minh")
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      if (viewModel.viewType === ViewType.Day) {
        startDate = dayjs(start)
          .tz("Asia/Ho_Chi_Minh")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ssZ");
        endDate = dayjs(start)
          .tz("Asia/Ho_Chi_Minh")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ssZ");
      } else if (viewModel.viewType === ViewType.Week) {
        startDate = dayjs(start)
          .tz("Asia/Ho_Chi_Minh")
          .startOf("week")
          .format("YYYY-MM-DDTHH:mm:ssZ");
        endDate = dayjs(end)
          .tz("Asia/Ho_Chi_Minh")
          .endOf("week")
          .format("YYYY-MM-DDTHH:mm:ssZ");
      } else {
        startDate = dayjs(start)
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DDTHH:mm:ssZ");
        endDate = dayjs(end)
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DDTHH:mm:ssZ");
      }

      const url = `http://localhost:3000/appointments/by-time-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
      console.log("URL:", url);
      const apptRes = await axios.get(url);

      const appointments = apptRes.data.appointments.map((a) => {
        let statusColor;
        switch (a.status) {
          case "pending":
            statusColor = "#faad14";
            break;
          case "confirmed":
            statusColor = "#52c41a";
            break;
          case "cancelled":
            statusColor = "#ff4d4f";
            break;
          default:
            statusColor = "#d9d9d9";
        }
        const ownerId =
          a.patientId ||
          (a.patient && Array.isArray(a.patient) && a.patient[0]?._id) ||
          (a.patient && a.patient._id) ||
          null;
        const isOwn =
          currentPatient &&
          ownerId &&
          String(ownerId) === String(currentPatient._id);

        const start = dayjs(
          a.appointmentStart || a.appointmentStartTime
        ).format("YYYY-MM-DDTHH:mm:ss");
        const end = dayjs(a.appointmentEnd || a.appointmentEndTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        console.log("start:", start, "| raw:", a.appointmentStartTime);

        const bgColor = isOwn ? statusColor : "#bfbfbf";

        return {
          id: a._id,
          start,
          end,
          resourceId: a.bedId,
          title: `${a.patient?.[0]?.fullName || "Bệnh nhân không rõ"} - ${
            a.status
          }`,
          bgColor,
          ownerId,
          isOwn,
        };
      });
      console.log("Final mapped appointments:", appointments);
      viewModel.setResources(beds);
      viewModel.setEvents(appointments);

      this.setState({ viewModel, loading: false });
    } catch (err) {
      console.error("Error fetching appointments:", err);
      this.setState({ loading: false });
    }
    console.log("Fetching range:", start, end);
    console.log("Local:", dayjs(start).format(), dayjs(end).format());
  };

  render() {
    const { viewModel, loading } = this.state;
    const isPicker = this.props.isPickerMode;
    const { isShowModal, selectedEvent } = this.state;
    const canDelete = selectedEvent ? this.isOwnerOf(selectedEvent) : false;

    const schedulerContent = (
      <div
        className="scheduler-scroll-wrapper"
        style={{
          background: "white",
          padding: isPicker ? 0 : 20,
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Spin spinning={loading}>
          <Scheduler
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            viewEventClick={this.ops1}
            viewEventText="Edit"
            viewEvent2Text="Delete"
            viewEvent2Click={this.ops2}
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            conflictOccurred={this.conflictOccurred}
            toggleExpandFunc={this.toggleExpandFunc}
          />
        </Spin>
      </div>
    );

    if (isPicker) {
      return (
        <div
          className="scheduler-picker-container"
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flexShrink: 0 }}>
            💡 <strong>Hướng dẫn:</strong> Kéo chuột vào vùng trống trên lịch để
            chọn giờ.
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>{schedulerContent}</div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <SiteLayout>
          <Scheduler
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            viewEventText=""
            viewEvent2Text=""
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            onScrollLeft={this.onScrollLeft}
            onScrollRight={this.onScrollRight}
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
            toggleExpandFunc={this.toggleExpandFunc}
          />
          <Modal
            title={
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  margin: "-20px -24px 20px",
                  padding: "20px 24px",
                  borderRadius: "8px 8px 0 0",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 2px 8px rgba(5, 150, 105, 0.15)",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                </svg>
                Tạo lịch hẹn mới
              </div>
            }
            open={this.state.isModalVisible}
            onCancel={() => this.setState({ isModalVisible: false })}
            onOk={this.handleCreateEvent}
            okText="Xác nhận đặt lịch"
            cancelText="Hủy bỏ"
            width={680}
            style={{ top: 20 }}
            okButtonProps={{
              style: {
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                borderColor: "#059669",
                height: "40px",
                fontSize: "15px",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
                transition: "all 0.3s ease",
              },
            }}
            cancelButtonProps={{
              style: {
                height: "40px",
                fontSize: "15px",
                borderColor: "#d9d9d9",
              },
            }}
          >
            <Form
              layout="vertical"
              style={{
                marginTop: "8px",
                overflowY: "scroll",
                maxHeight: "60vh",
              }}
            >
              {/* Patient Info Section */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "1px solid #a7f3d0",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#059669",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Thông tin bệnh nhân
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <Form.Item
                    label={
                      <span style={{ color: "#065f46", fontWeight: "500" }}>
                        Tên bệnh nhân
                      </span>
                    }
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      value={this.state.patientInfo?.fullName || ""}
                      disabled
                      style={{
                        background: "white",
                        border: "1px solid #a7f3d0",
                        borderRadius: "8px",
                        color: "#064e3b",
                        fontWeight: "500",
                      }}
                      prefix={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span style={{ color: "#065f46", fontWeight: "500" }}>
                        Số điện thoại
                      </span>
                    }
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      value={this.state.patientInfo?.phone || ""}
                      disabled
                      style={{
                        background: "white",
                        border: "1px solid #a7f3d0",
                        borderRadius: "8px",
                        color: "#064e3b",
                        fontWeight: "500",
                      }}
                      prefix={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="2"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Note Section */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Ghi chú
                  </span>
                }
              >
                <Input.TextArea
                  value={this.state.formValues.title}
                  onChange={(e) =>
                    this.setState({
                      formValues: {
                        ...this.state.formValues,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="Nhập ghi chú hoặc lý do khám (nếu có)..."
                  rows={3}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    resize: "none",
                  }}
                />
              </Form.Item>

              {/* Emergency Checkbox */}
              <Form.Item>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    background: this.state.isEmergency ? "#fef2f2" : "#f9fafb",
                    border: this.state.isEmergency
                      ? "2px solid #ef4444"
                      : "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={this.state.isEmergency}
                    onChange={(e) =>
                      this.setState({ isEmergency: e.target.checked })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#ef4444",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "600",
                      color: this.state.isEmergency ? "#dc2626" : "#374151",
                      fontSize: "14px",
                    }}
                  >
                    🚨 Lịch khẩn cấp
                  </span>
                  {this.state.isEmergency && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#dc2626",
                        fontWeight: "500",
                      }}
                    >
                      Ưu tiên cao
                    </span>
                  )}
                </label>
              </Form.Item>

              {/* Services Section */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Dịch vụ khám ({this.state.selectedServices.length} đã chọn)
                  </span>
                }
              >
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {this.state.availableServices.map((svc) => {
                      const isSelected = this.state.selectedServices.some(
                        (s) => s._id === svc._id
                      );
                      return (
                        <button
                          key={svc._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) return;
                            this.setState((prev) => ({
                              selectedServices: [...prev.selectedServices, svc],
                              totalPrice: prev.totalPrice + svc.price,
                            }));
                          }}
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                              : "white",
                            color: isSelected ? "#fff" : "#374151",
                            border: isSelected
                              ? "2px solid #059669"
                              : "2px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "10px 14px",
                            cursor: isSelected ? "default" : "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            opacity: isSelected ? 1 : 0.9,
                            textAlign: "left",
                            boxShadow: isSelected
                              ? "0 2px 8px rgba(5, 150, 105, 0.2)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#059669";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{svc.name}</span>
                            {isSelected && <span>✓</span>}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "4px",
                              fontWeight: "600",
                              color: isSelected ? "#d1fae5" : "#059669",
                            }}
                          >
                            {svc.price.toLocaleString()}đ
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Services Tags */}
                  {this.state.selectedServices.length > 0 && (
                    <div
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: "2px dashed #d1d5db",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#065f46",
                          marginBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        Dịch vụ đã chọn:
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {this.state.selectedServices.map((svc) => (
                          <span
                            key={svc._id}
                            style={{
                              background:
                                "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                              color: "white",
                              padding: "8px 14px",
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: "13px",
                              fontWeight: "500",
                              boxShadow: "0 2px 6px rgba(5, 150, 105, 0.25)",
                            }}
                          >
                            <span>{svc.name}</span>
                            <span
                              style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                color: "white",
                                borderRadius: "50%",
                                width: 20,
                                height: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: "bold",
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => {
                                this.setState((prev) => ({
                                  selectedServices:
                                    prev.selectedServices.filter(
                                      (s) => s._id !== svc._id
                                    ),
                                  totalPrice: prev.totalPrice - svc.price,
                                }));
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(255, 255, 255, 0.5)";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(255, 255, 255, 0.3)";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>

              {/* Total Price */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Tổng giá dịch vụ
                  </span>
                }
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "2px solid #fbbf24",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#92400e",
                    }}
                  >
                    Tổng thanh toán:
                  </span>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#b45309",
                    }}
                  >
                    {this.state.totalPrice.toLocaleString()} đ
                  </span>
                </div>
              </Form.Item>

              {/* Time Selection */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: "8px",
                }}
              >
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#065f46",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      🕐 Thời gian bắt đầu
                    </span>
                  }
                >
                  <DatePicker
                    showTime
                    value={
                      this.state.formValues.start
                        ? dayjs(this.state.formValues.start)
                        : null
                    }
                    onChange={(value) =>
                      this.setState({
                        formValues: { ...this.state.formValues, start: value },
                      })
                    }
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                    placeholder="Chọn thời gian bắt đầu"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#065f46",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      🕐 Thời gian kết thúc
                    </span>
                  }
                >
                  <DatePicker
                    showTime
                    value={
                      this.state.formValues.end
                        ? dayjs(this.state.formValues.end)
                        : null
                    }
                    onChange={(value) =>
                      this.setState({
                        formValues: { ...this.state.formValues, end: value },
                      })
                    }
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                    placeholder="Chọn thời gian kết thúc"
                  />
                </Form.Item>
              </div>

              {/* Info Note */}
              <div
                style={{
                  background: "#eff6ff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                  marginTop: "4px",
                  fontSize: "13px",
                  color: "#1e40af",
                  lineHeight: "1.6",
                }}
              >
                <strong>ℹ️ Lưu ý:</strong> Giờ khám từ 16:30 - 22:00. Vui lòng
                chọn thời gian phù hợp.
              </div>
            </Form>
          </Modal>
          <Modal
            title={
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  margin: "-20px -24px 20px",
                  padding: "20px 24px",
                  borderRadius: "8px 8px 0 0",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 2px 8px rgba(8, 145, 178, 0.15)",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Chỉnh sửa lịch hẹn
              </div>
            }
            open={this.state.editModalVisible}
            onCancel={() => this.setState({ editModalVisible: false })}
            footer={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                }}
              >
                <div>
                  {canDelete && (
                    <Button
                      key="delete"
                      danger
                      onClick={this.handleDeleteAppointment}
                      style={{
                        height: "40px",
                        fontSize: "15px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.2)",
                      }}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      }
                    >
                      Xóa lịch hẹn
                    </Button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    key="cancel"
                    onClick={() => this.setState({ editModalVisible: false })}
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      borderColor: "#d9d9d9",
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    key="save"
                    type="primary"
                    onClick={this.handleEditAppointment}
                    style={{
                      background:
                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      borderColor: "#059669",
                      height: "40px",
                      fontSize: "15px",
                      fontWeight: "600",
                      boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    icon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    }
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            }
            width={680}
            style={{ top: 20 }}
          >
            <Form
              layout="vertical"
              style={{
                marginTop: "8px",
                overflowY: "scroll",
                maxHeight: "60vh",
              }}
            >
              {/* Note Section */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Ghi chú / Lý do khám
                  </span>
                }
              >
                <Input.TextArea
                  value={this.state.formValues.title}
                  onChange={(e) =>
                    this.setState({
                      formValues: {
                        ...this.state.formValues,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="Nhập ghi chú hoặc lý do khám..."
                  rows={3}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    resize: "none",
                  }}
                />
              </Form.Item>

              {/* Services Section */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Dịch vụ khám ({this.state.selectedServices.length} đã chọn)
                  </span>
                }
              >
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {this.state.availableServices.map((svc) => {
                      const isSelected = this.state.selectedServices.some(
                        (s) => s._id === svc._id
                      );
                      return (
                        <button
                          key={svc._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) return;
                            this.setState((prev) => ({
                              selectedServices: [...prev.selectedServices, svc],
                              totalPrice: prev.totalPrice + svc.price,
                            }));
                          }}
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                              : "white",
                            color: isSelected ? "#fff" : "#374151",
                            border: isSelected
                              ? "2px solid #059669"
                              : "2px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "10px 14px",
                            cursor: isSelected ? "default" : "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            opacity: isSelected ? 1 : 0.9,
                            textAlign: "left",
                            boxShadow: isSelected
                              ? "0 2px 8px rgba(5, 150, 105, 0.2)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#059669";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{svc.name}</span>
                            {isSelected && <span>✓</span>}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "4px",
                              fontWeight: "600",
                              color: isSelected ? "#d1fae5" : "#059669",
                            }}
                          >
                            {svc.price.toLocaleString()}đ
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Services Tags */}
                  {this.state.selectedServices.length > 0 && (
                    <div
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: "2px dashed #d1d5db",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#065f46",
                          marginBottom: "10px",
                          fontWeight: "600",
                        }}
                      >
                        Dịch vụ đã chọn:
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {this.state.selectedServices.map((svc) => (
                          <span
                            key={svc._id}
                            style={{
                              background:
                                "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                              color: "white",
                              padding: "8px 14px",
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: "13px",
                              fontWeight: "500",
                              boxShadow: "0 2px 6px rgba(5, 150, 105, 0.25)",
                            }}
                          >
                            <span>{svc.name}</span>
                            <span
                              style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                color: "white",
                                borderRadius: "50%",
                                width: 20,
                                height: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: "bold",
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => {
                                this.setState((prev) => ({
                                  selectedServices:
                                    prev.selectedServices.filter(
                                      (s) => s._id !== svc._id
                                    ),
                                  totalPrice: prev.totalPrice - svc.price,
                                }));
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(255, 255, 255, 0.5)";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(255, 255, 255, 0.3)";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>

              {/* Total Price */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#065f46",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Tổng giá dịch vụ
                  </span>
                }
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "2px solid #fbbf24",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#92400e",
                    }}
                  >
                    Tổng thanh toán:
                  </span>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#b45309",
                    }}
                  >
                    {this.state.totalPrice.toLocaleString()} đ
                  </span>
                </div>
              </Form.Item>

              {/* Time Selection */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: "8px",
                }}
              >
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#065f46",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      🕐 Thời gian bắt đầu
                    </span>
                  }
                >
                  <DatePicker
                    showTime
                    value={
                      this.state.formValues.start
                        ? dayjs(this.state.formValues.start)
                        : null
                    }
                    onChange={(value) =>
                      this.setState({
                        formValues: { ...this.state.formValues, start: value },
                      })
                    }
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                    placeholder="Chọn thời gian bắt đầu"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#065f46",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      🕐 Thời gian kết thúc
                    </span>
                  }
                >
                  <DatePicker
                    showTime
                    value={
                      this.state.formValues.end
                        ? dayjs(this.state.formValues.end)
                        : null
                    }
                    onChange={(value) =>
                      this.setState({
                        formValues: { ...this.state.formValues, end: value },
                      })
                    }
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                    placeholder="Chọn thời gian kết thúc"
                  />
                </Form.Item>
              </div>

              {/* Info Note */}
              <div
                style={{
                  background: "#eff6ff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                  marginTop: "4px",
                  fontSize: "13px",
                  color: "#1e40af",
                  lineHeight: "1.6",
                }}
              >
                <strong>ℹ️ Lưu ý:</strong> Giờ khám từ 16:30 - 22:00. Vui lòng
                chọn thời gian phù hợp.
              </div>
            </Form>
          </Modal>
          
          {/* Delete Confirmation Modal */}
          <Modal
            open={this.state.showDeleteConfirm}
            onCancel={() => this.setState({ showDeleteConfirm: false })}
            footer={null}
            width={480}
            centered
            closable={false}
          >
            <div style={{ textAlign: "center", padding: "20px 10px" }}>
              {/* Warning Icon */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px",
                  background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2s infinite",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "12px",
                }}
              >
                Xác nhận xóa lịch hẹn
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "15px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                  marginBottom: "28px",
                }}
              >
                Bạn có chắc chắn muốn xóa lịch hẹn này không?
                <br />
                <span style={{ color: "#dc2626", fontWeight: "600" }}>
                  Hành động này không thể hoàn tác!
                </span>
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <Button
                  size="large"
                  onClick={() => this.setState({ showDeleteConfirm: false })}
                  style={{
                    minWidth: "120px",
                    height: "44px",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  danger
                  size="large"
                  onClick={this.confirmDeleteAppointment}
                  style={{
                    minWidth: "120px",
                    height: "44px",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                  }}
                  icon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  }
                >
                  Xóa ngay
                </Button>
              </div>
            </div>

            <style jsx>{`
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }
            `}</style>
          </Modal>

          <AuthPatientModal
            visible={this.state.showAuthModal}
            onSuccess={(patientInfo) => {
              localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
              this.setState({ showAuthModal: false });
            }}
            onClose={() => this.setState({ showAuthModal: false })}
          />
        </SiteLayout>
      </div>
    );
  }
  handleLogout = () => {
    localStorage.removeItem("patientInfo");
    message.info("Bạn đã đăng xuất thành công!");
    window.location.reload();
  };
  prevClick = async (schedulerData) => {
    schedulerData.prev();
    await this.fetchAppointmentsByRange(
      schedulerData.startDate,
      schedulerData.endDate
    );
    this.setState({ viewModel: schedulerData });
  };

  nextClick = async (schedulerData) => {
    schedulerData.next();
    await this.fetchAppointmentsByRange(
      schedulerData.startDate,
      schedulerData.endDate
    );
    this.setState({ viewModel: schedulerData });
  };

  onViewChange = (schedulerData, view) => {
    const start = new Date();
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    // schedulerData.setEvents(DemoData.events);
    this.setState({ viewModel: schedulerData });
    function secondsBetween(date1, date2) {
      const diff = Math.abs(date1.getTime() - date2.getTime());
      return diff / 1000;
    }

    console.log("Elapsed seconds: " + secondsBetween(start, new Date()));
  };

  onSelectDate = async (schedulerData, date) => {
    const localDate = dayjs(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
    schedulerData.setDate(localDate);
    await this.fetchAppointmentsByRange(
      schedulerData.startDate,
      schedulerData.endDate
    );
    this.setState({ viewModel: schedulerData });
  };

  eventClicked = async (schedulerData, event) => {
    if (!this.isLoggedIn()) {
      this.setState({ showAuthModal: true });
      return;
    }

    // fetch appointment details
    this.fetchServices();
    let appt;
    try {
      const res = await axios.get(
        `http://localhost:3000/appointments/${event.id}`
      );
      appt = res.data.appointment || res.data;
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết lịch hẹn:", err);
      message.error("Không thể tải chi tiết lịch hẹn!");
      return;
    }

    // check ownership
    const isOwner = this.isOwnerOf(appt) || this.isOwnerOf(event);
    if (!isOwner) {
      message.warning(
        "Bạn không có quyền chỉnh sửa lịch hẹn của người khác. Nếu bạn muốn đặt, vui lòng tạo lịch mới."
      );
      return;
    }

    // proceed to open edit modal for owner (previous behavior)
    try {
      let selectedServices = [];
      if (appt.services && appt.services.length > 0) {
        selectedServices = appt.services;
      } else if (appt.serviceIds && Array.isArray(appt.serviceIds)) {
        selectedServices = this.state.availableServices.filter((svc) =>
          appt.serviceIds.includes(svc._id)
        );
      }

      const totalPrice = selectedServices.reduce(
        (sum, s) => sum + (s.price || 0),
        0
      );

      this.setState({
        editModalVisible: true,
        selectedEvent: event,
        formValues: {
          title: appt.note || event.title.split(" - ")[0],
          start: dayjs(appt.appointmentStartTime),
          end: dayjs(appt.appointmentEndTime),
        },
        selectedServices,
        totalPrice,
      });
    } catch (err) {
      console.error(err);
    }
  };

  ops1 = (schedulerData, event) => {
    message.info(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  ops2 = (schedulerData, event) => {
    message.info(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end) => {
    if (this.props.isPickerMode) {
      if (this.props.onSlotSelect) {
        this.props.onSlotSelect({
          start: start,
          end: end,
          resourceId: slotId,
          resourceName: slotName,
        });
      }
      return;
    }
    const { patientInfo } = this.state;
    if (!patientInfo) {
      this.setState({ showAuthModal: true });
      return;
    }
    this.fetchServices();
    this.setState({
      isModalVisible: true,
      tempEvent: { schedulerData, slotId, slotName, start, end },
      formValues: { title: "", start, end },
      selectedServices: [],
      totalPrice: 0,
      isEmergency: false,
    });
  };

  handleCreateEvent = async () => {
    const { tempEvent, formValues, patientInfo } = this.state;
    const { schedulerData, slotId, start, end } = tempEvent;

    const title = formValues.title.trim();
    if (!patientInfo) {
      this.setState({ showAuthModal: true });
      return;
    }

    if (!title) {
      message.warning("Vui lòng nhập tên lịch hẹn");
      return;
    }

    const startTime = dayjs(formValues.start || start);
    const endTime = dayjs(formValues.end || end);

    const earliest = startTime.startOf("day").hour(16).minute(30);
    const latestStart = startTime.startOf("day").hour(19).minute(30);
    const latestEnd = startTime.startOf("day").hour(22).minute(0);

    if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
      message.warning("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      return;
    }

    if (endTime.isAfter(latestEnd)) {
      message.warning("Giờ kết thúc không được quá 22:00!");
      return;
    }

    try {
      this.setState({ loading: true });
      const payload = {
        bedId: slotId,
        patientId: patientInfo._id,
        serviceIds: this.state.selectedServices.map((s) => s._id),
        appointmentDate: startTime.format("YYYY-MM-DD"),
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        note: `${title} | Dịch vụ: ${this.state.selectedServices
          .map((s) => s.name)
          .join(", ")}`,
        isEmergency: this.state.isEmergency,
        createdBy: "patient",
      };

      await axios.post("http://localhost:3000/appointments", payload);

      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );

      this.setState({
        isModalVisible: false,
        tempEvent: null,
        formValues: { title: "", start: null, end: null },
        isEmergency: false,
        selectedServices: [],
        totalPrice: 0,
      });

      message.success("Tạo lịch hẹn thành công!");
      console.log("Appointment created successfully!");
    } catch (err) {
      console.error("Error creating appointment:", err);
      message.error("Tạo lịch hẹn thất bại. Vui lòng thử lại!");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleEditAppointment = async () => {
    const { selectedEvent, formValues } = this.state;
    try {
      this.setState({ loading: true });
      const payload = {
        appointmentDate: dayjs(formValues.start).format("YYYY-MM-DD"),
        appointmentStartTime: dayjs(formValues.start).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        appointmentEndTime: dayjs(formValues.end).format("YYYY-MM-DD HH:mm:ss"),
        note: formValues.title,
        serviceIds: this.state.selectedServices.map((s) => s._id),
      };

      console.log("Edit payload:", payload);

      await axios.patch(
        `http://localhost:3000/appointments/patient/${selectedEvent.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      await this.fetchAppointmentsByRange(
        this.state.viewModel.startDate,
        this.state.viewModel.endDate
      );

      this.setState({
        editModalVisible: false,
        selectedEvent: null,
      });

      message.success("Cập nhật lịch hẹn thành công!");
    } catch (error) {
      console.error("❌ Error editing appointment:", error);
      message.error("Không thể cập nhật lịch hẹn!");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDeleteAppointment = async () => {
    const { selectedEvent } = this.state;
    if (!selectedEvent || !this.isOwnerOf(selectedEvent)) {
      message.warning("Bạn không có quyền xóa lịch hẹn của người khác.");
      return;
    }
    
    // Show confirmation modal
    this.setState({ showDeleteConfirm: true });
  };

  confirmDeleteAppointment = async () => {
    const { selectedEvent } = this.state;
    
    try {
      this.setState({ loading: true, showDeleteConfirm: false });
      await axios.delete(
        `http://localhost:3000/appointments/${selectedEvent.id}`
      );

      await this.fetchAppointmentsByRange(
        this.state.viewModel.startDate,
        this.state.viewModel.endDate
      );

      this.setState({
        editModalVisible: false,
        selectedEvent: null,
      });

      message.success("Đã xóa lịch hẹn thành công!");
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      message.error("Không thể xóa lịch hẹn!");
    } finally {
      this.setState({ loading: false });
    }
  };

  moveEvent = async (schedulerData, event, slotId, slotName, start, end) => {
    if (!this.isLoggedIn()) {
      this.setState({ showAuthModal: true });
      return;
    }
    if (!this.isOwnerOf(event)) {
      message.warning("Bạn không thể di chuyển lịch hẹn của người khác.");
      return;
    }
    this.setState({ loading: true });

    const startTime = dayjs(start)
      .tz("Asia/Ho_Chi_Minh")
      .second(0)
      .millisecond(0);
    const endTime = dayjs(end).tz("Asia/Ho_Chi_Minh").second(0).millisecond(0);

    const earliest = startTime.startOf("day").hour(16).minute(30);
    const latestStart = startTime.startOf("day").hour(19).minute(30);
    const latestEnd = startTime.startOf("day").hour(22).minute(30);

    if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
      message.warning("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      this.setState({ loading: false });
      return;
    }

    if (endTime.isAfter(latestEnd)) {
      message.warning("Giờ kết thúc không được quá 22:00!");
      this.setState({ loading: false });
      return;
    }

    try {
      const payload = {
        appointmentDate: startTime.format("YYYY-MM-DD"),
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        bedId: slotId,
      };

      await axios.patch(
        `http://localhost:3000/appointments/patient/${event.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
      this.setState({ viewModel: schedulerData });
    } catch (error) {
      console.error("❌ Move event error:", error);
      message.error("Không thể cập nhật lịch hẹn, vui lòng thử lại!");
    } finally {
      this.setState({ loading: false });
    }
  };

  updateEventStart = async (schedulerData, event, newStart) => {
    if (!this.isLoggedIn()) {
      this.setState({ showAuthModal: true });
      return;
    }
    if (!this.isOwnerOf(event)) {
      message.warning(
        "Bạn không thể chỉnh sửa thời gian của lịch hẹn của người khác."
      );
      return;
    }

    const startTime = dayjs(newStart)
      .tz("Asia/Ho_Chi_Minh")
      .second(0)
      .millisecond(0);
    const earliest = startTime.startOf("day").hour(16).minute(30);
    const latestStart = startTime.startOf("day").hour(19).minute(30);

    if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
      this.setState({ loading: true });
      message.warning("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      this.setState({ loading: false });
      return;
    }

    try {
      this.setState({ loading: true });
      const payload = {
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      await axios.patch(
        `http://localhost:3000/appointments/patient/${event.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
      this.setState({ viewModel: schedulerData });
    } catch (error) {
      console.error("❌ Update start error:", error);
      this.setState({ loading: true });
      message.error("Không thể cập nhật thời gian bắt đầu!");
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateEventEnd = async (schedulerData, event, newEnd) => {
    if (!this.isLoggedIn()) {
      this.setState({ showAuthModal: true });
      return;
    }
    if (!this.isOwnerOf(event)) {
      message.warning(
        "Bạn không thể chỉnh sửa thời gian của lịch hẹn của người khác."
      );
      return;
    }

    const endTime = dayjs(newEnd)
      .tz("Asia/Ho_Chi_Minh")
      .second(0)
      .millisecond(0);
    const latestEnd = endTime.startOf("day").hour(22).minute(0);

    if (endTime.isAfter(latestEnd)) {
      this.setState({ loading: true });
      message.warning("Giờ kết thúc không được quá 22:00!");
      this.setState({ loading: false });
      return;
    }

    try {
      this.setState({ loading: true });
      const payload = {
        appointmentDate: endTime.format("YYYY-MM-DD"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      await axios.patch(
        `http://localhost:3000/appointments/patient/${event.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
      this.setState({ viewModel: schedulerData });
    } catch (error) {
      console.error("❌ Update end error:", error);
      this.setState({ loading: true });
      message.error("Không thể cập nhật thời gian kết thúc!");
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  onScrollRight = async (schedulerData, schedulerContent, maxScrollLeft) => {
    // Prevent auto-advancing day on scroll to avoid flicker
    return;
  };

  onScrollLeft = async (schedulerData, schedulerContent) => {
    // Prevent auto-moving to previous day on scroll
    return;
  };

  onScrollTop = () => console.log("onScrollTop");

  onScrollBottom = () => console.log("onScrollBottom");

  toggleExpandFunc = async (schedulerData, slotId) => {
    if (!this.isLoggedIn()) {
      this.setState({ showAuthModal: true });
      return;
    }
    const patient =
      this.state.patientInfo || JSON.parse(localStorage.getItem("patientInfo"));
    const events = schedulerData.events || this.state.viewModel.events || [];
    const hasOwnedInSlot = events.some(
      (ev) =>
        String(ev.resourceId) === String(slotId) &&
        String(ev.ownerId) === String(patient._id)
    );
    if (!hasOwnedInSlot) {
      message.warning(
        "Bạn không có quyền mở/tắt phần này vì không có lịch hẹn thuộc về bạn ở mục này."
      );
      return;
    }

    this.setState({ loading: true });
    schedulerData.toggleExpandStatus(slotId);
    try {
      this.setState({ viewModel: schedulerData });
      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
    } finally {
      this.setState({ loading: false });
    }
  };
}

export default wrapperFun(Basic);
