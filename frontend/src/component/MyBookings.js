import { useState, useEffect } from "react";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8082/api/bookings/my-bookings";

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleDelete = (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8082/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setBookings(bookings.filter((b) => b.bookingId !== bookingId));
          alert("✅ Booking cancelled successfully!");
        } else {
          alert("❌ Failed to cancel booking. Please try again.");
        }
      })
      .catch(() => {
        alert("❌ Error cancelling booking. Please try again.");
      });
  };

  const fetchMyBookings = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    console.log("Fetching bookings for username:", username, "Role:", role);

    if (!token || !username) {
      setError("Please login to view your bookings");
      setLoading(false);
      return;
    }

    // Admin can see all bookings, users see only their own
    const url = role === "ADMIN" 
      ? "http://localhost:8082/api/bookings" 
      : `${API_URL}?username=${encodeURIComponent(username)}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        console.log("Bookings received:", data);
        setBookings(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError("Unable to load your bookings. Please try again later.");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="my-bookings-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="header-section">
        <h2>📅 {localStorage.getItem("role") === "ADMIN" ? "All Bookings" : "My Bookings"}</h2>
        <p>{localStorage.getItem("role") === "ADMIN" ? "View and manage all workshop bookings" : "View and manage your workshop bookings"}</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎪</div>
          <h3>No Bookings Yet</h3>
          <p>You haven't booked any workshops yet. Start exploring!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div className="booking-header">
                <span className="booking-id">#{booking.bookingId}</span>
                <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-content">
                <h3>{booking.title}</h3>
                {localStorage.getItem("role") === "ADMIN" && (
                  <div className="user-badge">
                    <span className="icon">👤</span>
                    <span>{booking.name}</span>
                  </div>
                )}
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="icon">📍</span>
                    <span>{booking.venue}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">📅</span>
                    <span>{booking.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">🕐</span>
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon">🎟️</span>
                    <span>{booking.numberOfBooking} Ticket(s)</span>
                  </div>
                  <div className="detail-row amount">
                    <span className="icon">💰</span>
                    <span className="price">₹{booking.amount}</span>
                  </div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(booking.bookingId)}
                >
                  🗑️ Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
