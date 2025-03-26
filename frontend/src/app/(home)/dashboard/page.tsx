"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="w-full md:w-2/3 p-6 space-y-6">
      {/* Welcome Header */}
      <h1 className="px-12 md:px-0 text-3xl font-bold">Welcome back, David!</h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 dark:text-slate-100">
            Quick Actions
          </h2>
          <div className="flex flex-col space-y-3">
            <Button className="bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-slate-100 text-white text-xs sm:text-lg">
              <Link href="/plan">Plan New Trip</Link>
            </Button>
            <Button
              variant="outline"
              className="text-xs sm:text-lg border-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 dark:border-slate-300"
            >
              <Link href="/history">View Past Trips</Link>
            </Button>
          </div>
        </Card>

        {/* Upcoming Trip Card */}
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <h2 className="text-sm sm:text-lg font-semibold mb-2 dark:text-slate-100">
            Upcoming Trip
          </h2>
          <CardContent className="bg-blue-600 text-white rounded-lg p-4 text-center text-xl font-semibold">
            Kyoto
          </CardContent>
          <div className="mt-3">
            <Link href="/trip/123">
              <p className="text-gray-700 text-lg font-semibold dark:text-slate-100 hover:underline">
                Cultural Explorer
              </p>
            </Link>
            <p className="text-gray-500 dark:text-slate-100">Kyoto, Japan</p>
            <p className="text-blue-600 font-semibold mt-1">$1899</p>
            <p className="text-gray-500 mt-1">Mar 15 - Mar 22, 2024</p>
          </div>
        </Card>

        {/* Travel Stats Card */}
        <Card className="p-4 border-slate-400 shadow-lg shadow-slate-400 dark:border-slate-300">
          <h2 className="text-sm sm:text-lg font-semibold mb-4 dark:text-slate-100">
            Travel Stats
          </h2>
          <div className="space-y-2">
            <p className="flex justify-between text-gray-700 dark:text-slate-100">
              Total Trips <span className="font-semibold">12</span>
            </p>
            <p className="flex justify-between text-gray-700 dark:text-slate-100">
              Countries Visited <span className="font-semibold">8</span>
            </p>
            <p className="flex justify-between text-gray-700 dark:text-slate-100">
              Travel Days <span className="font-semibold">45</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
