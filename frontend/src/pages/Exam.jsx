import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Exam() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const studentName = location.state?.studentName || "Student";

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submittedRef = useRef(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const [examResponse, questionResponse] = await Promise.all([
        axios.get(`${API_URL}/exams/${id}`),
        axios.get(`${API_URL}/questions/${id}`)
      ]);

      setExam(examResponse.data);
      setQuestions(questionResponse.data);
      setTimeLeft(examResponse.data.duration * 60);
    } catch (err) {
      console.error(err);
      setError("Unable to load this examination.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || submitting || !exam) return;

    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting, exam]);

  const handleAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questions[currentQuestion]._id]: answer
    }));
  };

  const submitExam = async () => {
    if (submittedRef.current || submitting) return;

    submittedRef.current = true;
    setSubmitting(true);

    let score = 0;

    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score++;
      }
    });

    const percentage =
      questions.length > 0
        ? Number(((score / questions.length) * 100).toFixed(2))
        : 0;

    const localResult = {
      studentName,
      examId: exam._id,
      examTitle: exam.title,
      score,
      totalQuestions: questions.length,
      percentage,
      status: percentage >= 40 ? "PASS" : "FAIL"
    };

    try {
      const response = await axios.post(
        `${API_URL}/results`,
        localResult
      );

      navigate("/result", {
        state: {
          result: response.data
        }
      });
    } catch (err) {
      console.error(err);
      navigate("/result", {
        state: {
          result: localResult,
          saveError: true
        }
      });
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) {
    return <h2 className="loading">Loading examination...</h2>;
  }

  if (error) {
    return <div className="empty"><h2>{error}</h2></div>;
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="empty">
        <h2>No questions available</h2>
        <p>Please ask the admin to add questions.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <main className="exam-container">
      <div className="exam-header">
        <div>
          <span className="eyebrow">LIVE EXAMINATION</span>
          <h2>{exam.title}</h2>
          <p>
            Student: <strong>{studentName}</strong>
          </p>
          <p>{exam.subject}</p>
        </div>

        <div className={`timer ${timeLeft <= 60 ? "timer-warning" : ""}`}>
          ⏱ {formatTime()}
        </div>
      </div>

      <div className="exam-status">
        <span>
          Answered: <strong>{answeredCount}</strong>
        </span>
        <span>
          Unanswered: <strong>{unansweredCount}</strong>
        </span>
      </div>

      <div className="exam-layout">
        <section className="question-section">
          <div className="progress">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <div className="question-card">
            <h2>
              {currentQuestion + 1}. {question.question}
            </h2>

            <div className="options">
              {question.options.map((option, index) => (
                <label
                  className={
                    answers[question._id] === option
                      ? "option selected-option"
                      : "option"
                  }
                  key={index}
                >
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => handleAnswer(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="exam-buttons">
            <button
              className="secondary-btn"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((value) => value - 1)}
            >
              ← Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                className="btn"
                onClick={() => setCurrentQuestion((value) => value + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className="submit-btn"
                onClick={submitExam}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>
        </section>

        <aside className="question-palette">
          <h3>Questions</h3>

          <div className="palette-grid">
            {questions.map((item, index) => {
              const answered = answers[item._id] !== undefined;

              let className = "palette-number";

              if (index === currentQuestion) {
                className += " current";
              } else if (answered) {
                className += " answered";
              } else {
                className += " unanswered";
              }

              return (
                <button
                  key={item._id}
                  className={className}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="palette-info">
            <p>
              <span className="legend current"></span>
              Current
            </p>
            <p>
              <span className="legend answered"></span>
              Answered
            </p>
            <p>
              <span className="legend unanswered"></span>
              Unanswered
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Exam;
