"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

function Counter({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
  className,
  size = "default",
}: CounterProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const sizeClasses = {
    sm: "h-8",
    default: "h-10",
    lg: "h-12",
  };

  const buttonSizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex items-center border border-border rounded-lg bg-background",
        sizeClasses[size],
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-none border-0 hover:bg-muted",
          buttonSizeClasses[size]
        )}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div
        className={cn(
          "flex-1 text-center font-medium text-foreground border-x border-border flex items-center justify-center",
          textSizeClasses[size]
        )}
      >
        {value}
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-none border-0 hover:bg-muted",
          buttonSizeClasses[size]
        )}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { Counter };
