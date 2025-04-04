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
    imgLink: Optional[str] = None