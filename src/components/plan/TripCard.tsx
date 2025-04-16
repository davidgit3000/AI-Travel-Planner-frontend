"use client";
import Image from "next/image";

type TripCardProps = {
  destination: {
    city: string;
    state?: string;
    country?: string;
  };
  days: number;
  description: string;
  imageUrl: string;
  onClick: () => void;
};

export default function TripCard({
  destination,
  days,
  description,
  imageUrl,
  onClick,
}: TripCardProps) {
  return (
    <div className="w-full md:w-[20rem] flex flex-col cursor-pointer rounded-xl shadow-lg shadow-slate-400 dark:shadow-slate-500 bg-white overflow-hidden transition-transform duration-300 transform hover:scale-105" onClick={onClick}>
      <div className="aspect-square h-[12rem] bg-gray-200 dark:bg-gray-700 relative">
        <Image 
          src={imageUrl} 
          alt={`${destination.city}, ${destination.state || destination.country}`} 
          fill 
          className="object-cover" 
        />
      </div>
      <div className="p-4 flex flex-col justify-start">
        <h3 className="font-semibold text-lg text-gray-900 ">
          {`${destination.city}, ${destination.state || destination.country}`}
        </h3>
        <p className="text-sm text-gray-600 ">{days} days</p>
        <p className="mt-1 text-sm text-gray-700 ">{description}</p>
      </div>
    </div>
  );
}
