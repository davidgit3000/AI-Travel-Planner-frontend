"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccommodationPreferences, {
  AccommodationType,
} from "@/components/plan/AccommodationPreferences";
import BasicInfo, { BasicInfoType } from "@/components/plan/BasicInfo";
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
import { useTripPlan } from "@/contexts/TripPlanContext";
import { saveRecommendations, type Destination } from "@/utils/db";

import LoadingScreen from "@/components/plan/LoadingScreen";
import { capitalize } from "@/utils/helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function PlanPage() {
  const router = useRouter();
  const { plan, setPlan } = useTripPlan();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const createInitialState = <T extends { [key: string]: boolean }>(
    list: { value: string }[]
  ): T => Object.fromEntries(list.map((item) => [item.value, false])) as T;

  const [basicInfo, setBasicInfo] = useState<BasicInfoType>({
    destination: plan.isSpecificPlace
      ? (plan.specificPlace && capitalize(plan.specificPlace)) || ""
      : (plan.destination && capitalize(plan.destination)) || "",
    countryLabel: plan.countryLabel || "",
    specificPlace: plan.specificPlace || "",
    isSpecificPlace: plan.isSpecificPlace || false,
    startDate: plan.startDate || "",
    endDate: plan.endDate || "",
    travelers: plan.travelers || 0,
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
  const [currentTab, setCurrentTab] = useState("basic");

  const loadingSteps = useMemo(
    () =>
      basicInfo.isSpecificPlace
        ? [
            "Analyzing your preferences for " +
              capitalize(basicInfo.destination),
            "Discovering hidden gems in " + capitalize(basicInfo.destination),
            "Crafting your personalized itinerary",
            "Almost there! Finalizing your perfect trip to " +
              capitalize(basicInfo.destination),
          ]
        : [
            "Analyzing your preferences",
            "Finding destinations that match your style",
            "Curating personalized recommendations",
            "Almost there! Finalizing your travel plans",
          ],
    [basicInfo]
  );
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);

  // Tab order for navigation
  const tabOrder = ["basic", "preferences", "dining", "activities"];

  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isGenerating, loadingSteps.length]);

  useEffect(() => {
    if (isGenerating) {
      setLoadingText(loadingSteps[loadingStep]);
    }
  }, [loadingStep, isGenerating, loadingSteps]);
  
  // Check if any field is filled (for Reset button)
  const isAnyFieldFilled = useMemo(() => {
    // Check basic info fields
    const basicInfoFilled = (
      (basicInfo.isSpecificPlace && basicInfo.specificPlace.trim() !== "") ||
      (!basicInfo.isSpecificPlace && basicInfo.destination.trim() !== "") ||
      basicInfo.countryLabel.trim() !== "" ||
      basicInfo.startDate !== "" ||
      basicInfo.endDate !== "" ||
      basicInfo.travelers > 0
    );
    // Check at least one selected in each preference group
    const hasAccommodation = Object.values(accommodations).some((v) => v);
    const hasTripStyle = Object.values(tripStyles).some((v) => v);
    const hasDining = Object.values(dining).some((v) => v);
    const hasTransportation = Object.values(transportation).some((v) => v);
    const hasActivities = Object.values(activities).some((v) => v);
    return (
      basicInfoFilled ||
      hasAccommodation ||
      hasTripStyle ||
      hasDining ||
      hasTransportation ||
      hasActivities
    );
  }, [basicInfo, accommodations, tripStyles, dining, transportation, activities]);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    // Check basic info
    const isBasicInfoValid =
      ((basicInfo.isSpecificPlace && basicInfo.specificPlace.trim() !== "") ||
        (!basicInfo.isSpecificPlace && basicInfo.destination.trim() !== "")) &&
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
      countryLabel: "",
      specificPlace: "",
      isSpecificPlace: false,
      startDate: "",
      endDate: "",
      travelers: 0,
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

  const handleGeneratePlan = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    try {
      // Save current preferences to context
      setPlan({
        ...basicInfo,
        accommodations,
        tripStyles,
        dining,
        transportation,
        activities,
      });

      // Get travel recommendations from OpenAI
      // Prepare request data
      const requestData = {
        basicInfo: {
          ...basicInfo,
          travelers: Number(basicInfo.travelers),
        },
        travelPreferences: {
          tripStyles: Object.entries(tripStyles)
            .filter(([, selected]) => selected)
            .map(([value]) => value),
          accommodation: Object.entries(accommodations)
            .filter(([, selected]) => selected)
            .map(([value]) => value),
          transportation: Object.entries(transportation)
            .filter(([, selected]) => selected)
            .map(([value]) => value),
        },
        diningPreferences: Object.entries(dining)
          .filter(([, selected]) => selected)
          .map(([value]) => value),
        activities: Object.entries(activities)
          .filter(([, selected]) => selected)
          .map(([value]) => value),
      };

      console.log("Sending request data:", requestData);

      const response = await fetch(
        `${API_BASE_URL}/openai/generate-recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error:", errorData);
        throw new Error(
          errorData?.detail || "Failed to get travel recommendations"
        );
      }

      const data = await response.json();

      if (!data.destinations || !Array.isArray(data.destinations)) {
        throw new Error("Invalid response format: missing destinations array");
      }

      // Add trip details to each destination and store in IndexedDB
      try {
        const enrichedData = {
          ...data,
          destinations: data.destinations.map((destination: Destination) => ({
            ...destination,
            startDate: basicInfo.startDate,
            endDate: basicInfo.endDate,
            travelers: Number(basicInfo.travelers),
            isSpecificPlace: basicInfo.isSpecificPlace,
            specificPlace: basicInfo.specificPlace,
          })),
          // Include all preferences
          accommodations,
          tripStyles,
          dining,
          transportation,
          activities,
        };

        await saveRecommendations(enrichedData);
        toast.success("Travel recommendations generated!");
        router.push("/results");
      } catch (storageError) {
        console.error("Storage error:", storageError);
        toast.error("Failed to save recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate recommendations"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="container max-w-4xl mx-auto px-4 py-18 md:py-10 space-y-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Plan Your Trip</h1>
          <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full"
            >
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

              <TabsContent
                value="basic"
                className="p-6 md:p-8 md:pb-6 space-y-8"
              >
                <BasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={handlePreviousTab}
                    className={`${currentTab === tabOrder[0] ? "cursor-not-allowed" : "cursor-pointer"} text-slate-100 bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-400 dark:hover:text-slate-50 dark:text-slate-200 px-8`}
                    disabled={currentTab === tabOrder[0]}
                  >
                    Previous
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNextTab}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8"
                  >
                    Next
                  </Button>
                </div>
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
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={handlePreviousTab}
                    className={`${currentTab === tabOrder[0] ? "cursor-not-allowed" : "cursor-pointer"} text-slate-100 bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-400 dark:hover:text-slate-50 dark:text-slate-200 px-8`}
                    disabled={currentTab === tabOrder[0]}
                  >
                    Previous
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNextTab}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dining" className="p-6 md:p-8 space-y-8">
                <DiningPreferences
                  diningList={diningList}
                  dining={dining}
                  setDining={setDining}
                />
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={handlePreviousTab}
                    className={`${currentTab === tabOrder[0] ? "cursor-not-allowed" : "cursor-pointer"} text-slate-100 bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-400 dark:hover:text-slate-50 dark:text-slate-200 px-8`}
                    disabled={currentTab === tabOrder[0]}
                  >
                    Previous
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNextTab}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="p-6 md:p-8 space-y-8">
                <ActivityPreferences
                  activityList={activityList}
                  activities={activities}
                  setActivities={setActivities}
                />
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={handlePreviousTab}
                    className={`${currentTab === tabOrder[0] ? "cursor-not-allowed" : "cursor-pointer"} text-slate-100 bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-400 dark:hover:text-slate-50 dark:text-slate-200 px-8`}
                    disabled={currentTab === tabOrder[0]}
                  >
                    Previous
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="space-y-6">
            <div className="flex justify-end items-center space-x-4">
              <Button
                size="lg"
                onClick={handleReset}
                disabled={isGenerating || !isAnyFieldFilled}
                className={cn(
                  "text-xs sm:text-lg px-8 transition-all duration-200 text-white",
                  isGenerating || !isAnyFieldFilled
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-400 cursor-pointer"
                )}
              >
                Reset All
              </Button>

              <Button
                size="lg"
                disabled={!isFormValid || isGenerating}
                onClick={handleGeneratePlan}
                className={cn(
                  "px-8 text-white text-xs sm:text-lg transition-all duration-200",
                  !isFormValid || isGenerating
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-pointer"
                )}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <span>Generating Plan</span>
                    <span className="inline-block animate-pulse">...</span>
                  </div>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </div>

            {plan.explanation && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Why this destination?</h3>
                    <p className="text-slate-600 dark:text-slate-300">{plan.explanation.summary}</p>
                  </div>
                  {plan.explanation.travelHistory && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Based on your travel history</h3>
                      <p className="text-slate-600 dark:text-slate-300">{plan.explanation.travelHistory}</p>
                    </div>
                  )}
                  {plan.explanation.highlights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key highlights</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {plan.explanation.highlights.map((highlight, index) => (
                          <li key={index} className="text-slate-600 dark:text-slate-300">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingScreen
            message={loadingText}
            description={`It might take a few minutes to generate your trip plan. Please wait!`}
            onCancel={() => {
              setIsGenerating(false);
              toast.error("Plan generation cancelled", {
                cancel: true,
              });
            }}
          />
        </div>
      )}
    </>
  );
}
