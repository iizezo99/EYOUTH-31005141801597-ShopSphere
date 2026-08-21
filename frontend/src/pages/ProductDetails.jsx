import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/cartContext';
import ReviewSection from '../components/ReviewSection';
import './ProductDetails.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product details.');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product);
    }
  };

  if (loading) return (
    <div className="container product-details-loading">
      <h2>Loading...</h2>
    </div>
  );

  if (error) return (
    <div className="container product-details-feedback">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
        <p style={{ marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/products">
          <button className="btn-primary">Back to Products</button>
        </Link>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container product-details-feedback">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ marginBottom: '1.5rem' }}>The product you are looking for does not exist.</p>
        <Link to="/products">
          <button className="btn-primary">Back to Products</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container product-details-page">
      <div className="card product-details-card">
        <div className="product-media-panel">
          <img
            src={product.imageUrl || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="product-details-image"
          />
          <div className="product-media-note">
            <span>Fast delivery</span>
            <p>Responsive layout keeps product media front and center on desktop and stacked cleanly on mobile.</p>
          </div>
        </div>

        <div className="product-details-content">
          <div className="product-details-breadcrumb">
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          <h1 className="product-details-title">{product.name}</h1>
          {product.category?.name && (
            <span className="product-details-badge">
              {product.category.name}
            </span>
          )}
          <h2 className="product-details-price">${product.price.toFixed(2)}</h2>
          <p className="product-details-description">{product.description}</p>

          <div className="product-details-trust">
            <div className="product-trust-item">
              <strong>Secure checkout</strong>
              <span>Protected payment flow</span>
            </div>
            <div className="product-trust-item">
              <strong>Easy returns</strong>
              <span>Simple post-purchase support</span>
            </div>
          </div>

          <div className="product-details-quantity-row">
            <label className="product-details-label">Quantity</label>
            <div className="product-quantity-control">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="product-quantity-button"
              >
                -
              </button>
              <span className="product-quantity-value">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="product-quantity-button"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-details-actions">
            <button onClick={handleAddToCart} className="btn-primary product-primary-action">
              Add to Cart
            </button>
            <Link to="/cart">
              <button className="btn-outline product-secondary-action">Go to Cart</button>
            </Link>
          </div>
        </div>
      </div>
      <ReviewSection productId={product.id} />
    </div>
  );
};

export default ProductDetails;
