import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/actions/authActions";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      {/* ☰ Button */}
      <button className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar Menu */}
      <aside className={`lux-menu ${open ? "open" : ""}`}>

        <div className="lux-header">
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav>

          {/* PUBLIC ROUTES (NO LOGIN REQUIRED) */}
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
          <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
          <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>

          {/* ADMIN ONLY ROUTES */}
          {user?.isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
                Admin Dashboard
              </Link>

              <Link to="/admin/orders" onClick={() => setOpen(false)}>
                Orders
              </Link>
            </>
          )}

          {/* LOGOUT (ONLY IF USER EXISTS) */}
          {user && (
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          )}

        </nav>
      </aside>
    </>
  );
};

export default Navbar;
