/* eslint-disable */
import React, { Component } from "react";
import { Scheduler, SchedulerData, ViewType, wrapperFun } from "../../../index";
import dayjs from "dayjs";
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
        weekMaxEvents: 9669,
        monthMaxEvents: 9669,
        viewChangeEnabled: false,
        quarterMaxEvents: 6599,
        yearMaxEvents: 9956,
        customMaxEvents: 9965,
        eventItemPopoverTrigger: "click",
      }
    );

    // schedulerData.setSchedulerLocale(dayjsLocale);
    // schedulerData.setCalendarPopoverLocale(antdLocale);
    // schedulerData.setResources(DemoData.resources);
    // schedulerData.setEvents(DemoData.events);

    this.state = {
      viewModel: schedulerData,
      loading: true,
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
        .filter((a) =>
          dayjs(a.appointmentEndTime || a.appointmentDate).isAfter(startDate)
        )
        .map((a) => ({
          id: a._id,
          start: a.appointmentStartTime || a.appointmentDate,
          end: a.appointmentEndTime || a.appointmentDate,
          resourceId: a.bedId,
          title: `${a.patient?.[0]?.fullName || "Bệnh nhân không rõ"} - ${
            a.status
          }`,
          bgColor: a.status === "pending" ? "#faad14" : "#52c41a",
        }));

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

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if (
      confirm(
        `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
      )
    ) {
      let newFreshId = 0;
      schedulerData.events.forEach((item) => {
        if (item.id >= newFreshId) newFreshId = item.id + 1;
      });

      let newEvent = {
        id: newFreshId,
        title: "New event you just created",
        start: start,
        end: end,
        resourceId: slotId,
        bgColor: "purple",
      };
      schedulerData.addEvent(newEvent);
      this.setState({ viewModel: schedulerData });
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
    if (schedulerData.ViewTypes === ViewType.Day) {
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
    if (schedulerData.ViewTypes === ViewType.Day) {
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
