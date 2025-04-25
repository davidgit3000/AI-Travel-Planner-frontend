"use client";
import { useState, useEffect, useMemo } from "react";
import TripCard from "@/components/plan/TripCard";
import { getRecommendations, saveRecommendations } from "@/utils/db";
import { useTripPlan, type TripPlanData } from "@/contexts/TripPlanContext";
import { useRouter } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateTripDuration, capitalize, formatDate } from "@/utils/helpers";
import SelectionGroup from "@/components/plan/SelectionGroup";
import { toast } from "sonner";
import LoadingScreen from "@/components/plan/LoadingScreen";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop";

interface Destination {
  city: string;
  state?: string;
  country?: string;
}

interface TripPlan {
  destination: Destination;
  description: string;
  highlights: string[];
  imageUrl?: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ResultPage() {
  const { plan, setPlan } = useTripPlan();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [currentPreferences, setCurrentPreferences] = useState({
    accommodations: { ...plan.accommodations },
    tripStyles: { ...plan.tripStyles },
    dining: { ...plan.dining },
    transportation: { ...plan.transportation },
    activities: { ...plan.activities },
  });

  const loadingSteps = useMemo(
    () => [
      "Applying your preference updates",
      "Refining destination matches",
      "Refreshing recommendations",
      "Almost ready! Updating your travel suggestions",
    ],
    []
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRegenerating) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isRegenerating, loadingSteps.length]);

  useEffect(() => {
    if (isRegenerating) {
      setLoadingText(loadingSteps[loadingStep]);
    } 
  }, [loadingStep, isRegenerating, loadingSteps]);

  const handlePreferenceChange = (category: string, key: string) => {
    setCurrentPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: !prev[category as keyof typeof prev][key],
      },
    }));
  };

  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    // setLoadingStep(0);

    try {
      // Convert preference objects to arrays of selected items
      const formatPreferences = (prefs: Record<string, boolean>) => {
        return Object.entries(prefs)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => key.replace(/_/g, " "));
      };

      const updatedPlan = {
        basicInfo: {
          isSpecificPlace: false,
          specificPlace: plan.specificPlace,
          destination: plan.destination,
          startDate: plan.startDate,
          endDate: plan.endDate,
          travelers: plan.travelers,
        },
        travelPreferences: {
          tripStyles: formatPreferences(currentPreferences.tripStyles),
          accommodation: formatPreferences(currentPreferences.accommodations),
          transportation: formatPreferences(currentPreferences.transportation),
        },
        diningPreferences: formatPreferences(currentPreferences.dining),
        activities: formatPreferences(currentPreferences.activities),
      };

      console.log(updatedPlan);
      setPlan({ ...plan, ...currentPreferences });

      const response = await fetch(
        `${API_BASE_URL}/openai/generate-recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPlan),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate recommendations");
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
            startDate: plan.startDate,
            endDate: plan.endDate,
            travelers: plan.travelers,
            isSpecificPlace: plan.isSpecificPlace,
            specificPlace: plan.specificPlace,
          })),
          // Include all preferences
          accommodations: currentPreferences.accommodations,
          tripStyles: currentPreferences.tripStyles,
          dining: currentPreferences.dining,
          transportation: currentPreferences.transportation,
          activities: currentPreferences.activities,
        };

        await saveRecommendations(enrichedData);
        setTripPlans(enrichedData.destinations);
        toast.success("Successfully updated your travel plan!");
      } catch (storageError) {
        console.error("Storage error:", storageError);
        toast.error("Failed to save recommendations");
      }
    } catch (error) {
      console.error("Error regenerating recommendations:", error);
      toast.error("Failed to regenerate recommendations");
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    async function loadInitialRecommendations() {
      try {
        setIsLoading(true);
        const data = await getRecommendations();
        console.log(data);
        if (!data?.destinations) {
          toast.error("No recommendations found");
          router.push("/plan");
          return;
        }

        // Use the saved data directly since it already contains startDate, endDate, and travelers
        setTripPlans(data.destinations);

        // Update the context with the first destination's data
        if (data.destinations.length > 0) {
          const firstDest = data.destinations[0];
          // Update both plan context and current preferences with saved data
          const savedPreferences = {
            accommodations:
              (data.accommodations as Record<string, boolean>) || {},
            tripStyles: (data.tripStyles as Record<string, boolean>) || {},
            dining: (data.dining as Record<string, boolean>) || {},
            transportation:
              (data.transportation as Record<string, boolean>) || {},
            activities: (data.activities as Record<string, boolean>) || {},
          };

          const savedPlan: TripPlanData = {
            ...plan,
            isSpecificPlace: firstDest.isSpecificPlace,
            destination: firstDest.destination.country,
            specificPlace: firstDest.specificPlace,
            startDate: firstDest.startDate,
            endDate: firstDest.endDate,
            travelers: firstDest.travelers,
            ...savedPreferences,
          };

          setPlan(savedPlan);
          setCurrentPreferences(savedPreferences);
        }
      } catch (error) {
        console.error("Error loading initial recommendations:", error);
        toast.error("Failed to load recommendations");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialRecommendations();
  }, []); // Only run once when component mounts

  // if (isLoading === false && tripPlans.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10">
  //       <div className="max-w-5xl mx-auto space-y-5 flex flex-col items-center justify-center">
  //         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
  //           No recommendations found
  //         </h1>
  //         <Button
  //           onClick={() => router.push("/plan")}
  //           className="cursor-pointer bg-blue-600 text-white hover:bg-blue-500 transition"
  //         >
  //           Go back to plan
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10">
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="flex justify-between items-baseline gap-4">
            <h1 className="text-md md:text-3xl font-bold text-gray-900 dark:text-white">
              Your Trip Plan to{" "}
              {plan.isSpecificPlace
                ? plan.specificPlace && capitalize(plan.specificPlace)
                : plan.destination && capitalize(plan.destination)}
              {tripPlans.length > 0 &&
                tripPlans[0].destination.state &&
                `, ${capitalize(tripPlans[0].destination.state)}`}
            </h1>
            <span className="text-xs md:text-md text-gray-600 dark:text-gray-300">
              {tripPlans.length} {tripPlans.length === 1 ? "plan" : "plans"}{" "}
              found
            </span>
          </div>

          <div className="w-full sm:w-auto flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 space-x-4">
              <p className="text-muted-foreground">
                <strong>Date:</strong>{" "}
                {plan.startDate && formatDate(plan.startDate)} -{" "}
                {plan.endDate && formatDate(plan.endDate)}
              </p>
              <p className="text-muted-foreground">
                <strong>Travelers:</strong> {plan.travelers}
              </p>

              {!plan.isSpecificPlace ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="cursor-pointer flex items-center gap-2 text-xs md:text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500 transition"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only">
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </Button>
                  {showFilters && (
                    <Button
                      onClick={handleRegeneratePlan}
                      disabled={isRegenerating}
                      className="cursor-pointer flex items-center gap-2 text-xs md:text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500 transition disabled:bg-slate-400"
                    >
                      {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {(showFilters || plan.isSpecificPlace) && (
            <div className="border border-slate-700 dark:border-slate-200 p-4 rounded-lg space-y-4 text-sm animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plan.isSpecificPlace ? (
                  // Read-only display for specific places
                  <div className="col-span-3">
                    <div className="space-y-6">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Your Selected Preferences
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {Object.entries(currentPreferences).map(
                          ([category, options]) => {
                            const selectedOptions = Object.entries(options)
                              .filter(([, isSelected]) => isSelected)
                              .map(([key]) => key);

                            if (selectedOptions.length === 0) return null;

                            return (
                              <div key={category} className="space-y-2">
                                <h4 className="text-xs font-medium text-muted-foreground capitalize">
                                  {category.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedOptions.map((key) => (
                                    <Badge
                                      key={`${category}-${key}`}
                                      className="text-xs"
                                    >
                                      {key.replace(/_/g, " ")}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {Object.entries(currentPreferences).map(
                      ([category, options]) => (
                        <SelectionGroup
                          key={category}
                          label={category.replace(/([A-Z])/g, " $1").trim()}
                          options={options}
                          onChange={(key) =>
                            handlePreferenceChange(category, key)
                          }
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {tripPlans.map((plan, index) => (
              <TripCard
                key={index}
                destination={plan.destination}
                days={calculateTripDuration(plan.startDate, plan.endDate)}
                description={plan.description}
                imageUrl={plan.imageUrl || FALLBACK_IMAGE}
                onClick={() => {
                  router.push(
                    `/results/${encodeURIComponent(
                      `${plan.destination.city}, ${plan.destination.state || plan.destination.country}`
                        .toLowerCase()
                        .replace(/, /g, "-")
                    )}?from=${plan.startDate}&to=${plan.endDate}`
                  );
                }}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              onClick={() => router.push("/plan")}
              className="text-xs sm:text-lg px-8 transition-all shadow-lg shadow-green-500 dark:shadow-green-700 duration-200 text-white bg-green-600 hover:bg-green-500 cursor-pointer"
            >
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>
      {isRegenerating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingScreen
            message={loadingText}
            description={`It might take a few minutes to generate your trip plan. Please wait!`}
            onCancel={() => {
              // setIsLoading(false);
              setIsRegenerating(false);
              toast.error("Plan generation cancelled");
            }}
          />
        </div>
      )}
    </>
  );
}
