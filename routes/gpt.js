// gpt.js (OpenAI SDK v4+)
const express = require('express');
const router = express.Router();
require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/suggest', async (req, res) => {
  try {
    const { prompt } = req.body;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ suggestion: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong with GPT API.' });
  }
});

module.exports = router;
