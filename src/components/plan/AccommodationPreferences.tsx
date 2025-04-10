import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type AccommodationType = {
  hotel: boolean;
  hotel_and_resort: boolean;
  boutique_hotel: boolean;
  local_homestay: boolean;
  vacation_rental: boolean;
  hostel: boolean;
};

interface AccommodationPreferencesProps {
  accommodationList: { value: string; label: string }[];
  accommodations: AccommodationType;
  setAccommodations: React.Dispatch<React.SetStateAction<AccommodationType>>;
}

export default function AccommodationPreferences({
  accommodationList,
  accommodations,
  setAccommodations,
}: AccommodationPreferencesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Accommodation Preferences{" "}
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Select all that apply)
        </span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accommodationList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 border rounded-md p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
              accommodations[option.value as keyof AccommodationType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
            onClick={() =>
              setAccommodations((prev) => ({
                ...prev,
                [option.value]: !prev[option.value as keyof AccommodationType],
              }))
            }
          >
            <Checkbox
              id={option.value}
              checked={accommodations[option.value as keyof AccommodationType]}
              onCheckedChange={(checked) =>
                setAccommodations((prev) => ({
                  ...prev,
                  [option.value]: checked === true,
                }))
              }
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                accommodations[option.value as keyof AccommodationType] &&
                  "text-slate-800 dark:text-slate-100"
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
