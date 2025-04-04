from fastapi import APIRouter, HTTPException
from database import get_db_cursor
from models.trip import TripCreate, TripUpdate
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
            INSERT INTO trips (userId, destinationName, planDate, startDate, endDate, tripHighlights, linkPdf)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING 
                tripid as "tripId",
                userid as "userId",
                destinationname as "destinationName",
                plandate as "planDate",
                startdate as "startDate",
                enddate as "endDate",
                triphighlights as "tripHighlights",
                linkpdf as "linkPdf"
        """, [
            str(trip.userId),
            trip.destinationName,
            trip.planDate,
            trip.startDate,
            trip.endDate,
            trip.tripHighlights,
            trip.linkPdf
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
                linkpdf as "linkPdf"
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
                linkpdf as "linkPdf"
            FROM trips 
            WHERE tripid = %s
        """, [str(trip_id)])
        
        trip = cursor.fetchone()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        return trip

@router.put("/{trip_id}")
async def update_trip(trip_id: UUID, trip_update: TripUpdate):
    with get_db_cursor() as cursor:
        # Check if trip exists and get current values
        cursor.execute("SELECT * FROM trips WHERE tripid = %s", [str(trip_id)])
        existing_trip = cursor.fetchone()
        if not existing_trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        update_values = []
        
        if trip_update.destinationName is not None:
            update_fields.append("destinationname = %s")
            update_values.append(trip_update.destinationName)
        
        if trip_update.planDate is not None:
            update_fields.append("plandate = %s")
            update_values.append(trip_update.planDate)
        
        if trip_update.startDate is not None:
            update_fields.append("startdate = %s")
            update_values.append(trip_update.startDate)
        
        if trip_update.endDate is not None:
            update_fields.append("enddate = %s")
            update_values.append(trip_update.endDate)
        
        if trip_update.tripHighlights is not None:
            update_fields.append("triphighlights = %s")
            update_values.append(trip_update.tripHighlights)
        
        if trip_update.linkPdf is not None:
            update_fields.append("linkpdf = %s")
            update_values.append(trip_update.linkPdf)
        
        if update_fields:
            # Add trip_id to values
            update_values.append(str(trip_id))
            
            # Execute update query
            cursor.execute(f"""
                UPDATE trips 
                SET {', '.join(update_fields)}
                WHERE tripid = %s
                RETURNING 
                    tripid as "tripId",
                    userid as "userId",
                    destinationname as "destinationName",
                    plandate as "planDate",
                    startdate as "startDate",
                    enddate as "endDate",
                    triphighlights as "tripHighlights",
                    linkpdf as "linkPdf"
            """, update_values)
            
            updated_trip = cursor.fetchone()
            return updated_trip
        
        return existing_trip

@router.delete("/{trip_id}")
async def delete_trip(trip_id: UUID):
    with get_db_cursor() as cursor:
        cursor.execute("SELECT tripid FROM trips WHERE tripid = %s", [str(trip_id)])
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Trip not found")
        
        cursor.execute("DELETE FROM trips WHERE tripid = %s", [str(trip_id)])
        return {"message": "Trip deleted successfully"}