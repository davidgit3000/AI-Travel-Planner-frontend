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
  const fallbackImage =
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200";
  const [imageUrl, setImageUrl] = useState(fallbackImage);

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

        // Use the image URL from the database if available
        if (currentTrip.imgLink) {
          setImageUrl(currentTrip.imgLink);
        } else {
          setImageUrl(fallbackImage);
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
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left side - Image */}
        <div className="h-[400px] md:h-full">
          <div className="relative h-full w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-400 dark:shadow-slate-600">
            <Image
              src={imageUrl || fallbackImage}
              alt={`${trip.destinationName} view`}
              fill
              className="object-cover"
              priority
            />
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
