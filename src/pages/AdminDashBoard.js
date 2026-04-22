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
    deliveryInfo: {
      deliveryTime: '',
      returnPolicy: '',
      certification: '',
    }
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);

  /* =========================
     FETCH PRODUCTS (SAFE)
  ========================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("Error loading products");
    }
  };

  /* =========================
     ADMIN PROTECTION
  ========================= */
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

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
      if (!token) return alert("Login required");

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-description`,
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
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
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
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const updateProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Login required");

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${newProduct._id}`,
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
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;

    const token = localStorage.getItem('token');
    if (!token) return alert("Login required");

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* =========================
     EDIT PRODUCT
  ========================= */
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

      {/* INPUTS */}
      <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} style={styles.input} />

      <input placeholder="Materials" value={(newProduct.materials || []).join(',')} onChange={e =>
        setNewProduct(p => ({ ...p, materials: e.target.value.split(',').map(v => v.trim()) }))
      } style={styles.input} />

      <input placeholder="Colors" value={(newProduct.colors || []).join(',')} onChange={e =>
        setNewProduct(p => ({ ...p, colors: e.target.value.split(',').map(v => v.trim()) }))
      } style={styles.input} />

      <input placeholder="Carats" value={(newProduct.carats || []).join(',')} onChange={e =>
        setNewProduct(p => ({ ...p, carats: e.target.value.split(',').map(v => v.trim()) }))
      } style={styles.input} />

      <input type="number" placeholder="Old Price" value={newProduct.oldPrice} onChange={e =>
        setNewProduct(p => ({ ...p, oldPrice: e.target.value }))
      } style={styles.input} />

      <label>
        <input type="checkbox" checked={newProduct.onSale} onChange={e =>
          setNewProduct(p => ({ ...p, onSale: e.target.checked }))
        } />
        On Sale
      </label>

      <input name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} style={styles.input} />

      <button onClick={generateAIDescription} style={styles.aiButton}>
        {loadingAI ? '✨ Generating...' : '🤖 Generate AI Description'}
      </button>

      <textarea name="description" value={newProduct.description} onChange={handleInputChange} style={styles.textarea} />

      <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} style={styles.input} />
      <input name="image" placeholder="Image URL" value={newProduct.image} onChange={handleInputChange} style={styles.input} />
      <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} style={styles.input} />

      <button onClick={isEditing ? updateProduct : addProduct} style={styles.button}>
        {isEditing ? '💾 Update Product' : '➕ Add Product'}
      </button>

      <hr />

      <h3>Existing Products</h3>

      {products.map(p => (
        <div key={p._id} style={styles.productRow}>
          <b>{p.name}</b> — ${p.price}

          <div>
            <button onClick={() => editProduct(p)}>✏️</button>
            <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: 8 }}>🗑</button>
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
