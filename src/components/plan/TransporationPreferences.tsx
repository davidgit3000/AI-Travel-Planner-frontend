import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type TransportationType = {
  car_rental: boolean;
  public_transport: boolean;
  taxi: boolean;
  walking: boolean;
  biking: boolean;
  train: boolean;
  bus: boolean;
  boat: boolean;
  [key: string]: boolean;
};

interface TransporationPreferencesProps {
  transportationList: { value: string; label: string }[];
  transportation: TransportationType;
  setTransportation: React.Dispatch<React.SetStateAction<TransportationType>>;
}

export default function TransporationPreferences({
  transportationList,
  transportation,
  setTransportation,
}: TransporationPreferencesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Transportation Preferences{" "}
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Select all that apply)
        </span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transportationList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 border rounded-md p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
              transportation[option.value as keyof TransportationType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
            onClick={() =>
              setTransportation((prev) => ({
                ...prev,
                [option.value as keyof TransportationType]:
                  !prev[option.value as keyof TransportationType],
              }))
            }
          >
            <Checkbox
              id={option.value}
              checked={transportation[option.value as keyof TransportationType]}
              onCheckedChange={(checked) =>
                setTransportation((prev) => ({
                  ...prev,
                  [option.value as keyof TransportationType]: checked === true,
                }))
              }
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                transportation[option.value as keyof TransportationType] &&
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
