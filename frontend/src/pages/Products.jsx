import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import './Products.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

const ProductSkeleton = () => (
  <div className="skeleton-card" data-testid="product-skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

const truncateDescription = (description = '') => {
  if (description.length <= 90) return description;
  return `${description.slice(0, 87)}...`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (activeSearch) params.append('search', activeSearch);
    if (categoryId) params.append('categoryId', categoryId);
    params.append('sortBy', sortBy);
    params.append('order', order);
    params.append('page', page);
    params.append('limit', 8);

    api.get(`/products?${params.toString()}`)
      .then(res => {
        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalProducts(res.data.pagination.total);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, [activeSearch, categoryId, sortBy, order, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput('');
    setActiveSearch('');
    setCategoryId('');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  const hasFilters = activeSearch || categoryId;

  return (
    <div className="container products-page">
      <section className="products-hero">
        <div className="products-header">
          <p className="products-eyebrow">Curated catalog</p>
          <h2 className="page-title">Our Products</h2>
          <p>Browse our full catalog with faster search, clearer filters, and cleaner product cards that work better on every screen size.</p>
        </div>
        <div className="products-highlight-card">
          <div className="products-highlight-stat">
            <strong>{totalProducts || products.length}</strong>
            <span>Products</span>
          </div>
          <div className="products-highlight-stat">
            <strong>{categories.length}</strong>
            <span>Categories</span>
          </div>
          <div className="products-highlight-copy">
            <span>Tip</span>
            <p>Use search for product names and category filters together to narrow the list quickly.</p>
          </div>
        </div>
      </section>

      <div className="products-toolbar">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Search products"
          />
          <button onClick={handleSearch} className="btn-primary search-button">
            Search
          </button>
        </div>

        <div className="products-controls">
          <select
            className="category-select"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="toolbar-select"
          >
            <option value="createdAt">Date Added</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>

          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="toolbar-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {hasFilters && (
          <button onClick={handleClear} className="btn-outline products-clear-button">
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div className="products-error">
          {error}
          <button onClick={fetchProducts} className="btn-primary">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="products-meta">
          <div className="products-meta-primary">
            <span data-testid="product-count">
              {hasFilters
                ? `Found ${totalProducts} product${totalProducts !== 1 ? 's' : ''}`
                : `Showing all ${totalProducts} product${totalProducts !== 1 ? 's' : ''}`}
            </span>
            {activeSearch && <span className="products-chip">Search: &ldquo;{activeSearch}&rdquo;</span>}
            {categoryId && (
              <span className="products-chip">
                Category: {categories.find(cat => cat.id === categoryId)?.name || 'Selected'}
              </span>
            )}
          </div>
          <span className="products-meta-secondary">
            Sorted by {sortBy === 'createdAt' ? 'date added' : sortBy} ({order === 'desc' ? 'descending' : 'ascending'})
          </span>
        </div>
      )}

      {loading ? (
        <div className="products-loading grid-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
          <button onClick={handleClear} className="btn-primary">
            Show all products
          </button>
        </div>
      ) : (
        <div className="products-grid grid-3" data-testid="products-grid">
          {products.map(product => (
            <article key={product.id} className="product-card card">
              <div className="product-image-wrap">
                <img
                  src={product.imageUrl || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  loading="lazy"
                />
                {product.category?.name && (
                  <span className="product-badge">{product.category.name}</span>
                )}
              </div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <p className="product-description">{truncateDescription(product.description)}</p>
                <div className="product-footer">
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
                <Link to={`/product/${product.id}`}>
                  <button className="btn-primary product-card-button">View Details</button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="btn-outline"
          >
            Previous
          </button>
          <span style={{ fontWeight: 600 }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
import React from 'react';
