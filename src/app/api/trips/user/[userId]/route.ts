import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const response = await fetch(`${API_BASE_URL}/trips/user/${userId}`);
    
    const data = await response.json();
    
    // If we get an error response with data, check if it's a 404
    if (!response.ok) {
      if (response.status === 404) {
        // If user not found, return empty array
        return NextResponse.json([]);
      }
      // For other errors, include the error message from the backend
      return NextResponse.json({ error: data.detail || 'Failed to fetch trips' }, { status: response.status });
    }
    
    // If we got a successful response but it's not an array, handle it
    if (!Array.isArray(data)) {
      console.warn('Unexpected response format from trips API:', data);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}
