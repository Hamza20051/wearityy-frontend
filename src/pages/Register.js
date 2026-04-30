import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Guest Checkout Enabled 🛒</h2>

        <p>
          Customer registration is disabled.
          You can shop directly without an account.
        </p>

        <Link to="/products">
          <button>Go Shopping</button>
        </Link>

        <p style={{ marginTop: "10px" }}>
          Already an admin? <Link to="/login">Admin Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
