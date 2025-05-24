const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect("mongodb://127.0.0.1:27017/orcax-chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("🥔 감자 창고(MongoDB) 연결 성공!");
}).catch((err) => {
  console.error("❌ MongoDB 연결 실패:", err);
});

// 메시지 스키마
const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: String
});

const Message = mongoose.model("Message", messageSchema);

// 메시지 저장 (POST)
app.post("/send", async (req, res) => {
  const { sender, message, timestamp } = req.body;

  try {
    const newMessage = new Message({ sender, message, timestamp });
    await newMessage.save();
    console.log("✅ 감자 저장 완료:", sender, message);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ 감자 저장 중 오류:", error);
    res.status(500).send("서버 오류");
  }
});

// 메시지 조회 (GET)
app.get("/send", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ 메시지 조회 실패:", error);
    res.status(500).send("서버 오류");
  }
});

// 기본 라우트
app.get("/", (req, res) => {
  res.send("💬 orcax-chat-widget 서버 실행 중입니다!");
});

app.listen(PORT, () => {
  console.log(`🚀 서버 출발! 포트: ${PORT}`);
});

