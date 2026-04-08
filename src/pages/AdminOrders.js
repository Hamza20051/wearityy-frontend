import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminOrders = () => {
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Always call hooks, never conditionally
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in as admin to view orders.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Redirect handled after hooks
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="container mt-4">Loading orders...</div>;
  }

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
            <p><b>Address:</b> {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.postalCode}</p>
            <p><b>Payment Method:</b> {order.paymentMethod}</p>
            <p><b>Total:</b> ${order.totalPrice}</p>
            <h6>Products:</h6>
            <ul>
              {order.products.map((p) => (
                <li key={p._id}>{p.product?.name || 'Unknown'} - Quantity: {p.quantity}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
