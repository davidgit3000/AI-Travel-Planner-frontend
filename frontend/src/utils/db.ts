import { openDB, DBSchema } from 'idb';

interface TravelDB extends DBSchema {
  recommendations: {
    key: string;
    value: any;
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

export async function saveRecommendations(data: any) {
  const db = await initDB();
  await db.put(STORE_NAME, data, 'latest');
}

export async function getRecommendations() {
  const db = await initDB();
  return await db.get(STORE_NAME, 'latest');
}
