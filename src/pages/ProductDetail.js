import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getGuestId } from "../helpers/guest";
import "./ProductDetail.css";

const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products/${id}`);

        setProduct(res.data);
        setMainImage(res.data.images?.[0] || res.data.image);
      } catch (err) {
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);

      const guestId = getGuestId();

      await axios.post(`${BACKEND_URL}/api/cart/${guestId}`, {
        productId: product._id,
        quantity,
      });

      alert("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>

      <img src={mainImage} alt="" width="300" />

      <p>${product.price}</p>

      <button onClick={handleAddToCart} disabled={adding}>
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetail;
