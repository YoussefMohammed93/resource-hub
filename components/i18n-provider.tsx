"use client";

import { createContext, useContext, useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

// Import translation files
import enCommon from "@/public/locales/en/common.json";
import arCommon from "@/public/locales/ar/common.json";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
    },
    ar: {
      common: arCommon,
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Language context
interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize state based on what should already be set by the script in layout.tsx
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });

  const [isRTL, setIsRTL] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") || "en";
      return savedLanguage === "ar";
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem("language") || "en";

    // Only update if different from current state to avoid unnecessary re-renders
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
      setIsRTL(savedLanguage === "ar");
    }

    i18n.changeLanguage(savedLanguage);

    // Ensure document direction and lang attribute are set (should already be set by script)
    document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLanguage;

    // Update HTML lang attribute for proper font switching
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.setAttribute("lang", savedLanguage);
    }

    // Set loading to false after language is loaded
    setIsLoading(false);
  }, [language]);

  const changeLanguage = (lang: string) => {
    setIsLoading(true);
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsRTL(lang === "ar");

    // Update document direction and lang attribute
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // Update HTML lang attribute for proper font switching
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.setAttribute("lang", lang);
    }

    // Set loading to false after language change is complete
    setTimeout(() => setIsLoading(false), 100);
  };

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, isRTL, isLoading }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}
