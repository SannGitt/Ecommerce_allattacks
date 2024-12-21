import React from 'react';

function ProductCard({
  product,
  addToCart,
  comments,
  setComments,
  newComment,
  setNewComment,
}) {
  const handleCommentSubmit = async productId => {
    if (newComment.trim() === '') return;

    const user = 'logged-in-user'; // Replace with actual logged-in user info if needed
    const newCommentObj = { productId, comment: newComment, user };

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentObj),
      });
      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [productId]: [...(prev[productId] || []), newComment],
        }));
        setNewComment(''); // Clear the comment input after successful submission
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleKeyDown = (e, productId) => {
    if (e.key === 'Enter') {
      handleCommentSubmit(productId);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">₹{product.price}</p>
        <button onClick={() => addToCart(product)} className="add-to-cart">
          Add to Cart
        </button>
      </div>
      <div className="comment-section">
        <h4>Add a Comment</h4>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          rows="3"
          className="comment-input"
          onKeyDown={e => handleKeyDown(e, product.id)}
        />
        <button
          onClick={() => handleCommentSubmit(product.id)}
          className="submit-comment"
        >
          Submit
        </button>
        <div className="comments-list">
          {(comments[product.id] || []).map((comment, index) => (
            <p key={index} className="comment">
              {comment}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
