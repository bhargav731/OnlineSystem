# Online Examination System

A complete MERN-stack Online Examination System for a college/project demonstration.

## Stack

- React + Vite
- React Router
- Axios
- Node.js
- Express
- MongoDB
- Mongoose

## Features

### Student
- View available exams
- Enter student name
- Exam instructions
- MCQ examination
- Countdown timer
- Previous/Next navigation
- Question palette
- Answered/unanswered tracking
- Automatic submission when time expires
- Automatic scoring
- PASS/FAIL result
- Result saved to MongoDB

### Admin
- Dashboard statistics
- Create, edit and delete exams
- Add, edit and delete questions
- View questions for each exam
- View student results
- Search results
- PASS/FAIL filtering
- Refresh results

## Project Structure

```text
online-examination-system/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   ├── server.js
│   ├── models/
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Result.js
│   └── routes/
│       ├── examRoutes.js
│       ├── questionRoutes.js
│       └── resultRoutes.js
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── components/Navbar.jsx
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── Exam.jsx
│       │   ├── Exams.jsx
│       │   ├── Home.jsx
│       │   └── Result.jsx
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── .gitignore
└── README.md
```

## 1. Install prerequisites

Install:
- Node.js LTS
- MongoDB Community Server, or use MongoDB Atlas
- Git

## 2. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`.

Windows CMD:
```cmd
copy .env.example .env
```

PowerShell:
```powershell
Copy-Item .env.example .env
```

Default local `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/online_exam
PORT=5000
```

Start:

```bash
npm run dev
```

API:
```text
http://localhost:5000
```

## 3. Optional sample data

With the backend running and MongoDB available, open another terminal:

```bash
cd backend
npm run seed
```

This creates a sample MERN Stack Fundamentals exam and five questions.

## 4. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Open:
```text
http://localhost:5173
```

## 5. Demo flow

1. Open Home.
2. Open Exams.
3. Start the sample exam.
4. Enter a student name.
5. Answer questions.
6. Submit the exam.
7. View the result.
8. Open `/admin` to manage exams/questions and view results.

## API

### Exams
- GET `/api/exams`
- GET `/api/exams/:id`
- POST `/api/exams`
- PUT `/api/exams/:id`
- DELETE `/api/exams/:id`

### Questions
- GET `/api/questions/:examId`
- POST `/api/questions`
- PUT `/api/questions/:id`
- DELETE `/api/questions/:id`

### Results
- GET `/api/results`
- GET `/api/results/exam/:examId`
- POST `/api/results`

## GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial Online Examination System"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Never commit `.env`.

## Deployment

A simple deployment architecture is:
- MongoDB Atlas for database
- Render Web Service for backend
- Render Static Site for frontend

Backend:
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

Frontend:
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

Backend environment:
```env
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
PORT=10000
```

Frontend environment:
```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

For React Router on a static host, configure a rewrite from `/*` to `/index.html`.

## Important

This educational version has no authentication/authorization, as requested. The `/admin` page and admin API endpoints are therefore publicly accessible. Do not use this version for sensitive real-world student data without adding authentication and authorization.

## Future improvements

- Admin authentication
- Student authentication
- Exam scheduling
- Random question selection
- Per-question marks
- Negative marking
- PDF result generation
- Student dashboard
- Email notifications
- Advanced analytics
