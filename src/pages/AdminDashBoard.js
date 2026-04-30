import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AdminOrders.css';

const AdminDashBoard = () => {
  const user = useSelector((state) => state.auth.user);

  const [loadingAI, setLoadingAI] = useState(false);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 FIX: single backend source (NO env issues)
  const BACKEND_URL = "https://ecommerce-backend-tc68.onrender.com";

  const emptyProduct = {
    _id: null,
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    onSale: false,
    image: '',
    stock: '',
    category: '',
    ratings: '',
    materials: [],
    colors: [],
    carats: [],
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);

  /* =========================
     ADMIN PROTECTION
  ========================= */
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("Error loading products");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  /* =========================
     AI DESCRIPTION
  ========================= */
  const generateAIDescription = async () => {
    if (!newProduct.name || !newProduct.category) {
      return alert('Enter product name & category');
    }

    try {
      setLoadingAI(true);

      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${BACKEND_URL}/api/ai/generate-description`,
        {
          name: newProduct.name,
          category: newProduct.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewProduct(prev => ({
        ...prev,
        description: res.data.description,
      }));

    } catch {
      alert('AI generation failed');
    } finally {
      setLoadingAI(false);
    }
  };

  /* =========================
     ADD PRODUCT
  ========================= */
  const addProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Login required");

    try {
      await axios.post(
        `${BACKEND_URL}/api/products`,
        {
          ...newProduct,
          price: Number(newProduct.price),
          oldPrice: Number(newProduct.oldPrice),
          stock: Number(newProduct.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product added');
      setNewProduct(emptyProduct);
      fetchProducts();

    } catch {
      alert("Add failed");
    }
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const updateProduct = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${BACKEND_URL}/api/products/${newProduct._id}`,
        {
          ...newProduct,
          price: Number(newProduct.price),
          oldPrice: Number(newProduct.oldPrice),
          stock: Number(newProduct.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product updated');
      setIsEditing(false);
      setNewProduct(emptyProduct);
      fetchProducts();

    } catch {
      alert("Update failed");
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(
        `${BACKEND_URL}/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Deleted');
      fetchProducts();

    } catch {
      alert("Delete failed");
    }
  };

  const editProduct = (product) => {
    setIsEditing(true);
    setNewProduct({
      ...product,
      materials: product.materials || [],
      colors: product.colors || [],
      carats: product.carats || [],
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard</h1>

      <h4 style={styles.subHeading}>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h4>

      <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} style={styles.input} />

      <input name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} style={styles.input} />

      <button onClick={generateAIDescription} style={styles.aiButton}>
        {loadingAI ? 'Generating...' : 'Generate AI Description'}
      </button>

      <textarea name="description" value={newProduct.description} onChange={handleInputChange} style={styles.textarea} />

      <input name="price" type="number" placeholder="Price" value={newProduct.price} onChange={handleInputChange} style={styles.input} />

      <input name="image" placeholder="Image URL" value={newProduct.image} onChange={handleInputChange} style={styles.input} />

      <input name="stock" type="number" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} style={styles.input} />

      <button onClick={isEditing ? updateProduct : addProduct} style={styles.button}>
        {isEditing ? 'Update Product' : 'Add Product'}
      </button>

      <hr />

      <h3>Products</h3>

      {products.map(p => (
        <div key={p._id} style={styles.productRow}>
          <b>{p.name}</b> — ${p.price}

          <div>
            <button onClick={() => editProduct(p)}>Edit</button>
            <button onClick={() => deleteProduct(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 900, margin: 'auto' },
  heading: { textAlign: 'center' },
  subHeading: { textAlign: 'center', marginBottom: 15 },
  input: { width: '100%', padding: 12, margin: '8px 0' },
  textarea: { width: '100%', height: 120, padding: 12 },
  button: { width: '100%', padding: 12, marginTop: 10 },
  aiButton: { width: '100%', padding: 10, margin: '10px 0' },
  productRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 }
};

export default AdminDashBoard;
