import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCarat, setSelectedCarat] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");

        const res = await axios.get(
          `${BACKEND_URL}/api/products/${id}`
        );

        const p = res.data;

        setProduct(p);
        setMainImage(p.images?.[0] || p.image);
        setSelectedMaterial(p.materials?.[0] || "");
        setSelectedColor(p.colors?.[0] || "");
        setSelectedCarat(p.carats?.[0] || "");

      } catch (err) {
        console.error(err);
        setError("Failed to load product. Please try again.");
      }
    };

    fetchProduct();
  }, [id, BACKEND_URL]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      setAdding(true);

      await axios.post(
        `${BACKEND_URL}/api/cart/${user.id}`,
        {
          productId: product._id,
          quantity,
          material: selectedMaterial,
          color: selectedColor,
          carat: selectedCarat,
        }
      );

      alert("Added to cart 🛒");

    } catch (err) {
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        {error}
      </div>
    );
  }

  if (!product) return <p style={{ padding: 40 }}>Loading...</p>;

  const salePercentage =
    product.onSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="product-detail-page">

      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back to products
      </button>

      <div className="product-detail-card">

        {/* IMAGE */}
        <div className="image-gallery">
          <img
            src={mainImage}
            alt={product.name}
            className="product-detail-image"
          />

          <div className="thumbnail-row">
            {(product.images?.length ? product.images : [product.image]).map(
              (img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={`thumbnail ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                />
              )
            )}
          </div>
        </div>

        {/* INFO */}
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

          {/* PRICE */}
          <div className="price-row">
            {product.onSale && product.oldPrice && (
              <>
                <span className="old-price">${product.oldPrice}</span>
                <span className="sale-badge">-{salePercentage}%</span>
              </>
            )}
            <span className="current-price">${product.price}</span>
          </div>

          {/* VARIANTS (same as yours, unchanged) */}
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

          {/* STOCK */}
          <p className="stock-info">
            {product.stock > 0
              ? product.stock <= 5
                ? `⚠️ Only ${product.stock} left in stock!`
                : `In stock: ${product.stock}`
              : "Out of Stock"}
          </p>

          {/* ADD TO CART */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {product.stock === 0
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
