import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      basicInfo,
      travelPreferences,
      diningPreferences,
      activities
    } = await req.json();

    const prompt = `As an AI travel planner, ${basicInfo.isSpecificPlace ? `provide detailed travel information for ${basicInfo.specificPlace}` : `suggest 5 to 6 travel destinations${basicInfo.destination ? ` located in ${basicInfo.destination}` : ''}`}:

Basic Information:
- Destination Type: ${basicInfo.isSpecificPlace ? 'Specific Place' : 'Country'}
- Location: ${basicInfo.isSpecificPlace ? basicInfo.specificPlace : basicInfo.destination || 'Open to suggestions'}
- Travel Dates: ${basicInfo.startDate} to ${basicInfo.endDate}
- Number of Travelers: ${basicInfo.travelers}

Travel Preferences:
- Trip Styles: ${travelPreferences.tripStyles.join(', ')}
- Accommodation Types: ${travelPreferences.accommodation.join(', ')}
- Transportation: ${travelPreferences.transportation.join(', ')}

Dining Preferences:
${diningPreferences.join(', ')}

Activities:
${activities.join(', ')}

For each destination, provide:
1. City and Country name
2. A brief description (2-3 sentences) that includes:
   - The location (state/province/region and geographic position in the country)
   - Why it matches their preferences
3. 5-7 specific trip highlights or recommended activities

Format the response as a JSON object with the following structure:
{
  "destinations": [  // Will contain ${basicInfo.isSpecificPlace ? 'exactly 1 destination' : '5-6 destinations'}
    {
      "destination": { "city": string, "country": string },  // For specific places, use the exact location provided
      "description": string,  // Include detailed location information
      "highlights": string[]  // ${basicInfo.isSpecificPlace ? '7-10 specific highlights' : '5-7 highlights'}
    }
  ]
}

Ensure the suggestions are highly personalized based on all preferences and provide specific, actionable recommendations.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning assistant that provides personalized destination recommendations based on user preferences. Always respond in the exact JSON format specified in the prompt. Focus on providing specific, actionable recommendations that match the user\'s preferences.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const destinations = JSON.parse(content);
    
    // Validate response structure
    if (!destinations.destinations || !Array.isArray(destinations.destinations)) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate each destination object
    destinations.destinations.forEach((dest: any, index: number) => {
      if (!dest.destination?.city || !dest.destination?.country || !dest.description || !Array.isArray(dest.highlights)) {
        throw new Error(`Invalid destination format at index ${index}`);
      }
    });

    // Generate images for each destination using DALL-E
    const destinationsWithImages = await Promise.all(
      destinations.destinations.map(async (dest: any) => {
        try {
          const prompt = `A beautiful, professional travel photograph of ${dest.destination.city}, ${dest.destination.country}. Show iconic landmarks or cityscapes that capture the essence of the destination. Style: high-quality travel photography, 4K, realistic.`;
          
          const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            size: "1024x1024",
            quality: "standard",
            n: 1,
            response_format: "url"
          });

          return {
            ...dest,
            imageUrl: image.data[0].url,
          };
        } catch (error) {
          console.error(`Failed to generate image for ${dest.destination.city}:`, error);
          // Return destination without image if generation fails
          return dest;
        }
      })
    );

    return NextResponse.json({
      ...destinations,
      destinations: destinationsWithImages,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    let message = 'Failed to generate travel recommendations';
    let status = 500;

    if (error instanceof Error) {
      if (error.message.includes('api_key')) {
        message = 'Invalid or missing API key';
        status = 401;
      } else if (error.message.includes('rate_limit')) {
        message = 'Too many requests, please try again later';
        status = 429;
      }
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
