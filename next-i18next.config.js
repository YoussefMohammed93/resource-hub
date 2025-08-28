module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    localeDetection: false,
  },
  fallbackLng: {
    default: ["en"],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  // react: { useSuspense: false }
};
