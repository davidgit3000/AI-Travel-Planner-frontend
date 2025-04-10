"use client";
import { useState, useEffect } from "react";
import TripCard from "@/components/plan/TripCard";
import { getRecommendations } from "@/utils/db";
import { useTripPlan } from "@/contexts/TripPlanContext";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateTripDuration, formatDate } from "@/utils/helpers";
import SelectionGroup from "@/components/plan/SelectionGroup";
import { toast } from "sonner";
import LoadingScreen from "@/components/plan/LoadingScreen";

interface TripPlan {
  destination: {
    city: string;
    country: string;
  };
  description: string;
  highlights: string[];
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export default function ResultPage() {
  const { plan, setPlan } = useTripPlan();
  const [isLoading, setIsLoading] = useState(false);
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

  const loadingSteps = [
    "Analyzing your updated preferences",
    "Finding the perfect destinations",
    "Curating personalized recommendations",
    "Almost there! Finalizing your travel plans",
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isLoading, loadingSteps.length]);

  useEffect(() => {
    if (isLoading) {
      setLoadingText(loadingSteps[loadingStep]);
    }
  }, [loadingStep, isLoading, loadingSteps]);

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
    setIsLoading(true);
    setLoadingStep(0);

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

      setPlan({ ...plan, ...currentPreferences });

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlan),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();

      if (data.destinations) {
        setTripPlans(
          data.destinations.map((dest: { destination: { city: string; country: string }; description: string; highlights: string[]; imageUrl: string }) => ({
            destination: dest.destination,
            description: dest.description,
            highlights: dest.highlights,
            imageUrl: dest.imageUrl,
            startDate: plan.startDate,
            endDate: plan.endDate,
          }))
        );
        toast.success("Successfully updated your travel plan!");
      }
    } catch (error) {
      console.error("Error regenerating recommendations:", error);
    } finally {
      setIsRegenerating(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialRecommendations() {
      try {
        const data = await getRecommendations();
        if (data?.destinations) {
          setTripPlans(
            data.destinations.map((dest: { destination: { city: string; country: string }; description: string; highlights: string[]; imageUrl: string }) => ({
              destination: dest.destination,
              description: dest.description,
              highlights: dest.highlights,
              imageUrl: dest.imageUrl,
              startDate: plan.startDate,
              endDate: plan.endDate,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading initial recommendations:", error);
        toast.error("Failed to load recommendations");
      }
    }
    loadInitialRecommendations();
  }, [plan.startDate, plan.endDate]); // Only run once when component mounts

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10 flex items-center justify-center">
        <LoadingScreen
          message={loadingText}
          onCancel={() => {
            setIsLoading(false);
            setIsRegenerating(false);
            toast.error("Plan generation cancelled");
          }}
        />
      </div>
    );
  }

  if (tripPlans.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10">
        <div className="max-w-5xl mx-auto space-y-5 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            No recommendations found
          </h1>
          <Button
            onClick={() => router.push("/plan")}
            className="cursor-pointer bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Go back to plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-md md:text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Your Trip Plan to {plan.destination || ""}
          </h1>

          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            {tripPlans.length} plans found
          </span>
        </div>

        <div className="w-full sm:w-auto flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 space-x-4">
            <p className="text-muted-foreground">
              <strong>Date:</strong> {plan.startDate && formatDate(plan.startDate)} -{" "}
              {plan.endDate && formatDate(plan.endDate)}
            </p>
            <p className="text-muted-foreground">
              <strong>Travelers:</strong> {plan.travelers}
            </p>
          </div>
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
                  {Object.entries(currentPreferences).map(([category, options]) => (
                    <SelectionGroup
                      key={category}
                      label={category.replace(/([A-Z])/g, " $1").trim()}
                      options={options}
                      onChange={(key) => handlePreferenceChange(category, key)}
                    />
                  ))}
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
              imageUrl={plan.imageUrl}
              onClick={() => {
                router.push(
                  `/results/${encodeURIComponent(
                    `${plan.destination.city}, ${plan.destination.country}`
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
  );
}
