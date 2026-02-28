import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./logo.png";

function Login({ setRole }) {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ================= SIGN UP =================
    if (isSignUp) {
      const userExists = users.find((u) => u.email === email);
      if (userExists) {
        alert("User already exists");
        return;
      }

      const newUser = {
        email,
        password,
        role: selectedRole,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("role", selectedRole);

      // 🔥 Update App state immediately
      setRole(selectedRole);

      navigate(`/${selectedRole}`);
      return;
    }

    // ================= SIGN IN =================
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.role === selectedRole
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("role", selectedRole);

    // 🔥 Update App state immediately
    setRole(selectedRole);

    navigate(`/${selectedRole}`);
  };

  return (
    <div className="login-page">
      <div className="brand">
        <img src={logo} alt="logo" />
        <h2>GradeSphere</h2>
      </div>

      <div className="login-card">
        <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
        <p className="subtitle">
          {isSignUp
            ? "Create your account to get started"
            : "Access your dashboard and manage your work"}
        </p>

        <label>I am a:</label>
        <div className="role-toggle">
          <button
            type="button"
            className={selectedRole === "student" ? "active" : ""}
            onClick={() => setSelectedRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={selectedRole === "teacher" ? "active" : ""}
            onClick={() => setSelectedRole("teacher")}
          >
            Teacher
          </button>

          <button
            type="button"
            className={selectedRole === "admin" ? "active" : ""}
            onClick={() => setSelectedRole("admin")}
          >
            Admin
          </button>
        </div>

        <label>Email Address</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="login-btn"
          onClick={handleAuth}
        >
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        <p className="signup-text">
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;