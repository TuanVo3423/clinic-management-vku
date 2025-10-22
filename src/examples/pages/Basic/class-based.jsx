/* eslint-disable */
import React, { Component } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { Scheduler, SchedulerData, ViewType, wrapperFun } from "../../../index";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
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

      let startDate, endDate;
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

      const apptRes = await axios.get(
        "http://localhost:3000/appointments/by-time-range",
        {
          params: { startDate, endDate },
          paramsSerializer: (params) =>
            `startDate=${encodeURIComponent(
              params.startDate
            )}&endDate=${encodeURIComponent(params.endDate)}`,
        }
      );

      const appointments = apptRes.data.appointments
        .filter((a) => {
          const startA = dayjs(a.appointmentStartTime || a.appointmentDate);
          const endA = dayjs(a.appointmentEndTime || a.appointmentDate);
          const startB = dayjs(startDate);
          const endB = dayjs(endDate);
          return startA.isBefore(endB) && endA.isAfter(startB);
        })

        .map((a) => {
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

          return {
            id: a._id,
            start: a.appointmentStartTime || a.appointmentDate,
            end: a.appointmentEndTime || a.appointmentDate,
            resourceId: a.bedId,
            title: `${a.patient?.[0]?.fullName || "Bệnh nhân không rõ"} - ${
              a.status
            }`,
            bgColor,
          };
        });

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
          viewEventClick={this.ops1}
          viewEventText="Ops 1"
          viewEvent2Text="Ops 2"
          viewEvent2Click={this.ops2}
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
    alert(
      `You just clicked an event: {id: ${event.id}, title: ${event.title}}`
    );
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

  updateEventStart = (schedulerData, event, newStart) => {
    if (
      confirm(
        `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`
      )
    ) {
      schedulerData.updateEventStart(event, newStart);
    }
    this.setState({ viewModel: schedulerData });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    if (
      confirm(
        `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`
      )
    ) {
      schedulerData.updateEventEnd(event, newEnd);
    }
    this.setState({ viewModel: schedulerData });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    if (
      confirm(
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
      )
    ) {
      schedulerData.moveEvent(event, slotId, slotName, start, end);
      this.setState({ viewModel: schedulerData });
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
