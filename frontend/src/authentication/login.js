import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const extractRole = (data) => {
    if (data.role) return data.role;
    if (data.roles && data.roles.length > 0) return data.roles[0];
    if (data.authorities && data.authorities.length > 0)
      return data.authorities[0].authority;
    return "ROLE_USER";
  };

  const normalizeRole = (rawRole) => {
    if (!rawRole) return "USER";
    let role = rawRole.toString().trim().toUpperCase();
    if (role.startsWith("ROLE_")) {
      role = role.substring(5);
    }
    return role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("⚠️ Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8086/user/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const userRoleRaw = extractRole(data);
        const userRole = normalizeRole(userRoleRaw);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username);
          localStorage.setItem("role", userRole);

          setMessage("✅ Login successful!");
          if (typeof onLogin === "function") {
            onLogin(username, userRole);
          }
        } else {
          setMessage("❌ Token not received!");
        }
      } else {
        setMessage("❌ Invalid username or password!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Cannot connect to server. Please check if backend is running on port 8086.");
    }
  };

  return (
    <div className="form-container">
      <div className="auth-logo">
        <div className="auth-logo-icon">🎓</div>
        <div className="auth-logo-text">Workshop Hub</div>
      </div>
      <h2>Welcome Back</h2>
      <p>Sign in to continue to your account</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && <div className="auth-message">{message}</div>}
    </div>
  );
}

export default Login;
