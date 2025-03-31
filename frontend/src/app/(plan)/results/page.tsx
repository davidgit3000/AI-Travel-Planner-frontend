"use client";
import TripCard from "@/components/plan/TripCard";
import { useTripPlan } from "@/context/TripPlanContext";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const { plan } = useTripPlan();
  const router = useRouter();
  //   console.log(plan);
  const tripPlans = [
    {
      destination: "Paris, France",
      days: 7,
      description: "Immerse yourself in local traditions and historical sites",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Eiffel Tower
    },
    {
      destination: "Tokyo, Japan",
      days: 7,
      description: "Perfect blend of outdoor activities and scenic spots",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5b228bd689c172172ab88d9c/1501f7d6-87ac-445c-a87b-e9ff9551ccaa/_DSF5280-Enhanced-NR.jpg", // Tokyo cityscape
    },
    {
      destination: "Grand Canyon, Arizona",
      days: 7,
      description: "Focus on wellness and peaceful experiences",
      imageUrl:
        "https://www.globalnationalparks.com/wp-content/uploads/national-park-grand-canyon.jpg", // Grand Canyon
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

        <div className="w-full sm:w-auto flex justify-end">
          <Button
            onClick={() => router.push("/plan")}
            className="cursor-pointer flex items-center gap-2 text-xs md:text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500 transition"
          >
            <Filter className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Filter</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {tripPlans.map((plan, index) => (
            <TripCard
              key={index}
              destination={plan.destination}
              days={plan.days}
              description={plan.description}
              imageUrl={plan.imageUrl}
              onClick={() => router.push(`/results/${index}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
