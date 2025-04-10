import { openDB, DBSchema } from 'idb';

interface Destination {
  destination: {
    city: string;
    country: string;
  };
  description: string;
  highlights: string[];
  imageUrl?: string;
}

interface TravelRecommendations {
  destinations: Destination[];
  [key: string]: unknown;
}

interface TravelDB extends DBSchema {
  recommendations: {
    key: string;
    value: TravelRecommendations;
  };
}

const DB_NAME = 'travelPlannerDB';
const STORE_NAME = 'recommendations';

export async function initDB() {
  return openDB<TravelDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveRecommendations(data: TravelRecommendations) {
  const db = await initDB();
  await db.put(STORE_NAME, data, 'latest');
}

export async function getRecommendations() {
  const db = await initDB();
  return await db.get(STORE_NAME, 'latest');
}
