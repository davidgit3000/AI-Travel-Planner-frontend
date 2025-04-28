"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTripByTripId, type Trip } from "@/app/api/client";
import { toast } from "sonner";

interface TripDetailsProps {
  tripId: string;
}

export default function TripDetails({ tripId }: TripDetailsProps) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const currentTrip = await getTripByTripId(tripId);

        if (!currentTrip) {
          toast.error("Trip not found");
          router.push("/history");
          return;
        }

        setTrip(currentTrip);

        // Reset error state when loading new image
        setImageError(false);
        
        // Use the image URL from the database if available
        if (currentTrip.imgLink) {
          setImageUrl(currentTrip.imgLink);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("Failed to load trip details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-w-sm md:min-w-3xl max-w-4xl mx-auto px-6 md:px-8 py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {trip.destinationName}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {new Date(trip.startDate + "T00:00:00").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(trip.endDate + "T00:00:00").toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Left side - Image */}
        <div className="h-[20rem] md:h-[30rem]">
          <div className="relative h-full w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-400 dark:shadow-slate-600">
            {imageError ? (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <svg
                  className="w-12 h-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Unable to load image</p>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={`${trip.destinationName} view`}
                fill
                className="object-cover"
                priority
                unoptimized={(imageUrl || "").startsWith("data:")} // Disable optimization for base64 images
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>

        {/* Right side - Trip Highlights */}
        <div className="h-full">
          <div className="h-full bg-background text-foreground rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-400 dark:shadow-slate-600 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Trip Highlights
            </h2>
            <ul className="space-y-2 list-disc pl-6 text-slate-600 dark:text-slate-400">
              {trip.tripHighlights
                ?.split("\n")
                .map((highlight, index) => (
                  <li key={index}>
                    {highlight.trim().charAt(0).toUpperCase() +
                      highlight.trim().slice(1)}
                  </li>
                )) || (
                <li className="text-slate-500 dark:text-slate-500 italic">
                  No highlights available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="h-10 px-8 border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        {trip.linkPdf && (
          <Link href={trip.linkPdf} target="_blank">
            <Button className="h-10 px-8 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
              View Trip Schedule
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
