"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchCities, getCachedCountries, debounce } from "@/utils/api";

export type BasicInfoType = {
  destination: string;
  searchRadius: number;
  startDate: string;
  endDate: string;
  travelers: number;
  searchType: "city" | "country";
};

interface BasicInfoProps {
  basicInfo: BasicInfoType;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoType>>;
}

interface Location {
  value: string;
  label: string;
}

export default function BasicInfo({ basicInfo, setBasicInfo }: BasicInfoProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [countries, setCountries] = useState<Location[]>([]);

  // Fetch countries on mount
  useEffect(() => {
    async function loadCountries() {
      const countriesData = await getCachedCountries();
      setCountries(
        countriesData.map((country) => ({
          value: country.cca2.toLowerCase(),
          label: country.name.common,
        }))
      );
    }
    loadCountries();
  }, []);

  // Debounced city search
  const debouncedCitySearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      try {
        const cities = await searchCities(query);
        setSearchResults(
          cities.map((city) => ({
            value: `${city.id}`,
            label: `${city.name}, ${city.country}`,
          }))
        );
      } catch (error) {
        console.error("Error searching cities:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (query: string) => {
      if (basicInfo.searchType === "city") {
        setIsLoading(true);
        debouncedCitySearch(query);
      }
    },
    [basicInfo.searchType, debouncedCitySearch]
  );

  return (
    <>
      <div className="space-y-4">
        <Label
          htmlFor="destination"
          className="text-base text-slate-900 dark:text-slate-100"
        >
          Where would you like to go?
        </Label>
        <Tabs
          value={basicInfo.searchType}
          onValueChange={(value) => setBasicInfo({ ...basicInfo, searchType: value as "city" | "country" })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="city" className="px-4 text-slate-600 data-[state=active]:text-blue-600 dark:text-slate-400">Search by City</TabsTrigger>
            <TabsTrigger value="country" className="px-4 text-slate-600 data-[state=active]:text-blue-600 dark:text-slate-400">Search by Country</TabsTrigger>
          </TabsList>

          <TabsContent value="city" className="mt-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {basicInfo.destination
                    ? searchResults.find((city) => city.value === basicInfo.destination)?.label
                    : "Search for a city..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search cities..." 
                    onValueChange={handleSearchChange}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        "No cities found."
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((city) => (
                        <CommandItem
                          key={city.value}
                          value={city.value}
                          onSelect={(currentValue) => {
                            setBasicInfo({ ...basicInfo, destination: currentValue });
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              basicInfo.destination === city.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-base text-slate-900 dark:text-slate-100">Search Radius (km)</Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[50]}
                    max={200}
                    step={10}
                    value={[basicInfo.searchRadius]}
                    onValueChange={([value]) =>
                      setBasicInfo({ ...basicInfo, searchRadius: value })
                    }
                    className="[&_[role=slider]]:bg-blue-600"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {basicInfo.searchRadius}km radius from city center
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="country" className="mt-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {basicInfo.destination
                    ? countries.find((country) => country.value === basicInfo.destination)?.label
                    : "Select a country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search countries..." />
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.value}
                          onSelect={(currentValue) => {
                            setBasicInfo({ ...basicInfo, destination: currentValue });
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              basicInfo.destination === country.value ? "opacity-100" : "opacity-0"
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="startDate"
            className="text-base text-slate-900 dark:text-slate-100"
          >
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={basicInfo.startDate}
            onChange={(e) => setBasicInfo({ ...basicInfo, startDate: e.target.value })}
            className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="endDate"
            className="text-base text-slate-900 dark:text-slate-100"
          >
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={basicInfo.endDate}
            onChange={(e) => setBasicInfo({ ...basicInfo, endDate: e.target.value })}
            className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
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
          value={basicInfo.travelers}
          onChange={(e) => setBasicInfo({ ...basicInfo, travelers: Number(e.target.value) })}
          className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </>
  );
}
