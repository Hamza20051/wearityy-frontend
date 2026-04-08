import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Logo from "../assets/image/logo.jpg";
import Search from "../assets/image/search.jpg";
import { Dropdown } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = cartItems.reduce(
  (total, item) => total + (item.quantity || 1),
  0
);


  return (
    <header className="headerWrapper">

      {/* Top Strip */}
      <div className="top-strip">
        <div className="container text-center">
          <p className="mb-0" color="black">
            ⚠ Due to <b>TRAFFIC</b>, orders may proceed with slight delay
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main sticky-top">
        <div className="container d-flex align-items-center justify-content-between">

          {/* Logo */}
          <Link to="/" className="logo-section">
            <img src={Logo} alt="Logo" className="logo-image" />
            <div className="logo-text ms-3">
              <h1 className="brand-name">WEARITYY</h1>
              <p className="tagline">Jewellery Store</p>
            </div>
          </Link>

          {/* Search */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search  products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>
              <img src={Search} alt="Search" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="header-actions">

            {/* User */}
            <Dropdown>
              <Dropdown.Toggle className="user-dropdown">
                <FiUser size={18} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders">Orders</Dropdown.Item>
                <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Cart */}
            <button className="cart-btn" onClick={() => navigate("/cart")}>
              <IoCartOutline size={22} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
                )}

            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
