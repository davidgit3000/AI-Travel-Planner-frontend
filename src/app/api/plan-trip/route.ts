import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Define the webhook URL - this should be in an environment variable
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://dlam.app.n8n.cloud/webhook/trip-schedule';

    try {
      // POST the request to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger workflow: ${response.status}`);
      }

      const data = await response.json();
      console.log('n8n response:', data);
      
      // Extract the PDF URL from the response
      const pdfUrl = data?.pdfUrl;
      
      if (!pdfUrl) {
        console.error('No PDF URL in response:', data);
        return NextResponse.json(
          { error: 'No itinerary link found in the response' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: 'Trip itinerary generated successfully',
        itineraryUrl: pdfUrl,
        status: 'success'
      });

    } catch (fetchError) {
      // This will catch network errors (like n8n being inactive) and HTTP errors
      console.error('n8n webhook error:', fetchError);
      return NextResponse.json(
        { 
          error: 'n8n service is currently inactive. Please activate n8n and try again.',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
