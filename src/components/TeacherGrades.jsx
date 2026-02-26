import { useEffect, useState } from "react";
import "./TeacherDashboard.css";

function TeacherGrades() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
const [gradeInputs, setGradeInputs] = useState({});
const [feedbackInputs, setFeedbackInputs] = useState({});
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
  

  // Collect all graded submissions
  const students = assignments.flatMap((a) =>
    a.submissions
      .filter((s) => s.score!=null)
      .map((s) => ({
        name: s.student,
        id: s.student?.slice(-4),
        score: s.score
      }))
  );

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const average =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.score, 0) /
            students.length
        )
      : 0;

  const highest =
    students.length > 0
      ? Math.max(...students.map((s) => s.score))
      : 0;

  const lowest =
    students.length > 0
      ? Math.min(...students.map((s) => s.score))
      : 0;

  const passRate =
    students.length > 0
      ? Math.round(
          (students.filter((s) => s.score >= 40).length /
            students.length) *
            100
        )
      : 0;

  const getLetter = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const distribution = {
    A: students.filter((s) => s.score >= 90).length,
    B: students.filter((s) => s.score >= 80 && s.score < 90).length,
    C: students.filter((s) => s.score >= 70 && s.score < 80).length,
    D: students.filter((s) => s.score >= 60 && s.score < 70).length,
    F: students.filter((s) => s.score < 60).length
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
                score: Number(grade),
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
  return (
    <div className="grades-container">

      <h2>Grades</h2>
      <p className="sub-text">
        View and manage student grades
      </p>
      {/* GRADING SECTION */}
{assignments.length === 0 ? (
  <p>No assignments available.</p>
) : assignments.every(a => a.submissions.length === 0) ? (
  <p>No student submissions available to grade.</p>
) : (
  assignments.map((a) =>
    a.submissions.map((s) => (
      <div key={a.id + s.student} className="assignment-card">

        <p><strong>Assignment:</strong> {a.title}</p>
        <p><strong>Student:</strong> {s.student}</p>
<span className={`grade-badge ${s.score != null ? "graded" : "pending"}`}>
  {s.score != null ? "Graded" : "Pending"}
</span>
        <input
  type="number"
  placeholder="Enter Grade"
  value={gradeInputs[`${a.id}-${s.student}`] || ""}
  onChange={(e) =>
    setGradeInputs({
      ...gradeInputs,
      [`${a.id}-${s.student}`]: e.target.value
    })
  }
/>

<textarea
  placeholder="Write feedback..."
  value={feedbackInputs[`${a.id}-${s.student}`] || ""}
  onChange={(e) =>
    setFeedbackInputs({
      ...feedbackInputs,
      [`${a.id}-${s.student}`]: e.target.value
    })
  }
  rows="3"
/>

<button
  onClick={() =>
    handleGrade(
      a.id,
      s.student,
      gradeInputs[`${a.id}-${s.student}`],
      feedbackInputs[`${a.id}-${s.student}`]
    )
  }
>
  Save Grade
</button>

<p><strong>Current Grade:</strong> {s.score ?? "Not graded"}</p>
<p><strong>Feedback:</strong> {s.feedback ?? "No feedback yet"}</p>
      </div>
    ))
  )
)}

      {/* CLASS OVERVIEW */}
      <div className="overview-card">
        <div className="overview-stat">
          <span>Students</span>
          <h3>{students.length}</h3>
        </div>
        <div className="overview-stat">
          <span>Average</span>
          <h3>{average}%</h3>
        </div>
        <div className="overview-stat">
          <span>Highest</span>
          <h3>{highest}%</h3>
        </div>
        <div className="overview-stat">
          <span>Lowest</span>
          <h3>{lowest}%</h3>
        </div>
        <div className="overview-stat">
          <span>Pass Rate</span>
          <h3>{passRate}%</h3>
        </div>
      </div>

      {/* SEARCH */}
      <div className="grades-controls">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="grades-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>ID</th>
              <th>Score</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={idx}>
                <td>{s.name}</td>
                <td>{s.id}</td>
                <td>{s.score}</td>
                <td>{s.score}%</td>
                <td>{getLetter(s.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DISTRIBUTION */}
      <div className="distribution-card">
        <h3>Grade Distribution</h3>
        <div className="distribution-grid">
          <div className="dist-box green">
            {distribution.A}
            <span>A (90-100)</span>
          </div>
          <div className="dist-box blue">
            {distribution.B}
            <span>B (80-89)</span>
          </div>
          <div className="dist-box orange">
            {distribution.C}
            <span>C (70-79)</span>
          </div>
          <div className="dist-box red">
            {distribution.D}
            <span>D (60-69)</span>
          </div>
          <div className="dist-box gray">
            {distribution.F}
            <span>F (0-59)</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TeacherGrades;