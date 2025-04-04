export interface User {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
}

export interface Trip {
  tripId: string;
  userId: string;
  destinationName: string;
  planDate: string;
  startDate: string;
  endDate: string;
  tripHighlights?: string;
  linkPdf?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const user = JSON.parse(storedUser);
    const response = await fetch(`/api/users/${user.userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  try {
    const response = await fetch(`/api/trips/user/${userId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // If we get an error response, log it and return empty array
      console.error('Error from trips API:', data);
      return [];
    }
    
    // If we get a valid response but it's not an array, return empty array
    if (!Array.isArray(data)) {
      console.warn('Unexpected response format from trips API:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}
