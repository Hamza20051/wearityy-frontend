import React from 'react';
import { Link } from 'react-router-dom';


const OrderConfirmation = () => {
  return (
    <div className="order-success">
      <div className="order-card">
        <h1>🎉 Order Placed Successfully!</h1>
        <p>
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        <div className="order-actions">
          <Link to="/orders">
            <button className="view-orders">View Orders</button>
          </Link>

          <Link to="/">
            <button className="continue-shopping">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
