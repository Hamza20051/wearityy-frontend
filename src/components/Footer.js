import React, { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaTags, FaTruck, FaGem, FaGift } from "react-icons/fa";
const Footer = () => {
  const [email, setEmail] = useState("");

  // Updated handleSubscribe to call backend API
  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEmail(""); // clear input
      } else {
        alert(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe. Try again later.");
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">

        {/* Top Info */}
        <div className="topInfo row text-center">
          <div className="col info-card">
          <FaGem size={28} color="#8b5e3c" />
            <p>Elegant Earrings</p>
          </div>
          <div className="col info-card">
          <FaGift size={28} color="#8b5e3c" />
            <p>Beautiful Bracelets</p>
          </div>
          <div className="col info-card">
          <FaTags size={28} color="#8b5e3c" />
            <p>Exclusive Discounts</p>
          </div>
          <div className="col info-card">
          <FaTruck size={28} color="#8b5e3c" />
            <p>Fast Delivery Across Pakistan</p>
          </div>
        </div>

        {/* Links */}
        <div className="row mt-5 linksWrap">
          <div className="col">
            <h5>Earrings</h5>
            <ul>
              <li><Link to="#">Studs</Link></li>
              <li><Link to="#">Hoops</Link></li>
              <li><Link to="#">Long Earrings</Link></li>
            </ul>
          </div>

          <div className="col">
            <h5>Bracelets</h5>
            <ul>
              <li><Link to="#">Gold</Link></li>
              <li><Link to="#">Silver</Link></li>
              <li><Link to="#">Diamond</Link></li>
            </ul>
          </div>

          <div className="col">
            <h5>Necklaces</h5>
            <ul>
              <li><Link to="#">Chokers</Link></li>
              <li><Link to="#">Pendants</Link></li>
              <li><Link to="#">Chains</Link></li>
            </ul>
          </div>

          <div className="col">
            <h5>Rings</h5>
            <ul>
              <li><Link to="#">Solitaire</Link></li>
              <li><Link to="#">Stackable</Link></li>
              <li><Link to="#">Engagement</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="row mt-5 newsletter-social text-center">
          <div className="col-md-6 mb-3">
            <h5>Subscribe to our Newsletter</h5>
            <div className="subscribe-section">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>

          <div className="col-md-6">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/wearityy?igsh=Z3UybG5jcnB2aXhv&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@wearityy0?_r=1&_t=ZS-939AXt5uaN3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4 copyright">
          <div className="col text-center">
            <p>© 2026 Wearityy Jewelry. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
