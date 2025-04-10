import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const handleTransportationChange = (value: string) => {
    const resetState = Object.fromEntries(
      Object.keys(transportation).map(key => [key, false])
    ) as TransportationType;
    
    setTransportation({
      ...resetState,
      [value]: true,
    });
  };

  // Find the currently selected value
  const selectedValue = Object.entries(transportation).find(([_, value]) => value)?.[0] || "";

  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Transportation Preferences
      </Label>
      <RadioGroup 
        value={selectedValue}
        onValueChange={handleTransportationChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {transportationList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 rounded-md border border-slate-300 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
              transportation[option.value as keyof TransportationType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400 cursor-pointer",
                transportation[option.value as keyof TransportationType]
                  ? "text-slate-800 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
