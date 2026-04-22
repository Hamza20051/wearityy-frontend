import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [discountCode, setDiscountCode] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  // ✅ YOUR DETAILS
  const WHATSAPP_NUMBER = "923460051459";
  const ACCOUNT_NUMBER = "03367051459";
  const STORE_NAME = "Hafiz Hamza Khalid";

  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');

      try {
        const res = await axios.get(`${BACKEND_URL}/api/cart/${user.id}`);
        setCartItems(res.data.products || []);
      } catch (err) {
        console.error('Cart fetch failed:', err);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const validateStockBeforeCheckout = async () => {
    for (const item of cartItems) {
      const res = await axios.get(
        `${BACKEND_URL}/api/products/${item.product._id}`
      );

      if (res.data.stock < item.quantity) {
        alert(`Only ${res.data.stock} left for ${res.data.name}`);
        return false;
      }
    }
    return true;
  };

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert('You must be logged in');

    if (!name || !email || !phone || !address || !city || !postalCode) {
      return alert('Please fill in all required fields');
    }

    const isStockValid = await validateStockBeforeCheckout();
    if (!isStockValid) return;

    try {
      await axios.post(`${BACKEND_URL}/api/orders`, {
        user: user.id,
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingInfo: {
          name,
          email,
          phone,
          address,
          city,
          postalCode,
        },
        paymentMethod,
        discountCode,
        totalPrice: calculateTotal(),
      });

      await axios.delete(`${BACKEND_URL}/api/cart/${user.id}`);

      alert('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order');
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <h2>Checkout</h2>

        {/* USER INFO */}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />

        {/* PAYMENT METHOD */}
        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Cash on Delivery</option>
          <option value="SadaPay">SadaPay / NayaPay (Manual Transfer)</option>
        </select>

        {/* COD INFO */}
        {paymentMethod === 'COD' && (
          <p style={{ marginTop: "10px" }}>
            💵 Pay cash when your order is delivered.
          </p>
        )}

        {/* SADA / NAYAPAY INFO */}
        {paymentMethod === 'SadaPay' && (
          <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ddd" }}>
            <h4>📱 Manual Payment (SadaPay / NayaPay)</h4>

            <p><b>Account Number:</b> {ACCOUNT_NUMBER}</p>
            <p><b>Store Name:</b> {STORE_NAME}</p>

            <p style={{ color: "red" }}>
              ⚠ After payment, send screenshot on WhatsApp for confirmation
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "10px",
                background: "green",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                textDecoration: "none"
              }}
            >
              📲 Send Screenshot on WhatsApp
            </a>
          </div>
        )}

        {/* DISCOUNT */}
        <input
          type="text"
          placeholder="Discount Code (Optional)"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />

        {/* TOTAL */}
        <h4>Total: ${calculateTotal()}</h4>

        {/* PLACE ORDER */}
        <button className="place-order-btn" onClick={placeOrder}>
          Place Order
        </button>

      </div>
    </div>
  );
};

export default Checkout;
