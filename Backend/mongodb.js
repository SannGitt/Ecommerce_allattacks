// mongodb.js

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/')
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch(e => {
    console.log('Failed to connect to MongoDB', e);
  });

// Define the login schema
const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 5000, // Default wallet balance on signup
  },
});

// Create the login collection
const LogInCollection = mongoose.model('LogInCollection', logInSchema);

// Define the product schema
const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // Description is required
  },
  price: {
    type: Number,
    required: true, // Price is required
    min: 0, // Price cannot be negative
  },
});

// Create the product collection
const ProductCollection = mongoose.model('ProductCollection', productSchema);

// Define the comment schema
const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the comment collection
const CommentCollection = mongoose.model('CommentCollection', commentSchema);

module.exports = CommentCollection;

// Export the models
module.exports = {
  LogInCollection,
  ProductCollection,
  CommentCollection, // Added export for CommentCollection
};
