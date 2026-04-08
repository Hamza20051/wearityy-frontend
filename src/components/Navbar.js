import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/actions/authActions";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      {/* ☰ */}
      <button className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Menu */}
      <aside className={`lux-menu ${open ? "open" : ""}`}>
        <div className="lux-header">
          
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setOpen(false)}>Products</Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
              <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>

              {user?.isAdmin && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)}>Admin</Link>
                  <Link to="/admin/orders" onClick={() => setOpen(false)}>Orders</Link>
                </>
              )}

              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
