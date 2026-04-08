import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      setAdding(true);
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });
      alert("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Sale percentage
  const salePercentage =
    product.onSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <div className="price-row">
        {product.onSale && product.oldPrice && (
          <>
            <span className="old-price">${product.oldPrice}</span>
            <span className="sale-badge">-{salePercentage}%</span>
          </>
        )}
        <span className="current-price">${product.price}</span>
      </div>

      {product.stock > 0 ? (
        <p className="stock-info">
          {product.stock <= 5
            ? `⚠️ Only ${product.stock} left!`
            : `In stock: ${product.stock}`}
        </p>
      ) : (
        <p className="stock-info out-of-stock">Out of Stock</p>
      )}

      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={adding || product.isOutOfStock || product.stock === 0}
      >
        {product.isOutOfStock || product.stock === 0
          ? "Out of Stock"
          : adding
          ? "Adding..."
          : "Add"}
      </button>
    </div>
  );
};

export default ProductCard;
