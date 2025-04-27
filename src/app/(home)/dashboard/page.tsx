"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { formatDate } from "@/utils/helpers";
import { Loader2, PlusCircle, Sparkles, Clock } from "lucide-react";
import { useTripPlan } from "@/contexts/TripPlanContext";
import LoadingScreen from "@/components/plan/LoadingScreen";

import {
  getCurrentUser,
  getUserTrips,
  getRecommendedTrip,
  type Trip,
} from "@/app/api/client";

interface TravelStats {
  totalTrips: number;
  countriesVisited: number;
  travelDays: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { setPlan } = useTripPlan();
  const [userName, setUserName] = useState<string>("");
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [inProgressTrips, setInProgressTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TravelStats>({
    totalTrips: 0,
    countriesVisited: 0,
    travelDays: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = useMemo(
    () => [
      "Analyzing your travel history and preferences",
      "Finding the perfect destination for you",
      "Crafting personalized recommendations",
      "Almost there! Finalizing your travel suggestions",
    ],
    []
  );

  const loadingText = useMemo(
    () => loadingSteps[loadingStep % loadingSteps.length],
    [loadingStep, loadingSteps]
  );

  useEffect(() => {
    if (isRecommending) {
      const interval = setInterval(() => {
        setLoadingStep((step) => step + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRecommending]);

  const handleRecommendTrip = async () => {
    try {
      setIsRecommending(true);
      const recommendation = await getRecommendedTrip(userId);

      // Update the trip plan context with the recommendation
      setPlan({
        destination: `${recommendation.data.destination.city}${recommendation.data.destination.state ? `, ${recommendation.data.destination.state}` : ``}, ${recommendation.data.destination.country}`,
        countryLabel: recommendation.data.destination.country,
        specificPlace: `${recommendation.data.destination.city}${recommendation.data.destination.state ? `, ${recommendation.data.destination.state}` : ``}, ${recommendation.data.destination.country}`,
        isSpecificPlace: recommendation.data.isSpecificPlace,
        startDate: recommendation.data.startDate,
        endDate: recommendation.data.endDate,
        travelers: recommendation.data.travelers,
        accommodations: recommendation.data.accommodations,
        tripStyles: recommendation.data.tripStyles,
        dining: recommendation.data.dining,
        transportation: recommendation.data.transportation,
        activities: recommendation.data.activities,
        explanation: recommendation.explanation
      });

      // Show success message with the first highlight
      toast.success(
        recommendation.explanation.highlights[0] || 
        "Got a perfect destination for you!"
      );

      // Navigate to the plan page
      router.push("/plan");
    } catch (error) {
      console.error("Error getting trip recommendation:", error);
      toast.error("Failed to get trip recommendation. Please try again.");
    } finally {
      setIsRecommending(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setIsLoading(false);
          toast.error("User not authenticated. Please sign in first");
          router.push("/sign-in");
          return;
        }

        setUserName(user.fullName.split(" ")[0]); // Get first name
        setUserId(user.userId); // Store userId for recommendation

        const trips = await getUserTrips(user.userId);

        // Find in-progress and upcoming trips
        const today = new Date();
        // Set time to midnight for consistent date comparison
        today.setHours(0, 0, 0, 0);

        const { inProgress, upcoming } = trips.reduce(
          (acc, trip) => {
            // Parse dates and ensure they're in local timezone
            const startDate = new Date(trip.startDate + "T00:00:00");
            const endDate = new Date(trip.endDate + "T00:00:00");

            console.log("Date comparison:", {
              startDate,
              endDate,
              today,
              rawStart: trip.startDate,
              rawEnd: trip.endDate,
            });
            if (startDate <= today && endDate >= today) {
              acc.inProgress.push(trip);
            } else if (startDate > today) {
              acc.upcoming.push(trip);
            }
            return acc;
          },
          { inProgress: [] as Trip[], upcoming: [] as Trip[] }
        );

        setInProgressTrips(
          inProgress.sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          )
        );

        setUpcomingTrips(
          upcoming.sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
        );

        // Calculate stats
        const uniqueCountries = new Set(
          trips.map((trip) => trip.destinationName.split(",").pop()?.trim())
        );
        const totalDays = trips.reduce((acc, trip) => {
          return (
            acc +
            differenceInDays(new Date(trip.endDate), new Date(trip.startDate))
          );
        }, 0);

        setStats({
          totalTrips: trips.length,
          countriesVisited: uniqueCountries.size,
          travelDays: totalDays,
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 p-6 space-y-6">
      {/* Welcome Header */}
      <h1 className="px-12 md:px-0 text-3xl font-bold">
        Welcome back, {userName || "Traveler"}!
      </h1>

      {/* Dashboard Grid */}
      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Button
                // variant="outline"
                size="lg"
                className="w-full text-sm xl:text-lg justify-start shadow-md shadow-slate-400 dark:shadow-slate-300"
                asChild
              >
                <Link href="/plan">
                  <PlusCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-500" />
                  Plan a New Trip
                </Link>
              </Button>
              <Button
                // variant="outline"
                size="lg"
                className="w-full text-sm xl:text-lg justify-start shadow-md shadow-slate-400 dark:shadow-slate-300"
                asChild
              >
                <Link href="/history">
                  <Clock className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  View Past Trips
                </Link>
              </Button>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-full">
                      <Button
                        // variant="outline"
                        size="lg"
                        className={`w-full text-sm xl:text-lg justify-start ${stats.totalTrips === 0 ? "opacity-60 bg-slate-700 dark:bg-slate-300" : "cursor-pointer"} shadow-md shadow-slate-400 dark:shadow-slate-300`}
                        onClick={handleRecommendTrip}
                        disabled={isRecommending || stats.totalTrips === 0}
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                        {isRecommending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Getting Recommendation...
                          </>
                        ) : (
                          "Recommend me a trip"
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    {stats.totalTrips === 0
                      ? "Plan at least one trip to unlock this AI recommendation feature"
                      : "Get an AI-powered trip recommendation based on your travel history"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Travel Stats Card */}
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 dark:text-slate-100">
            Travel Stats
          </h2>
          <CardContent className="p-0 grid grid-cols-3 gap-4">
            {
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Total Trips
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.countriesVisited}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Countries
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.travelDays}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Travel Days
                  </p>
                </div>
              </>
            }
          </CardContent>
        </Card>
      </div>

      {/* In-progress Trips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">
          In-progress Trips
        </h2>
        {inProgressTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressTrips.map((trip) => (
              <Card
                key={trip.tripId}
                className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300"
              >
                <CardContent className="p-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      {trip.destinationName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Planned on {formatDate(trip.planDate)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Start: {formatDate(trip.startDate)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        End: {formatDate(trip.endDate)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/trips/${trip.tripId}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
            <CardContent className="p-0">
              <p className="text-slate-600 dark:text-slate-400">
                No trips currently in progress.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Trips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">
          Upcoming Trips
        </h2>
        {upcomingTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <Card
                key={trip.tripId}
                className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300"
              >
                <CardContent className="p-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      {trip.destinationName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Planned on {formatDate(trip.planDate)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Start: {formatDate(trip.startDate)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        End: {formatDate(trip.endDate)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/trips/${trip.tripId}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
            <CardContent className="p-0">
              <p className="text-slate-600 dark:text-slate-400">
                No upcoming trips. Time to plan one!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {isRecommending && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingScreen
            message={loadingText}
            description={`We're finding the perfect destination based on your travel history. Please wait!`}
            onCancel={() => {
              setIsRecommending(false);
              toast.error("Recommendation cancelled", {
                cancel: true,
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
