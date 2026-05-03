import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getGuestId } from "../helpers/guest";

const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("SadaPay");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const res = await axios.get(
        `${BACKEND_URL}/api/cart/${getGuestId()}`
      );
      setCartItems(res.data.products || []);
      setLoading(false);
    };

    fetchCart();
  }, []);

  const calculateTotal = () =>
    cartItems.reduce(
      (sum, i) => sum + (i.product?.price || 0) * i.quantity,
      0
    );

  const placeOrder = async () => {
    if (cartItems.length === 0) return alert("Cart empty");

    try {
      setPlacing(true);

      const guestId = getGuestId();

      const res = await axios.post(`${BACKEND_URL}/api/orders`, {
        guestId,
        paymentMethod,
        products: cartItems.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingInfo: {
          name: "Guest User",
          email: "guest@email.com",
          phone: "000000000",
          address: "Guest Address",
          city: "N/A",
          postalCode: "00000",
        },
        totalPrice: calculateTotal(),
      });

      const orderId = res.data._id;

      // 🔥 WhatsApp message
      const msg = `Order ID: ${orderId}
Total: Rs ${calculateTotal()}
Payment via: ${paymentMethod}

Screenshot sent`;

      window.open(
        `https://wa.me/923460051459?text=${encodeURIComponent(msg)}`
      );

      await axios.delete(
        `${BACKEND_URL}/api/cart/${guestId}`
      );

      navigate("/order-confirmation");

    } catch (err) {
      alert("Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Checkout</h2>

      {/* PAYMENT OPTIONS */}
      <h3>Select Payment</h3>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="SadaPay">SadaPay</option>
        <option value="NayaPay">NayaPay</option>
        <option value="COD">Cash on Delivery</option>
      </select>

      {/* PAYMENT DETAILS */}
      <p><b>SadaPay / NayaPay:</b> 03367051459</p>
      <p><b>Name:</b> Hafiz Hamza Khalid</p>

      <p style={{ color: "red" }}>
        Send screenshot on WhatsApp: 03460051459
      </p>

      <h3>Total: Rs {calculateTotal()}</h3>

      <button onClick={placeOrder} disabled={placing}>
        {placing ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
