const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const {
  LogInCollection,
  ProductCollection,
  CommentCollection,
} = require('./mongodb');

const app = express();
const port = process.env.PORT || 4200; // Backend port

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies
  })
);

// Set up express-session
app.use(
  session({
    secret: 'your-secret-key', // Use a secure secret key in production
    resave: false, // Avoid resaving session if not modified
    saveUninitialized: true, // Save session even if not initialized
    cookie: { secure: false }, // Set secure: true in production with HTTPS
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Test route for checking server health
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Handle signup
app.post('/signup', async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  const data = { name, password, walletBalance: 5000 };

  try {
    const existingUser = await LogInCollection.findOne({ name });
    if (existingUser) {
      if (existingUser.password === password) {
        res.send('User details already exist');
      } else {
        res.send('User already exists with a different password');
      }
    } else {
      await LogInCollection.insertMany([data]);
      res.status(201).json({
        message: 'User created successfully',
        walletBalance: data.walletBalance,
      });
    }
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const user = await LogInCollection.findOne({ name: req.body.name });

    if (user) {
      if (user.password === req.body.password) {
        req.session.user = {
          name: user.name,
          walletBalance: user.walletBalance,
        };

        res.status(200).json({
          message: 'Login successful',
          name: user.name,
          walletBalance: user.walletBalance,
        });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Handle protected endpoint
app.get('/protected-endpoint', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ message: 'Welcome to the protected page!' });
  } else {
    res.status(401).json({ message: 'ACCESS GRANTED FOR USER' });
  }
});

// Route to fetch all comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await CommentCollection.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Route to post a new comment
app.post('/api/comments', async (req, res) => {
  const { user, commentText } = req.body;

  if (!user || !commentText) {
    return res
      .status(400)
      .json({ message: 'User and commentText are required' });
  }

  const newComment = new CommentCollection({
    user,
    commentText,
    date: new Date(),
  });

  try {
    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Error saving comment' });
  }
});

// Serve the React app for other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
