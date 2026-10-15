import { useState } from "react";
import "./BookingOperation.css";
import { loadStripe } from "@stripe/stripe-js";

function BookingOperation() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [activeForm, setActiveForm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    workshopId: "",
    numberOfBooking: "",
    bookingId: "",
  });

  const API_URL = "http://localhost:8082/api/bookings";
  const STRIPE_PUBLIC_KEY ="***";

  const getHeaders = (isJson = true) => {
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const isAuthenticated = () => !!localStorage.getItem("token");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddBooking = async () => {
    setMessage("");
    setBookingDetails(null);

    if (!isAuthenticated()) {
      setMessage("⚠️ Please login to make a booking.");
      return;
    }

    const username = localStorage.getItem("username");
    const payload = {
      name: username || formData.name,
      workshopId: Number(formData.workshopId),
      numberOfBooking: Number(formData.numberOfBooking),
    };

    try {
      const bookingRes = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!bookingRes.ok) {
        const text = await bookingRes.text();
        setMessage(`❌ Error: ${bookingRes.status} - ${text}`);
        return;
      }

      const bookingData = await bookingRes.json();
      setBookingDetails(bookingData);

      if (!bookingData.sessionId) {
        setMessage("⚠️ Payment session not available.");
        return;
      }

      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({
        sessionId: bookingData.sessionId,
      });

      if (error) {
        setMessage("⚠️ Stripe error: " + error.message);
      }
    } catch (err) {
      console.error(err);
      let errorMsg = "❌ Booking failed. ";
      if (err.message.includes("seats")) {
        errorMsg += "Not enough seats available. Please try with fewer tickets.";
      } else if (err.message.includes("already")) {
        errorMsg += "You have already booked this workshop.";
      } else if (err.message.includes("network") || err.message.includes("fetch")) {
        errorMsg += "Network error. Please check your connection and try again.";
      } else {
        errorMsg += "Please try again or contact support if the issue persists.";
      }
      setMessage(errorMsg);
    }
  };

  const handleSubmit = async () => {
    switch (activeForm) {
      case "add":
        await handleAddBooking();
        setFormData({
          name: "",
          workshopId: "",
          numberOfBooking: "",
          bookingId: "",
        });
        break;
      case "update":
        if (!formData.bookingId) {
          setMessage("⚠️ Enter Booking ID");
          return;
        }
        try {
          const updateRes = await fetch(`${API_URL}/${formData.bookingId}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify({
              name: formData.name,
              workshopId: Number(formData.workshopId),
              numberOfBooking: Number(formData.numberOfBooking),
            }),
          });
          if (updateRes.ok) {
            const data = await updateRes.json();
            setBookingDetails(data);
            setMessage("✅ Booking updated successfully!");
          } else {
            const txt = await updateRes.text();
            setMessage("❌ Error updating booking: " + (txt || updateRes.status));
          }
        } catch (err) {
          console.error(err);
          setMessage("⚠️ Something went wrong!");
        }
        break;
      case "get":
        if (!formData.bookingId) {
          setMessage("⚠️ Enter Booking ID");
          return;
        }
        try {
          const getRes = await fetch(`${API_URL}/${formData.bookingId}`, {
            headers: getHeaders(false),
          });
          if (getRes.ok) {
            const data = await getRes.json();
            const username = localStorage.getItem("username");
            const role = localStorage.getItem("role");
            
            // Admin can view all bookings, users can only view their own
            if (role !== "ADMIN" && data.name !== username) {
              setMessage("❌ You can only view your own bookings.");
              setBookingDetails(null);
              return;
            }
            setBookingDetails(data);
            setMessage("Booking fetched!");
          } else {
            const txt = await getRes.text();
            setMessage("❌ Error fetching booking: " + (txt || getRes.status));
          }
        } catch (err) {
          console.error(err);
          setMessage("⚠️ Something went wrong!");
        }
        break;
      case "delete":
        if (!formData.bookingId) {
          setMessage("⚠️ Enter Booking ID");
          return;
        }
        try {
          const delRes = await fetch(`${API_URL}/${formData.bookingId}`, {
            method: "DELETE",
            headers: getHeaders(false),
          });
          if (delRes.ok) {
            setBookingDetails(null);
            setMessage(`🗑️ Booking with ID ${formData.bookingId} deleted`);
          } else {
            const txt = await delRes.text();
            setMessage("❌ Error deleting booking: " + (txt || delRes.status));
          }
        } catch (err) {
          console.error(err);
          setMessage("⚠️ Something went wrong!");
        }
        break;
      default:
        return;
    }
  };

  return (
    <div className="booking-container">
      <h2 className="title">Booking Management</h2>
      <p>Manage your workshop bookings and reservations</p>

      <div className="operations-tabs">
        <button className={`tab-btn ${activeForm === "add" ? "active" : ""}`} onClick={() => { setActiveForm("add"); setMessage(""); setBookingDetails(null); }}>New Booking</button>
        <button className={`tab-btn ${activeForm === "update" ? "active" : ""}`} onClick={() => { setActiveForm("update"); setMessage(""); setBookingDetails(null); }}>Update</button>
        <button className={`tab-btn ${activeForm === "get" ? "active" : ""}`} onClick={() => { setActiveForm("get"); setMessage(""); setBookingDetails(null); }}>Search</button>
        <button className={`tab-btn ${activeForm === "delete" ? "active" : ""}`} onClick={() => { setActiveForm("delete"); setMessage(""); setBookingDetails(null); }}>Cancel</button>
      </div>

      {activeForm && (
        <div className="booking-form">
          {(activeForm === "add" || activeForm === "update") && (
            <>
              {activeForm === "update" && (
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
              )}
              <input type="number" name="workshopId" placeholder="Workshop ID" value={formData.workshopId} onChange={handleChange} />
              <input type="number" name="numberOfBooking" placeholder="Number of Booking" value={formData.numberOfBooking} onChange={handleChange} />
            </>
          )}
          {(activeForm === "update" || activeForm === "get" || activeForm === "delete") && (
            <input type="text" name="bookingId" placeholder="Enter Booking ID" value={formData.bookingId} onChange={handleChange} />
          )}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {message && (
        <div 
          className="message" 
          style={{
            background: message.includes("✅") || message.includes("fetched") || message.includes("successfully") 
              ? "#d4edda" 
              : message.includes("❌") 
              ? "#f8d7da" 
              : message.includes("⚠️") 
              ? "#fff3cd" 
              : message.includes("🗑️") 
              ? "#d1ecf1" 
              : "#e7f3ff",
            color: message.includes("✅") || message.includes("fetched") || message.includes("successfully") 
              ? "#155724" 
              : message.includes("❌") 
              ? "#721c24" 
              : message.includes("⚠️") 
              ? "#856404" 
              : message.includes("🗑️") 
              ? "#0c5460" 
              : "#004085",
            borderLeftColor: message.includes("✅") || message.includes("fetched") || message.includes("successfully") 
              ? "#28a745" 
              : message.includes("❌") 
              ? "#dc3545" 
              : message.includes("⚠️") 
              ? "#ffc107" 
              : message.includes("🗑️") 
              ? "#17a2b8" 
              : "#007bff"
          }}
        >
          {message}
        </div>
      )}

      {bookingDetails && (
        <div className="booking-detail">
          <h4>Booking Details</h4>
          <div className="detail-card">
            <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
            <p><strong>Name:</strong> {bookingDetails.name}</p>
            <p><strong>Workshop ID:</strong> {bookingDetails.workshopId}</p>
            <p><strong>Number of Booking:</strong> {bookingDetails.numberOfBooking}</p>
            {bookingDetails.amount && <p><strong>Amount:</strong> ₹{bookingDetails.amount}</p>}
            {bookingDetails.status && <p><strong>Status:</strong> {bookingDetails.status}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingOperation;
