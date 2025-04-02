from fastapi import APIRouter, HTTPException
from database import get_db_cursor
from models.user import UserCreate, UserLogin
from passlib.context import CryptContext
from uuid import UUID

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_user(user: UserCreate):
    with get_db_cursor() as cursor:
        # Check if email already exists
        cursor.execute("SELECT email FROM users WHERE email = %s", [user.email])
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password
        hashed_password = pwd_context.hash(user.password)
        
        # Insert new user with hashed password
        cursor.execute("""
            INSERT INTO users (fullName, email, password, address, phoneNumber)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING userid as "userId", fullname as "fullName", email
        """, [user.fullName, user.email, hashed_password, user.address, user.phoneNumber])
        
        new_user = cursor.fetchone()
        return new_user

@router.post("/login")
async def login(user_credentials: UserLogin):
    with get_db_cursor() as cursor:
        # Get user by email
        cursor.execute("""
            SELECT 
                userid as "userId",
                email,
                password
            FROM users 
            WHERE email = %s
        """, [user_credentials.email])
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(user_credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Return user info (excluding password)
        return {"userId": user["userId"], "email": user["email"]}

@router.get("/{email}")
async def get_user(email: str):
    with get_db_cursor() as cursor:
        cursor.execute("""
            SELECT 
                userid as "userId",
                fullname as "fullName",
                email,
                address,
                phonenumber as "phoneNumber"
            FROM users 
            WHERE email = %s
        """, [email])
        user = cursor.fetchone()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)
