interface ReviewCardProps {
  author: string;
  score: number;
  timestamp: string;
  content: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ author, score, timestamp, content }) => {
  return (
    <div className="review-card" style={{border: '1px solid black', padding: '10px', margin: '10px', borderRadius: '5px'}}>
      <div className="review-header">
        <span className="author"><strong>{author}</strong></span>
        <span className="score"> {'⭐'.repeat(score || 0)}</span>
        <p className="timestamp">
          {new Date(timestamp).toLocaleString()}
        </p>
      </div>
      <p className="content">{content}</p>
    </div>
  );
};

export default ReviewCard;