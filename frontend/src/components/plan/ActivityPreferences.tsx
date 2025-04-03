import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type ActivityType = {
  hiking: boolean;
  sightseeing: boolean;
  museums: boolean;
  local_markets: boolean;
  adventure_sports: boolean;
  beach_activities: boolean;
  nightlife: boolean;
  photography: boolean;
  cooking_classes: boolean;
  wildlife: boolean;
};

interface ActivityPreferencesProps {
  activityList: { value: string; label: string }[];
  activities: ActivityType;
  setActivities: React.Dispatch<React.SetStateAction<ActivityType>>;
}

export default function ActivityPreferences({
  activityList,
  activities,
  setActivities,
}: ActivityPreferencesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base text-slate-900 dark:text-slate-100">
        Activity Preferences{" "}
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Select all that apply)
        </span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activityList.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-2 border rounded-md p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
              activities[option.value as keyof ActivityType]
                ? "border-2 border-blue-600 dark:border-blue-500"
                : "border-slate-300 dark:border-slate-400"
            )}
            onClick={() =>
              setActivities((prev) => ({
                ...prev,
                [option.value]: !prev[option.value as keyof ActivityType],
              }))
            }
          >
            <Checkbox
              id={option.value}
              checked={activities[option.value as keyof ActivityType]}
              onCheckedChange={(checked) =>
                setActivities((prev) => ({
                  ...prev,
                  [option.value]: checked,
                }))
              }
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                activities[option.value as keyof ActivityType] &&
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
