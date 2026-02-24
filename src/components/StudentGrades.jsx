import { useEffect, useState } from "react";
import "./StudentGrades.css";

function StudentGrades() {
  const [assignments, setAssignments] = useState([]);
  const studentEmail = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    }
  }, []);

  // Filter only assignments that have been graded for this student
  const myGraded = assignments.filter((a) =>
    a.submissions.some((s) => s.student === studentEmail && s.grade !== null)
  );

  // Grouping by subject for the card layout
  const groupedBySubject = myGraded.reduce((acc, curr) => {
    const subject = curr.subject || "General";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(curr);
    return acc;
  }, {});

  // Calculating Overall Stats for the Purple Banner
  const totalGrades = myGraded.map(a => 
    Number(a.submissions.find(s => s.student === studentEmail).grade)
  );
  const avgGPA = totalGrades.length 
    ? (totalGrades.reduce((a, b) => a + b, 0) / totalGrades.length).toFixed(0) 
    : 0;

  return (
    <div className="grades-container">
      <header className="page-header">
        <h1>Grades</h1>
        <p>Track your academic performance across all subjects</p>
      </header>

      {/* GPA Banner Section */}
      <div className="gpa-banner">
        <div className="banner-left">
          <span className="label">Overall GPA</span>
          <div className="gpa-display">
            <h2>{avgGPA} <span>/ 100</span></h2>
            <span className="grade-letter">Grade: {avgGPA >= 90 ? 'A' : 'B'}</span>
          </div>
          <div className="mini-stats">
            <div className="mini-card">
              <p>Highest Grade</p>
              <strong>94%</strong>
              <span>Computer Science</span>
            </div>
            <div className="mini-card">
              <p>Lowest Grade</p>
              <strong>85%</strong>
              <span>Physics</span>
            </div>
            <div className="mini-card">
              <p>Total Subjects</p>
              <strong>{Object.keys(groupedBySubject).length}</strong>
              <span>This Semester</span>
            </div>
          </div>
        </div>
        <div className="banner-icon">🏅</div>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {Object.keys(groupedBySubject).length === 0 ? (
          <p className="no-data">No graded assignments yet.</p>
        ) : (
          Object.entries(groupedBySubject).map(([subject, items]) => {
            const subjectAvg = (items.reduce((acc, item) => 
              acc + Number(item.submissions.find(s => s.student === studentEmail).grade), 0) / items.length).toFixed(0);

            return (
              <div key={subject} className="subject-card">
                <div className="subject-header">
                  <div className="subject-title">
                    <span className="icon">📖</span>
                    <div>
                      <h3>{subject}</h3>
                      <p>Dr. Smith</p>
                    </div>
                  </div>
                  <div className="subject-score">
                    <span className="percentage">{subjectAvg}%</span>
                    <span className="trend">↗ Improving</span>
                  </div>
                </div>
                <div className="progress-bar">
                    <div className="fill" style={{width: `${subjectAvg}%`}}></div>
                </div>

                <div className="assignment-breakdown">
                  <p className="section-label">Recent Assignments</p>
                  {items.map(item => {
                    const submission = item.submissions.find(s => s.student === studentEmail);
                    return (
                      <div key={item.id} className="grade-row">
                        <div className="info">
                          <p className="item-title">{item.title}</p>
                          <span className="item-date">Graded on {item.deadline}</span>
                        </div>
                        <span className="item-score">{submission.grade}/100</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentGrades;