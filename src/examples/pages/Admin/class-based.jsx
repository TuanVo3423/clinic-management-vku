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
import { Spin, message } from "antd";
import { Scheduler, SchedulerData, ViewType, wrapperFun } from "../../../index";
import AuthPatientModal from "../../../components/AuthPatientmModal.jsx";
import CreateAppointmentModal from "./components/CreateAppointmentModal.jsx";
import EditAppointmentModal from "./components/EditAppointmentModal.jsx";
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
      }
    );

    // schedulerData.setSchedulerLocale(dayjsLocale);
    // schedulerData.setCalendarPopoverLocale(antdLocale);
    // schedulerData.setResources(DemoData.resources);
    // schedulerData.setEvents(DemoData.events);

    this.state = {
      viewModel: schedulerData,
      loading: true,
      isLoadingModal: false,
      isModalVisible: false,
      formValues: {
        title: "",
        start: null,
        end: null,
        status: "pending",
        isCheckout: false,
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
      // State cho ListView modal
      beds: [],
      existingPatients: [],
      patientMode: "existing",
      selectedPatientId: null,
      newPatientForm: {
        fullName: "",
        phone: "",
        gender: "male",
      },
    };
    this.form = React.createRef();
  }

  async componentDidMount() {
    const { viewModel } = this.state;
    await this.fetchAppointmentsByRange(viewModel.startDate, viewModel.endDate);
    await this.fetchBeds();
    await this.fetchExistingPatients();
  }

  fetchBeds = async () => {
    try {
      const bedsRes = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/beds`
      );
      this.setState({ beds: bedsRes.data.beds });
    } catch (error) {
      console.error("Không thể tải danh sách giường!", error);
    }
  };

  fetchExistingPatients = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/patients`
      );
      this.setState({ existingPatients: response.data.patients || [] });
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  fetchServices = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/services?minPrice=0&maxPrice=500000`
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

      const bedsRes = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/beds`
      );
      const beds = bedsRes.data.beds.map((bed) => ({
        id: bed._id,
        name: bed.bedName,
        department: bed.department,
      }));

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

      const url = `${
        process.env.REACT_APP_BASE_BE_URL
      }/appointments/by-time-range?startDate=${encodeURIComponent(
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

        const start = dayjs(
          a.appointmentStart || a.appointmentStartTime
        ).format("YYYY-MM-DDTHH:mm:ss");
        const end = dayjs(a.appointmentEnd || a.appointmentEndTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
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
        {/* Modal tạo lịch hẹn mới - từ ListView */}
        <CreateAppointmentModal
          visible={this.state.isModalVisible}
          loading={this.state.isLoadingModal}
          onCancel={() => {
            this.setState({
              isModalVisible: false,
              patientMode: "existing",
              selectedPatientId: null,
              newPatientForm: { fullName: "", phone: "", gender: "male" },
              selectedServices: [],
              totalPrice: 0,
            });
          }}
          onOk={this.handleCreateEvent}
          patientMode={this.state.patientMode}
          onPatientModeChange={(e) => {
            this.setState({
              patientMode: e.target.value,
              selectedPatientId: null,
              newPatientForm: {
                fullName: "",
                phone: "",
                gender: "male",
              },
            });
          }}
          existingPatients={this.state.existingPatients}
          selectedPatientId={this.state.selectedPatientId}
          onPatientSelect={(value) =>
            this.setState({ selectedPatientId: value })
          }
          newPatientForm={this.state.newPatientForm}
          onNewPatientChange={(newPatientForm) =>
            this.setState({ newPatientForm })
          }
          beds={this.state.beds}
          tempEvent={this.state.tempEvent}
          availableServices={this.state.availableServices}
          selectedServices={this.state.selectedServices}
          onServicesChange={(selectedIds) => {
            const selected = this.state.availableServices.filter((svc) =>
              selectedIds.includes(svc._id)
            );
            const totalPrice = selected.reduce(
              (sum, s) => sum + (s.price || 0),
              0
            );
            this.setState({
              selectedServices: selected,
              totalPrice,
            });
          }}
          totalPrice={this.state.totalPrice}
          formValues={this.state.formValues}
          onFormValuesChange={(formValues) => this.setState({ formValues })}
        />
        {/* Modal chỉnh sửa lịch hẹn - từ ListView */}
        <EditAppointmentModal
          visible={this.state.editModalVisible}
          loading={this.state.isLoadingModal}
          onCancel={() => {
            this.setState({
              editModalVisible: false,
              selectedServices: [],
              totalPrice: 0,
            });
          }}
          onOk={this.handleEditAppointment}
          selectedEvent={this.state.selectedEvent}
          beds={this.state.beds}
          availableServices={this.state.availableServices}
          selectedServices={this.state.selectedServices}
          onServicesChange={(selectedIds) => {
            const selected = this.state.availableServices.filter((svc) =>
              selectedIds.includes(svc._id)
            );
            const totalPrice = selected.reduce(
              (sum, s) => sum + (s.price || 0),
              0
            );
            this.setState({
              selectedServices: selected,
              totalPrice,
            });
          }}
          totalPrice={this.state.totalPrice}
          formValues={this.state.formValues}
          onFormValuesChange={(formValues) => this.setState({ formValues })}
        />
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
    // if (!event.title.includes("pending")) {
    //   message.warning("Chỉ có thể chỉnh sửa lịch hẹn ở trạng thái pending!");
    //   return;
    // }

    this.setState({ isLoadingModal: true, editModalVisible: true });
    await this.fetchServices();

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${event.id}`
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

      // Thêm thông tin bệnh nhân vào selectedEvent
      const eventWithPatientInfo = {
        ...event,
        patientName: appt.patient?.[0]?.fullName || "Không rõ",
        phone: appt.patient?.[0]?.phone || "",
      };
      console.log("appt.status", appt.status);
      this.setState({
        isLoadingModal: false,
        selectedEvent: eventWithPatientInfo,
        formValues: {
          title: appt.note || event.title.split(" - ")[0],
          start: dayjs(appt.appointmentStartTime),
          end: dayjs(appt.appointmentEndTime),
          status: appt.status,
          isCheckout: appt.isCheckout || false,
        },
        selectedServices,
        totalPrice,
      });
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết lịch hẹn:", err);
      message.error("Không thể tải chi tiết lịch hẹn!");
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
    this.fetchServices();
    this.setState({
      isModalVisible: true,
      tempEvent: { schedulerData, slotId, slotName, start, end },
      formValues: {
        title: "",
        start,
        end,
        status: "pending",
        isCheckout: false,
      },
      patientMode: "existing",
      selectedPatientId: null,
      newPatientForm: { fullName: "", phone: "", gender: "male" },
      selectedServices: [],
      totalPrice: 0,
    });
  };

  handleCreateEvent = async () => {
    const {
      tempEvent,
      formValues,
      patientMode,
      selectedPatientId,
      newPatientForm,
      selectedServices,
    } = this.state;
    const { schedulerData, slotId, start, end } = tempEvent;

    try {
      let patientId = null;

      // Xử lý bệnh nhân
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
            `${process.env.REACT_APP_BASE_BE_URL}/patients`,
            {
              fullName: newPatientForm.fullName.trim(),
              phone: newPatientForm.phone.trim(),
              gender: newPatientForm.gender,
            }
          );
          patientId = createPatientResponse.data.patient_id;
          console.log("✅ New patient created:", patientId);

          // Refresh patient list
          await this.fetchExistingPatients();
        } catch (err) {
          console.error("Error creating patient:", err);
          message.error(
            "Không thể tạo bệnh nhân mới. " +
              (err.response?.data?.message || "Vui lòng thử lại!")
          );
          return;
        }
      }

      // Validate services
      if (!selectedServices || selectedServices.length === 0) {
        message.error("Vui lòng chọn ít nhất một dịch vụ!");
        return;
      }

      const startTime = dayjs(formValues.start || start);
      const endTime = dayjs(formValues.end || end);

      const earliest = startTime.startOf("day").hour(16).minute(30);
      const latestStart = startTime.startOf("day").hour(19).minute(30);
      const latestEnd = startTime.startOf("day").hour(22).minute(0);

      if (startTime.isBefore(earliest) || startTime.isAfter(latestStart)) {
        message.error("Giờ bắt đầu phải nằm trong khoảng 16:30 - 19:30!");
        return;
      }

      if (endTime.isAfter(latestEnd)) {
        message.error("Giờ kết thúc không được quá 22:00!");
        return;
      }

      const payload = {
        bedId: slotId,
        patientId: patientId,
        serviceIds: selectedServices.map((s) => s._id),
        appointmentDate: startTime.format("YYYY-MM-DD"),
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        status: formValues.status || "pending",
        note: formValues.title || "",
        isCheckout: false,
        createdBy: "doctor",
      };

      await axios.post(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments`,
        payload
      );

      await this.fetchAppointmentsByRange(
        schedulerData.startDate,
        schedulerData.endDate
      );

      this.setState({
        isModalVisible: false,
        tempEvent: null,
        formValues: { title: "", start: null, end: null, status: "pending" },
        patientMode: "existing",
        selectedPatientId: null,
        newPatientForm: { fullName: "", phone: "", gender: "male" },
        selectedServices: [],
        totalPrice: 0,
      });

      message.success("Đã tạo lịch khám mới!");
    } catch (err) {
      console.error("Error creating appointment:", err);
      message.error("Có lỗi xảy ra!");
    }
  };

  handleEditAppointment = async () => {
    const { selectedEvent, formValues, selectedServices } = this.state;

    // Validate services
    if (!selectedServices || selectedServices.length === 0) {
      message.error("Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      const payload = {
        appointmentDate: dayjs(formValues.start).format("YYYY-MM-DD"),
        appointmentStartTime: dayjs(formValues.start).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        appointmentEndTime: dayjs(formValues.end).format("YYYY-MM-DD HH:mm:ss"),
        note: formValues.title,
        serviceIds: selectedServices.map((s) => s._id),
        status: formValues.status,
        isCheckout: formValues.isCheckout || false,
      };

      console.log("Edit payload:", payload);

      await axios.patch(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${selectedEvent.id}`,
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
        selectedServices: [],
        totalPrice: 0,
      });

      message.success("Đã cập nhật lịch khám!");
    } catch (error) {
      console.error("❌ Error editing appointment:", error);
      message.error("Có lỗi xảy ra!");
    }
  };

  handleDeleteAppointment = async () => {
    const { selectedEvent } = this.state;
    if (!window.confirm("Bạn có chắc muốn xóa lịch hẹn này không?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${selectedEvent.id}`
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
        appointmentDate: startTime.format("YYYY-MM-DD"),
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        bedId: slotId,
      };

      await axios.patch(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${event.id}`,
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
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${event.id}`,
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
        appointmentDate: endTime.format("YYYY-MM-DD"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      await axios.patch(
        `${process.env.REACT_APP_BASE_BE_URL}/appointments/${event.id}`,
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
