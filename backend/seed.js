const mongoose = require("mongoose");
require("dotenv").config();

const Exam = require("./models/Exam");
const Question = require("./models/Question");

const sampleQuestions = [
  {
    question: "Which library is used for building user interfaces?",
    options: ["React", "MongoDB", "Express", "Node.js"],
    correctAnswer: "React"
  },
  {
    question: "Which database is commonly used with the MERN stack?",
    options: ["React", "MongoDB", "CSS", "HTML"],
    correctAnswer: "MongoDB"
  },
  {
    question: "What does Node.js allow JavaScript to run on?",
    options: ["Browser only", "Server", "Database", "HTML"],
    correctAnswer: "Server"
  },
  {
    question: "Which technology is commonly used to create the backend API?",
    options: ["Express", "React", "CSS", "MongoDB"],
    correctAnswer: "Express"
  },
  {
    question: "What does CSS primarily control?",
    options: ["Database", "Page styling", "Server", "API"],
    correctAnswer: "Page styling"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Exam.findOne({
      title: "MERN Stack Fundamentals"
    });

    if (existing) {
      console.log("Sample exam already exists.");
      await mongoose.disconnect();
      return;
    }

    const exam = await Exam.create({
      title: "MERN Stack Fundamentals",
      subject: "Full Stack Web Development",
      duration: 10,
      totalMarks: 5
    });

    await Question.insertMany(
      sampleQuestions.map((item) => ({
        ...item,
        examId: exam._id
      }))
    );

    console.log("Sample exam and questions created.");
    console.log("Exam ID:", exam._id.toString());

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seed();
