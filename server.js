const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// 루트 접속 테스트
app.get('/', (req, res) => {
  res.send('💬 orcax-chat-widget 서버 실행 중입니다!');
});

// MongoDB 연결 및 서버 시작
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공 (채팅 위젯)');
    app.listen(PORT, () => {
      console.log(`💬 orcax-chat-widget 서버 포트 ${PORT}에서 실행 중`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
  });

// --- 메시지 스키마 및 라우트 추가 ---

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: String,
});

const Message = mongoose.model('Message', messageSchema);

// 메시지 저장 (POST)
app.post('/send', async (req, res) => {
  try {
    const { sender, message, timestamp } = req.body;
    const newMessage = new Message({ sender, message, timestamp });
    await newMessage.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('❌ 메시지 저장 실패:', err);
    res.status(500).json({ success: false });
  }
});

// 메시지 불러오기 (GET)
app.get('/send', async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 }).limit(50);
    res.json(messages.reverse());
  } catch (err) {
    console.error('❌ 메시지 로드 실패:', err);
    res.status(500).json([]);
  }
});

