import { useState, useEffect } from "react";
import "./WorkshopOperation.css";

function WorkshopOperation() {
  const [workshops, setWorkshops] = useState([]);
  const [singleWorkshop, setSingleWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    capacity: "",
    availableSeats: "",
    amount: "",
    createdBy: "",
  });
  const [activeForm, setActiveForm] = useState("");
  const [message, setMessage] = useState("");
  const [idInput, setIdInput] = useState("");

  const API_URL = "http://localhost:8081/api/workshops";

  const getRole = () => {
    const r = localStorage.getItem("role");
    return r ? r.toUpperCase() : null;
  };
  const isAdmin = () => getRole() === "ADMIN";
  const isAuthenticated = () => !!localStorage.getItem("token");

  const getHeaders = (isJson = true) => {
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchWorkshops = async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeaders(false) });
      if (res.ok) {
        const data = await res.json();
        setWorkshops(data);
      } else showMessage("⚠️ Failed to fetch workshops");
    } catch {
      showMessage("⚠️ Error occurred while fetching workshops");
    }
  };

  const fetchWorkshopById = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { headers: getHeaders(false) });
      if (res.ok) {
        const data = await res.json();
        setSingleWorkshop(data);
        showMessage("ℹ️ Workshop fetched!");
      } else {
        showMessage("❌ Workshop not found");
        setSingleWorkshop(null);
      }
    } catch {
      showMessage("⚠️ Error fetching workshop");
    }
  };

  useEffect(() => {
    if (activeForm === "all") {
      fetchWorkshops();
      setSingleWorkshop(null);
    } else if (activeForm !== "get") {
      setWorkshops([]);
      setSingleWorkshop(null);
    }
  }, [activeForm]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!isAuthenticated()) {
      showMessage("⚠️ Please login first.");
      return;
    }

    try {
      let res;
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue,
        capacity: Number(formData.capacity),
        availableSeats: Number(formData.availableSeats),
        amount: Number(formData.amount),
        createdBy: formData.createdBy,
      };

      switch (activeForm) {
        case "add":
          if (!isAdmin()) {
            showMessage("❌ Only ADMIN can add workshops.");
            return;
          }
          res = await fetch(API_URL, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            showMessage("✅ Workshop added successfully!");
            setFormData({
              title: "",
              description: "",
              date: "",
              startTime: "",
              endTime: "",
              venue: "",
              capacity: "",
              availableSeats: "",
              amount: "",
              createdBy: "",
            });
            fetchWorkshops();
            setActiveForm("");
          } else showMessage("❌ Error adding workshop");
          break;

        case "update":
          if (!isAdmin()) {
            showMessage("❌ Only ADMIN can update workshops.");
            return;
          }
          if (!idInput) {
            showMessage("⚠️ Enter Workshop ID to update");
            return;
          }
          res = await fetch(`${API_URL}/${idInput}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            showMessage("✅ Workshop updated successfully!");
            setIdInput("");
            setFormData({
              title: "",
              description: "",
              date: "",
              startTime: "",
              endTime: "",
              venue: "",
              capacity: "",
              availableSeats: "",
              amount: "",
              createdBy: "",
            });
            fetchWorkshops();
            setActiveForm("");
          } else showMessage("❌ Error updating workshop");
          break;

        case "get":
          if (!idInput) {
            showMessage("⚠️ Enter Workshop ID to fetch");
            return;
          }
          fetchWorkshopById(idInput);
          break;

        case "delete":
          if (!isAdmin()) {
            showMessage("❌ Only ADMIN can delete workshops.");
            return;
          }
          if (!idInput) {
            showMessage("⚠️ Enter Workshop ID to delete");
            return;
          }
          res = await fetch(`${API_URL}/${idInput}`, {
            method: "DELETE",
            headers: getHeaders(false),
          });
          if (res.ok) {
            showMessage(`🗑️ Workshop with ID ${idInput} deleted`);
            setIdInput("");
            fetchWorkshops();
            setActiveForm("");
          } else showMessage("❌ Error deleting workshop");
          break;

        default:
          break;
      }
    } catch {
      showMessage("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="workshop-container">
      <h2>Workshop Management</h2>
      <p>Manage your workshop events</p>

      <div className="operations-tabs">
        <button className={`tab-btn ${activeForm === "all" ? "active" : ""}`} onClick={() => setActiveForm("all")}>All Workshops</button>
        {isAdmin() && <button className={`tab-btn ${activeForm === "add" ? "active" : ""}`} onClick={() => setActiveForm("add")}>Add New</button>}
        {isAdmin() && <button className={`tab-btn ${activeForm === "update" ? "active" : ""}`} onClick={() => setActiveForm("update")}>Update</button>}
        <button className={`tab-btn ${activeForm === "get" ? "active" : ""}`} onClick={() => setActiveForm("get")}>Search</button>
        {isAdmin() && <button className={`tab-btn ${activeForm === "delete" ? "active" : ""}`} onClick={() => setActiveForm("delete")}>Delete</button>}
      </div>

      {message && (
        <p
          className={`message ${
            message.startsWith("✅")
              ? "success"
              : message.startsWith("ℹ️")
              ? "info"
              : message.startsWith("🗑️")
              ? "delete"
              : "error"
          }`}
        >
          {message}
        </p>
      )}

      {activeForm !== "" && activeForm !== "all" && (
        <div className="workshop-form">
          {(activeForm === "get" ||
            activeForm === "delete" ||
            activeForm === "update") && (
            <>
              <input
                type="number"
                placeholder="Workshop ID"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
              />
              {activeForm === "update" && (
                <button
                  type="button"
                  onClick={() => fetchWorkshopById(idInput)}
                >
                  Load Workshop
                </button>
              )}
            </>
          )}

          {(activeForm === "add" || activeForm === "update") && (
            <>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
              <input
                type="number"
                name="availableSeats"
                placeholder="Available Seats"
                value={formData.availableSeats}
                onChange={handleChange}
              />
              <input
                type="number"
                step="0.01"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
              />
              <input
                type="text"
                name="createdBy"
                placeholder="Created By"
                value={formData.createdBy}
                onChange={handleChange}
              />
            </>
          )}

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {activeForm === "all" && workshops.length > 0 && (
        <div className="workshop-list">
          <h3>All Workshops</h3>
          <ul>
            {workshops.map((w) => (
              <li key={w.workshopId} className="workshop-card">
                <div>
                  <strong>{w.title}</strong>
                  <p>{w.description}</p>
                </div>
                <div className="workshop-meta">
                  <span>📅 {w.date}</span>
                  <span>📍 {w.venue}</span>
                  <span>👥 {w.availableSeats}/{w.capacity}</span>
                  <span>💰 ₹{w.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {singleWorkshop && (
        <div className="workshop-detail">
          <h3>Workshop Details</h3>
          <div className="detail-box">
            <p><strong>Title:</strong> {singleWorkshop.title}</p>
            <p><strong>Description:</strong> {singleWorkshop.description}</p>
            <p><strong>Date:</strong> {singleWorkshop.date}</p>
            <p><strong>Time:</strong> {singleWorkshop.startTime} - {singleWorkshop.endTime}</p>
            <p><strong>Venue:</strong> {singleWorkshop.venue}</p>
            <p><strong>Seats:</strong> {singleWorkshop.availableSeats}/{singleWorkshop.capacity}</p>
            <p><strong>Amount:</strong> ₹{singleWorkshop.amount}</p>
            <p><strong>Created By:</strong> {singleWorkshop.createdBy}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkshopOperation;
