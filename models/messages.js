const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // ← 이거 꼭 필요

// 메시지 불러오기
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("메시지 불러오기 오류:", err);
    res.status(500).json({ error: '메시지를 불러오는 중 오류 발생' });
  }
});

// 메시지 저장하기
router.post('/', async (req, res) => {
  try {
    const { sender, message } = req.body;
    if (!sender || !message) {
      return res.status(400).json({ error: '보낸 사람과 메시지는 필수입니다.' });
    }

    const newMessage = new Message({ sender, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: '메시지 저장 완료' });
  } catch (err) {
    console.error("메시지 저장 오류:", err);
    res.status(500).json({ error: '메시지를 저장하는 중 오류 발생' });
  }
});

module.exports = router;
