import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

        if (!data || data.length === 0) {
          setError("No products found.");
        }

        setProducts(data || []);

      } catch (err) {
        console.error(err);
        setError("Error fetching products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, BACKEND_URL]);

  return (
    <div className="container mt-4">
      <h2>Search Results for: "{searchQuery}"</h2>

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
