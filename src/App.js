import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';

import store from './store/store';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import Header from './components/Header';
import AIChatbot from "./components/AIChatbot";

import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import SearchResults from "./pages/SearchResults";
import AdminDashBoard from './pages/AdminDashBoard';
import AdminOrders from './pages/AdminOrders';

/* =========================
   SCROLL TO TOP
========================= */
const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

/* =========================
   ADMIN ROUTE ONLY
========================= */
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />

        <div className="theme-pink">

          <Header />
          <Navbar />

          <main className="main-content">

            <Routes>

              {/* PUBLIC (NO LOGIN SYSTEM) */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/search" element={<SearchResults />} />

              {/* ADMIN ONLY */}
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

              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />

              {/* REMOVE LOGIN ROUTES (NO NEED) */}
              <Route path="*" element={<Navigate to="/" />} />

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
