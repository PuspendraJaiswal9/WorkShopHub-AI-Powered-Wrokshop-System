import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import Login from "./authentication/login";
import Register from "./authentication/registration";
import WorkshopOperation from "./component/WorkshopOperation";
import FareOperation from "./component/FareOperation";
import BookingOperation from "./component/BookingOperation";
import MyBookings from "./component/MyBookings";
import Chatbot from "./component/Chatbot";
import PaymentSuccess from "./component/PaymentSuccess";
import PaymentCancel from "./component/PaymentCancel";
import AdminDashboard from "./component/AdminDashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeComponent, setActiveComponent] = useState("workshop");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole) {
      setIsAuthenticated(true);
      setUsername(user);
      setRole(storedRole.toUpperCase());
    }
  }, []);

  const handleLogin = (loggedInUsername, loggedInRole) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setRole(loggedInRole ? loggedInRole.toUpperCase() : "USER");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUsername(null);
    setRole(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "workshop":
        return <WorkshopOperation />;
      case "fare":
        return <FareOperation />;
      case "booking":
        return <BookingOperation />;
      case "mybookings":
        return <MyBookings />;
      case "chatbot":
        return <Chatbot />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-bg">
              {!isAuthenticated ? (
                !showAuth ? (
                  <HomePage onGetStarted={() => setShowAuth(true)} />
                ) : (
                <div className="auth-container">
                  <div className="auth-card">
                    {showLogin ? (
                      <>
                        <Login onLogin={handleLogin} />
                        <p className="auth-switch">
                          Don't have an account?{" "}
                          <button
                            className="toggle-btn"
                            onClick={() => setShowLogin(false)}
                          >
                            Register
                          </button>
                        </p>
                      </>
                    ) : (
                      <>
                        <Register />
                        <p className="auth-switch">
                          Already have an account?{" "}
                          <button
                            className="toggle-btn"
                            onClick={() => setShowLogin(true)}
                          >
                            Login
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                </div>
                )
              ) : (
                <div className="dashboard-wrapper">
                  <div className="top-header">
                    <div className="brand-section">
                      <div className="brand-logo">🎓</div>
                      <div className="brand-info">
                        <div className="brand-name">Workshop Hub</div>
                        <div className="brand-tagline">Manage Your Events</div>
                      </div>
                    </div>
                    <div className="user-section">
                      <div className="user-info">
                        <div className="user-name">{username}</div>
                        <div className="user-role">{role}</div>
                      </div>
                      <button className="logout-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-layout">
                    <aside className="sidebar">
                      <div className="sidebar-header">
                        <h3>Navigation</h3>
                      </div>
                      <nav className="sidebar-nav">
                        <button
                          className={`sidebar-item ${activeComponent === "workshop" ? "active" : ""}`}
                          onClick={() => setActiveComponent("workshop")}
                        >
                          <span className="icon">🎪</span>
                          <span className="label">Workshops</span>
                        </button>

                        <button
                          className={`sidebar-item ${activeComponent === "fare" ? "active" : ""}`}
                          onClick={() => setActiveComponent("fare")}
                        >
                          <span className="icon">💰</span>
                          <span className="label">Fare</span>
                        </button>

                        <button
                          className={`sidebar-item ${activeComponent === "booking" ? "active" : ""}`}
                          onClick={() => setActiveComponent("booking")}
                        >
                          <span className="icon">📅</span>
                          <span className="label">Bookings</span>
                        </button>

                        <button
                          className={`sidebar-item ${activeComponent === "mybookings" ? "active" : ""}`}
                          onClick={() => setActiveComponent("mybookings")}
                        >
                          <span className="icon">🎫</span>
                          <span className="label">My Bookings</span>
                        </button>

                        <button
                          className={`sidebar-item ${activeComponent === "chatbot" ? "active" : ""}`}
                          onClick={() => setActiveComponent("chatbot")}
                        >
                          <span className="icon">💬</span>
                          <span className="label">Chatbot</span>
                        </button>

                        {role === "ADMIN" && (
                          <button
                            className="sidebar-item"
                            onClick={() => (window.location.href = "/admin-dashboard")}
                          >
                            <span className="icon">👨‍💼</span>
                            <span className="label">Admin Panel</span>
                          </button>
                        )}
                      </nav>
                    </aside>

                    <main className="main-content">
                      <div className="content-wrapper">{renderComponent()}</div>
                      <div className="footer">
                        <p>© 2024 Workshop Hub. All rights reserved.</p>
                      </div>
                    </main>
                  </div>
                </div>
              )}
            </div>
          }
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard onLogout={handleLogout} />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
}

export default App;
