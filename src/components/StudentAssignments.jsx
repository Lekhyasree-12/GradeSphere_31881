import { useState, useEffect } from "react";
import "./StudentAssignments.css";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const studentEmail = localStorage.getItem("loggedInUser");

  // 🔥 Load assignments from subjects
  useEffect(() => {
  const loadAssignments = () => {
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
  };

  loadAssignments();

  // Listen for storage updates
  window.addEventListener("storage", loadAssignments);

  return () => {
    window.removeEventListener("storage", loadAssignments);
  };
}, []);

  // Determine assignment status
  const getStatus = (a) => {
    const submitted = a.submissions?.some(
      (s) => s.student === studentEmail
    );

    if (submitted) return "Submitted";

    const isOverdue = new Date(a.deadline || a.dueDate) < new Date();
    return isOverdue ? "Overdue" : "Pending";
  };

  // Submit assignment
  const handleSubmit = (id, subjectId) => {
    const storedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    const updatedSubjects = storedSubjects.map((subject) => {
      if (subject.id === subjectId) {
        const updatedAssignments = subject.assignments.map((a) => {
          if (
            a.id === id &&
            !a.submissions?.some(
              (s) => s.student === studentEmail
            )
          ) {
            return {
              ...a,
              submissions: [
                ...(a.submissions || []),
                { student: studentEmail, grade: null }
              ]
            };
          }
          return a;
        });

        return { ...subject, assignments: updatedAssignments };
      }
      return subject;
    });

    localStorage.setItem(
      "subjects",
      JSON.stringify(updatedSubjects)
    );

    // Reload assignments after submit
    const refreshedAssignments = updatedSubjects.flatMap((subject) =>
      (subject.assignments || []).map((assignment) => ({
        ...assignment,
        subject: subject.name,
        subjectId: subject.id
      }))
    );

    setAssignments(refreshedAssignments);
  };

  // Filtering
  const filteredAssignments = assignments.filter((a) => {
    const status = getStatus(a);
    const matchesFilter = filter === "All" || status === filter;
    const matchesSearch = a.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(
      (a) => getStatus(a) === "Pending"
    ).length,
    submitted: assignments.filter(
      (a) => getStatus(a) === "Submitted"
    ).length,
    overdue: assignments.filter(
      (a) => getStatus(a) === "Overdue"
    ).length
  };

  return (
    <div className="assignments-container">
      <header className="page-header">
        <h1>Assignments</h1>
        <p>View and manage all your course assignments</p>
      </header>

      {/* Search & Filter */}
      <div className="controls-row">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {["All", "Pending", "Submitted", "Overdue"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="summary-stats">
        <div>Total: {stats.total}</div>
        <div>Pending: {stats.pending}</div>
        <div>Submitted: {stats.submitted}</div>
        <div>Overdue: {stats.overdue}</div>
      </div>

      {/* Assignment List */}
      <div className="assignment-list">
        {filteredAssignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          filteredAssignments.map((a) => {
            const status = getStatus(a);

            return (
              <div key={a.id} className="assignment-card">
                <h3>
                  {a.title}{" "}
                  <span className={`badge ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </h3>

                <p>{a.description}</p>

                <p><strong>Subject:</strong> {a.subject}</p>
                <p><strong>Points:</strong> {a.points}</p>
                <p>
                  <strong>Due:</strong>{" "}
                  {a.deadline || a.dueDate}
                </p>

                <button
                  disabled={status === "Submitted"}
                  onClick={() =>
                    handleSubmit(a.id, a.subjectId)
                  }
                >
                  {status === "Submitted"
                    ? "Submitted"
                    : "Submit"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;