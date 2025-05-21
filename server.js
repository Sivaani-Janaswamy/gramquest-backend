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

// Dynamic Base URL (for image URL construction)
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.BASE_URL
  : `http://localhost:${PORT}`;

// Make BASE_URL accessible in routes/controllers
app.locals.BASE_URL = BASE_URL;

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
            console.log(`✅ Server running at ${BASE_URL}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err);
    });
