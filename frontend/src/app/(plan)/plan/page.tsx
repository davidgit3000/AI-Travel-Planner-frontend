"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccommodationPreferences, {
  AccommodationType,
} from "@/components/plan/AccommodationPreferences";
import BasicInfo from "@/components/plan/BasicInfo";
import TripStyles, { TripStylesType } from "@/components/plan/TripStyles";
import DiningPreferences, {
  DiningType,
} from "@/components/plan/DiningPreferences";
import {
  accommodationList,
  tripStylesList,
  diningList,
  activityList,
  transportationList,
} from "@/data/data";
import ActivityPreferences, {
  ActivityType,
} from "@/components/plan/ActivityPreferences";
import TransporationPreferences, {
  TransportationType,
} from "@/components/plan/TransporationPreferences";
import { cn } from "@/lib/utils";

import { useTripPlan } from "@/context/TripPlanContext";

// ---------- TODO: Make Tab responsive in mobile view ----------
export default function PlanPage() {
  const router = useRouter();
  const { plan, setPlan } = useTripPlan();

  const createInitialState = <T extends { [key: string]: boolean }>(
    list: { value: string }[]
  ): T => Object.fromEntries(list.map((item) => [item.value, false])) as T;

  const [basicInfo, setBasicInfo] = useState({
    destination: plan.destination || "",
    searchRadius: plan.searchRadius || 50,
    startDate: plan.startDate || "",
    endDate: plan.endDate || "",
    travelers: plan.travelers || 0,
    searchType: plan.searchType || "city",
  });

  const [accommodations, setAccommodations] = useState<AccommodationType>(
    plan.accommodations && Object.keys(plan.accommodations).length > 0
      ? (plan.accommodations as AccommodationType)
      : createInitialState<AccommodationType>(accommodationList)
  );

  const [tripStyles, setTripStyles] = useState<TripStylesType>(
    plan.tripStyles && Object.keys(plan.tripStyles).length > 0
      ? (plan.tripStyles as TripStylesType)
      : createInitialState<TripStylesType>(tripStylesList)
  );

  const [dining, setDining] = useState<DiningType>(
    plan.dining && Object.keys(plan.dining).length > 0
      ? (plan.dining as DiningType)
      : createInitialState<DiningType>(diningList)
  );

  const [transportation, setTransportation] = useState<TransportationType>(
    plan.transportation && Object.keys(plan.transportation).length > 0
      ? (plan.transportation as TransportationType)
      : createInitialState<TransportationType>(transportationList)
  );

  const [activities, setActivities] = useState<ActivityType>(
    plan.activities && Object.keys(plan.activities).length > 0
      ? (plan.activities as ActivityType)
      : createInitialState<ActivityType>(activityList)
  );

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    // Check basic info
    const isBasicInfoValid =
      basicInfo.destination.trim() !== "" &&
      basicInfo.startDate !== "" &&
      basicInfo.endDate !== "" &&
      basicInfo.travelers > 0;

    // Check if at least one option is selected in each preference
    const hasAccommodation = Object.values(accommodations).some((v) => v);
    const hasTripStyle = Object.values(tripStyles).some((v) => v);
    const hasDining = Object.values(dining).some((v) => v);
    const hasTransportation = Object.values(transportation).some((v) => v);
    const hasActivities = Object.values(activities).some((v) => v);

    return (
      isBasicInfoValid &&
      hasAccommodation &&
      hasTripStyle &&
      hasDining &&
      hasTransportation &&
      hasActivities
    );
  }, [
    basicInfo,
    accommodations,
    tripStyles,
    dining,
    transportation,
    activities,
  ]);

  // Reset all selected data input
  const handleReset = () => {
    const defaultBasicInfo = {
      destination: "",
      searchRadius: 50,
      startDate: "",
      endDate: "",
      travelers: 0,
      searchType: "city" as const,
    };

    setBasicInfo(defaultBasicInfo);
    setAccommodations(createInitialState<AccommodationType>(accommodationList));
    setTripStyles(createInitialState<TripStylesType>(tripStylesList));
    setDining(createInitialState<DiningType>(diningList));
    setTransportation(
      createInitialState<TransportationType>(transportationList)
    );
    setActivities(createInitialState<ActivityType>(activityList));

    // Also clear the global plan context
    setPlan({
      ...defaultBasicInfo,
      accommodations: {},
      tripStyles: {},
      dining: {},
      transportation: {},
      activities: {},
    });
  };

  const handleGeneratePlan = () => {
    setPlan({
      ...basicInfo,
      accommodations,
      tripStyles,
      dining,
      transportation,
      activities,
    });
    router.push("/results");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-18 md:py-10 space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Plan Your Trip</h1>
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <Tabs defaultValue="basic" className="w-full">
            <div className="relative w-full">
              <TabsList className="w-full flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar h-14 bg-transparent border-b border-slate-200 dark:border-slate-800 scroll-p-4">
                <div className="flex px-2 sm:px-4 min-w-full">
                  <TabsTrigger
                    value="basic"
                    className="px-4 text-xs md:text-sm h-14 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="min-w-fit px-4 text-xs md:text-sm h-14 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    Travel Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="dining"
                    className="min-w-fit px-4 text-xs md:text-sm h-14 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    Dining Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="activities"
                    className="min-w-fit px-4 text-xs md:text-sm h-14 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    Activities
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent value="basic" className="p-6 md:p-8 space-y-8">
              <BasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
            </TabsContent>

            <TabsContent value="preferences" className="p-6 md:p-8 space-y-8">
              <AccommodationPreferences
                accommodationList={accommodationList}
                accommodations={accommodations}
                setAccommodations={setAccommodations}
              />
              <TripStyles
                tripStylesList={tripStylesList}
                tripStyles={tripStyles}
                setTripStyles={setTripStyles}
              />
              <TransporationPreferences
                transportationList={transportationList}
                transportation={transportation}
                setTransportation={setTransportation}
              />
            </TabsContent>

            <TabsContent value="dining" className="p-6 md:p-8 space-y-8">
              <DiningPreferences
                diningList={diningList}
                dining={dining}
                setDining={setDining}
              />
            </TabsContent>

            <TabsContent value="activities" className="p-6 md:p-8 space-y-8">
              <ActivityPreferences
                activityList={activityList}
                activities={activities}
                setActivities={setActivities}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <div className="flex justify-end items-center space-x-4">
          <Button
            size="lg"
            onClick={handleReset}
            className="cursor-pointer text-xs sm:text-lg px-8 transition-all duration-200 bg-red-500 text-white hover:bg-red-400"
          >
            Reset All
          </Button>

          <Button
            size="lg"
            disabled={!isFormValid}
            onClick={handleGeneratePlan}
            className={cn(
              "cursor-pointer px-8 text-white text-xs sm:text-lg transition-all duration-200",
              isFormValid
                ? "bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-500"
                : "bg-slate-400 cursor-not-allowed"
            )}
          >
            Generate Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
