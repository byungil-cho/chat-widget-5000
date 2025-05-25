require("dotenv").config();
const WebSocket = require("ws");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("✅ MongoDB 연결 완료"));
db.on("error", console.error);

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model("Product", productSchema);

// 콕 메시지 서버 주소
const socket = new WebSocket(process.env.COK_URL);

socket.on("open", () => {
  console.log("📡 콕 서버 연결 성공");
});

socket.on("message", async (data) => {
  try {
    const msg = JSON.parse(data);
    const { name, qty } = msg;

    console.log(`[📨 수신] ${name} - ${qty}개`);

    await Product.updateOne(
      { name },
      {
        $inc: { quantity: qty },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    console.log(`[💾 저장 완료] ${name} 수량 반영됨`);
  } catch (err) {
    console.error("❌ 메시지 처리 에러:", err);
  }
});

socket.on("error", (err) => {
  console.error("🔥 WebSocket 연결 실패:", err);
});
