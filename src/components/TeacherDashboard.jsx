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

  // Load assignments
  useEffect(() => {
    const savedAssignments = localStorage.getItem("assignments");
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="teacher-container">

      {/* ================= SIDEBAR ================= */}
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

      {/* ================= MAIN CONTENT ================= */}
      <div className="teacher-main">

        {/* ===== DASHBOARD VIEW ===== */}
        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-header">
              <h1>Welcome back 👋</h1>
              <p>
                Here's what's happening in your classes today
              </p>
            </div>

            <div className="teacher-stats">
              <div className="stat-card">
                <div>
                  <h3>{assignments.length}</h3>
                  <p>Total Assignments</p>
                </div>
              </div>

              <div className="stat-card">
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
            </div>
          </>
        )}

        {/* ===== OTHER TABS ===== */}
        {activeTab === "create" && <TeacherCreate />}
        {activeTab === "submissions" && <TeacherSubmissions />}
        {activeTab === "grades" && <TeacherGrades />}
      </div>
    </div>
  );
}

export default TeacherDashboard;