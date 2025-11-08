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
import { Modal, Form, Input, DatePicker, Spin } from "antd";
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
        besidesWidth: 300,
        schedulerContentHeight: "100%",
        resourceName: "Bed No.",
        dayMaxEvents: 99,
        viewChangeEnabled: false,
        eventItemPopoverTrigger: "none",
        dayStartFrom: 16,
        dayStopTo: 22,
        minuteStep: 30,
        nonAgendaDayCellHeaderFormat: "HH:mm",
        dayCellWidth: 70,
        schedulerContentWidth: "100%",
        nonWorkingTimeHeadStyle: { backgroundColor: "#fff" },
        nonWorkingTimeBodyBgColor: "#fff",
      }
    );

    // schedulerData.setSchedulerLocale(dayjsLocale);
    // schedulerData.setCalendarPopoverLocale(antdLocale);
    // schedulerData.setResources(DemoData.resources);
    // schedulerData.setEvents(DemoData.events);

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
      patientInfo: JSON.parse(localStorage.getItem("patientInfo")) || null,
      isEmergency: false,
      availableServices: [],
      selectedServices: [],
      totalPrice: 0,
    };
  }

  async componentDidMount() {
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

      let startDate = dayjs(start).startOf("day").format("YYYY-MM-DD HH:mm:ss");
      let endDate = dayjs(start).endOf("day").format("YYYY-MM-DD HH:mm:ss");
      if (viewModel.viewType === ViewType.Day) {
        startDate = dayjs(start).startOf("day").format("YYYY-MM-DD HH:mm:ss");
        endDate = dayjs(start).endOf("day").format("YYYY-MM-DD HH:mm:ss");
      } else if (viewModel.viewType === ViewType.Week) {
        startDate = dayjs(start).startOf("week").format("YYYY-MM-DD HH:mm:ss");
        endDate = dayjs(end).endOf("week").format("YYYY-MM-DD HH:mm:ss");
      } else {
        startDate = dayjs(start).format("YYYY-MM-DD HH:mm:ss");
        endDate = dayjs(end).format("YYYY-MM-DD HH:mm:ss");
      }

      const url = `http://localhost:3000/appointments/by-time-range?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
      console.log("URL:", url);
      const apptRes = await axios.get(url);

      const appointments = apptRes.data.appointments.map((a) => {
        let bgColor;
        switch (a.status) {
          case "pending":
            bgColor = "#faad14";
            break;
          case "confirmed":
            bgColor = "#52c41a";
            break;
          case "cancelled":
            bgColor = "#ff4d4f";
            break;
          default:
            bgColor = "#d9d9d9";
        }

        const start = dayjs(a.appointmentStartTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        const end = dayjs(a.appointmentEndTime).format("YYYY-MM-DDTHH:mm:ss");
        console.log("start:", start, "| raw:", a.appointmentStartTime);

        return {
          id: a._id,
          start,
          end,
          resourceId: a.bedId,
          title: `${a.patient?.[0]?.fullName || "Bệnh nhân không rõ"} - ${
            a.status
          }`,
          bgColor,
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
    if (loading) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.8)",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
          title="Tạo lịch hẹn mới"
          open={this.state.isModalVisible}
          onCancel={() => this.setState({ isModalVisible: false })}
          onOk={this.handleCreateEvent}
          okText="Lưu"
          cancelText="Hủy"
          style={{ top: 20 }}
        >
          <Form layout="vertical">
            <Form.Item label="Tên bệnh nhân">
              <Input value={this.state.patientInfo?.fullName || ""} disabled />
            </Form.Item>

            <Form.Item label="Số điện thoại">
              <Input value={this.state.patientInfo?.phone || ""} disabled />
            </Form.Item>

            <Form.Item label="Ghi chú">
              <Input
                value={this.state.formValues.title}
                onChange={(e) =>
                  this.setState({
                    formValues: {
                      ...this.state.formValues,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Nhập ghi chú (nếu có)"
              />
            </Form.Item>

            <Form.Item>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={this.state.isEmergency}
                  onChange={(e) =>
                    this.setState({ isEmergency: e.target.checked })
                  }
                />
                <span>Lịch khẩn cấp</span>
              </label>
            </Form.Item>

            <Form.Item label="Dịch vụ khám">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                        backgroundColor: isSelected ? "#52c41a" : "#f0f0f0",
                        color: isSelected ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      {svc.name} ({svc.price.toLocaleString()}đ)
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {this.state.selectedServices.map((svc) => (
                  <span
                    key={svc._id}
                    style={{
                      background: "#1890ff",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {svc.name}
                    <span
                      style={{
                        background: "white",
                        color: "#1890ff",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        this.setState((prev) => ({
                          selectedServices: prev.selectedServices.filter(
                            (s) => s._id !== svc._id
                          ),
                          totalPrice: prev.totalPrice - svc.price,
                        }));
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </Form.Item>

            <Form.Item label="Tổng giá dịch vụ">
              <Input
                value={`${this.state.totalPrice.toLocaleString()} đ`}
                disabled
                style={{ fontWeight: "bold", color: "#d4380d" }}
              />
            </Form.Item>

            <Form.Item label="Thời gian bắt đầu">
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
              />
            </Form.Item>

            <Form.Item label="Thời gian kết thúc">
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
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chỉnh sửa lịch hẹn"
          open={this.state.editModalVisible}
          onCancel={() => this.setState({ editModalVisible: false })}
          onOk={this.handleEditAppointment}
          okText="Lưu"
          cancelText="Hủy"
          style={{ top: 20 }}
        >
          <Form layout="vertical">
            <Form.Item label="Ghi chú / tiêu đề">
              <Input
                value={this.state.formValues.title}
                onChange={(e) =>
                  this.setState({
                    formValues: {
                      ...this.state.formValues,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Dịch vụ khám">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                        backgroundColor: isSelected ? "#52c41a" : "#f0f0f0",
                        color: isSelected ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      {svc.name} ({svc.price.toLocaleString()}đ)
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {this.state.selectedServices.map((svc) => (
                  <span
                    key={svc._id}
                    style={{
                      background: "#1890ff",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {svc.name}
                    <span
                      style={{
                        background: "white",
                        color: "#1890ff",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        this.setState((prev) => ({
                          selectedServices: prev.selectedServices.filter(
                            (s) => s._id !== svc._id
                          ),
                          totalPrice: prev.totalPrice - svc.price,
                        }));
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </Form.Item>
            <Form.Item label="Tổng giá dịch vụ">
              <Input
                value={`${this.state.totalPrice.toLocaleString()} đ`}
                disabled
                style={{ fontWeight: "bold", color: "#d4380d" }}
              />
            </Form.Item>
            <Form.Item label="Thời gian bắt đầu">
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
              />
            </Form.Item>
            <Form.Item label="Thời gian kết thúc">
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
              />
            </Form.Item>
          </Form>
        </Modal>
        <AuthPatientModal
          visible={this.state.showAuthModal}
          onSuccess={(patientInfo) => {
            localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
            this.setState({ showAuthModal: false });
          }}
          onClose={() => this.setState({ showAuthModal: false })}
        />
      </div>
    );
  }
  handleLogout = () => {
    localStorage.removeItem("patientInfo");
    alert("Bạn đã đăng xuất thành công!");
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
    if (!event.title.includes("pending")) {
      alert("Chỉ có thể chỉnh sửa lịch hẹn ở trạng thái pending!");
      return;
    }

    this.setState({ loading: true });
    this.fetchServices();

    try {
      const res = await axios.get(
        `http://localhost:3000/appointments/${event.id}`
      );
      const appt = res.data.appointment || res.data;

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
      console.error("❌ Lỗi khi lấy chi tiết lịch hẹn:", err);
      alert("Không thể tải chi tiết lịch hẹn!");
    } finally {
      this.setState({ loading: false });
    }
  };

  ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end) => {
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
      alert("Vui lòng nhập tên lịch hẹn");
      return;
    }

    const startTime = dayjs(formValues.start || start);
    const endTime = dayjs(formValues.end || end);

    const earliest = startTime.startOf("day").hour(16).minute(30);
    const latestStart = startTime.startOf("day").hour(19).minute(30);
    const latestEnd = startTime.startOf("day").hour(22).minute(0);

    if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
      alert("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      return;
    }

    if (endTime.isAfter(latestEnd)) {
      alert("Giờ kết thúc không được quá 22:00!");
      return;
    }

    try {
      const payload = {
        bedId: slotId,
        patientId: patientInfo._id,
        doctorId: "655f8c123456789012345679",
        serviceIds: this.state.selectedServices.map((s) => s._id),
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        note: `${title} | Dịch vụ: ${this.state.selectedServices
          .map((s) => s.name)
          .join(", ")}`,
        isEmergency: this.state.isEmergency,
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
      });

      console.log("Appointment created successfully!");
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Tạo lịch hẹn thất bại. Vui lòng thử lại!");
    }
  };

  handleEditAppointment = async () => {
    const { selectedEvent, formValues } = this.state;
    try {
      const payload = {
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

      alert("Cập nhật lịch hẹn thành công!");
    } catch (error) {
      console.error("❌ Error editing appointment:", error);
      alert("Không thể cập nhật lịch hẹn!");
    }
  };

  handleDeleteAppointment = async () => {
    const { selectedEvent } = this.state;
    if (!window.confirm("Bạn có chắc muốn xóa lịch hẹn này không?")) return;

    try {
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

      alert("Đã xóa lịch hẹn thành công!");
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      alert("Không thể xóa lịch hẹn!");
    }
  };

  moveEvent = async (schedulerData, event, slotId, slotName, start, end) => {
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
      alert("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      this.setState({ loading: false });
      return;
    }

    if (endTime.isAfter(latestEnd)) {
      alert("Giờ kết thúc không được quá 22:00!");
      this.setState({ loading: false });
      return;
    }

    try {
      const payload = {
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
      alert("Không thể cập nhật lịch hẹn, vui lòng thử lại!");
    } finally {
      this.setState({ loading: false });
    }
  };

  updateEventStart = async (schedulerData, event, newStart) => {
    const startTime = dayjs(newStart)
      .tz("Asia/Ho_Chi_Minh")
      .second(0)
      .millisecond(0);
    const earliest = startTime.startOf("day").hour(16).minute(30);
    const latestStart = startTime.startOf("day").hour(19).minute(30);

    if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
      this.setState({ loading: true });
      alert("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
      this.setState({ loading: false });
      return;
    }

    try {
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
      alert("Không thể cập nhật thời gian bắt đầu!");
      this.setState({ loading: false });
    }
  };

  updateEventEnd = async (schedulerData, event, newEnd) => {
    const endTime = dayjs(newEnd)
      .tz("Asia/Ho_Chi_Minh")
      .second(0)
      .millisecond(0);
    const latestEnd = endTime.startOf("day").hour(22).minute(0);

    if (endTime.isAfter(latestEnd)) {
      this.setState({ loading: true });
      alert("Giờ kết thúc không được quá 22:00!");
      this.setState({ loading: false });
      return;
    }

    try {
      const payload = {
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
      alert("Không thể cập nhật thời gian kết thúc!");
      this.setState({ loading: false });
    }
  };

  onScrollRight = async (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.viewType === ViewType.Day) {
      schedulerData.next();
      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
      this.setState({ viewModel: schedulerData });
      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  };

  onScrollLeft = async (schedulerData, schedulerContent) => {
    if (schedulerData.viewType === ViewType.Day) {
      schedulerData.prev();
      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );
      this.setState({ viewModel: schedulerData });
      schedulerContent.scrollLeft = 10;
    }
  };

  onScrollTop = () => console.log("onScrollTop");

  onScrollBottom = () => console.log("onScrollBottom");

  toggleExpandFunc = async (schedulerData, slotId) => {
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
