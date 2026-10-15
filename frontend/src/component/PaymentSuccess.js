import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    
    if (bookingId) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:8082/api/bookings/${bookingId}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
        .then(res => res.json())
        .then(data => setBookingDetails(data))
        .catch(() => {});
    }
  }, [searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        overflow: "hidden",
        animation: "slideUp 0.5s ease-out"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          padding: "40px 30px",
          textAlign: "center",
          color: "white"
        }}>
          <div style={{
            fontSize: "60px",
            marginBottom: "15px",
            animation: "checkmark 0.6s ease-in-out"
          }}>✓</div>
          <h2 style={{ margin: "0", fontSize: "28px", fontWeight: "600" }}>Payment Successful!</h2>
          <p style={{ margin: "10px 0 0 0", opacity: "0.9" }}>Your booking has been confirmed</p>
        </div>

        {bookingDetails ? (
          <div style={{ padding: "30px" }}>
            <div style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px"
            }}>
              <h3 style={{
                margin: "0 0 20px 0",
                color: "#333",
                fontSize: "20px",
                borderBottom: "2px solid #28a745",
                paddingBottom: "10px"
              }}>Booking Details</h3>
              
              <div style={{ display: "grid", gap: "15px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Booking ID</span>
                  <span style={{ color: "#333", fontWeight: "600" }}>#{bookingDetails.bookingId}</span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Name</span>
                  <span style={{ color: "#333", fontWeight: "600" }}>{bookingDetails.name}</span>
                </div>
                
                {bookingDetails.title && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0"
                  }}>
                    <span style={{ color: "#666", fontWeight: "500" }}>Workshop</span>
                    <span style={{ color: "#333", fontWeight: "600" }}>{bookingDetails.title}</span>
                  </div>
                )}
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Tickets</span>
                  <span style={{ color: "#333", fontWeight: "600" }}>{bookingDetails.numberOfBooking}</span>
                </div>
                
                {bookingDetails.amount && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    border: "2px solid #28a745"
                  }}>
                    <span style={{ color: "#28a745", fontWeight: "600" }}>Amount Paid</span>
                    <span style={{ color: "#28a745", fontWeight: "700", fontSize: "18px" }}>₹{bookingDetails.amount}</span>
                  </div>
                )}
                
                {bookingDetails.status && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0"
                  }}>
                    <span style={{ color: "#666", fontWeight: "500" }}>Status</span>
                    <span style={{
                      color: "white",
                      backgroundColor: "#28a745",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}>{bookingDetails.status}</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigate("/")} 
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "16px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Go to Dashboard →
            </button>
          </div>
        ) : (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ color: "#666", fontSize: "16px" }}>Loading booking details...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentSuccess;
