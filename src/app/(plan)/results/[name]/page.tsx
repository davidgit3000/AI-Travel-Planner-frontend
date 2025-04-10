"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getRecommendations } from "@/utils/db";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  calculateTripDuration,
  normalizeDate,
} from "@/utils/helpers";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import LoadingScreen from "@/components/plan/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTrip,
  planTrip,
  getUserTrips,
  type Trip,
} from "@/app/api/client";

interface TripDetails {
  destination: {
    city: string;
    country: string;
  };
  description: string;
  highlights: string[];
  imageUrl?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop";

export default function TripDetailsPage() {
  const loadingSteps = useMemo(() => [
    "Our AI agent is analyzing your trip details",
    "Crafting a personalized itinerary",
    "Adding local insights and recommendations",
    "Preparing to send your custom travel plan",
  ], []);

  const { user } = useAuth();
  const [isPlanning, setIsPlanning] = useState(false);
  const [isPlanned, setIsPlanned] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);
  const searchParams = useSearchParams();
  const { name } = useParams();
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const startDate = formatDate(searchParams.get("from") || "");
  const endDate = formatDate(searchParams.get("to") || "");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlanning) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlanning, loadingSteps.length]);

  useEffect(() => {
    if (isPlanning) {
      setLoadingText(loadingSteps[loadingStep]);
    }
  }, [loadingStep, isPlanning, loadingSteps]);

  const title = name
    ? decodeURIComponent(name as string)
        .replace(/-/g, ", ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "";

  // Check if trip already exists when component mounts
  useEffect(() => {
    console.log("Checking existing trip...");

    async function loadTripDetails() {
      try {
        const data = await getRecommendations();
        if (data) {
          const destination = data.destinations.find((dest: TripDetails) => {
            const destString = `${dest.destination.city}, ${dest.destination.country}`;
            // Convert both strings to lowercase and normalize spaces and commas
            const normalizedDest = destString
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim();
            const normalizedTitle = title
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim();
            return normalizedDest === normalizedTitle;
          });
          if (destination) {
            setTripDetails(destination);
            setImageUrl(destination.imageUrl || FALLBACK_IMAGE);
          }
        }
      } catch (error) {
        console.error("Error loading trip details:", error);
      }
    }
    loadTripDetails();
  }, [title]);

  useEffect(() => {
    async function checkExistingTrip() {
      if (!user?.userId || !tripDetails) {
        console.log("Not enough data to check for existing trip");
        return;
      }
      console.log("Continue checking existing trip...");
      try {
        const userTrips = await getUserTrips(user.userId);
        console.log("User trips:", userTrips);
        console.log("Current trip details:", {
          destination: `${tripDetails?.destination.city}, ${tripDetails?.destination.country}`,
          startDate,
          endDate,
        });

        const tripExists = userTrips.some((trip: Trip) => {
          const normalizedDestination = trip.destinationName
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
          const currentDestination =
            `${tripDetails?.destination.city}, ${tripDetails?.destination.country}`
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim();
          const storedStart = normalizeDate(trip.startDate);
          const storedEnd = normalizeDate(trip.endDate);
          const currentStart = normalizeDate(startDate);
          const currentEnd = normalizeDate(endDate);

          console.log("Comparing trip:", {
            stored: {
              destination: normalizedDestination,
              startDate: storedStart,
              endDate: storedEnd,
            },
            current: {
              destination: currentDestination,
              startDate,
              endDate,
            },
            matches: {
              destination: normalizedDestination === currentDestination,
              startDate: storedStart === currentStart,
              endDate: storedEnd === currentEnd,
            },
          });

          return (
            normalizedDestination === currentDestination &&
            storedStart === currentStart &&
            storedEnd === currentEnd
          );
        });

        console.log("Trip exists:", tripExists);
        if (tripExists) {
          setIsPlanned(true);
          toast.info(
            "This trip has already been planned! Please check trip history"
          );
        }
      } catch (error) {
        console.error("Error checking existing trip:", error);
      }
    }

    checkExistingTrip();
  }, [tripDetails, startDate, endDate, user?.userId]);

  // When the button "Plan this trip" is clicked, send the trip details to the backend
  const handlePlanTrip = async () => {
    console.log("handlePlanTrip called");
    if (!tripDetails) {
      toast.error("No trip details available");
      return;
    }

    setIsPlanning(true);
    try {
      console.log("Sending trip plan request...");
      // Plan trip using AI agent from n8n and sent it to the user's email
      const result = await planTrip({
        destination: `${tripDetails.destination.city}, ${tripDetails.destination.country}`,
        startDate,
        endDate,
        fullName: user?.fullName,
        days: calculateTripDuration(startDate, endDate),
        email: user?.email,
      });

      console.log("Trip plan result:", result);

      if (!result.itineraryUrl) {
        throw new Error("No itinerary URL received");
      }

      console.log("Sending trip to API:", {
        userId: user?.userId,
        destinationName: `${tripDetails.destination.city}, ${tripDetails.destination.country}`,
        planDate: new Date().toISOString().split("T")[0],
        startDate: new Date(startDate).toISOString().split("T")[0],
        endDate: new Date(endDate).toISOString().split("T")[0],
        tripHighlights: tripDetails.highlights.join("\n"),
        linkPdf: result.itineraryUrl,
        imgLink: imageUrl || "",
      });

      // Create trip record in database
      if (user?.userId) {
        try {
          await createTrip({
            userId: user?.userId,
            destinationName: `${tripDetails.destination.city}, ${tripDetails.destination.country}`,
            planDate: new Date().toISOString().split("T")[0],
            startDate: new Date(startDate).toISOString().split("T")[0],
            endDate: new Date(endDate).toISOString().split("T")[0],
            tripHighlights: tripDetails.highlights.join("\n"),
            linkPdf: result.itineraryUrl, // If your API returns a PDF URL
            imgLink: imageUrl || "",
          });
        } catch (error) {
          console.error("Error saving trip to database:", error);
          // Don't show error to user since the trip plan was still sent to their email
        }
      }

      toast.success("Your trip is being planned! Check your email soon.");
      setIsPlanned(true);
    } catch (err) {
      console.error("Trip planning error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while planning your trip."
      );
    } finally {
      setIsPlanning(false);
    }
  };
  
  if (!tripDetails) {
    return (
      <>
        <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10 max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-md md:text-2xl font-bold">Loading...</h1>
          </div>
        </div>
        {isPlanning && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <LoadingScreen
              message={loadingText}
              onCancel={() => {
                setIsPlanning(false);
                toast.error("Trip planning cancelled");
              }}
            />
          </div>
        )}
      </>
    );
  }

 
  return (
    <>
      <div className="min-h-screen bg-background text-foreground px-4 py-20 md:py-10 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-md md:text-2xl font-bold">{title}</h1>
          <p className="text-xs md:text-sm font-semibold text-muted-foreground">
            {startDate} <span className="text-gray-500">-</span> {endDate}
          </p>
        </div>

        <div className="w-full shadow-lg shadow-slate-400 dark:shadow-slate-500 aspect-[3/2] bg-gray-300 rounded-lg overflow-hidden relative">
          <Image
            src={imageUrl || FALLBACK_IMAGE}
            alt={title}
            fill
            className="object-cover"
            unoptimized={(imageUrl || "").startsWith("data:")} // Disable optimization for base64 images
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4 md:col-span-2">
            <h2 className="font-semibold mb-2">
              About {tripDetails.destination.city}
            </h2>
            <p className="text-sm">{tripDetails.description}</p>
          </section>

          <section className="border border-slate-400 dark:border-slate-300 shadow-lg shadow-slate-400 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Trip Highlights</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {tripDetails.highlights.map((highlight, index) => (
                <li key={index}>
                  {highlight.charAt(0).toUpperCase() + highlight.slice(1)}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            className="cursor-pointer hover:shadow-lg hover:shadow-slate-400 dark:hover:shadow-slate-500 text-xs md:text-sm"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            className={`${
              isPlanned
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:shadow-lg hover:shadow-slate-400 dark:hover:shadow-slate-500"
            } text-xs md:text-sm`}
            onClick={handlePlanTrip}
            disabled={isPlanning || isPlanned}
          >
            {isPlanning
              ? "Planning..."
              : isPlanned
                ? "Planned and sent"
                : "Plan this trip"}
          </Button>
        </div>
      </div>
      {isPlanning && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingScreen
            message={loadingText}
            onCancel={() => {
              setIsPlanning(false);
              toast.error("Trip planning cancelled");
            }}
          />
        </div>
      )}
    </>
  );
}
