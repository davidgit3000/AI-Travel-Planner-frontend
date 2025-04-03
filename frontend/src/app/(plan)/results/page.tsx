"use client";
import TripCard from "@/components/plan/TripCard";
import { useTripPlan } from "@/contexts/TripPlanContext";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateTripDuration, formatDate } from "@/utils/helpers";
import SelectionGroup from "@/components/plan/SelectionGroup";

export default function ResultPage() {
  const { plan } = useTripPlan();
  const router = useRouter();
  //   console.log(plan);
  const tripPlans = [
    {
      destination: "Paris, France",
      description: "Immerse yourself in local traditions and historical sites",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Eiffel Tower
      startDate: "2024-03-15",
      endDate: "2024-03-22",
    },
    {
      destination: "Tokyo, Japan",
      description: "Perfect blend of outdoor activities and scenic spots",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5b228bd689c172172ab88d9c/1501f7d6-87ac-445c-a87b-e9ff9551ccaa/_DSF5280-Enhanced-NR.jpg", // Tokyo cityscape
      startDate: "2024-03-15",
      endDate: "2024-03-22",
    },
    {
      destination: "Grand Canyon, Arizona",
      description: "Focus on wellness and peaceful experiences",
      imageUrl:
        "https://www.globalnationalparks.com/wp-content/uploads/national-park-grand-canyon.jpg", // Grand Canyon
      startDate: "2024-03-15",
      endDate: "2024-03-22",
    },
  ];

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
              <strong>Date:</strong> {formatDate(plan.startDate)} -{" "}
              {formatDate(plan.endDate)}
            </p>
            <p className="text-muted-foreground">
              <strong>Travelers:</strong> {plan.travelers}
            </p>
            <p className="text-muted-foreground">
              {plan.searchType === "city" && (
                <>
                  <strong>Within:</strong> {plan.searchRadius} miles
                </>
              )}
            </p>
          </div>
          <Button
            onClick={() => router.push("/plan")}
            className="cursor-pointer flex items-center gap-2 text-xs md:text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500 transition"
          >
            <Filter className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Filter</span>
          </Button>
        </div>

        <div className="border border-slate-700 dark:border-slate-200 p-4 rounded-lg space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectionGroup
              label="Accommodations"
              options={plan.accommodations}
            />
            <SelectionGroup label="Trip Styles" options={plan.tripStyles} />
            <SelectionGroup label="Dining Preferences" options={plan.dining} />
            <SelectionGroup
              label="Transportation"
              options={plan.transportation}
            />
            <SelectionGroup label="Activities" options={plan.activities} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {tripPlans.map((_plan, index) => (
            <TripCard
              key={index}
              destination={_plan.destination}
              days={calculateTripDuration(plan.startDate, plan.endDate)}
              description={_plan.description}
              imageUrl={_plan.imageUrl}
              onClick={() =>
                router.push(
                  `/results/${encodeURIComponent(
                    _plan.destination.toLowerCase().replace(/, /g, "-")
                  )}?image=${encodeURIComponent(_plan.imageUrl)}&from=${
                    plan.startDate
                  }&to=${plan.endDate}`
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
