import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getGuestId } from "../helpers/guest";
import "./Cart.css";

const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH CART
  ========================= */
  const fetchCart = async () => {
    try {
      const guestId = getGuestId();

      const res = await axios.get(
        `${BACKEND_URL}/api/cart/${guestId}`
      );

      setCartItems(res.data.products || []);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGuestId(); // ensure ID exists
    fetchCart();
  }, []);

  /* =========================
     UPDATE QUANTITY (FIXED)
  ========================= */
  const updateQty = async (productId, newQty, currentQty) => {
    if (newQty < 1) return;

    try {
      const guestId = getGuestId();

      const diff = newQty - currentQty;

      await axios.post(`${BACKEND_URL}/api/cart/${guestId}`, {
        productId,
        quantity: diff, // ✅ correct logic
      });

      fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeItem = async (productId) => {
    try {
      const guestId = getGuestId();

      await axios.delete(
        `${BACKEND_URL}/api/cart/${guestId}/${productId}`
      );

      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  /* =========================
     TOTAL PRICE
  ========================= */
  const total = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.price || 0) * item.quantity,
    0
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                
                <img
                  src={item.product.image}
                  alt={item.product.name}
                />

                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  <p>${item.product.price}</p>

                  {/* QUANTITY CONTROL */}
                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        updateQty(
                          item.product._id,
                          item.quantity - 1,
                          item.quantity
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQty(
                          item.product._id,
                          item.quantity + 1,
                          item.quantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>

                  {/* STOCK WARNING */}
                  {item.product.isOutOfStock && (
                    <p className="out-stock">Out of stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <button className="checkout-button">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
