import React from "react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="order-success">
      <h1>🎉 Order Placed!</h1>

      <p>Status: Pending Verification</p>

      <p><b>SadaPay / NayaPay:</b> 03367051459</p>
      <p><b>Name:</b> Hafiz Hamza Khalid</p>

      <p style={{ color: "red" }}>
        Send payment screenshot on WhatsApp: 03460051459
      </p>

      <Link to="/">
        <button>Continue Shopping</button>
      </Link>
    </div>
  );
};

export default OrderConfirmation;
