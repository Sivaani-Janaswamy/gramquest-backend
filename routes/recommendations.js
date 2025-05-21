const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Recommendation 1', category: 'Tech' },
    { id: 2, title: 'Recommendation 2', category: 'Art' },
  ]);
});

module.exports = router;
