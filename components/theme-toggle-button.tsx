"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-muted/75 transition-colors"
      >
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 sm:w-9 text-muted-foreground hover:text-muted-foreground sm:h-9 rounded-lg hover:bg-muted/75 transition-all duration-200 relative"
          aria-label="Toggle theme"
        >
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 scale-100 dark:scale-0 transition-all duration-300 absolute rotate-0 dark:-rotate-90" />
          <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 scale-0 dark:scale-100 transition-all duration-300 absolute rotate-90 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center gap-2 cursor-pointer !mb-1 last:!mb-0 transition-colors ${
                theme === themeOption.value ? "bg-secondary" : ""
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="flex-1">{themeOption.label}</span>
              {theme === themeOption.value && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
