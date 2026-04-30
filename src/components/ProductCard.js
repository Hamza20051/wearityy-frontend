import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      setAdding(true);

      // Guest cart allowed (no login required)
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingIndex = cart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // Sale calculation
  const salePercentage =
    product.onSale && product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
    >
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

      {/* STOCK STATUS */}
      {product.stock > 0 ? (
        <p className="stock-info">
          {product.stock <= 5
            ? `⚠️ Only ${product.stock} left!`
            : `In stock: ${product.stock}`}
        </p>
      ) : (
        <p className="stock-info out-of-stock">Out of Stock</p>
      )}

      {/* ADD TO CART */}
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={adding || product.stock <= 0}
      >
        {product.stock <= 0
          ? "Out of Stock"
          : adding
          ? "Adding..."
          : "Add"}
      </button>
    </div>
  );
};

export default ProductCard;
