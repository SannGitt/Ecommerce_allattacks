// src/index.js (Backend code)

const express = require("express");
const path = require("path");
const cors = require('cors');
const { LogInCollection, ProductCollection, CommentCollection } = require("./mongodb"); // Added CommentCollection

const app = express();
const port = process.env.PORT || 4200;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle signup
app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
    }

    const data = { name, password, walletBalance: 5000 }; // Default wallet balance on signup

    try {
        const existingUser = await LogInCollection.findOne({ name });
        if (existingUser) {
            if (existingUser.password === password) {
                res.send("User details already exist");
            } else {
                res.send("User already exists with a different password");
            }
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).json({ message: "User created successfully", walletBalance: data.walletBalance });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Handle login
app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });

        if (user) {
            if (user.password === req.body.password) {
                res.status(200).json({
                    message: "Login successful",
                    name: req.body.name,
                    walletBalance: user.walletBalance // Send wallet balance with login response
                });
            } else {
                res.status(401).send("Incorrect password");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Route to fetch all comments (global comments section)
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await CommentCollection.find(); // Fetch all comments
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
});

// Updated Route to post a new comment (Global Comments)
app.post('/api/comments', async (req, res) => {
    const { user, commentText } = req.body; // Removed clothId

    if (!user || !commentText) {
        return res.status(400).json({ message: "User and commentText are required" });
    }

    const newComment = new CommentCollection({
        user,
        commentText,
        date: new Date()
    });

    try {
        await newComment.save();
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving comment" });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


