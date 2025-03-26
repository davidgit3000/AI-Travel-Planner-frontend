import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type DiningType = {
  restaurant: boolean;
  localCuisine: boolean;
  streetFood: boolean;
  fineDining: boolean;
  vegetarianVegan: boolean;
  seafood: boolean;
  dairyFree: boolean;
  bar: boolean;
  cafe: boolean;
  pub: boolean;
  vietnamese: boolean;
  italian: boolean;
  mexican: boolean;
  thai: boolean;
  indian: boolean;
  japanese: boolean;
  chinese: boolean;
  korean: boolean;
};

interface DiningPreferencesProps {
  diningList: { value: string; label: string }[];
  dining: DiningType;
  setDining: React.Dispatch<React.SetStateAction<DiningType>>;
}

export default function DiningPreferences({
  diningList,
  dining,
  setDining,
}: DiningPreferencesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Dining Preferences{" "}
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Select all that apply)
        </span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diningList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 border rounded-md p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
              dining[option.value as keyof DiningType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
            onClick={() =>
              setDining((prev) => ({
                ...prev,
                [option.value as keyof DiningType]:
                  !prev[option.value as keyof DiningType],
              }))
            }
          >
            <Checkbox
              id={option.value}
              checked={dining[option.value as keyof DiningType]}
              onCheckedChange={(checked) =>
                setDining((prev) => ({
                  ...prev,
                  [option.value as keyof DiningType]: checked === true,
                }))
              }
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                dining[option.value as keyof DiningType] &&
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
