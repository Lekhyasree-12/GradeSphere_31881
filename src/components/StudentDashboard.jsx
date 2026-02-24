import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentAssignments from "./StudentAssignments";
import StudentGrades from "./StudentGrades";
import StudentCalendar from "./StudentCalendar";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const studentEmail = localStorage.getItem("loggedInUser");
// Get all grades for this student
const studentGrades = assignments
  .flatMap(a => a.submissions || [])
  .filter(s => s.student === studentEmail && s.grade)
  .map(s => Number(s.grade));

// Calculate average
const average =
  studentGrades.length > 0
    ? Math.round(
        studentGrades.reduce((a, b) => a + b, 0) /
          studentGrades.length
      )
    : 0;
  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) setAssignments(JSON.parse(saved));
  }, []);

  const submitted = assignments.filter((a) => a.submissions?.some((s) => s.student === studentEmail));
  const pending = assignments.filter((a) => !a.submissions?.some((s) => s.student === studentEmail));
  
  // Example logic for overdue (simplified)
  const overdue = pending.filter(a => new Date(a.dueDate) < new Date());

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">🎓</div>
          <div>
            <h3>Student</h3>
            <p>Portal</p>
          </div>
        </div>
        <nav>
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <span className="icon">⊞</span> Dashboard
          </li>
          <li className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
            <span className="icon">📄</span> Assignments
          </li>
          <li className={activeTab === "grades" ? "active" : ""} onClick={() => setActiveTab("grades")}>
            <span className="icon">🏅</span> Grades
          </li>
          <li className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>
            <span className="icon">📅</span> Calendar
          </li>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* Main Container */}
      <main className="main-view">
        {activeTab === "dashboard" ? (
          <div className="dashboard-grid">
            <div className="center-col">
              <header className="welcome-header">
                <h1>Welcome Back 👋</h1>
                <p>Here's what's happening with your studies today</p>
              </header>

              {/* Top Stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon blue">📖</div>
                  <h3>{assignments.length}</h3>
                  <p>Total Assignments</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">✓</div>
                  <h3>{submitted.length}</h3>
                  <p>Submitted</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange">🕒</div>
                  <h3>{pending.length}</h3>
                  <p>Pending</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon red">!</div>
                  <h3>{overdue.length}</h3>
                  <p>Overdue</p>
                </div>
              </div>

              {/* Recent Assignments List */}
              <section className="assignment-list-section">
                <h2>Recent Assignments</h2>
                <div className="assignment-cards-container">
                  {assignments.map((a) => (
                    <div key={a.id} className="assignment-item-card">
                      <div className="item-header">
                        <div>
                          <h4>{a.title}</h4>
                          <span className="subject-tag">{a.subject || "General"}</span>
                        </div>
                        <span className={`status-pill ${a.status?.toLowerCase() || 'pending'}`}>
                          {a.status || "Pending"}
                        </span>
                      </div>
                      <p className="due-date">Due: {a.dueDate}</p>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${a.progress || 0}%`, backgroundColor: getStatusColor(a.status) }}></div>
                        </div>
                        <span className="progress-text">{a.progress || 0}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Side Column */}
            <aside className="right-col">
              <div className="performance-card">
                <div className="perf-header">
                  <span>📈 Performance</span>
                </div>
                <h2>{average}%</h2>
                <p>Average Grade</p>
                
              </div>

              <div className="schedule-card">
  <h3>Today's Schedule</h3>

  {assignments.length === 0 ? (
    <p className="empty-msg">No classes scheduled today</p>
  ) : (
    assignments
      .filter(a => a.dueDate) // only if dueDate exists
      .slice(0, 3) // show max 3
      .map(a => (
        <div key={a.id} className="schedule-item">
          <span className="time">
            {new Date(a.dueDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
          <div className="class-info">
            <strong>{a.subject || "General"}</strong>
            <p>{a.title}</p>
          </div>
        </div>
      ))
  )}
</div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <button className="btn-primary">Submit Assignment</button>
                <button className="btn-secondary">View Grades</button>
              </div>
            </aside>
          </div>
        ) : (
          <div className="tab-content">
            {activeTab === "assignments" && <StudentAssignments />}
            {activeTab === "grades" && <StudentGrades />}
            {activeTab === "calendar" && <StudentCalendar />}
          </div>
        )}
      </main>
    </div>
  );
}

const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
        case 'submitted': return '#22c55e';
        case 'overdue': return '#ef4444';
        default: return '#3b82f6';
    }
}

export default StudentDashboard;