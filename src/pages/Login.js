import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     LOGIN HANDLER (DISABLED FOR USERS)
  ========================= */
  const handleLogin = (e) => {
    e.preventDefault();

    setError("User login is disabled. Admin access only.");
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Admin Access 🔐</h2>
        <p className="auth-subtitle">
          This login is for admin only
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>

        <p className="auth-footer">
          Customer login is disabled — use guest checkout
        </p>

      </div>
    </div>
  );
};

export default Login;
