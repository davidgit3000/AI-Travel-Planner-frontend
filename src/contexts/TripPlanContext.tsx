"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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
}>({
  plan: defaultState,
  setPlan: () => {},
});

export function TripPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<TripPlanData>(defaultState);
  return (
    <TripPlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </TripPlanContext.Provider>
  );
}

export const useTripPlan = () => useContext(TripPlanContext);
