import { useState, useEffect } from "react";

function TeacherSubjects() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects");
    return saved ? JSON.parse(saved) : [];
  });

  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const handleCreateSubject = () => {
    if (!subjectName) return;

    const newSubject = {
      id: Date.now(),
      name: subjectName,
      teacher: localStorage.getItem("loggedInUser"),
      assignments: []
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
  };

  return (
    <div>
      <h2>Create Subject</h2>

      <input
        type="text"
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />

      <button onClick={handleCreateSubject}>
        Add Subject
      </button>

      <hr />

      {subjects.map((s) => (
        <div key={s.id}>
          <h3>{s.name}</h3>
          <p>Assignments: {s.assignments.length}</p>
        </div>
      ))}
    </div>
  );
}

export default TeacherSubjects;