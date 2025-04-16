"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCachedCountries } from "@/utils/api";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type BasicInfoType = {
  destination: string;
  countryLabel: string;
  specificPlace: string;
  isSpecificPlace: boolean;
  startDate: string;
  endDate: string;
  travelers: number;
};

interface BasicInfoProps {
  basicInfo: BasicInfoType;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoType>>;
}

interface Location {
  value: string;
  label: string;
}

// TODO: Add an input field to search for a particular place (instead of city)
export default function BasicInfo({ basicInfo, setBasicInfo }: BasicInfoProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Location[]>([]);
  const [isSpecificPlace, setIsSpecificPlace] = useState(
    basicInfo.isSpecificPlace
  );

  // Fetch countries on mount
  useEffect(() => {
    async function loadCountries() {
      try {
        setIsLoading(true);
        const countriesData = await getCachedCountries();
        setCountries(
          countriesData.map(
            (country: { cca2: string; name: { common: string } }) => ({
              value: country.cca2.toLowerCase(),
              label: country.name.common,
            })
          )
        );
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCountries();
  }, []);

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Label
              htmlFor="destination-type"
              className="text-base text-slate-900 dark:text-slate-100"
            >
              Destination Type
            </Label>
            <div className="relative w-full sm:w-auto">
              <div className="flex w-full sm:w-[18rem] relative bg-slate-100 dark:bg-slate-800 rounded-lg p-[0.125rem]">
                {/* Sliding background */}
                <div
                  className={`absolute inset-[0.125rem] w-[calc(50%-0.125rem)] bg-white dark:bg-slate-950 rounded-[0.375rem] transition-transform duration-200 ease-out ${
                    isSpecificPlace ? "translate-x-[100%]" : "translate-x-0"
                  }`}
                />
                {/* Buttons */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSpecificPlace(false);
                    setBasicInfo({
                      ...basicInfo,
                      isSpecificPlace: false,
                      specificPlace: "",
                    });
                  }}
                  className={`flex-1 relative z-10 transition-all duration-200 px-3 py-1.5 text-sm rounded-[0.375rem] ${
                    !isSpecificPlace
                      ? "text-primary font-medium ring-1 ring-primary/20 shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  By Country
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSpecificPlace(true);
                    setBasicInfo({
                      ...basicInfo,
                      isSpecificPlace: true,
                      destination: "",
                      countryLabel: "",
                    });
                  }}
                  className={`flex-1 relative z-10 transition-all duration-200 px-3 py-1.5 text-sm rounded-[0.375rem] ${
                    isSpecificPlace
                      ? "text-primary font-medium ring-1 ring-primary/20 shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Specific Place
                </Button>
              </div>
            </div>
          </div>

          {!isSpecificPlace ? (
            <>
              <Label
                htmlFor="destination"
                className="text-base text-slate-900 dark:text-slate-100"
              >
                Select a country
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {basicInfo.countryLabel || "Search a country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandList>
                      <CommandEmpty>
                        {isLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          "No countries found."
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.value}
                            onSelect={() => {
                              setBasicInfo({
                                ...basicInfo,
                                destination: country.label,
                                countryLabel: country.label,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                basicInfo.countryLabel === country.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Label
                htmlFor="specific-place"
                className="text-base text-slate-900 dark:text-slate-100"
              >
                Enter a place or a region (state, province, etc.)
              </Label>
              <Input
                id="specific-place"
                placeholder="e.g., Paris or California"
                value={basicInfo.specificPlace}
                onChange={(e) =>
                  setBasicInfo({
                    ...basicInfo,
                    specificPlace: e.target.value,
                    destination: e.target.value,
                  })
                }
                className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="startDate"
            className="text-base text-slate-900 dark:text-slate-100"
          >
            Start Date
          </Label>
          <div className="w-full">
            <DatePicker
              id="startDate"
              selected={
                basicInfo.startDate
                  ? new Date(basicInfo.startDate + "T00:00:00")
                  : null
              }
              onChange={(date: Date | null) => {
                if (!date) {
                  setBasicInfo({ ...basicInfo, startDate: "" });
                  return;
                }
                // Use 'en-CA' to get YYYY-MM-DD format in local time
                const localDateString = date.toLocaleDateString("en-CA");
                setBasicInfo({
                  ...basicInfo,
                  startDate: localDateString,
                });
              }}
              selectsStart
              startDate={
                basicInfo.startDate
                  ? new Date(basicInfo.startDate + "T00:00:00")
                  : null
              }
              endDate={
                basicInfo.endDate
                  ? new Date(basicInfo.endDate + "T00:00:00")
                  : null
              }
              minDate={new Date()}
              maxDate={
                basicInfo.endDate
                  ? new Date(basicInfo.endDate + "T00:00:00")
                  : undefined
              }
              placeholderText="Select start date"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="endDate"
            className="text-base text-slate-900 dark:text-slate-100"
          >
            End Date
          </Label>
          <div className="w-full">
            <DatePicker
              id="endDate"
              selected={
                basicInfo.endDate
                  ? new Date(basicInfo.endDate + "T00:00:00")
                  : undefined
              }
              onChange={(date: Date | null) => {
                if (!date) {
                  setBasicInfo({ ...basicInfo, endDate: "" });
                  return;
                }
                // Use 'en-CA' to get YYYY-MM-DD format in local time
                const localDateString = date.toLocaleDateString("en-CA");
                setBasicInfo({
                  ...basicInfo,
                  endDate: localDateString,
                });
              }}
              selectsEnd
              startDate={
                basicInfo.startDate
                  ? new Date(basicInfo.startDate + "T00:00:00")
                  : null
              }
              endDate={
                basicInfo.endDate
                  ? new Date(basicInfo.endDate + "T00:00:00")
                  : null
              }
              minDate={
                basicInfo.startDate
                  ? new Date(basicInfo.startDate + "T00:00:00")
                  : undefined
              }
              placeholderText="Select end date"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="travelers"
          className="text-base text-slate-900 dark:text-slate-100"
        >
          Number of Travelers
        </Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          placeholder="Enter number of travelers"
          value={basicInfo.travelers || ''}
          onChange={(e) => {
            const value = e.target.value.replace(/^0+/, '');
            setBasicInfo({ ...basicInfo, travelers: value ? Number(value) : 0 });
          }}
          className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </>
  );
}
