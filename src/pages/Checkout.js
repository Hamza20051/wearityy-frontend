import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 🔥 FIX: hard backend URL (no env issues)
const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

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

  const WHATSAPP_NUMBER = "923460051459";
  const ACCOUNT_NUMBER = "03367051459";
  const STORE_NAME = "Hafiz Hamza Khalid";

  // 🛒 GUEST ID SYSTEM
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const guestId = getGuestId();

        const res = await axios.get(
          `${BACKEND_URL}/api/cart/${guestId}`
        );

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
    if (!name || !email || !phone || !address || !city || !postalCode) {
      return alert('Please fill in all required fields');
    }

    const isStockValid = await validateStockBeforeCheckout();
    if (!isStockValid) return;

    try {
      const guestId = getGuestId();

      await axios.post(`${BACKEND_URL}/api/orders`, {
        guestId,
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

      await axios.delete(`${BACKEND_URL}/api/cart/${guestId}`);

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

        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />

        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Cash on Delivery</option>
          <option value="SadaPay">SadaPay / NayaPay</option>
        </select>

        {paymentMethod === 'SadaPay' && (
          <div style={{ marginTop: "10px" }}>
            <p><b>Account:</b> {ACCOUNT_NUMBER}</p>
            <p><b>Store:</b> {STORE_NAME}</p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              Send Payment Screenshot
            </a>
          </div>
        )}

        <input
          type="text"
          placeholder="Discount Code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />

        <h4>Total: ${calculateTotal()}</h4>

        <button className="place-order-btn" onClick={placeOrder}>
          Place Order
        </button>

      </div>
    </div>
  );
};

export default Checkout;
