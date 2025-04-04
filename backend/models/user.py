# Pydantic models for request/response validation
from pydantic import BaseModel

class UserCreate(BaseModel):
    fullName: str
    email: str
    password: str
    address: str | None = None
    phoneNumber: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    fullName: str | None = None
    address: str | None = None
    phoneNumber: str | None = None
