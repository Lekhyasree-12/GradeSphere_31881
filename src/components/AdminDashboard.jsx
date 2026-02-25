import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("subjects")) || [];
    setSubjects(stored);
  }, []);

  const handleAddSubject = () => {
    if (!subjectName.trim()) return;

    const storedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    const newSubject = {
      id: Date.now(),
      name: subjectName,
      assignments: []
    };

    const updatedSubjects = [...storedSubjects, newSubject];

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
    setSubjectName("");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="subject-section">
        <h3>Add New Subject</h3>

        <div className="input-row">
          <input
            type="text"
            placeholder="Enter Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddSubject}>
            Add
          </button>
        </div>
      </div>

      <div className="subject-list">
        <h3>All Subjects</h3>

        {subjects.length === 0 ? (
          <p className="empty-text">No subjects added yet.</p>
        ) : (
          subjects.map((sub) => (
            <div key={sub.id} className="subject-card">
              {sub.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;