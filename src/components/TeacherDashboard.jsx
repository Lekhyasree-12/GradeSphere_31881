import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import TeacherCreate from "./TeacherCreate";
import TeacherSubmissions from "./TeacherSubmissions";
import TeacherGrades from "./TeacherGrades";

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="teacher-container">
      {/* Sidebar */}
      <div className="teacher-sidebar">
        <h2>GradeSphere</h2>
        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "create" ? "active" : ""}
            onClick={() => setActiveTab("create")}
          >
            Create Assignment
          </li>
          <li
            className={activeTab === "submissions" ? "active" : ""}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </li>
          <li
            className={activeTab === "grades" ? "active" : ""}
            onClick={() => setActiveTab("grades")}
          >
            Grades
          </li>
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="teacher-main">
        {activeTab === "dashboard" && (
          <>
            {/* Header */}
            <div className="dashboard-header">
              <h1>Welcome back 👋</h1>
              <p>Here's what's happening in your classes today</p>
            </div>

            {/* Stats Row */}
            <div className="teacher-stats">
              <div className="stat-card">
                <div className="stat-icon blue">📄</div>
                <div>
                  <h3>{assignments.length}</h3>
                  <p>Total Assignments</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✔️</div>
                <div>
                  <h3>
                    {assignments.reduce(
                      (t, a) => t + a.submissions.length,
                      0
                    )}
                  </h3>
                  <p>Total Submissions</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">🕒</div>
                <div>
                  <h3>15</h3>
                  <p>Pending Review</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">👥</div>
                <div>
                  <h3>45</h3>
                  <p>Total Students</p>
                </div>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="dashboard-grid">
              {/* LEFT COLUMN */}
              <div className="main-column">
                {/* Active Assignments */}
                <section className="assignments-section">
                  <h2>Active Assignments</h2>

                  {assignments.length === 0 ? (
                    <div className="assignment-detail-card">
                      <p>No assignments created yet.</p>
                    </div>
                  ) : (
                    assignments.map((a) => (
                      <div
                        key={a.id}
                        className="assignment-detail-card"
                      >
                        <div className="card-top">
                          <div>
                            <h3>{a.title}</h3>
                            <p className="category">
                              Mathematics
                            </p>
                          </div>
                          <span className="due-date">
                            Due: {a.deadline}
                          </span>
                        </div>

                        <div className="progress-wrapper">
                          <div className="progress-info">
                            <span>
                              {a.submissions.length}/45 submissions
                            </span>
                            <span>
                              {Math.round(
                                (a.submissions.length / 45) * 100
                              )}
                              %
                            </span>
                          </div>

                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${
                                  (a.submissions.length / 45) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </section>

                {/* Class Performance */}
                <section className="class-performance">
                  <h2>Class Performance</h2>

                  <div className="performance-card">
                    {[
                      "Mathematics",
                      "English",
                      "Physics",
                      "Chemistry",
                    ].map((subject, idx) => (
                      <div key={idx} className="perf-row">
                        <div className="perf-label">
                          <span className="dot"></span>
                          {subject}
                        </div>

                        <div className="perf-bar-container">
                          <div
                            className="perf-bar"
                            style={{ width: "85%" }}
                          ></div>
                          <span className="perf-pct">
                            87%{" "}
                            <small>(45 students)</small>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="side-column">
                {/* Recent Submissions */}
                <div className="recent-submissions-card">
                  <h3>Recent Submissions</h3>
                  <p>No recent activity</p>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-card">
                  <h3>Quick Actions</h3>
                  <button
                    onClick={() => setActiveTab("create")}
                  >
                    Create Assignment
                  </button>
                  <button
                    className="secondary"
                    onClick={() =>
                      setActiveTab("submissions")
                    }
                  >
                    Review Submissions
                  </button>
                  <button
                    className="secondary"
                    onClick={() =>
                      setActiveTab("grades")
                    }
                  >
                    View All Grades
                  </button>
                </div>

                {/* Alerts */}
                <div className="alerts-card">
                  <h3>⚠️ Alerts</h3>
                  <div className="alert-item warning">
                    <strong>
                      15 submissions need grading
                    </strong>
                    <p>Review before weekend</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "create" && <TeacherCreate />}
        {activeTab === "submissions" && <TeacherSubmissions />}
        {activeTab === "grades" && <TeacherGrades />}
      </div>
    </div>
  );
}

export default TeacherDashboard;