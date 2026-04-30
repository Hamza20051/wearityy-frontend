import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  // 🔥 Hard backend URL (avoids env issues)
  const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/products?search=${encodeURIComponent(searchQuery)}`
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        setProducts(data || []);

        if (!data || data.length === 0) {
          setError("No products found.");
        }

      } catch (err) {
        console.error(err);
        setError("Error fetching products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="container mt-4">

      <h2>Search Results: "{searchQuery}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3" key={product._id}>
              <div className="card mb-4">

                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                />

                <div className="card-body">
                  <h5>{product.name}</h5>
                  <p>${product.price}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SearchResults;
