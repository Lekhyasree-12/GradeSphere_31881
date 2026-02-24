import { useEffect, useState } from "react";
import "./StudentCalendar.css";

function StudentCalendar() {
  const [assignments, setAssignments] = useState([]);
  // We use 2026-02-24 to match your design screenshot
  const [currentDate, setCurrentDate] = useState(new Date("2026-02-24")); 

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    }
  }, []);

  // Helper to get day number from a date string (e.g., "2026-02-24" -> 24)
  const getDayFromDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).getDate();
  };

  // Calendar setup for Feb 2026
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);
  const todayDate = 24;

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
              <h2>February 2026</h2>
            </div>

            <div className="weekday-header">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="calendar-grid">
              {daysInMonth.map((day) => (
                <div key={day} className={`day-cell ${day === todayDate ? "today" : ""}`}>
                  <span className="day-number">{day}</span>
                  <div className="day-events">
                    {/* Only show assignments added by the teacher in the grid */}
                    {assignments
                      .filter(a => getDayFromDate(a.deadline) === day)
                      .map((a, idx) => (
                        <div key={idx} className="event-pill" style={{ backgroundColor: "#3b82f6" }}>
                          {a.title}
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="calendar-sidebar">
          <div className="side-card">
            <h3>Today's Deadlines</h3>
            {/* Show only real assignments due today */}
            {assignments.filter(a => getDayFromDate(a.deadline) === todayDate).length > 0 ? (
              assignments.filter(a => getDayFromDate(a.deadline) === todayDate).map((a, i) => (
                <div key={i} className="today-item">
                  <div className="item-icon" style={{ color: "#3b82f6" }}>📅</div>
                  <div className="item-info">
                    <strong>{a.title}</strong>
                    <span>Due Today</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events">No deadlines today</p>
            )}
          </div>

          <div className="side-card">
            <h3>Upcoming Deadlines</h3>
            <div className="upcoming-list">
              {assignments.length > 0 ? (
                assignments
                  .filter(a => getDayFromDate(a.deadline) > todayDate)
                  .map((a, i) => (
                    <div key={i} className="upcoming-row">
                      <div className="date-box">
                        <span>Feb</span>
                        <strong>{getDayFromDate(a.deadline)}</strong>
                      </div>
                      <div className="event-detail">
                        <strong>{a.title}</strong>
                        <span>{a.subject || "General"}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="no-events">No upcoming assignments</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default StudentCalendar;