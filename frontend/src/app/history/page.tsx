import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const trips = [
  {
    destination: "Paris, France",
    planDate: "2024-01-15",
    dateFrom: "2024-03-10",
    dateTo: "2024-03-20",
  },
  {
    destination: "Tokyo, Japan",
    planDate: "2024-02-01",
    dateFrom: "2024-04-05",
    dateTo: "2024-04-15",
  },
  {
    destination: "New York, USA",
    planDate: "2024-02-10",
    dateFrom: "2024-05-01",
    dateTo: "2024-05-08",
  },
  {
    destination: "Barcelona, Spain",
    planDate: "2024-03-01",
    dateFrom: "2024-06-15",
    dateTo: "2024-06-25",
  },
  {
    destination: "Dubai, UAE",
    planDate: "2024-03-15",
    dateFrom: "2024-07-10",
    dateTo: "2024-07-20",
  },
];

export default function HistoryPage() {
  return (
    <div className="px-20 py-10 w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Trip History
      </h1>
      <div className="overflow-x-auto w-full rounded-t-xl">
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
            {trips.map((trip, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                  {trip.destination}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {trip.planDate}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {trip.dateFrom}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {trip.dateTo}
                </td>
                <td className="px-6 py-4">
                  <Link href="/history/1">
                    <Button className="bg-gradient-to-r cursor-pointer from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                      View Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
