import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import TeacherCreate from "./TeacherCreate";
import TeacherSubmissions from "./TeacherSubmissions";
import TeacherGrades from "./TeacherGrades";

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  // Load assignments
  useEffect(() => {
    const savedAssignments = localStorage.getItem("assignments");
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  // Load subjects
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // Filter assignments by selected subject
  const subjectAssignments = selectedSubject
    ? assignments.filter(
        (a) => a.subject === selectedSubject.name
      )
    : [];

  return (
    <div className="teacher-container">

      {/* ================= SIDEBAR ================= */}
      <div className="teacher-sidebar">
        <h2>GradeSphere</h2>

        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveTab("dashboard");
              setSelectedSubject(null);
            }}
          >
            Dashboard
          </li>

          <li style={{ marginTop: "20px", fontWeight: "600" }}>
            Subjects
          </li>

          {subjects.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                setSelectedSubject(s);
                setActiveTab("subject");
              }}
              className={
                activeTab === "subject" &&
                selectedSubject?.id === s.id
                  ? "active"
                  : ""
              }
            >
              {s.name}
            </li>
          ))}

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

        {/* ===== SUBJECT VIEW ===== */}
        {activeTab === "subject" && selectedSubject && (
          <>
            <div className="dashboard-header">
              <h1>{selectedSubject.name}</h1>
              <p>Assignments under this subject</p>
            </div>

            {subjectAssignments.length === 0 ? (
              <div className="assignment-detail-card">
                <p>No assignments in this subject yet.</p>
              </div>
            ) : (
              subjectAssignments.map((a) => (
                <div
                  key={a.id}
                  className="assignment-detail-card"
                >
                  <div className="card-top">
                    <div>
                      <h3>{a.title}</h3>
                      <p className="category">
                        {a.subject}
                      </p>
                    </div>
                    <span className="due-date">
                      Due: {a.deadline}
                    </span>
                  </div>

                  <p>
                    Submissions: {a.submissions.length}
                  </p>
                </div>
              ))
            )}
          </>
        )}

        {/* ===== DASHBOARD VIEW ===== */}
        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-header">
              <h1>Welcome back 👋</h1>
              <p>
                Here's what's happening in your classes
                today
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

              <div className="stat-card">
                <div>
                  <h3>{subjects.length}</h3>
                  <p>Total Subjects</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== OTHER TABS ===== */}
        {activeTab === "create" && <TeacherCreate />}
        {activeTab === "submissions" && (
          <TeacherSubmissions />
        )}
        {activeTab === "grades" && <TeacherGrades />}
      </div>
    </div>
  );
}

export default TeacherDashboard;