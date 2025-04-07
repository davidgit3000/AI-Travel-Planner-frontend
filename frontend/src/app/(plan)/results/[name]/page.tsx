"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getRecommendations } from "@/utils/db";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helpers";
import { useEffect, useState } from "react";

interface TripDetails {
  destination: {
    city: string;
    country: string;
  };
  description: string;
  highlights: string[];
  imageUrl: string;
}

export default function TripDetailsPage() {
  const searchParams = useSearchParams();
  const { name } = useParams();
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const startDate = formatDate(searchParams.get("from") || "");
  const endDate = formatDate(searchParams.get("to") || "");

  const title = name
    ? decodeURIComponent(name as string)
        .replace(/-/g, ", ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : "";

  useEffect(() => {
    async function loadTripDetails() {
      try {
        const data = await getRecommendations();
        if (data) {
          const destination = data.destinations.find((dest: TripDetails) => {
            const destString = `${dest.destination.city}, ${dest.destination.country}`;
            // Convert both strings to lowercase and normalize spaces and commas
            const normalizedDest = destString.toLowerCase().replace(/\s+/g, ' ').trim();
            const normalizedTitle = title.toLowerCase().replace(/\s+/g, ' ').trim();
            return normalizedDest === normalizedTitle;
          });
          if (destination) {
            setTripDetails(destination);
            setImageUrl(destination.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error loading trip details:', error);
      }
    }
    loadTripDetails();
  }, [title]);

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-md md:text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

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
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover"
            unoptimized={imageUrl.startsWith('data:')} // Disable optimization for base64 images
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4 md:col-span-2">
          <h2 className="font-semibold mb-2">About {tripDetails.destination.city}</h2>
          <p className="text-sm">{tripDetails.description}</p>
        </section>

        <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Trip Highlights</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {tripDetails.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
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
