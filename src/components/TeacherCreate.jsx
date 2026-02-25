import { useState, useEffect } from "react";
import "./TeacherDashboard.css";

function TeacherCreate() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [points, setPoints] = useState(100);
  const [assignTo, setAssignTo] = useState("All Students");

  // Load subjects
  useEffect(() => {
    const saved = localStorage.getItem("subjects");
    if (saved) {
      setSubjects(JSON.parse(saved));
    }
  }, []);

  const handlePublish = () => {
    if (!title || !selectedSubjectId || !dueDate) {
      alert("Please fill required fields");
      return;
    }

    const updatedSubjects = subjects.map((subject) => {
      if (subject.id === Number(selectedSubjectId)) {
        return {
          ...subject,
          assignments: [
            ...subject.assignments,
            {
              id: Date.now(),
              title,
              description,
              deadline: dueDate,
              time: dueTime,
              points,
              assignTo,
              submissions: []
            }
          ]
        };
      }
      return subject;
    });

    setSubjects(updatedSubjects);
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // Reset form
    setTitle("");
    setSelectedSubjectId("");
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
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
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
          <p>
            <strong>Subject:</strong>{" "}
            {subjects.find(s => s.id === Number(selectedSubjectId))?.name || "No subject selected"}
          </p>
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
          <p>
            Active Assignments:{" "}
            {subjects.reduce(
              (total, s) => total + s.assignments.length,
              0
            )}
          </p>
          <p>Total Subjects: {subjects.length}</p>
        </div>

      </div>
    </div>
  );
}

export default TeacherCreate;