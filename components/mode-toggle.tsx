"use client";

import * as React from "react";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggleMenuItem() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
        <Sun className="w-4 h-4 scale-100 dark:scale-0 transition-transform" />
        <Moon className="absolute w-4 h-4 scale-0 dark:scale-100 transition-transform" />
        <span className="ml-2">Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-[160px]">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center gap-2 mb-1 last:mb-0 cursor-pointer ${
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
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
