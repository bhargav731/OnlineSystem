import { Link, useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const result = location.state?.result;
  const saveError = location.state?.saveError;

  if (!result) {
    return (
      <div className="empty">
        <h2>No result available</h2>
        <Link to="/exams" className="btn">
          Go to Exams
        </Link>
      </div>
    );
  }

  return (
    <main className="result-container">
      <span className="eyebrow">RESULT</span>
      <h1>Examination Result</h1>

      <div className="result-card">
        <div className="result-icon">
          {result.status === "PASS" ? "✓" : "!"}
        </div>

        <h2>{result.examTitle}</h2>

        <p className="student-result-name">
          Student: <strong>{result.studentName}</strong>
        </p>

        <div className="score">
          {result.score} / {result.totalQuestions}
        </div>

        <h3>Percentage: {result.percentage}%</h3>

        <div
          className={
            result.status === "PASS"
              ? "status-badge pass"
              : "status-badge fail"
          }
        >
          {result.status}
        </div>

        {saveError && (
          <p className="warning-text">
            Result was calculated locally, but the server could not save it.
          </p>
        )}

        <Link to="/exams" className="btn">
          Back to Exams
        </Link>
      </div>
    </main>
  );
}

export default Result;
