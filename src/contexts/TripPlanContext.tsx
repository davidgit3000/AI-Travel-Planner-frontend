"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Type definition for TripPlanData, which represents the data structure for a trip plan.
 * It includes various properties such as destination, country label, start and end dates,
 * number of travelers, and preferences for accommodations, trip styles, dining, transportation, and activities.
 * Additionally, it includes an optional explanation object that provides more context about the trip.
 */
export type TripPlanData = {
  destination: string;
  countryLabel?: string;
  specificPlace?: string;
  isSpecificPlace?: boolean;
  startDate: string;
  endDate: string;
  travelers: number;
  accommodations: Record<string, boolean>;
  tripStyles: Record<string, boolean>;
  dining: Record<string, boolean>;
  transportation: Record<string, boolean>;
  activities: Record<string, boolean>;
  explanation?: {
    summary: string;
    travelHistory: string;
    highlights: string[];
  };
};

const STORAGE_KEY = "tripmate_plan_data";

const getStoredPlan = (): TripPlanData => {
  if (typeof window === "undefined") return defaultState;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultState;

  try {
    return JSON.parse(stored) as TripPlanData;
  } catch (error) {
    console.error("Error parsing stored plan:", error);
    return defaultState;
  }
};

const defaultState: TripPlanData = {
  destination: "",
  countryLabel: undefined,
  startDate: "",
  endDate: "",
  travelers: 0,
  accommodations: {},
  tripStyles: {},
  dining: {},
  transportation: {},
  activities: {},
};

const TripPlanContext = createContext<{
  plan: TripPlanData;
  setPlan: (data: TripPlanData) => void;
  resetPlan: () => void;
}>({
  plan: defaultState,
  setPlan: () => {},
  resetPlan: () => {},
});

export function TripPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<TripPlanData>(() => getStoredPlan());

  const setPlan = useCallback((data: TripPlanData) => {
    setPlanState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const resetPlan = useCallback(() => {
    setPlanState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  return (
    <TripPlanContext.Provider value={{ plan, setPlan, resetPlan }}>
      {children}
    </TripPlanContext.Provider>
  );
}

export const useTripPlan = () => useContext(TripPlanContext);
