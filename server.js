const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./database/connect');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const gspaceRoutes = require('./routes/gspaceRoutes');
const recommendationRoutes = require('./routes/recommendations');
const trendingRoutes = require('./routes/trending');
const gptRoutes = require('./routes/gpt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gspaces', gspaceRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/gpt', gptRoutes);
console.log('API Posts Route Loaded');

// Home route
app.get('/', (req, res) => {
    res.send('🚀 Server is running and connected to MongoDB!');
});

// Connect to DB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err);
    });
