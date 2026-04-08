import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
// At the top of ProductDetail.js or ProductList.js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCarat, setSelectedCarat] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const p = res.data;
        setProduct(p);
        setMainImage(p.images?.[0] || p.image);
        setSelectedMaterial(p.materials?.[0] || "");
        setSelectedColor(p.colors?.[0] || "");
        setSelectedCarat(p.carats?.[0] || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      setAdding(true);
      await axios.post(`${BACKEND_URL}/api/cart/${user.id}`, {
        productId: product._id,
        quantity,
        material: selectedMaterial,
        color: selectedColor,
        carat: selectedCarat,
      });
      alert("Added to cart 🛒");
    } catch (err) {
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p style={{ padding: 40 }}>Loading...</p>;

  // ✅ Sale percentage
  const salePercentage =
    product.onSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="product-detail-page">
      {/* 🔙 Back */}
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back to products
      </button>

      <div className="product-detail-card">
        {/* 🖼 Image Gallery */}
        <div className="image-gallery">
          <img src={mainImage} alt={product.name} className="product-detail-image" />
          <div className="thumbnail-row">
            {(product.images?.length ? product.images : [product.image]).map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* ℹ Product Info */}
        <div className="product-detail-info">
          <div className="title-row">
            <h1>{product.name}</h1>
            <button
              className={`wishlist-icon ${wishlisted ? "active" : ""}`}
              onClick={() => setWishlisted(!wishlisted)}
            >
              ♥
            </button>
          </div>

          <p>{product.description}</p>

          {/* 💰 Price */}
          <div className="price-row">
            {product.onSale && product.oldPrice && (
              <>
                <span className="old-price">${product.oldPrice}</span>
                <span className="sale-badge">-{salePercentage}%</span>
              </>
            )}
            <span className="current-price">${product.price}</span>
          </div>

          {/* 💎 Variants */}
          {product.materials?.length > 0 && (
            <div className="variant-section">
              <h4>Material</h4>
              {product.materials.map(m => (
                <button
                  key={m}
                  className={selectedMaterial === m ? "variant active" : "variant"}
                  onClick={() => setSelectedMaterial(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="variant-section">
              <h4>Color</h4>
              {product.colors.map(c => (
                <button
                  key={c}
                  className={selectedColor === c ? "variant active" : "variant"}
                  onClick={() => setSelectedColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {product.carats?.length > 0 && (
            <div className="variant-section">
              <h4>Carat</h4>
              {product.carats.map(k => (
                <button
                  key={k}
                  className={selectedCarat === k ? "variant active" : "variant"}
                  onClick={() => setSelectedCarat(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          )}

          {/* 🔎 Selection Summary */}
          <p className="selection-summary">
            {selectedMaterial} {selectedColor && "•"} {selectedColor}{" "}
            {selectedCarat && "•"} {selectedCarat}
          </p>

          {/* 📦 Delivery Info */}
          {product.deliveryInfo && (
            <div className="delivery-info">
              <p>🚚 {product.deliveryInfo.deliveryTime}</p>
              <p>🔄 {product.deliveryInfo.returnPolicy}</p>
              <p>📜 {product.deliveryInfo.certification}</p>
            </div>
          )}

          {/* ⭐ Reviews */}
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <p>⭐ {product.ratings || 0} / 5</p>
            <p>No reviews yet</p>
          </div>

          {/* 🔢 Quantity */}
          <div className="quantity-box">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock || 1, q + 1))}
            >
              +
            </button>
          </div>

          {/* 🔢 Stock Info */}
          {product.stock > 0 ? (
            <p className="stock-info">
              {product.stock <= 5
                ? `⚠️ Only ${product.stock} left in stock!`
                : `In stock: ${product.stock}`}
            </p>
          ) : (
            <p className="stock-info out-of-stock">Out of Stock</p>
          )}

          {/* 🛒 Add to Cart */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={adding || product.isOutOfStock || product.stock === 0}
          >
            {product.isOutOfStock || product.stock === 0
              ? "Out of Stock"
              : adding
              ? "Adding..."
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
