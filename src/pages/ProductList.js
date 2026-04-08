import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
// At the top of ProductDetail.js or ProductList.js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = '?';
        if (sort) query += `sort=${sort}&`;
        if (categoryFilter) query += `category=${categoryFilter}&`;
        if (priceMin) query += `priceMin=${priceMin}&`;
        if (priceMax) query += `priceMax=${priceMax}&`;
        if (ratingFilter) query += `rating=${ratingFilter}&`;
        if (search) query += `search=${search}&`;

        const response = await axios.get(`${BACKEND_URL}/api/products${query}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [sort, categoryFilter, priceMin, priceMax, ratingFilter, search]);

  const categories = [
    
    'Nails',
    'Bands',
    'Rings',
    'Nackles',
    'Braclets',
    'Earrings'
  ];

  return (
    <div className="product-list-page">
      <h1>Our  Collection ✨</h1>

      {/* Search */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        

       

        <button className="clear-filters" onClick={() => {
          setSort('');
          setCategoryFilter('');
          setPriceMin('');
          setPriceMax('');
          setRatingFilter('');
          setSearch('');
        }}>Clear Filters</button>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        )}
      </div>
    </div>
  );
};

export default ProductList;
