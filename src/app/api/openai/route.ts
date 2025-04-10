import { NextResponse } from 'next/server';

interface Destination {
  destination: {
    city: string;
    country: string;
  };
  description: string;
  highlights: string[];
  imageUrl?: string;
}

interface DestinationsResponse {
  destinations: Destination[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    console.log('Next.js API received request:', requestData);

    const url = `${API_BASE_URL}/openai/generate-recommendations`;
    console.log('Forwarding to FastAPI URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('FastAPI error:', error);
      return NextResponse.json(
        { error: error.detail || 'Failed to generate recommendations' },
        { status: response.status }
      );
    }

    const data: DestinationsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in OpenAI route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
