import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import './ReviewSection.css';

const REVIEW_API_URL = import.meta.env.VITE_REVIEW_API_URL || '';

const Stars = ({ value, onChange, interactive = false }) => {
  const [hoveredValue, setHoveredValue] = useState(0);
  const displayValue = interactive && hoveredValue ? hoveredValue : value;

  return (
  <div
    className={`review-stars${interactive ? ' review-stars-interactive' : ''}`}
    aria-label={`${value} out of 5 stars`}
    onMouseLeave={() => interactive && setHoveredValue(0)}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`review-star${star <= displayValue ? ' is-selected' : ''}`}
        onClick={() => interactive && onChange(star)}
        onMouseEnter={() => interactive && setHoveredValue(star)}
        onFocus={() => interactive && setHoveredValue(star)}
        onBlur={() => interactive && setHoveredValue(0)}
        aria-label={`${star} star${star === 1 ? '' : 's'}`}
        disabled={!interactive}
      >
        ★
      </button>
    ))}
  </div>
  );
};

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadReviews = async () => {
    if (!REVIEW_API_URL) {
      setMessage('Reviews are not configured for this deployment.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${REVIEW_API_URL}/reviews/${productId}`);
      if (!response.ok) throw new Error('Unable to load reviews');
      setReviews(await response.json());
    } catch (error) {
      console.error('Review loading failed:', error);
      setMessage('Reviews are temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setMessage('');
    loadReviews();
  }, [productId]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) return setMessage('Please sign in before submitting a review.');
    if (!REVIEW_API_URL) return setMessage('Reviews are not configured for this deployment.');
    if (!rating) return setMessage('Please select a star rating.');
    if (!comment.trim()) return setMessage('Please write a short review.');

    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetch(`${REVIEW_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: String(productId),
          userId: String(user.id || user.email),
          rating,
          comment: comment.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit review');
      setReviews((current) => [data, ...current]);
      setRating(0);
      setComment('');
      setMessage('Thank you for your review.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card review-section" aria-labelledby="reviews-title">
      <div className="review-section-header">
        <div>
          <p className="review-eyebrow">Customer feedback</p>
          <h2 id="reviews-title">Reviews and ratings</h2>
        </div>
        {reviews.length > 0 && (
          <span className="review-count">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
        )}
      </div>

      {loading ? <p className="review-muted">Loading reviews...</p> : reviews.length === 0 ? (
        <p className="review-muted">No reviews yet. Be the first to rate this product.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <article className="review-item" key={review._id}>
              <div className="review-item-topline">
                <Stars value={review.rating} />
                <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      )}

      <form className="review-form" onSubmit={submitReview}>
        <h3>Leave a review</h3>
        <label>
          Rating
          <Stars value={rating} onChange={setRating} interactive />
        </label>
        <label>
          Comment
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            placeholder={user ? 'Share your experience...' : 'Sign in to leave a review'}
            disabled={!user || submitting}
            rows="4"
          />
        </label>
        <div className="review-form-footer">
          {message && <p className="review-message" role="status">{message}</p>}
          <button className="btn-primary" type="submit" disabled={!user || submitting}>
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewSection;
