const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(30);
  res.json(messages);
});

router.post('/', async (req, res) => {
  const { nickname, content, type } = req.body;
  const newMsg = new Message({ nickname, content, type });
  await newMsg.save();
  res.status(201).json(newMsg);
});

module.exports = router;
