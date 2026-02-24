import { useState, useEffect } from "react";
import "./StudentAssignments.css";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const studentEmail = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    }
  }, []);

  const getStatus = (a) => {
    const submitted = a.submissions?.some((s) => s.student === studentEmail);
    if (submitted) return "Submitted";
    const isOverdue = new Date(a.deadline) < new Date();
    return isOverdue ? "Overdue" : "Pending";
  };

  const handleSubmit = (id) => {
    if (!studentEmail) return alert("User not logged in.");
    const updated = assignments.map((a) => {
      if (a.id === id && !a.submissions.some(s => s.student === studentEmail)) {
        return {
          ...a,
          submissions: [...a.submissions, { student: studentEmail, grade: null }]
        };
      }
      return a;
    });
    setAssignments(updated);
    localStorage.setItem("assignments", JSON.stringify(updated));
  };

  const filteredAssignments = assignments.filter((a) => {
    const status = getStatus(a);
    const matchesFilter = filter === "All" || status === filter;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => getStatus(a) === "Pending").length,
    submitted: assignments.filter(a => getStatus(a) === "Submitted").length,
    overdue: assignments.filter(a => getStatus(a) === "Overdue").length,
  };

  return (
    <div className="assignments-container">
      <header className="page-header">
        <h1>Assignments</h1>
        <p>View and manage all your course assignments</p>
      </header>

      {/* Search and Filters */}
      <div className="controls-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search assignments..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
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
      </div>

      {/* Stats Summary Cards */}
      <div className="summary-stats">
        <div className="summary-card blue">
          <h3>{stats.total}</h3>
          <p>Total Assignments</p>
        </div>
        <div className="summary-card orange">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="summary-card green">
          <h3>{stats.submitted}</h3>
          <p>Submitted</p>
        </div>
        <div className="summary-card red">
          <h3>{stats.overdue}</h3>
          <p>Overdue</p>
        </div>
      </div>

      {/* Assignment List */}
      <div className="assignment-list">
        {filteredAssignments.length === 0 ? (
          <p className="no-data">No assignments found matching your criteria.</p>
        ) : (
          filteredAssignments.map((a) => {
            const status = getStatus(a);
            return (
              <div key={a.id} className="assignment-detail-card">
                <div className="card-top">
                  <div className="title-group">
                    <h3>{a.title} <span className={`badge ${status.toLowerCase()}`}>{status}</span></h3>
                    <p className="description">{a.description || "No description provided."}</p>
                    <div className="metadata">
                      <span><strong>Subject:</strong> {a.subject || "N/A"}</span>
                      <span><strong>Teacher:</strong> {a.teacherName || "Instructor"}</span>
                      <span><strong>Points:</strong> {a.points || "100"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="deadline-info">
                    <span>📅 Due {a.deadline}</span>
                    <span>📎 {a.attachments?.length || 0} attachments</span>
                  </div>
                  <div className="action-buttons">
                    <button className="btn-secondary">View Details</button>
                    <button 
                      className="btn-primary" 
                      disabled={status === "Submitted"}
                      onClick={() => handleSubmit(a.id)}
                    >
                      {status === "Submitted" ? "Submitted" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;