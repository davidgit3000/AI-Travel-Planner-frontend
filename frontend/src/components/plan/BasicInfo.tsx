import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BasicInfoType = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
};

interface BasicInfoProps {
  basicInfo: BasicInfoType;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoType>>;
}

export default function BasicInfo({ basicInfo, setBasicInfo }: BasicInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="destination"
          className="text-base text-slate-900 dark:text-slate-100"
        >
          Where would you like to go?
        </Label>
        <Input
          id="destination"
          placeholder="Enter destination"
          value={basicInfo.destination}
          onChange={(e) => setBasicInfo({ ...basicInfo, destination: e.target.value })}
          className="w-full border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
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
