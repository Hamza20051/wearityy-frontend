import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const qtyTimer = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  /* =========================
     FETCH CART
  ========================= */
  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/cart/${user.id}`
        );

        const products = res.data.products || [];

        setCartItems(products);

        // sync local storage
        localStorage.setItem("cart", JSON.stringify(products));

      } catch (err) {
        console.error('Failed to load cart', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [BACKEND_URL]);

  /* =========================
     UPDATE QUANTITY (DEBOUNCED)
  ========================= */
  const handleUpdateQty = (productId, newQty, stock) => {
    if (newQty < 1 || newQty > stock) return;

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    clearTimeout(qtyTimer.current);

    qtyTimer.current = setTimeout(async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id) return;

      try {
        await axios.post(
          `${BACKEND_URL}/api/cart/${user.id}`,
          {
            productId,
            quantity: newQty,
          }
        );
      } catch (err) {
        console.error('Quantity sync failed', err);
      }
    }, 400);
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const handleRemove = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/cart/${user.id}/${productId}`
      );

      const products = res.data.products || [];

      setCartItems(products);
      localStorage.setItem("cart", JSON.stringify(products));

    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  /* =========================
     CLEAR STORAGE IF EMPTY
  ========================= */
  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, [cartItems]);

  /* =========================
     TOTALS
  ========================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  /* =========================
     UI
  ========================= */
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {loading ? (
        <p className="loading-text">Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">

                <img src={item.product.image} alt={item.product.name} />

                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  <p>Price: ${item.product.price}</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        handleUpdateQty(
                          item.product._id,
                          item.quantity - 1,
                          item.product.stock
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdateQty(
                          item.product._id,
                          item.quantity + 1,
                          item.product.stock
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.product._id)}
                  >
                    Remove
                  </button>

                  {item.product.stock === 0 && (
                    <p className="out-stock">Out of stock</p>
                  )}
                </div>

              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
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
