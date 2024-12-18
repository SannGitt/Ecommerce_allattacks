// src/components/ProductCard.js

import React, { useState, useEffect } from "react";
import CommentSection from "./CommentSection"; // Import the CommentSection component

const ProductCard = ({ product }) => {
    const [comments, setComments] = useState([]);
    
    // Fetch comments for the current product
    useEffect(() => {
        fetch(`/api/comments/${product._id}`)
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    }, [product._id]);

    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>

            {/* Display the CommentSection below the product */}
            <CommentSection productId={product._id} comments={comments} />
        </div>
    );
};

export default ProductCard;

