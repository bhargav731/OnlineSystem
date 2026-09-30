import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <span className="eyebrow">MERN STACK PROJECT</span>
        <h1>Online Examination System</h1>
        <p>
          Attend online examinations, manage questions, and get instant
          results in one place.
        </p>

        <Link to="/exams" className="btn">
          Start Examination
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Online Exams</h3>
          <p>Take multiple-choice examinations from any device.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Live Timer</h3>
          <p>A countdown timer automatically submits when time ends.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Instant Results</h3>
          <p>View your score, percentage, and PASS/FAIL status immediately.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
