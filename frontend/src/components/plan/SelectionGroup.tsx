"use client";

import { Badge } from "@/components/ui/badge";

type SelectionGroupProps = {
  label: string;
  options: Record<string, boolean>;
};

export default function SelectionGroup({
  label,
  options,
}: SelectionGroupProps) {
  const selected = Object.entries(options)
    .filter(([_, selected]) => selected)
    .map(([key]) => key.replace(/_/g, " "));

  if (selected.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <Badge key={item} className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
