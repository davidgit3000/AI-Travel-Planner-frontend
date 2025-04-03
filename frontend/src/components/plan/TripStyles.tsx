import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type TripStylesType = {
  relaxation: boolean;
  adventure: boolean;
  cultural: boolean;
  shopping: boolean;
  luxury: boolean;
  beach: boolean;
  hiking: boolean;
  "budget-friendly": boolean;
  outdoor: boolean;
  urban: boolean;
  foodWine: boolean;
  historical: boolean;
};

interface TripStylesProps {
  tripStylesList: { value: string; label: string }[];
  tripStyles: TripStylesType;
  setTripStyles: React.Dispatch<React.SetStateAction<TripStylesType>>;
}

export default function TripStyles({
  tripStylesList,
  tripStyles,
  setTripStyles,
}: TripStylesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Trip Styles{" "}
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Select all that apply)
        </span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tripStylesList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 border rounded-md p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
              tripStyles[option.value as keyof TripStylesType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
            onClick={() =>
              setTripStyles((prev) => ({
                ...prev,
                [option.value as keyof TripStylesType]:
                  !prev[option.value as keyof TripStylesType],
              }))
            }
          >
            <Checkbox
              id={option.value}
              checked={tripStyles[option.value as keyof TripStylesType]}
              onCheckedChange={(checked) =>
                setTripStyles((prev) => ({
                  ...prev,
                  [option.value as keyof TripStylesType]: checked === true,
                }))
              }
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                tripStyles[option.value as keyof TripStylesType] &&
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
