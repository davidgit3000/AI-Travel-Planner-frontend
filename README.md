# AI Travel Planner

An intelligent travel planning system that generates personalized itineraries based on user preferences, available flights, budget constraints, and current travel offers.

## Project Structure

```
AI_Travel_Planner/
├── frontend/          # Next.js frontend application
└── backend/           # FastAPI backend application
```

## Setup Instructions

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Tech Stack

- Frontend: Next.js with TailwindCSS
- Backend: FastAPI with SQLAlchemy ORM (located [here](https://github.com/davidgit3000/AI-Travel-Planner-backend))
- Database: PostgreSQL + NeonDB
