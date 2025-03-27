import React from "react";
import { Badge } from "@/components/ui/badge";

export default function HistoryDetailPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cultural Explorer</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">7 days</span>
      </div>

      <div className="rounded-xl bg-blue-600 text-white text-4xl font-bold py-10 text-center mb-10">
        Cultural Explorer
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-semibold text-lg mb-2">Trip Highlights</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Local cooking classes with renowned chefs</li>
            <li>Historical guided tours of ancient sites</li>
            <li>Traditional craft workshops with artisans</li>
            <li>Evening cultural performances</li>
            <li>Visit to local markets and bazaars</li>
            <li>Traditional tea ceremony experience</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div>
          <h2 className="font-semibold text-lg mb-2">Accommodation Details</h2>
          <p className="text-sm font-medium">Heritage Grand Hotel</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Luxury 5-star hotel in the heart of the historical district
          </p>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>Features:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Central location near cultural sites</li>
              <li>Traditional architecture with modern amenities</li>
              <li>Spa facilities with traditional treatments</li>
              <li>Cultural activities and classes on-site</li>
            </ul>
            <p className="mt-2">Amenities:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Free high-speed Wi-Fi</li>
              <li>Pool & Fitness Center</li>
              <li>Concierge service</li>
              <li>24/7 Room Service</li>
              <li>Airport Shuttle</li>
              <li>Traditional restaurant</li>
            </ul>
            <p className="mt-2">Rating: <span className="text-blue-600 font-semibold">4.8</span></p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Transportation Options</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Included in Package:</p>
          <ul className="list-disc list-inside ml-4 text-sm text-gray-700 dark:text-gray-300">
            <li>Private airport transfers</li>
            <li>Dedicated tour vehicle</li>
            <li>Local transport card for free time</li>
            <li>Walking tour guide</li>
          </ul>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 mb-1">Additional Options:</p>
          <ul className="list-disc list-inside ml-4 text-sm text-gray-700 dark:text-gray-300">
            <li>Premium car upgrade available</li>
            <li>Bicycle rental service</li>
            <li>Private driver on request</li>
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="font-semibold text-lg mb-4">Daily Schedule</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Day 1</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 ml-4 list-disc">
              <li><strong>09:00</strong> - Airport pickup (Private transfer to hotel)</li>
              <li><strong>12:00</strong> - Welcome lunch (Traditional cuisine)</li>
              <li><strong>14:00</strong> - City tour (Main landmarks)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Day 2</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 ml-4 list-disc">
              <li><strong>09:00</strong> - Museum visit (Guided tour)</li>
              <li><strong>14:00</strong> - Workshop (Local crafts)</li>
              <li><strong>19:00</strong> - Dinner show (Cultural performance)</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-4">Dining Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold">Heritage Restaurant</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Cuisine: <strong>Traditional</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Price Range: <strong>$$$</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Award-winning local dishes</p>
          </div>
          <div>
            <h4 className="font-semibold">Riverside Cafe</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Cuisine: <strong>Fusion</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Price Range: <strong>$$</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Scenic river views</p>
          </div>
          <div>
            <h4 className="font-semibold">Market Square</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Cuisine: <strong>Street Food</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Price Range: <strong>$</strong></p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Authentic experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
