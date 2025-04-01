"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helpers";

export default function TripDetailsPage() {
  const searchParams = useSearchParams();
  const { name } = useParams();
  const router = useRouter();

  const imageUrl = searchParams.get("image") || "";
  const startDate = formatDate(searchParams.get("from") || "");
  const endDate = formatDate(searchParams.get("to") || "");

  const title = name
    ? decodeURIComponent(name as string)
        .replace(/-/g, ", ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

  console.log(title);
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-md md:text-2xl font-bold">{title}</h1>
        <p className="text-xs md:text-sm font-semibold text-muted-foreground">
          {startDate} <span className="text-gray-500">-</span> {endDate}
        </p>
      </div>

      <div className="w-full shadow-lg shadow-slate-400 dark:shadow-slate-500 aspect-[3/2] bg-gray-300 rounded-lg overflow-hidden relative">
        {imageUrl && (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Trip Highlights</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Local cooking classes with renowned chefs</li>
            <li>Historical guided tours of ancient sites</li>
            <li>Traditional craft workshops with artisans</li>
            <li>Evening cultural performances</li>
            <li>Visit to local markets and bazaars</li>
            <li>Traditional tea ceremony experience</li>
          </ul>
        </section>

        <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Weather Forecast</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Temperature: 72°F</li>
            <li>Raining: No</li>
            <li>Humidity: 70%</li>
          </ul>
        </section>

        <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4 md:col-span-1">
          <h2 className="font-semibold mb-2">Accommodation Details</h2>
          <div className="text-sm">
            <p className="font-bold">
              Heritage Grand Hotel{" "}
              <span className="text-blue-500 text-xs ml-2">Rating: 4.8</span>
            </p>
            <p className="mt-2 font-medium">Features</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Central location near cultural sites</li>
              <li>Traditional architecture with modern amenities</li>
              <li>Spa facilities with traditional treatments</li>
              <li>Cultural activities and classes on-site</li>
            </ul>
            <p className="mt-2 font-medium">Amenities</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Free high-speed Wi-Fi</li>
              <li>Pool & Fitness Center</li>
              <li>Concierge service</li>
              <li>24/7 Room Service</li>
              <li>Airport Shuttle</li>
              <li>Traditional restaurant</li>
            </ul>
          </div>
        </section>

        <section className="border border-slate-400 dark:border-slate-300 rounded-lg shadow-lg shadow-slate-400 p-4 md:col-span-1">
          <h2 className="font-semibold mb-2">Dining Recommendations</h2>
          <div className="text-sm space-y-4">
            <div>
              <p className="font-bold">Heritage Restaurant</p>
              <p>
                Cuisine: <span className="italic">Traditional</span>
              </p>
              <p>
                Price Range: <span className="font-semibold">$$$</span>
              </p>
              <p>Award-winning local dishes</p>
            </div>
            <div>
              <p className="font-bold">Riverside Cafe</p>
              <p>
                Cuisine: <span className="italic">Fusion</span>
              </p>
              <p>
                Price Range: <span className="font-semibold">$$</span>
              </p>
              <p>Scenic river views</p>
            </div>
            <div>
              <p className="font-bold">Market Square</p>
              <p>
                Cuisine: <span className="italic">Street Food</span>
              </p>
              <p>
                Price Range: <span className="font-semibold">$</span>
              </p>
              <p>Authentic experience</p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" className="cursor-pointer hover:shadow-lg hover:shadow-slate-400 dark:hover:shadow-slate-500 text-xs md:text-sm" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button className="cursor-pointer hover:shadow-lg hover:shadow-slate-400 dark:hover:shadow-slate-500 text-xs md:text-sm">Plan this trip</Button>
      </div>
    </div>
  );
}
