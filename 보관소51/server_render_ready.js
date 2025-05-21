
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

// 메시지를 저장할 배열 (메모리 저장 방식)
let messages = [];

// 루트 확인용
app.get("/", (req, res) => {
  res.send("✅ OrcaX 서버 정상 작동 중! Render에서 잘 실행되고 있습니다.");
});

// 메시지 가져오기
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// 메시지 전송
app.post("/api/messages", (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: "sender와 message는 필수입니다." });
  }
  messages.push({ sender, message });
  res.status(201).json({ success: true });
});

// 서버 실행
app.listen(port, () => {
  console.log(`🚀 OrcaX 서버 실행 중: 포트 ${port}`);
});
