const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ✅ Notice 모델 정의 (inline으로도 사용 가능)
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Notice = mongoose.model('Notice', noticeSchema);

// ✅ 공지사항 전체 조회
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    console.error('공지사항 조회 오류:', err);
    res.status(500).send('서버 오류');
  }
});

// ✅ 공지사항 등록
router.post('/', async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const newNotice = new Notice({ title, content, date });
    await newNotice.save();
    res.status(201).send('공지사항 등록 완료');
  } catch (err) {
    console.error('공지사항 등록 오류:', err);
    res.status(500).send('등록 실패');
  }
});

// ✅ 공지사항 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error('공지사항 삭제 오류:', err);
    res.status(500).send('삭제 실패');
  }
});

module.exports = router;
