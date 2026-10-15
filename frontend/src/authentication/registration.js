import { useState } from "react";

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password) {
      setMessage("⚠️ Please fill all fields!");
      return;
    }

    try {
      console.log("Sending registration request...");
      console.log("Request data:", { username, email, password: "***" });
      
      const response = await fetch("http://localhost:8086/user/register", {
        method: "POST",
        mode: "cors",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log("Response received:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        setMessage(`✅ Registered: ${data.username || username}. Please login.`);
        if (typeof onRegisterSuccess === "function") onRegisterSuccess(data);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const text = await response.text();
        console.error("Registration failed:", text);
        setMessage("❌ Registration failed: " + (text || response.status));
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("⚠️ Cannot connect to server. Please check if backend is running on port 8086.");
    }
  };

  return (
    <div className="form-container">
      <div className="auth-logo">
        <div className="auth-logo-icon">🎓</div>
        <div className="auth-logo-text">Workshop Hub</div>
      </div>
      <h2>Create Account</h2>
      <p>Join us to manage your workshop events</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
      {message && <div className="auth-message">{message}</div>}
    </div>
  );
}

export default Register;
