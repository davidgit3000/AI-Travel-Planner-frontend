"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, getUserTrips, type Trip } from "@/app/api/client";
import { differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TravelStats {
  totalTrips: number;
  countriesVisited: number;
  travelDays: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TravelStats>({
    totalTrips: 0,
    countriesVisited: 0,
    travelDays: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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

        const trips = await getUserTrips(user.userId);

        // Find upcoming trips
        const today = new Date();
        const futureTrips = trips
          .filter((trip) => new Date(trip.startDate) >= today)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        setUpcomingTrips(futureTrips);

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
      {/* Quick Actions and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 dark:text-slate-100">
            Quick Actions
          </h2>
          <div className="flex flex-col space-y-3">
            <Button
              className="bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-slate-100 text-white text-xs sm:text-lg"
              asChild
            >
              <Link href="/plan">Plan New Trip</Link>
            </Button>
            <Button
              variant="outline"
              className="text-xs sm:text-lg border-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 dark:border-slate-300"
              asChild
            >
              <Link href="/history">View Past Trips</Link>
            </Button>
          </div>
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

      {/* Upcoming Trips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Upcoming Trips</h2>
        {upcomingTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <Card key={trip.tripId} className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
                <CardContent className="p-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{trip.destinationName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/history/${trip.tripId}`}>View Details</Link>
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
    </div>
  );
}
