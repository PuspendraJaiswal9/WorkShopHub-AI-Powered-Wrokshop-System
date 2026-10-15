import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, open: 0, escalated: 0, resolved: 0 });
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:8085/admin/tickets";

  const getToken = () => localStorage.getItem("token");
  const getRole = () => (localStorage.getItem("role") || "").toUpperCase();

  const fetchTickets = () => {
    if (getRole() !== "ADMIN") {
      setError("Access denied. Admins only.");
      setTickets([]);
      return;
    }

    const url = filterStatus ? `${API_URL}?status=${filterStatus}` : API_URL;
    
    fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      })
      .then((data) => {
        setTickets(data || []);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError("Unable to fetch tickets from server.");
        setTickets([]);
      });

    fetch(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const escalateTicket = (id) => {
    if (getRole() !== "ADMIN") {
      alert("Access denied.");
      return;
    }
    fetch(`http://localhost:8085/admin/tickets/${id}/escalate`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(() => fetchTickets())
      .catch(() => alert("Failed to escalate ticket"));
  };

  const resolveTicket = (id) => {
    if (getRole() !== "ADMIN") {
      alert("Access denied.");
      return;
    }
    fetch(`http://localhost:8085/admin/tickets/${id}/resolve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(() => fetchTickets())
      .catch(() => alert("Failed to resolve ticket"));
  };

  const deleteTicket = (id) => {
    if (getRole() !== "ADMIN") {
      alert("Access denied.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    
    fetch(`http://localhost:8085/admin/tickets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => fetchTickets())
      .catch(() => alert("Failed to delete ticket"));
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/"); // redirect to home
  };

  if (getRole() !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h3>Access Denied</h3>
        <p>Only admin users can view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", padding: "0 8px" }}>{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1ecf1" }}>🎫</div>
          <div className="stat-info">
            <div className="stat-value">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f8d7da" }}>⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.escalated}</div>
            <div className="stat-label">Escalated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d4edda" }}>✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>🎪 Customer Support Tickets</h3>
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
        <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>User</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No tickets available.
              </td>
            </tr>
          ) : (
            tickets.map((t) => (
              <tr key={t.id}>
                <td><strong>#{t.id}</strong></td>
                <td>{t.username || "N/A"}</td>
                <td>{t.subject}</td>
                <td>{t.description}</td>
                <td>
                  <span className={`priority-badge ${t.priority?.toLowerCase()}`}>
                    {t.priority || "MEDIUM"}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${t.status?.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
                <td>{t.createdAt?.slice(0, 19).replace("T", " ")}</td>
                <td>
                  {t.status !== "RESOLVED" && (
                    <>
                      <button
                        className="btn resolve"
                        onClick={() => resolveTicket(t.id)}
                      >
                        Resolve
                      </button>
                      {t.status !== "ESCALATED" && (
                        <button
                          className="btn escalate"
                          onClick={() => escalateTicket(t.id)}
                        >
                          Escalate
                        </button>
                      )}
                    </>
                  )}
                  <button
                    className="btn delete"
                    onClick={() => deleteTicket(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
