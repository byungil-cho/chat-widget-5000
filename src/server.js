const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

let messages = [];

app.get("/", (req, res) => {
  res.send("✅ OrcaX 채팅 서버 작동 중 (테스트용)");
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { sender, message, timestamp } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: "sender와 message는 필수입니다." });
  }
  messages.push({ sender, message, timestamp });
  res.status(201).json({ success: true });
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: 포트 ${port}`);
});