"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccommodationPreferences, { AccommodationType } from "@/components/plan/AccommodationPreferences";
import BasicInfo, { BasicInfoType } from "@/components/plan/BasicInfo";
import TripStyles, { TripStylesType } from "@/components/plan/TripStyles";
import DiningPreferences, { DiningType } from "@/components/plan/DiningPreferences";
import { accommodationList, tripStylesList, diningList, activityList, transportationList } from "@/data/data";
import ActivityPreferences, { ActivityType } from "@/components/plan/ActivityPreferences";
import TransporationPreferences, { TransportationType } from "@/components/plan/TransporationPreferences";
import { cn } from "@/lib/utils";

export default function PlanPage() {
  const createInitialState = <T extends { [key: string]: boolean }>(list: { value: string }[]): T => 
    Object.fromEntries(list.map(item => [item.value, false])) as T;

  const [basicInfo, setBasicInfo] = useState<BasicInfoType>({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 0,
  });

  const [accommodations, setAccommodations] = useState<AccommodationType>(() => 
    createInitialState<AccommodationType>(accommodationList));

  const [tripStyles, setTripStyles] = useState<TripStylesType>(() => 
    createInitialState<TripStylesType>(tripStylesList));

  const [dining, setDining] = useState<DiningType>(() => 
    createInitialState<DiningType>(diningList));

  const [transportation, setTransportation] = useState<TransportationType>(() => 
    createInitialState<TransportationType>(transportationList));

  const [activities, setActivities] = useState<ActivityType>(() => 
    createInitialState<ActivityType>(activityList));

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    // Check basic info
    const isBasicInfoValid = 
      basicInfo.destination.trim() !== "" && 
      basicInfo.startDate !== "" && 
      basicInfo.endDate !== "" && 
      basicInfo.travelers > 0;

    // Check if at least one option is selected in each preference
    const hasAccommodation = Object.values(accommodations).some(v => v);
    const hasTripStyle = Object.values(tripStyles).some(v => v);
    const hasDining = Object.values(dining).some(v => v);
    const hasTransportation = Object.values(transportation).some(v => v);
    const hasActivities = Object.values(activities).some(v => v);

    return (
      isBasicInfoValid &&
      hasAccommodation &&
      hasTripStyle &&
      hasDining &&
      hasTransportation &&
      hasActivities
    );
  }, [basicInfo, accommodations, tripStyles, dining, transportation, activities]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Plan Your Trip</h1>
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full p-4 h-14 bg-transparent border-b border-slate-200 dark:border-slate-800">
              <TabsTrigger
                value="basic"
                className="h-14 px-4 text-xs md:text-sm data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="h-14 px-4 text-xs md:text-sm data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Travel Preferences
              </TabsTrigger>
              <TabsTrigger
                value="dining"
                className="h-14 px-4 text-xs md:text-sm data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Dining Preferences
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="h-14 px-4 text-xs md:text-sm data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Activities
              </TabsTrigger>
            </TabsList>

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
        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={!isFormValid}
            className={cn(
              "px-8 cursor-pointer text-white text-xs sm:text-lg transition-all duration-200",
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
