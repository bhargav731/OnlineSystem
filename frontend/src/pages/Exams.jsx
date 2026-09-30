import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setError("");
      const response = await axios.get(`${API_URL}/exams`);
      setExams(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load examinations. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const openStartBox = (exam) => {
    setSelectedExam(exam);
    setStudentName("");
  };

  const startExam = () => {
    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }

    navigate(`/exam/${selectedExam._id}`, {
      state: {
        studentName: studentName.trim()
      }
    });
  };

  if (loading) {
    return <h2 className="loading">Loading examinations...</h2>;
  }

  return (
    <main className="container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">EXAMINATION PORTAL</span>
          <h1>Available Examinations</h1>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {exams.length === 0 ? (
        <div className="empty">
          <h3>No examinations available</h3>
          <p>Create an examination from the Admin page.</p>
        </div>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <article className="exam-card" key={exam._id}>
              <div className="exam-badge">EXAM</div>
              <h2>{exam.title}</h2>

              <p>
                <strong>Subject:</strong> {exam.subject}
              </p>
              <p>
                <strong>Duration:</strong> {exam.duration} minutes
              </p>
              <p>
                <strong>Total Marks:</strong> {exam.totalMarks}
              </p>

              <button
                className="btn full-btn"
                onClick={() => openStartBox(exam)}
              >
                Start Exam
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedExam && (
        <div className="modal-overlay">
          <div className="start-modal">
            <button
              className="modal-close"
              onClick={() => setSelectedExam(null)}
              aria-label="Close"
            >
              ×
            </button>

            <span className="eyebrow">START EXAM</span>
            <h2>{selectedExam.title}</h2>

            <div className="exam-meta">
              <span>📚 {selectedExam.subject}</span>
              <span>⏱️ {selectedExam.duration} minutes</span>
            </div>

            <h3>Exam Instructions</h3>
            <ul>
              <li>Read each question carefully.</li>
              <li>Select one correct answer.</li>
              <li>Do not refresh the page during the exam.</li>
              <li>The exam submits automatically when time ends.</li>
              <li>Minimum 40% is required to pass.</li>
            </ul>

            <input
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") startExam();
              }}
            />

            <div className="modal-buttons">
              <button
                className="secondary-btn"
                onClick={() => setSelectedExam(null)}
              >
                Cancel
              </button>

              <button className="btn" onClick={startExam}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Exams;
