# AI Travel Planner

An intelligent travel planning system that generates personalized itineraries and their suggested scheduled activities based on user preferences for traveling.
## Project Structure

```
AI_Travel_Planner/
├── frontend/          # Next.js frontend application
└── backend/           # FastAPI backend application
```

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:

   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with your database configuration:

   ```
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/travel_planner
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at http://localhost:8000

### Frontend Setup

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

### Database Setup

1. Create a MySQL database named `travel_planner`
2. Update the database connection details in the backend `.env` file

## Tech Stack

- Frontend: Next.js with TailwindCSS
- Backend: Python FastAPI with SQLAlchemy ORM
- Database: MySQL
