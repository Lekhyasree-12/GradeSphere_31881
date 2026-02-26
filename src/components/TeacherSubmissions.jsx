import { useEffect, useState } from "react";
import "./TeacherDashboard.css";

function TeacherSubmissions() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

useEffect(() => {
  const storedSubjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

  const allAssignments = storedSubjects.flatMap((subject) =>
    (subject.assignments || []).map((assignment) => ({
      ...assignment,
      subject: subject.name,
      subjectId: subject.id
    }))
  );

  setAssignments(allAssignments);
}, []);

  // Save changes when grading
  const updateStorage = (updated) => {
    setAssignments(updated);
    localStorage.setItem("assignments", JSON.stringify(updated));
  };

  const handleGrade = (assignmentId, studentEmail, grade, feedback) => {

  const updated = assignments.map((a) => {
    if (a.id === assignmentId) {
      return {
        ...a,
        submissions: a.submissions.map((s) =>
          s.student === studentEmail
            ? {
                ...s,
                score: Number(grade),   // IMPORTANT
                feedback: feedback
              }
            : s
        )
      };
    }
    return a;
  });

  setAssignments(updated);
  localStorage.setItem("assignments", JSON.stringify(updated));
};
  const allSubmissions = assignments.flatMap((a) =>
    a.submissions.map((s, i) => ({
      ...s,
      assignmentTitle: a.title,
      assignmentId: a.id,
      index: i
    }))
  );

  const filtered = allSubmissions.filter((s) => {
    const matchesSearch =
      s.student.toLowerCase().includes(search.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && s.score == null) ||
(filter === "graded" && s.score != null);

    return matchesSearch && matchesFilter;
  });

  const total = allSubmissions.length;
const pending = allSubmissions.filter((s) => s.score == null).length;
const graded = allSubmissions.filter((s) => s.score != null).length;

  return (
    <div className="submissions-container">

      <h2>Submissions</h2>
      <p className="sub-text">Review and grade student submissions</p>

      {/* SEARCH + FILTER */}
      <div className="submission-controls">
        <input
          type="text"
          placeholder="Search by student or assignment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "graded" ? "active" : ""}
            onClick={() => setFilter("graded")}
          >
            Graded
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="submission-stats">
        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total Submissions</p>
        </div>
        <div className="stat-card warning">
          <h3>{pending}</h3>
          <p>Pending Review</p>
        </div>
        <div className="stat-card success">
          <h3>{graded}</h3>
          <p>Graded</p>
        </div>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No submissions found</h3>
        </div>
      ) : (
        filtered.map((s, idx) => (
          <div key={idx} className="submission-card">

            <div className="submission-top">
              <div>
                <h3>{s.student}</h3>
                <p className="assignment-name">
                  {s.assignmentTitle}
                </p>
              </div>

              {s.score==null ? (
                <span className="status-pill pending">
                  Pending
                </span>
              ) : (
                <span className="status-pill graded">
                  Graded
                </span>
              )}
            </div>

            <div className="submission-actions">
              <button className="primary">
                View Submission
              </button>

              <button className="secondary">
                Download
              </button>

             {s.score == null ? (
  <button
  className="grade-btn"
  onClick={() => setActiveTab("grades")}
>
  Grade Now
</button>
) : (
  <div className="score-display">
    {s.score}
  </div>
)}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default TeacherSubmissions;