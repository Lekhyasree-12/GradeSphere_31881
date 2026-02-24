import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import "./index.css";
function App() {

  const loggedInUser = localStorage.getItem("loggedInUser");

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/student"
        element={loggedInUser ? <StudentDashboard /> : <Navigate to="/" />}
      />

      <Route
        path="/teacher"
        element={loggedInUser ? <TeacherDashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
