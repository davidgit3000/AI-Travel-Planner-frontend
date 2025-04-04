from pydantic import BaseModel
from datetime import date
from typing import Optional
from uuid import UUID

class TripCreate(BaseModel):
    userId: UUID
    destinationName: str
    planDate: date
    startDate: date
    endDate: date
    tripHighlights: Optional[str] = None
    linkPdf: Optional[str] = None

class TripUpdate(BaseModel):
    destinationName: Optional[str] = None
    planDate: Optional[date] = None
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    tripHighlights: Optional[str] = None
    linkPdf: Optional[str] = None