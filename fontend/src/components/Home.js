import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousal from './Carousal';
import './Home.css';
import Card from './Card';
import ReactLinkify from 'react-linkify'; // Import the library

const Home = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [clothData, setClothData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const onButtonClick = () => {
    if (loggedIn) {
      navigate('/protected'); // Navigate to protected page if logged in
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    // Fetch existing comments from the backend
    fetch('http://localhost:4200/api/comments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        return response.json();
      })
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));

    // Fetch cloth data from ClothData.json
    fetch('/ClothData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setClothData(data))
      .catch(error => {
        console.error('Error fetching cloth data:', error);
      });
  }, []);

  const handleCommentSubmit = event => {
    event.preventDefault();
    if (!newComment) {
      alert('Please write a comment.');
      return;
    }

    // Send the comment to the backend
    fetch('http://localhost:4200/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: email || 'Anonymous', // Use the logged-in user's email or 'Anonymous'
        commentText: newComment,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save the comment');
        }
        return response.json();
      })
      .then(() => {
        alert('Comment added successfully!');
        setComments([
          ...comments,
          { user: email || 'Anonymous', commentText: newComment },
        ]); // Add new comment locally
        setNewComment(''); // Clear the input field
      })
      .catch(error => {
        console.error('Error saving comment:', error);
      });
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <Carousal />
        <div className="welcome-message">
          <h1>Welcome to AMEHA!</h1>
        </div>
        <div className="message-container">
          {loggedIn ? (
            <div className="logged-in-message">
              <p>
                Welcome back, <strong>{email}</strong>!
              </p>
              <p>You can access exclusive content.</p>
            </div>
          ) : (
            <p>Please SignUp to explore our exclusive collection.</p>
          )}
        </div>
        <div className="button-container">
          <button className="action-button" onClick={onButtonClick}>
            {loggedIn ? 'Access Protected Page' : 'Sign Up'}
          </button>
        </div>
      </div>

      {/* Display Cloth Data */}
      <div className="cloth-data-container">
        <h2>Available Cloths</h2>
        <div className="cloth-grid">
          {clothData.map((item, index) => (
            <div key={index} className="cloth-card">
              <img src={item.img} alt={item.name} className="img-fluid" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{item.CategoryName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <h2>Leave a Comment</h2>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="submit-comment-button">
            Submit Comment
          </button>
        </form>
      </div>

      {/* Display Comments */}
      <div className="comment-display">
        <h2>Comments</h2>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>
              <strong>{comment.user}:</strong>{' '}
              <ReactLinkify>{comment.commentText}</ReactLinkify>
            </p>
          </div>
        ))}
      </div>

      <Card />
    </div>
  );
};

export default Home;
