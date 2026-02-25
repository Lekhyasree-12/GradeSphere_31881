import { useState, useEffect } from "react";
import "./TeacherDashboard.css";

function TeacherCreate() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(100);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("subjects")) || [];
    setSubjects(stored);
  }, []);

  const handlePublish = () => {
    if (!title || !selectedSubjectId || !dueDate) {
      alert("Please fill all required fields");
      return;
    }

    const storedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    console.log("Selected Subject ID:", selectedSubjectId);
    console.log("Stored Subjects:", storedSubjects);

    const updatedSubjects = storedSubjects.map((subject) => {
      if (subject.id === Number(selectedSubjectId)) {
        console.log("MATCH FOUND:", subject.name);

        return {
          ...subject,
          assignments: [
            ...(subject.assignments || []),
            {
              id: Date.now(),
              title,
              description,
              deadline: dueDate,
              points,
              submissions: []
            }
          ]
        };
      }
      return subject;
    });

    console.log("Updated Subjects:", updatedSubjects);

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
// 🔥 ADD THIS LINE
window.dispatchEvent(new Event("subjectsUpdated"));
    alert("Assignment Created Successfully!");

    // Reset form
    setTitle("");
    setSelectedSubjectId("");
    setDescription("");
    setDueDate("");
    setPoints(100);
  };

  return (
    <div className="create-layout">
      <h2>Create Assignment</h2>

      <label>Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Subject *</label>
      <select
        value={selectedSubjectId}
        onChange={(e) => setSelectedSubjectId(e.target.value)}
      >
        <option value="">Select Subject</option>
        {subjects.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Due Date *</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label>Points</label>
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />

      <button onClick={handlePublish}>
        Publish Assignment
      </button>
    </div>
  );
}

export default TeacherCreate;