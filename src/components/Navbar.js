import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/actions/authActions";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    setOpen(false);
  };

  const categories = [
    "Rings",
    "Earrings",
    "Necklaces",
    "Bracelets"
  ];

  return (
    <>
      {/* ☰ Button */}
      <button className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`lux-menu ${open ? "open" : ""}`}>

        <div className="lux-header">
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav>

          {/* HOME */}
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          {/* =========================
              PRODUCTS DROPDOWN
          ========================= */}
          <div
            className="dropdown-parent"
            onClick={() => setShowProducts(!showProducts)}
          >
            Products ▾
          </div>

          {showProducts && (
            <div className="dropdown-child">

              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  onClick={() => setOpen(false)}
                >
                  {cat}
                </Link>
              ))}

            </div>
          )}

          {/* CART + CHECKOUT (GUEST ACCESS) */}
          <Link to="/cart" onClick={() => setOpen(false)}>
            Cart
          </Link>

          <Link to="/checkout" onClick={() => setOpen(false)}>
            Checkout
          </Link>

          {/* ADMIN ONLY */}
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

          {/* LOGOUT */}
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
