import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AdminOrders.css';

const AdminOrders = () => {
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: hard backend URL (no env issues on Vercel)
  const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

  const WHATSAPP = "923460051459";

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Login required');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${BACKEND_URL}/api/orders/status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  /* =========================
     ADMIN PROTECTION
  ========================= */
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="container mt-4">Loading orders...</div>;

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-3 p-3">

            <h5>Order ID: {order._id}</h5>

            <p><b>Name:</b> {order.shippingInfo.name}</p>
            <p><b>Email:</b> {order.shippingInfo.email}</p>
            <p><b>Phone:</b> {order.shippingInfo.phone}</p>

            <p>
              <b>Address:</b>{" "}
              {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.postalCode}
            </p>

            <p><b>Payment:</b> {order.paymentMethod}</p>
            <p><b>Total:</b> ${order.totalPrice}</p>

            <p>
              <b>Status:</b>{" "}
              <span className={`status ${order.status || "Pending"}`}>
                {order.status || "Pending"}
              </span>
            </p>

            <h6>Products:</h6>
            <ul>
              {order.products.map((p, i) => (
                <li key={i}>
                  {p.product?.name || 'Unknown'} - Qty: {p.quantity}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "10px" }}>

              <button onClick={() => updateStatus(order._id, "Confirmed")}>
                Confirm
              </button>

              <button
                onClick={() => updateStatus(order._id, "Delivered")}
                style={{ marginLeft: "10px" }}
              >
                Delivered
              </button>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Order%20${order._id}%20is%20${order.status}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginLeft: "10px",
                  background: "green",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  textDecoration: "none"
                }}
              >
                WhatsApp
              </a>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
