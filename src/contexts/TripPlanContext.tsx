"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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
