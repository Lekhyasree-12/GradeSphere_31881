import { useState, useEffect } from "react";
import "./TeacherDashboard.css";

function TeacherCreate() {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [points, setPoints] = useState(100);
  const [assignTo, setAssignTo] = useState("All Students");

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const handlePublish = () => {
    if (!title || !subject || !dueDate) {
      alert("Please fill required fields");
      return;
    }

    const newAssignment = {
      id: Date.now(),
      title,
      subject,
      description,
      deadline: dueDate,
      time: dueTime,
      points,
      assignTo,
      submissions: []
    };

    setAssignments([...assignments, newAssignment]);

    // Reset form
    setTitle("");
    setSubject("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPoints(100);
    setAssignTo("All Students");
  };

  return (
    <div className="create-layout">

      {/* LEFT SIDE FORM */}
      <div className="create-form-section">

        <h2>Create Assignment</h2>
        <p className="sub-text">
          Create and publish assignments for your students
        </p>

        <label>Assignment Title *</label>
        <input
          type="text"
          placeholder="e.g., Mathematics Quiz - Chapter 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Subject *</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select a subject</option>
          <option>Mathematics</option>
          <option>English</option>
          <option>Physics</option>
          <option>Chemistry</option>
        </select>

        <label>Description *</label>
        <textarea
          placeholder="Provide detailed instructions for the assignment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="row">
          <div>
            <label>Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label>Due Time *</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>
        </div>

        <label>Total Points *</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />

        <label>Assign To *</label>
        <select
          value={assignTo}
          onChange={(e) => setAssignTo(e.target.value)}
        >
          <option>All Students</option>
          <option>Section A</option>
          <option>Section B</option>
        </select>

        {/* Upload Box */}
        <div className="upload-box">
          <p>Click to upload or drag and drop</p>
          <small>PDF, DOC, DOCX up to 10MB</small>
        </div>

        <div className="btn-row">
          <button className="primary" onClick={handlePublish}>
            Publish Assignment
          </button>
          <button className="secondary">
            Save as Draft
          </button>
        </div>

      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="preview-section">

        <div className="preview-card">
          <h3>Assignment Preview</h3>
          <p><strong>Title:</strong> {title || "No title yet"}</p>
          <p><strong>Subject:</strong> {subject || "No subject selected"}</p>
          <p><strong>Due Date:</strong> {dueDate || "No date set"}</p>
          <p><strong>Points:</strong> {points} points</p>
        </div>

        <div className="tips-card">
          <h3>💡 Tips for Creating Assignments</h3>
          <ul>
            <li>Be clear and specific in your instructions</li>
            <li>Set realistic deadlines for students</li>
            <li>Include rubrics or grading criteria</li>
            <li>Attach reference materials if needed</li>
          </ul>
        </div>

        <div className="stats-card">
          <h3>Your Stats</h3>
          <p>Active Assignments: {assignments.length}</p>
          <p>Total Students: 45</p>
          <p>Avg Completion: 92%</p>
        </div>

      </div>
    </div>
  );
}

export default TeacherCreate;