/* eslint-disable */
import React, { Component } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { Scheduler, SchedulerData, ViewType, wrapperFun } from "../../../index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

import axios from "axios";

class Basic extends Component {
  constructor(props) {
    super(props);

    const schedulerData = new SchedulerData(
      dayjs().format("YYYY-MM-DD"),
      ViewType.Day,
      false,
      false,
      {
        besidesWidth: 300,
        schedulerContentHeight: "100%",
        resourceName: "Bed No.",
        dayMaxEvents: 99,
        viewChangeEnabled: false,
        eventItemPopoverTrigger: "click",
        dayStartFrom: 16,
        dayStopTo: 22,
        minuteStep: 30,
        nonAgendaDayCellHeaderFormat: "HH:mm",
        dayCellWidth: 70,
        schedulerContentWidth: "100%",
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
    };
  }

  async componentDidMount() {
    const { viewModel } = this.state;
    await this.fetchAppointmentsByRange(viewModel.startDate, viewModel.endDate);
  }

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
  };

  render() {
    const { viewModel, loading } = this.state;
    if (loading) return <p>Đang tải danh sách...</p>;

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
        >
          <Form layout="vertical">
            <Form.Item label="Tên lịch hẹn">
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
                placeholder="Nhập tên bệnh nhân hoặc ghi chú"
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
          footer={[
            <button
              key="delete"
              onClick={this.handleDeleteAppointment}
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            >
              Xóa
            </button>,
            <button
              key="save"
              onClick={this.handleEditAppointment}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              Lưu
            </button>,
          ]}
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
      </div>
    );
  }

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
    schedulerData.setDate(date);
    await this.fetchAppointmentsByRange(
      schedulerData.startDate,
      schedulerData.endDate
    );
    this.setState({ viewModel: schedulerData });
  };

  eventClicked = (schedulerData, event) => {
    if (event.title.includes("pending")) {
      this.setState({
        editModalVisible: true,
        selectedEvent: event,
        formValues: {
          title: event.title.split(" - ")[0],
          start: dayjs(event.start),
          end: dayjs(event.end),
        },
      });
    } else {
      alert("Chỉ có thể chỉnh sửa lịch hẹn ở trạng thái pending!");
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
    this.setState({
      isModalVisible: true,
      tempEvent: { schedulerData, slotId, slotName, start, end },
      formValues: { title: "", start, end },
    });
  };

  handleCreateEvent = async () => {
    const { tempEvent, formValues } = this.state;
    const { schedulerData, slotId, start, end } = tempEvent;
    const title = formValues.title.trim();

    if (!title) {
      alert("Vui lòng nhập tên lịch hẹn");
      return;
    }

    const startTime = dayjs(formValues.start || start);
    const endTime = dayjs(formValues.end || end);

    const earliest = startTime.startOf("day").add(16, "hour").add(30, "minute");
    const latest = startTime.startOf("day").add(19, "hour").add(30, "minute");

    if (startTime.isBefore(earliest) || endTime.isAfter(latest)) {
      alert("Giờ hẹn phải nằm trong khoảng 16:30 - 19:30!");
      return;
    }

    try {
      const payload = {
        bedId: slotId,
        patientId: "68eb572c67c485c17868fe9b",
        doctorId: "655f8c123456789012345679",
        serviceId: "655f8c12345678901234567a",
        appointmentStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
        note: title,
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
    try {
      const payload = {
        appointmentStartTime: dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
        appointmentEndTime: dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
        bedId: slotId,
      };

      console.log("Move payload:", payload);

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
    }
  };

  updateEventStart = async (schedulerData, event, newStart) => {
    try {
      const payload = {
        appointmentStartTime: dayjs(newStart).format("YYYY-MM-DD HH:mm:ss"),
      };

      console.log("Resize start payload:", payload);

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
      alert("Không thể cập nhật thời gian bắt đầu!");
    }
  };

  updateEventEnd = async (schedulerData, event, newEnd) => {
    try {
      const payload = {
        appointmentEndTime: dayjs(newEnd).format("YYYY-MM-DD HH:mm:ss"),
      };

      console.log("Resize end payload:", payload);

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
      alert("Không thể cập nhật thời gian kết thúc!");
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

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({ viewModel: schedulerData });
  };
}

export default wrapperFun(Basic);
