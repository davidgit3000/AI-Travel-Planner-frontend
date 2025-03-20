import Image from "next/image";

/**
 * The homepage of the AI Travel Planner app.
 *
 * Displays a header with the app title and a tagline, and a call-to-action to
 * plan a trip.
 */
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold">AI Travel Planner</h1>
        <p className="text-lg">Plan your next adventure with AI-powered travel recommendations.</p>  
      </main>
    </div>
  );
}
