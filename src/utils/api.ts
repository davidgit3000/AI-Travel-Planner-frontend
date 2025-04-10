interface GeoDBCity {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
}

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital: string[];
  region: string;
  flags: {
    png: string;
    svg: string;
  };
}

const GEODB_API_KEY = process.env.NEXT_PUBLIC_GEODB_API_KEY;
const GEODB_API_HOST = 'wft-geo-db.p.rapidapi.com';

export async function searchCities(query: string): Promise<GeoDBCity[]> {
  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(
        query
      )}&limit=10&sort=-population`,
      {
        headers: {
          'X-RapidAPI-Key': GEODB_API_KEY || '',
          'X-RapidAPI-Host': GEODB_API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,capital,region,flags');
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await response.json();
    return data.sort((a: Country, b: Country) => 
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

// Cache the countries list
let countriesCache: Country[] | null = null;

export async function getCachedCountries(): Promise<Country[]> {
  if (!countriesCache) {
    countriesCache = await getCountries();
  }
  return countriesCache;
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
