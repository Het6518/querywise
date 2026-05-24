# AI Query Optimizer

Production-style web app for SQL query optimization using React, Express, and Gemini Flash.

## Install

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Configure

Set your Gemini API key in `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

## Run

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## API

`POST http://localhost:5000/analyze`

```json
{
  "schema": "Students(id, name, marks, course_id)",
  "query": "Find students scoring above 80 marks"
}
```
