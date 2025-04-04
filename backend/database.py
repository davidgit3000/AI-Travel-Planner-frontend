import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
from contextlib import contextmanager

load_dotenv()

# Get database connection details from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")  # Neon DB connection string

def get_db_connection():
    """Create a new database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise

@contextmanager
def get_db_cursor():
    """Context manager for database operations"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        yield cursor
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

# Initialize database tables
def init_db():
    with get_db_cursor() as cursor:
        # Drop existing tables due to dependencies
        cursor.execute("DROP TABLE IF EXISTS trips")
        cursor.execute("DROP TABLE IF EXISTS users")
        
        # Create UUID extension if not exists
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
        
        # Create User table with UUID
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                userID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                fullName VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                phoneNumber VARCHAR(20)
            )
        """)

        # Create Trip table with UUID
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trips (
                tripID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                userID UUID REFERENCES users(userID),
                destinationName VARCHAR(100) NOT NULL,
                planDate DATE NOT NULL,
                startDate DATE NOT NULL,
                endDate DATE NOT NULL,
                tripHighlights TEXT,
                linkPdf VARCHAR(255),
                imgLink VARCHAR(500)
            )
        """)
        
        # Add imgLink column to existing trips table if it doesn't exist
        cursor.execute("""
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name='trips' AND column_name='imglink'
                ) THEN 
                    ALTER TABLE trips ADD COLUMN imgLink VARCHAR(500);
                END IF;
            END $$;
        """)

# Call init_db() when running this file directly
if __name__ == "__main__":
    init_db()
    print("Database tables created successfully")