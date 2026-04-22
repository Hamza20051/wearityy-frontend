import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error('Invalid server response');
      }

      // Save auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redux update
      dispatch({
        type: 'LOGIN',
        payload: { user, token }
      });

      navigate('/');

    } catch (err) {
      console.error('Login error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password'
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Welcome Back 💖</h2>
        <p className="auth-subtitle">Login to continue shopping</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
