"use client";

import { Badge } from "@/components/ui/badge";

type SelectionGroupProps = {
  label: string;
  options: Record<string, boolean>;
  onChange?: (key: string) => void;
};

export default function SelectionGroup({
  label,
  options,
  onChange,
}: SelectionGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([key, isSelected]) => (
          <Badge 
            key={key} 
            variant={isSelected ? "default" : "outline"}
            className={`text-xs cursor-pointer ${isSelected ? 'bg-blue-600 hover:bg-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            onClick={() => onChange?.(key)}
          >
            {key.replace(/_/g, " ")}
          </Badge>
        ))}
      </div>
    </div>
  );
}
