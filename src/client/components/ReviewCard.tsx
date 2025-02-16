interface ReviewCardProps {
  author: string;
  score: number;
  timestamp: string;
  content: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ author, score, timestamp, content }) => {
  return (
    <div className="review-card" 
      style={{
        border: '1px solid black',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        boxShadow: '6px 4px 4px darkgray'
      }}
    >
      <div className="review-header">
        <span className="review-author"><strong>{author} - </strong></span>
        <span className="review-score"> {'⭐'.repeat(score || 0)}</span>
        <p className="review-timestamp" style={{color: 'gray', marginTop: '0px', fontSize: '12px'}}>
          {new Date(timestamp).toLocaleString()}
        </p>
      </div>
      <p className="review-content">{content}</p>
    </div>
  );
};

export default ReviewCard;