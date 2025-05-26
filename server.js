const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const farmRoutes = require('./routes/farm');
app.use('/api/farm', farmRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch(err => console.error("MongoDB 연결 실패", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
