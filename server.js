
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

// ✅ 감시용 ping 라우터
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// ✅ 메시지 수신 라우터 예시
app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;
  console.log(`📨 메시지 도착: ${name} - ${message}`);
  res.status(200).json({ success: true, msg: "메시지 전송 완료" });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 콕 서버 작동 중: http://localhost:${PORT}`);
});
