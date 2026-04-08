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
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [discountCode, setDiscountCode] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Card + bank details
  const [bank, setBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // For card flip effect
  const [isFlipped, setIsFlipped] = useState(false);

  const navigate = useNavigate();

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
        `http://localhost:5000/api/products/${item.product._id}`
      );
  
      if (res.data.stock < item.quantity) {
        alert(
          `Stock changed! Only ${res.data.stock} left for ${res.data.name}`
        );
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

    if (paymentMethod === 'Credit Card') {
      if (!bank || !cardNumber || !expiry || !cvv) {
        return alert('Please fill in all credit card details');
      }
    }
    const isStockValid = await validateStockBeforeCheckout();
    if (!isStockValid) return;

    try {
      await axios.post('http://localhost:5000/api/orders', {
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
        bank: paymentMethod === 'Credit Card' ? bank : null,
        cardInfo:
          paymentMethod === 'Credit Card'
            ? { cardNumber, expiry, cvv }
            : null,
        totalPrice: calculateTotal(),
      });

      await axios.delete(`http://localhost:5000/api/cart/${user.id}`);
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

      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />

      <label>Payment Method</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Credit Card">Credit Card</option>
      </select>

      {paymentMethod === 'Credit Card' && (
        <div>
          {/* 3D Card Preview */}
          <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-front">
              <div className="bank-name">{bank || "Your Bank"}</div>
              <div className="card-number">
                {cardNumber ? cardNumber : "#### #### #### ####"}
              </div>
              <div className="card-footer">
                <span>{name || "Card Holder"}</span>
                <span>{expiry || "MM/YY"}</span>
              </div>
            </div>
            <div className="card-back">
              <div className="stripe"></div>
              <div className="cvv">CVV: {cvv || "***"}</div>
            </div>
          </div>

          <div className="credit-card-section">
            <label>Select Bank</label>
            <select value={bank} onChange={(e) => setBank(e.target.value)} required>
              <option value="">-- Choose Your Bank --</option>
              <option value="HBL">HBL - Habib Bank Limited</option>
              <option value="UBL">UBL - United Bank Limited</option>
              <option value="MCB">MCB - Muslim Commercial Bank</option>
              <option value="Meezan">Meezan Bank</option>
              <option value="Faysal">Faysal Bank</option>
              <option value="Allied">Allied Bank</option>
            </select>

            <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
            <input type="text" placeholder="Expiry Date (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              required
            />
          </div>
        </div>
      )}

      <input type="text" placeholder="Discount Code (Optional)" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />

      <h4>Total: ${calculateTotal()}</h4>

      <button className="place-order-btn" onClick={placeOrder}>
            Place Order
      </button>

    </div>
    
    </div>
  );
};

export default Checkout;
