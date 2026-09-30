const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

router.post("/", async (req, res) => {
  try {
    const {
      studentName,
      examId,
      examTitle,
      score,
      totalQuestions
    } = req.body;

    if (!studentName || !examId || !examTitle) {
      return res.status(400).json({
        message: "studentName, examId and examTitle are required"
      });
    }

    const safeScore = Number(score) || 0;
    const safeTotal = Number(totalQuestions) || 0;

    const percentage =
      safeTotal > 0
        ? Number(((safeScore / safeTotal) * 100).toFixed(2))
        : 0;

    const status = percentage >= 40 ? "PASS" : "FAIL";

    const result = new Result({
      studentName,
      examId,
      examTitle,
      score: safeScore,
      totalQuestions: safeTotal,
      percentage,
      status
    });

    const savedResult = await result.save();

    res.status(201).json(savedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save result"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/exam/:examId", async (req, res) => {
  try {
    const results = await Result.find({
      examId: req.params.examId
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(400).json({ message: "Invalid exam ID" });
  }
});

module.exports = router;
