# TinyPal Backend - Node.js + MongoDB

## Overview
This is the backend implementation for the TinyPal Full-Stack Assignment.  
It provides APIs to serve data for the **Did You Know** screen and the **Flash Card** screen in the React Native frontend.

---

## Tech Stack
- **Node.js** with Express.js
- **MongoDB** with Mongoose ORM
- **dotenv** for environment configuration
- **CORS** enabled for cross-origin requests

---

## Project Setup

### 1. Clone the Repository
```bash
git clone <your-backend-repo-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add:
```
PORT=4000
MONGO_URI=<your-mongodb-connection-string>
```

### 4. Run the Server
```bash
npm run dev
```
The server will start at: `http://localhost:4000`

---

## API Endpoints

### 1. GET /api/didyouknow
Returns general "Did You Know" facts.

**Sample Response:**
```json
{
  "id": 1,
  "fact": "Honey never spoils and can last thousands of years."
}
```

### 2. GET /api/flashcards
Returns a list of flashcards (questions & answers).

**Sample Response:**
```json
{
  "flashcards": [
    { "question": "What is React Native?", "answer": "A framework for building mobile apps using React." }
  ]
}
```

---

## Folder Structure
```
backend/
│-- src/
│   │-- models/       # Mongoose schemas
│   │-- routes/       # API route definitions
│   │-- controllers/  # API logic
│   │-- server.js     # Entry point
│
│-- .env              # Environment variables
│-- package.json
│-- README.md
```

---

## Future Improvements
- Add authentication for user-based flashcards.
- Implement caching (Redis) for faster API response.
- Add unit tests with Jest/Mocha.
- Deploy backend on cloud service (Heroku, Vercel, or AWS).

---

## Author
Developed as part of the TinyPal Full-Stack Hiring Assignment.
