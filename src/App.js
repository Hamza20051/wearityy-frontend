import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import AIChatbot from "./components/AIChatbot";
import store from './store/store';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import Header from './components/Header';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderConfirmation from './pages/OrderConfirmation';
import SearchResults from "./pages/SearchResults";
import AdminDashBoard from './pages/AdminDashBoard';
import AdminOrders from './pages/AdminOrders';

// Scroll to top on route change
const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Private route for logged-in users
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

// Admin route for admin users
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <div className="theme-pink"> {/* Global makeup theme wrapper */}
          <Header />
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Protected Routes */}
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashBoard />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              
              <Route
                path="/admin/users"
                element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
                />
            </Routes>
          </main>
          <AIChatbot />
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
