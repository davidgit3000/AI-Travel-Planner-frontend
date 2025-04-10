"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  message: string;
  onCancel?: () => void;
}

export default function LoadingScreen({
  message,
  onCancel,
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-slate-400 bg-white p-8 shadow-lg dark:border-slate-600 dark:bg-slate-900">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {message}
            {dots}
          </p>
          {onCancel && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={onCancel}
                className="text-xs sm:text-sm px-4 transition-all duration-200 text-red-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
