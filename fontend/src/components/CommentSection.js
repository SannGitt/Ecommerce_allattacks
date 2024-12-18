import React, { useState, useEffect } from "react";

const CommentSection = () => {
    const [comments, setComments] = useState([]); // State to store all comments
    const [user, setUser] = useState(""); // State to store user input
    const [commentText, setCommentText] = useState(""); // State to store comment text
    const [error, setError] = useState(""); // Error message

    // Fetch comments from the backend
    const fetchComments = async () => {
        try {
            const response = await fetch("http://localhost:4200/api/comments");
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Submit a new comment
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !commentText) {
            setError("User and Comment are required!");
            return;
        }

        setError(""); // Clear previous errors

        try {
            const response = await fetch("http://localhost:4200/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user, commentText }),
            });

            if (response.ok) {
                setUser("");
                setCommentText("");
                fetchComments(); // Refresh comments after adding
            } else {
                const data = await response.json();
                setError(data.message || "Error adding comment");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            setError("Error connecting to the server");
        }
    };

    // Fetch comments on component mount
    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div style={styles.container}>
            <h2>Comment Section</h2>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    style={styles.input}
                />
                <textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={styles.textarea}
                />
                <button type="submit" style={styles.button}>Submit</button>
            </form>
            
            {/* Error Message */}
            {error && <p style={styles.error}>{error}</p>}
            
            {/* Comment List */}
            <div style={styles.commentList}>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} style={styles.comment}>
                            <p><strong>{comment.user}:</strong> {comment.commentText}</p>
                            <small>{new Date(comment.date).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: "50%",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
    },
    input: {
        padding: "10px",
        marginBottom: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    textarea: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        resize: "none",
        height: "80px",
        marginBottom: "10px",
    },
    button: {
        padding: "10px",
        backgroundColor: "#4caf50",
        color: "white",
        fontSize: "16px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    commentList: {
        marginTop: "20px",
    },
    comment: {
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#fff",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
};

export default CommentSection;


