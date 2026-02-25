import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./logo.png";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignUp) {
      // SIGN UP
      const userExists = users.find((u) => u.email === email);
      if (userExists) {
        alert("User already exists");
        return;
      }

      const newUser = { email, password, role };
      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      alert("Account created successfully! Please sign in.");
      setIsSignUp(false);
      return;
    }

    // SIGN IN
    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("role", role);

    // ✅ Proper Navigation
    if (role === "student") {
      navigate("/student");
    } else if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "admin") {
      navigate("/admin");
    }
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
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            className={role === "teacher" ? "active" : ""}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>

          {/* ✅ ADMIN BUTTON ADDED */}
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
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

        <button className="login-btn" onClick={handleAuth}>
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        <p className="signup-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;