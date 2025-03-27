"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  // const [selected, setSelected] = React.useState<string[]>(value ?? defaultValue);
  const [inputValue, setInputValue] = React.useState("");

  const selected = value ?? defaultValue;

  const handleSelect = React.useCallback(
    (val: string) => {
      if (value?.includes(val)) {
        onChange?.(value.filter((v) => v !== val));
      } else {
        onChange?.([...(value ?? []), val]);
      }
    },
    [value, onChange]
  );

  const handleRemove = React.useCallback(
    (val: string) => {
      onChange?.(value?.filter((v) => v !== val) ?? []);
    },
    [value, onChange]
  );

  React.useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  return (
    <div className="relative">
      <div
        className="relative flex min-h-[38px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {option?.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemove(value);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder={selected.length === 0 ? "Select items..." : undefined}
          />
        </div>
      </div>
      {open && (
        <div className="absolute top-[100%] mt-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <div className="max-h-[200px] overflow-auto p-1">
            {options
              .filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    selected.includes(option.value)
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelect(option.value);
                    setInputValue("");
                  }}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input"
                    }`}
                  >
                    {selected.includes(option.value) && (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
