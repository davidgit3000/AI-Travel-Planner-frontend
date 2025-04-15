"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserTrips } from "@/app/api/client";
import { Loader2 } from "lucide-react";
import type { Trip } from "@/app/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// TODO: How to make the table view fully visible in mobile view
export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          toast.error("User not authenticated. Please sign in.");
          setIsLoading(false);
          router.push("/sign-in");
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.userId;
        if (!userId) {
          toast.error("User not authenticated");
          setIsLoading(false);
          return;
        }

        const tripsData = await getUserTrips(userId);
        // Filter trips that ended before today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
        
        const pastTrips = tripsData.filter(trip => {
          const endDate = new Date(trip.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate < today;
        });
        
        // Sort by end date, most recent first
        pastTrips.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        
        setTrips(pastTrips);
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load trips: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    fetchTrips();
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
    <div className="px-4 md:px-20 py-20 md:py-10 w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Trip History
      </h1>
      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto w-full rounded-t-xl">
        <table className="w-full max-w-[90rem] mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-left text-sm font-semibold">
              <th className="px-6 py-4 rounded-tl-xl">Destination</th>
              <th className="px-6 py-4">Plan Date</th>
              <th className="px-6 py-4">Date From</th>
              <th className="px-6 py-4">Date To</th>
              <th className="px-6 py-4 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No past trips found. Start planning your next adventure!
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr
                  key={trip.tripId}
                  className="border-t border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                    {trip.destinationName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {new Date(trip.planDate + 'T00:00:00').toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {new Date(trip.startDate + 'T00:00:00').toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {new Date(trip.endDate + 'T00:00:00').toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/trips/${trip.tripId}`}>
                      <Button className="bg-gradient-to-r cursor-pointer from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden space-y-4 -mx-4 px-4">
        {trips.length === 0 ? (
          <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              No past trips found. Start planning your next adventure!
            </p>
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.tripId}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4 shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {trip.destinationName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Planned on: {new Date(trip.planDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From: {new Date(trip.startDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  To: {new Date(trip.endDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <Link href={`/trips/${trip.tripId}`} className="block">
                <Button className="w-full bg-gradient-to-r cursor-pointer from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                  View Details
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
