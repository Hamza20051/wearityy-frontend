import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {

  // ⚠️ Placeholder status (replace later with backend order data if needed)
  const order = {
    status: "Pending"
  };

  return (
    <div className="order-success">
      <div className="order-card">

        <h1>🎉 Order Placed Successfully!</h1>

        {/* STATUS BADGE */}
        <span className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>

        <p>
          Thank you for your purchase. Your order has been placed successfully.
          We will process it soon.
        </p>

        <div className="order-actions">

          {/* OPTIONAL: You can remove this if /orders page is not ready */}
          <Link to="/">
            <button className="continue-shopping">
              Continue Shopping
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
