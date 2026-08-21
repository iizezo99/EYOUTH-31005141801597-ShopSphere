import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/100';

const Cart = () => {
  const { cart, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(item.productId);
    } else if (newQuantity > item.quantity) {
      addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
      });
    } else {
      // For decrease, we'd need backend support for updating quantity, so we'll just remove and re-add for now
      // But for simplicity, let's just remove and re-add delta times
      // Alternatively, handle this in cart context
      // For now, just remove and re-add
      removeFromCart(item.productId);
      for (let i = 0; i < newQuantity; i++) {
        addToCart({
          id: item.productId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Please Login</h2>
          <p style={{ marginBottom: '1.5rem' }}>You need to be logged in to view your cart.</p>
          <Link to="/">
            <button className="btn-primary">Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
          <p style={{ marginBottom: '1.5rem' }}>Add some products to your cart to get started!</p>
          <Link to="/products">
            <button className="btn-primary">Browse Products</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          {cart.items.map(item => (
            <div key={item._id || item.productId} className="card" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', alignItems: 'center' }}>
              <img
                src={item.imageUrl || PLACEHOLDER_IMAGE}
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.3rem' }}>{item.name}</h3>
                <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '1.1rem' }}>${item.price.toFixed(2)} each</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleQuantityChange(item, -1)}
                  style={{ padding: '0.3rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, 1)}
                  style={{ padding: '0.3rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  style={{ color: '#dc2626', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '1rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Order Summary</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <button className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }}>
                Proceed to Checkout
              </button>
            </Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#3b82f6', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
