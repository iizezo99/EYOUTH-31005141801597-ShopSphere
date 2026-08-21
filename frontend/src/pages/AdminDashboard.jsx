import { useEffect, useState } from 'react';
import api from '../api/axios';
import './AdminDashboard.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/40';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({ users: 0, products: 0, categories: 0 });
  const [file, setFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });

  // New Category Form State
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: '',
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!file) {
      setSelectedImagePreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const fetchProducts = async () => {
    const res = await api.get('/products?limit=100');
    setProducts(res.data.data || res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setCounts(res.data.counts || { users: 0, products: 0, categories: 0 });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const hasExistingPhoto = Boolean(productForm.imageUrl?.trim());
    const hasPhoto = Boolean(file || hasExistingPhoto);

    if (!hasPhoto) {
      alert('A product photo is required. Please upload an image or provide an image URL.');
      return;
    }

    try {
      setSubmittingProduct(true);
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('description', productForm.description);
      formData.append('categoryId', productForm.categoryId);
      formData.append('imageUrl', productForm.imageUrl.trim());

      if (file) {
        formData.append('image', file);
      }

      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert(`Product ${productForm.id ? 'updated' : 'added'} successfully!`);
      resetProductForm();
      fetchProducts();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingCategory(true);
      if (categoryForm.id) {
        await api.put(`/categories/${categoryForm.id}`, {
          name: categoryForm.name,
        });
      } else {
        await api.post('/categories', {
          name: categoryForm.name,
        });
      }

      alert(`Category ${categoryForm.id ? 'updated' : 'added'} successfully!`);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
    });
    setFile(null);
    setActiveTab('products');
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
    });
    setActiveTab('categories');
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert('Error deleting product');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert('Error deleting category');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      categoryId: '',
    });
    setFile(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      id: null,
      name: '',
    });
  };

  const currentProductImage = selectedImagePreview || productForm.imageUrl || '';

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Store control center</p>
          <h1 className="page-title admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage the catalog with cleaner forms, clearer previews, and mobile-friendly actions.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{counts.users}</div>
        </div>
        <div className="card admin-stat-card">
          <div className="admin-stat-label">Total Products</div>
          <div className="admin-stat-value">{counts.products}</div>
        </div>
        <div className="card admin-stat-card">
          <div className="admin-stat-label">Total Categories</div>
          <div className="admin-stat-value">{counts.categories}</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('products')}
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
        >
          Categories
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-product-layout">
          <div className="card admin-form-card">
            <div className="admin-section-heading">
              <div>
                <h3>{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
                <p>Every product must include a photo so the storefront always looks complete.</p>
              </div>
              {productForm.id && (
                <button type="button" onClick={resetProductForm} className="btn-outline">
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleProductSubmit} className="admin-form-grid">
              <label className="admin-field">
                <span>Product Name</span>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </label>

              <label className="admin-field">
                <span>Price</span>
                <input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                  min="0.01"
                  step="0.01"
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Photo Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
                <small>Upload a product image or paste an image URL below. New products cannot be saved without a photo.</small>
              </label>

              <label className="admin-field admin-field-full">
                <span>Image URL</span>
                <input
                  type="text"
                  placeholder="https://example.com/product-photo.jpg"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Description</span>
                <textarea
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows="4"
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Category</span>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <div className="admin-form-actions admin-field-full">
                <button type="submit" className="btn-primary" disabled={submittingProduct}>
                  {submittingProduct ? 'Saving...' : productForm.id ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>

          <div className="card admin-preview-card">
            <h3>Photo Preview</h3>
            <div className="admin-image-preview">
              {currentProductImage ? (
                <img src={currentProductImage} alt={productForm.name || 'Product preview'} />
              ) : (
                <div className="admin-image-empty">
                  <span>Photo required</span>
                  <p>Add an upload or URL to preview the product card image.</p>
                </div>
              )}
            </div>
            <div className="admin-preview-meta">
              <strong>{productForm.name || 'Product name preview'}</strong>
              <span>{productForm.price ? `$${Number(productForm.price).toFixed(2)}` : '$0.00'}</span>
            </div>
          </div>

          <div className="card admin-list-card">
            <div className="admin-section-heading">
              <div>
                <h3>Manage Products</h3>
                <p>{products.length} item{products.length !== 1 ? 's' : ''} in the catalog</p>
              </div>
            </div>

            <div className="admin-product-list">
              {products.map(product => (
                <div key={product.id} className="admin-product-row">
                  <div className="admin-product-summary">
                    <img
                      src={product.imageUrl || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      className="admin-product-thumb"
                    />
                    <div>
                      <div className="admin-product-name">{product.name}</div>
                      <div className="admin-product-meta">
                        <span>${product.price.toFixed(2)}</span>
                        {product.category?.name && <span>{product.category.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <button onClick={() => handleEditProduct(product)} className="btn-outline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="admin-category-layout">
          <div className="card admin-form-card">
            <div className="admin-section-heading">
              <div>
                <h3>{categoryForm.id ? 'Edit Category' : 'Add New Category'}</h3>
                <p>Keep category names short and easy to scan in filters.</p>
              </div>
              {categoryForm.id && (
                <button type="button" onClick={resetCategoryForm} className="btn-outline">
                  Cancel edit
                </button>
              )}
            </div>
            <form onSubmit={handleCategorySubmit} className="admin-form-grid">
              <label className="admin-field admin-field-full">
                <span>Category Name</span>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </label>
              <div className="admin-form-actions admin-field-full">
                <button type="submit" className="btn-primary" disabled={submittingCategory}>
                  {submittingCategory ? 'Saving...' : categoryForm.id ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>

          <div className="card admin-list-card">
            <div className="admin-section-heading">
              <div>
                <h3>Manage Categories</h3>
                <p>{categories.length} categor{categories.length === 1 ? 'y' : 'ies'} available</p>
              </div>
            </div>
            <div className="admin-category-list">
              {categories.map(category => (
                <div key={category.id} className="admin-category-row">
                  <div className="admin-category-name">{category.name}</div>
                  <div className="admin-row-actions">
                    <button onClick={() => handleEditCategory(category)} className="btn-outline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
