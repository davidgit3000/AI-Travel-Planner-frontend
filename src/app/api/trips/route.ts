import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const tripData = await request.json();

    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        return NextResponse.json(
          { error: error.detail || "Failed to create trip" },
          { status: response.status }
        );
      } catch {
        // If error response is not JSON
        const errorText = await response.text();
        return NextResponse.json(
          { error: errorText || "Failed to create trip" },
          { status: response.status }
        );
      }
    }

    const newTrip = await response.json();
    console.log("New trip created:", newTrip);
    return NextResponse.json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
