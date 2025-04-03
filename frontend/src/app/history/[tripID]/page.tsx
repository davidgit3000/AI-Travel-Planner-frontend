"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HistoryDetailPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Tokyo, Japan
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          2/26/2025 - 3/28/2025
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left side - Image */}
        <div className="h-[400px] md:h-full">
          <div className="relative h-full w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-400 dark:shadow-slate-600">
            <Image
              src="https://images.squarespace-cdn.com/content/v1/5b228bd689c172172ab88d9c/1501f7d6-87ac-445c-a87b-e9ff9551ccaa/_DSF5280-Enhanced-NR.jpg"
              alt="Tokyo cityscape"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right side - Trip Highlights */}
        <div className="h-[400px] md:h-full">
          <div className="h-full bg-background text-foreground rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-400 dark:shadow-slate-600 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Trip Highlights
            </h2>
            <ul className="space-y-2 list-disc pl-6 text-slate-600 dark:text-slate-400">
              <li>Local cooking classes with renowned chefs</li>
              <li>Historical guided tours of ancient sites</li>
              <li>Traditional craft workshops with artisans</li>
              <li>Evening cultural performances</li>
              <li>Visit to local markets and bazaars</li>
              <li>Traditional tea ceremony experience</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="h-10 px-8 border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Link href="/schedule.pdf" target="_blank">
          <Button className="h-10 px-8 bg-blue-600 hover:bg-blue-500 text-white">
            View Trip Schedule
          </Button>
        </Link>
      </div>
    </div>
  );
}
