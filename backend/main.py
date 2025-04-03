from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user

app = FastAPI(title="AI Travel Planner API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AI Travel Planner API"}
