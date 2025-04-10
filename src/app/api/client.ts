export interface User {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserUpdate {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface TripCreate {
  userId: string;
  destinationName: string;
  planDate: string;
  startDate: string;
  endDate: string;
  tripHighlights?: string;
  linkPdf?: string;
  imgLink?: string;
}

export interface Trip extends TripCreate {
  tripId: string;
}

export interface TripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  fullName?: string;
  days: number;
  email?: string;
}

export interface TripPlanResponse {
  pdfUrl?: string;
  [key: string]: any; // For any additional fields returned by the API
}

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Get auth headers for API requests
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

// Get current user data by userId
export async function getCurrentUser(): Promise<User | null> {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const user = JSON.parse(storedUser);
    const response = await fetch(`/api/users/${user.userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Update user data by userId
export async function updateUser(userId: string, data: UserUpdate): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Get user data by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/by-email/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user by email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Create a new trip
export async function createTrip(trip: TripCreate): Promise<Trip> {
  try {
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(trip),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create trip');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}

// Plan a new trip using AI agent from n8en and send it to the user's email
export async function planTrip(data: TripPlanRequest): Promise<TripPlanResponse> {
  try {
    const response = await fetch('/api/plan-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to trigger trip planning.');
    }

    return result;
  } catch (error) {
    console.error('Error planning trip:', error);
    throw error;
  }
}

// Get all trips for a user by userId
export async function getUserTrips(userId: string): Promise<Trip[]> {
  try {
    const response = await fetch(`/api/trips/user/${userId}`, {
      headers: getAuthHeaders(),
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

// Get a single trip by tripId
export async function getTripByTripId(tripId: string): Promise<Trip | null> {
  try {
    const response = await fetch(`/api/trips/${tripId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch trip');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}
