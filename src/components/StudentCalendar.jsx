import { useEffect, useState } from "react";
import "./StudentCalendar.css";

function StudentCalendar() {
  const [assignments, setAssignments] = useState([]);

  // Start from Jan 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  useEffect(() => {
    const storedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    const allAssignments = storedSubjects.flatMap((subject) =>
      (subject.assignments || []).map((assignment) => ({
        ...assignment,
        subject: subject.name
      }))
    );

    setAssignments(allAssignments);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year &&
    today.getMonth() === month;

  const getAssignmentsForDay = (day) => {
    return assignments.filter((a) => {
      const date = new Date(a.deadline || a.dueDate);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  const goToPreviousMonth = () => {
    if (month > 0) {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const goToNextMonth = () => {
    if (month < 11) {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayAssignments = getAssignmentsForDay(day);

    calendarDays.push(
      <div
        key={day}
        className={`day-cell ${
          isCurrentMonth && today.getDate() === day ? "today" : ""
        }`}
      >
        <span className="day-number">{day}</span>

        <div className="day-events">
          {dayAssignments.map((a) => (
            <div
              key={a.id}
              className="event-pill"
              style={{ backgroundColor: "#3b82f6" }}
            >
              {a.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <header className="page-header">
        <h1>Calendar</h1>
        <p>View your schedule and upcoming events</p>
      </header>

      <div className="calendar-layout">
        <section className="calendar-main">
          <div className="calendar-card">
            <div className="calendar-nav">
              <button onClick={goToPreviousMonth}>◀</button>
              <h2>
                {monthName} {year}
              </h2>
              <button onClick={goToNextMonth}>▶</button>
            </div>

            <div className="weekday-header">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentCalendar;