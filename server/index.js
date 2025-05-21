// server/index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = 5000;

// ✅ CORS 허용 (프론트 도메인과 연결 위해 반드시 필요)
app.use(cors());

// ✅ JSON 파싱
app.use(express.json());

// ✅ 정적 파일 서빙 (index.html 등)
app.use(express.static(path.join(__dirname, '../public')));

// ✅ 메시지 라우트
app.use('/api/messages', messageRoutes);

// ✅ MongoDB 연결
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://orcax:비밀번호@cluster.mongodb.net/orcax?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Atlas 연결 성공!');
})
.catch(err => {
  console.error('❌ MongoDB 연결 오류:', err);
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
