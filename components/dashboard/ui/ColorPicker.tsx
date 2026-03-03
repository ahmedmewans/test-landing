"use client";

import { ChromePicker, type ColorResult } from "react-color";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const handleChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start", className)}
        >
          <div
            className="size-4 rounded-full mr-2 border border-border"
            style={{ backgroundColor: value }}
          />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <ChromePicker
          color={value}
          onChange={handleChange}
          disableAlpha
          styles={{
            default: {
              picker: {
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
              },
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
