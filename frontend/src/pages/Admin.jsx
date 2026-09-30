import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const emptyExam = {
  title: "",
  subject: "",
  duration: "",
  totalMarks: ""
};

const emptyQuestion = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctAnswer: ""
};

function Admin() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [examForm, setExamForm] = useState(emptyExam);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);

  const [editingExamId, setEditingExamId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const [examResponse, resultResponse] = await Promise.all([
        axios.get(`${API_URL}/exams`),
        axios.get(`${API_URL}/results`)
      ]);

      setExams(examResponse.data);
      setResults(resultResponse.data);

      if (selectedExamId) {
        await fetchQuestions(selectedExamId);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId) => {
    if (!examId) {
      setQuestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/questions/${examId}`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
      setQuestions([]);
    }
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleExamChange = (event) => {
    const { name, value } = event.target;
    setExamForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const submitExam = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        title: examForm.title.trim(),
        subject: examForm.subject.trim(),
        duration: Number(examForm.duration),
        totalMarks: Number(examForm.totalMarks)
      };

      if (editingExamId) {
        await axios.put(`${API_URL}/exams/${editingExamId}`, payload);
        showMessage("Exam updated successfully.");
      } else {
        await axios.post(`${API_URL}/exams`, payload);
        showMessage("Exam created successfully.");
      }

      setExamForm(emptyExam);
      setEditingExamId(null);
      await fetchAll();
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message || "Failed to save exam."
      );
    }
  };

  const editExam = (exam) => {
    setEditingExamId(exam._id);
    setExamForm({
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      totalMarks: exam.totalMarks
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam and all its questions?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/exams/${id}`);

      if (selectedExamId === id) {
        setSelectedExamId("");
        setQuestions([]);
      }

      showMessage("Exam deleted successfully.");
      await fetchAll();
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete exam.");
    }
  };

  const selectExam = async (id) => {
    setSelectedExamId(id);
    setEditingQuestionId(null);
    setQuestionForm(emptyQuestion);
    await fetchQuestions(id);
  };

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;

    setQuestionForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const submitQuestion = async (event) => {
    event.preventDefault();

    if (!selectedExamId) {
      showMessage("Select an exam first.");
      return;
    }

    try {
      const payload = {
        examId: selectedExamId,
        question: questionForm.question.trim(),
        options: [
          questionForm.option1.trim(),
          questionForm.option2.trim(),
          questionForm.option3.trim(),
          questionForm.option4.trim()
        ],
        correctAnswer: questionForm.correctAnswer
      };

      if (editingQuestionId) {
        await axios.put(
          `${API_URL}/questions/${editingQuestionId}`,
          payload
        );
        showMessage("Question updated successfully.");
      } else {
        await axios.post(`${API_URL}/questions`, payload);
        showMessage("Question added successfully.");
      }

      setQuestionForm(emptyQuestion);
      setEditingQuestionId(null);
      await fetchQuestions(selectedExamId);
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message || "Failed to save question."
      );
    }
  };

  const editQuestion = (question) => {
    setEditingQuestionId(question._id);

    setQuestionForm({
      question: question.question,
      option1: question.options[0] || "",
      option2: question.options[1] || "",
      option3: question.options[2] || "",
      option4: question.options[3] || "",
      correctAnswer: question.correctAnswer
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await axios.delete(`${API_URL}/questions/${id}`);
      showMessage("Question deleted successfully.");
      await fetchQuestions(selectedExamId);
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete question.");
    }
  };

  const filteredResults = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return results.filter((result) => {
      const matchesSearch =
        !searchValue ||
        result.studentName.toLowerCase().includes(searchValue) ||
        result.examTitle.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        result.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, statusFilter]);

  const passCount = results.filter(
    (result) => result.status === "PASS"
  ).length;

  const failCount = results.filter(
    (result) => result.status === "FAIL"
  ).length;

  const averagePercentage =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) => sum + Number(result.percentage || 0),
            0
          ) / results.length
        ).toFixed(2)
      : "0.00";

  if (loading) {
    return <h2 className="loading">Loading admin dashboard...</h2>;
  }

  return (
    <main className="container admin-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Admin Dashboard</h1>
          <p>Manage examinations, questions, and student results.</p>
        </div>

        <button className="secondary-btn" onClick={fetchAll}>
          ↻ Refresh
        </button>
      </div>

      {message && <div className="success-box">{message}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Exams</h3>
          <strong>{exams.length}</strong>
        </div>
        <div className="stat-card">
          <h3>Attempts</h3>
          <strong>{results.length}</strong>
        </div>
        <div className="stat-card">
          <h3>Passed</h3>
          <strong>{passCount}</strong>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <strong>{failCount}</strong>
        </div>
        <div className="stat-card">
          <h3>Average</h3>
          <strong>{averagePercentage}%</strong>
        </div>
      </section>

      <section className="admin-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">EXAM MANAGEMENT</span>
            <h2>{editingExamId ? "Edit Examination" : "Create Examination"}</h2>
          </div>
        </div>

        <form onSubmit={submitExam} className="admin-form">
          <input
            name="title"
            value={examForm.title}
            onChange={handleExamChange}
            placeholder="Exam title"
            required
          />

          <input
            name="subject"
            value={examForm.subject}
            onChange={handleExamChange}
            placeholder="Subject"
            required
          />

          <input
            name="duration"
            type="number"
            min="1"
            value={examForm.duration}
            onChange={handleExamChange}
            placeholder="Duration in minutes"
            required
          />

          <input
            name="totalMarks"
            type="number"
            min="1"
            value={examForm.totalMarks}
            onChange={handleExamChange}
            placeholder="Total marks"
            required
          />

          <div className="form-buttons">
            <button className="btn" type="submit">
              {editingExamId ? "Update Exam" : "Create Exam"}
            </button>

            {editingExamId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditingExamId(null);
                  setExamForm(emptyExam);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">EXAM LIST</span>
            <h2>Examinations</h2>
          </div>
        </div>

        {exams.length === 0 ? (
          <p>No exams created yet.</p>
        ) : (
          <div className="admin-exam-list">
            {exams.map((exam) => (
              <div className="admin-exam" key={exam._id}>
                <div>
                  <h3>{exam.title}</h3>
                  <p>
                    {exam.subject} · {exam.duration} minutes ·{" "}
                    {exam.totalMarks} marks
                  </p>
                </div>

                <div className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => selectExam(exam._id)}
                  >
                    Questions
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => editExam(exam)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteExam(exam._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">QUESTION MANAGEMENT</span>
            <h2>Questions</h2>
          </div>
        </div>

        <select
          className="admin-select"
          value={selectedExamId}
          onChange={(event) => selectExam(event.target.value)}
        >
          <option value="">Select an exam</option>
          {exams.map((exam) => (
            <option value={exam._id} key={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>

        {selectedExamId && (
          <>
            <form onSubmit={submitQuestion} className="question-form">
              <h3>
                {editingQuestionId ? "Edit Question" : "Add Question"}
              </h3>

              <textarea
                name="question"
                value={questionForm.question}
                onChange={handleQuestionChange}
                placeholder="Enter question"
                rows="3"
                required
              />

              <input
                name="option1"
                value={questionForm.option1}
                onChange={handleQuestionChange}
                placeholder="Option 1"
                required
              />

              <input
                name="option2"
                value={questionForm.option2}
                onChange={handleQuestionChange}
                placeholder="Option 2"
                required
              />

              <input
                name="option3"
                value={questionForm.option3}
                onChange={handleQuestionChange}
                placeholder="Option 3"
                required
              />

              <input
                name="option4"
                value={questionForm.option4}
                onChange={handleQuestionChange}
                placeholder="Option 4"
                required
              />

              <select
                name="correctAnswer"
                value={questionForm.correctAnswer}
                onChange={handleQuestionChange}
                required
              >
                <option value="">Select correct answer</option>
                {[
                  questionForm.option1,
                  questionForm.option2,
                  questionForm.option3,
                  questionForm.option4
                ]
                  .filter(Boolean)
                  .map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </select>

              <div className="form-buttons">
                <button className="btn" type="submit">
                  {editingQuestionId ? "Update Question" : "Add Question"}
                </button>

                {editingQuestionId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingQuestionId(null);
                      setQuestionForm(emptyQuestion);
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="question-list">
              {questions.length === 0 ? (
                <p>No questions for this exam.</p>
              ) : (
                questions.map((question, index) => (
                  <div className="question-admin-card" key={question._id}>
                    <h3>
                      {index + 1}. {question.question}
                    </h3>

                    <ol type="A">
                      {question.options.map((option, optionIndex) => (
                        <li
                          key={optionIndex}
                          className={
                            option === question.correctAnswer
                              ? "correct-label"
                              : ""
                          }
                        >
                          {option}
                          {option === question.correctAnswer && " ✓"}
                        </li>
                      ))}
                    </ol>

                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => editQuestion(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteQuestion(question._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>

      <section className="admin-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">RESULT MANAGEMENT</span>
            <h2>Student Results</h2>
          </div>
        </div>

        <div className="filter-row">
          <input
            type="text"
            placeholder="Search student or exam..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Results</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        {filteredResults.length === 0 ? (
          <p>No matching results.</p>
        ) : (
          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result._id}>
                    <td>{result.studentName}</td>
                    <td>{result.examTitle}</td>
                    <td>
                      {result.score}/{result.totalQuestions}
                    </td>
                    <td>{result.percentage}%</td>
                    <td>
                      <span
                        className={
                          result.status === "PASS"
                            ? "table-pass"
                            : "table-fail"
                        }
                      >
                        {result.status}
                      </span>
                    </td>
                    <td>
                      {result.createdAt
                        ? new Date(result.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;
