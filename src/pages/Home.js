import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // 🔥 FIX: hard backend URL (no env issues)
  const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = '';
        if (categoryFilter) query = `?category=${categoryFilter}`;

        const response = await axios.get(
          `${BACKEND_URL}/api/products${query}`
        );

        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true
  };

  const categories = ["Earrings", "Rings", "Necklaces", "Bracelets", "Bands"];

  return (
    <div className="home-wrapper">

      {/* HERO SLIDER */}
      <section className="hero-slider">
        <Slider {...sliderSettings}>
          <div className="slider-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAs44qzUuTYMl2ZrLDT-6djaZB4iPfoYvs2g&s" alt="banner1" />
          </div>

          <div className="slider-item">
            <img src="https://akns-images.eonline.com/eol_images/Entire_Site/20221119/rs_1024x759-221219151049-What-to-Buy-With-Sephora-Gift-Cards-2.jpg" alt="banner2" />
          </div>

          <div className="slider-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Si_CYcApyyZVjdTLLDiXK365zqm3ODBWwQ&s" alt="banner3" />
          </div>
        </Slider>
      </section>

      {/* PROMO */}
      <div className="promo-banner mt-4">
        <h4>ALL NEW DROPS ARE AVAILABLE</h4>
      </div>

      {/* CATEGORIES */}
      <section className="categories mt-5">
        <h2>Shop by Category</h2>

        <div className="category-buttons mt-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}

          <button
            className="category-btn reset"
            onClick={() => setCategoryFilter('')}
          >
            All
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="featured-products mt-5">
        <h2>Featured Products</h2>

        <div className="products-grid mt-3">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
