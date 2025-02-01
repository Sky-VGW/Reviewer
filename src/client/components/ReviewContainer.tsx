import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import type { AppStoreReview } from '../../server/types.js';

const ReviewContainer: React.FC = () => {
  const [reviews, setReviews] = useState<AppStoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchReviews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2>Recent Reviews ({ reviews.length })</h2>
      <div className="reviews-container" style={{ overflow: 'auto', maxHeight: '700px' }}>
        {reviews.length === 0 ? (
          <p>No recent reviews found</p>
        ) : (
          reviews.map(review => (
            <ReviewCard
              key={review.id}
              author={review.author}
              score={review.score}
              timestamp={review.timestamp}
              content={review.content}
            />
          ))
        )}
      </div>
    </>
  );
};

export default ReviewContainer;