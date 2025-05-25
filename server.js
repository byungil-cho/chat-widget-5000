// 전체 통합된 server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 몽고 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB 연결 실패:"));
db.once("open", () => console.log("✅ MongoDB 연결 완료"));

// 메시지 스키마
const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: String,
});

const Message = mongoose.model("Message", messageSchema);

// 제품(곡물) 스키마
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

// 메시지 API
app.get("/send", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post("/send", async (req, res) => {
  const { sender, message, timestamp } = req.body;
  const msg = new Message({ sender, message, timestamp });
  await msg.save();
  res.json({ success: true });
});

// 제품 등록 API (선택적으로 사용할 수 있음)
app.post("/api/product", async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const result = await Product.updateOne(
      { name },
      {
        $inc: { quantity },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ 제품 저장 실패:", err);
    res.status(500).send("제품 저장 오류");
  }
});

// 시세 계산기 API
app.get("/api/market", async (req, res) => {
  try {
    const items = await Product.aggregate([
      { $group: { _id: "$name", total: { $sum: "$quantity" } } }
    ]);

    const totalQty = items.reduce((sum, item) => sum + item.total, 0);
    const avg = totalQty / (items.length || 1);

    const priced = items.map((item) => ({
      name: item._id,
      quantity: item.total,
      price: parseFloat((avg / item.total).toFixed(2)),
    }));

    res.json(priced);
  } catch (err) {
    console.error("❌ 시세 계산 실패:", err);
    res.status(500).send("시세 계산 중 오류");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ OrcaX 서버 실행 중: http://localhost:${PORT}`);
});
