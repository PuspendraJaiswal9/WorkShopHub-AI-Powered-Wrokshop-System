import { useState } from "react";
import "./FareOperation.css";

function FareOperation() {
  const [singleFare, setSingleFare] = useState(null);
  const [message, setMessage] = useState("");
  const [activeForm, setActiveForm] = useState("");
  const [formData, setFormData] = useState({
    fareId: "",
    workshopId: "",
    price: "",
  });

  const API_URL = "http://localhost:8083/fares";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMessage("");
    setSingleFare(null);

    if (!isAuthenticated()) {
      setMessage("⚠️ Please login first.");
      return;
    }

    try {
      let res;
      const payload = {
        fareId: Number(formData.fareId),
        workshopId: Number(formData.workshopId),
        price: Number(formData.price),
      };

      switch (activeForm) {
        case "add":
          if (!isAdmin()) {
            setMessage("❌ Only ADMIN can add fares.");
            return;
          }
          res = await fetch(API_URL, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            setMessage("✅ Fare added successfully!");
            setFormData({ fareId: "", workshopId: "", price: "" });
            setTimeout(() => setActiveForm(""), 2000);
          }
          break;

        case "update":
          if (!isAdmin()) {
            setMessage("❌ Only ADMIN can update fares.");
            return;
          }
          if (!formData.fareId) {
            setMessage("⚠️ Enter Fare ID to update");
            return;
          }
          res = await fetch(`${API_URL}/${formData.fareId}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            setMessage("✅ Fare updated successfully!");
            setFormData({ fareId: "", workshopId: "", price: "" });
            setTimeout(() => setActiveForm(""), 2000);
          }
          break;

        case "get":
          if (!formData.fareId) {
            setMessage("⚠️ Enter Fare ID to get");
            return;
          }
          res = await fetch(`${API_URL}/${formData.fareId}`, {
            headers: getHeaders(false),
          });
          if (res.ok) {
            const data = await res.json();
            setSingleFare(data);
            setMessage("ℹ️ Fare fetched!");
          } else {
            const txt = await res.text();
            setMessage("❌ Error fetching fare: " + (txt || res.status));
          }
          break;

        case "delete":
          if (!isAdmin()) {
            setMessage("❌ Only ADMIN can delete fares.");
            return;
          }
          if (!formData.fareId) {
            setMessage("⚠️ Enter Fare ID to delete");
            return;
          }
          res = await fetch(`${API_URL}/${formData.fareId}`, {
            method: "DELETE",
            headers: getHeaders(false),
          });
          if (res.ok) {
            setMessage(`🗑️ Fare with ID ${formData.fareId} deleted`);
            setFormData({ fareId: "", workshopId: "", price: "" });
            setTimeout(() => setActiveForm(""), 2000);
          } else {
            const txt = await res.text();
            setMessage("❌ Error deleting fare: " + (txt || res.status));
          }
          break;

        default:
          break;
      }

      if (res && !res.ok) {
        const text = await res.text();
        setMessage("❌ Error: " + (text || res.status));
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="fare-container">
      <h2>Fare Management</h2>
      <p>Manage workshop pricing and fare details</p>

      <div className="operations-tabs">
        {isAdmin() && <button className={`tab-btn ${activeForm === "add" ? "active" : ""}`} onClick={() => { setActiveForm("add"); setMessage(""); setSingleFare(null); }}>Add Fare</button>}
        {isAdmin() && <button className={`tab-btn ${activeForm === "update" ? "active" : ""}`} onClick={() => { setActiveForm("update"); setMessage(""); setSingleFare(null); }}>Update</button>}
        <button className={`tab-btn ${activeForm === "get" ? "active" : ""}`} onClick={() => { setActiveForm("get"); setMessage(""); setSingleFare(null); }}>Search</button>
        {isAdmin() && <button className={`tab-btn ${activeForm === "delete" ? "active" : ""}`} onClick={() => { setActiveForm("delete"); setMessage(""); setSingleFare(null); }}>Delete</button>}
      </div>

      {activeForm && (
        <div className="fare-form">
          {(activeForm === "add" || activeForm === "update") && (
            <>
              <input
                type="number"
                name="fareId"
                placeholder="Fare ID"
                value={formData.fareId}
                onChange={handleChange}
              />
              <input
                type="number"
                name="workshopId"
                placeholder="Workshop ID"
                value={formData.workshopId}
                onChange={handleChange}
              />
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
              />
            </>
          )}

          {(activeForm === "get" || activeForm === "delete") && (
            <input
              type="number"
              name="fareId"
              placeholder="Enter Fare ID"
              value={formData.fareId}
              onChange={handleChange}
            />
          )}

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

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

      {activeForm === "get" && singleFare && (
        <div className="fare-detail">
          <h3>Fare Details</h3>
          <p><strong>Fare ID:</strong> {singleFare.fareId}</p>
          <p><strong>Workshop ID:</strong> {singleFare.workshopId}</p>
          <p><strong>Price:</strong> ₹{singleFare.price}</p>
        </div>
      )}
    </div>
  );
}

export default FareOperation;
