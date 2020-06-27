import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

const Calendar = () => {
  const calendarComponentRef = React.useRef();

  const calendarWeekends = true;

  const calendarEvents = [
    // initial event data
    { title: 'Event Now', start: new Date() },
    { title: 'All day events', start: new Date(2020, 0, 1, 20, 30) },
    { title: 'Canada weekly exports', start: new Date(2020, 0, 6, 19, 11) },
    { title: 'USDA exports', start: new Date(2020, 0, 26, 5, 22) },
    { title: 'USDA weekly inspections', start: new Date(2020, 0, 6, 11, 10) },
    { title: 'USDA Weather Reports', start: new Date(2020, 0, 14), end: new Date(2020, 0, 16) },
  ];

  return (
    <Container className="calendar">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Calendar</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="calendar-container">
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,listWeek',
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            ref={calendarComponentRef}
            weekends={calendarWeekends}
            events={calendarEvents}
          // dateClick={this.handleDateClick}
            handleWindowResize
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Calendar;
