from fastapi import APIRouter, HTTPException
from database import get_db_cursor
from models.trip import TripCreate
from uuid import UUID

router = APIRouter(
    prefix="/trips",
    tags=["trips"]
)

@router.post("/")
async def create_trip(trip: TripCreate):
    with get_db_cursor() as cursor:
        # Verify user exists
        cursor.execute("SELECT userid FROM users WHERE userid = %s", [str(trip.userId)])
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create trip
        cursor.execute("""
            INSERT INTO trips (userId, destinationName, planDate, startDate, endDate, tripHighlights, linkPdf, imgLink)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING 
                tripid as "tripId",
                userid as "userId",
                destinationname as "destinationName",
                plandate as "planDate",
                startdate as "startDate",
                enddate as "endDate",
                triphighlights as "tripHighlights",
                linkpdf as "linkPdf",
                imglink as "imgLink"
        """, [
            str(trip.userId),
            trip.destinationName,
            trip.planDate,
            trip.startDate,
            trip.endDate,
            trip.tripHighlights,
            trip.linkPdf,
            trip.imgLink
        ])
        
        new_trip = cursor.fetchone()
        return new_trip

@router.get("/user/{user_id}")
async def get_user_trips(user_id: UUID):
    with get_db_cursor() as cursor:
        # First check if user exists
        cursor.execute("""
            SELECT EXISTS(
                SELECT 1 FROM users WHERE userid = %s
            ) as "exists"
        """, [str(user_id)])
        result = cursor.fetchone()
        user_exists = result["exists"] if result else False
        
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")

        cursor.execute("""
            SELECT 
                tripid as "tripId",
                userid as "userId",
                destinationname as "destinationName",
                plandate as "planDate",
                startdate as "startDate",
                enddate as "endDate",
                triphighlights as "tripHighlights",
                linkpdf as "linkPdf",
                imglink as "imgLink"
            FROM trips 
            WHERE userid = %s
            ORDER BY plandate DESC
        """, [str(user_id)])
        
        trips = cursor.fetchall()
        if not trips:
            # Return empty list instead of 404 for no trips
            return []
        return trips

@router.get("/{trip_id}")
async def get_trip(trip_id: UUID):
    with get_db_cursor() as cursor:
        cursor.execute("""
            SELECT 
                tripid as "tripId",
                userid as "userId",
                destinationname as "destinationName",
                plandate as "planDate",
                startdate as "startDate",
                enddate as "endDate",
                triphighlights as "tripHighlights",
                linkpdf as "linkPdf",
                imglink as "imgLink"
            FROM trips 
            WHERE tripid = %s
        """, [str(trip_id)])
        
        trip = cursor.fetchone()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        return trip

@router.delete("/{trip_id}")
async def delete_trip(trip_id: UUID):
    with get_db_cursor() as cursor:
        cursor.execute("SELECT tripid FROM trips WHERE tripid = %s", [str(trip_id)])
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Trip not found")
        
        cursor.execute("DELETE FROM trips WHERE tripid = %s", [str(trip_id)])
        return {"message": "Trip deleted successfully"}