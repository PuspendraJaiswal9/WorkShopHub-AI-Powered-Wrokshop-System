import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
    <div style={{
      textAlign: "center",
      marginTop: "150px",
      color: "#dc3545",
      fontFamily: "Poppins"
    }}>
      <h2>❌ Payment Cancelled!</h2>
      <p>Redirecting you to home...</p>
    </div>
  );
}

export default PaymentCancel;
