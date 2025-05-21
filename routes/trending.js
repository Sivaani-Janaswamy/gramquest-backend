const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Trending Post 1', likes: 150 },
    { id: 2, title: 'Trending Post 2', likes: 120 },
  ]);
});

module.exports = router;
