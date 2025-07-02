// Main exports
export { IntlProvider } from "./provider";
export { useTranslation, useLocale, useT, withTranslation } from "./hooks";
export {
  createTranslationFunction,
  loadTranslations,
} from "./utils/translation";
export {
  getLocaleFromCookie,
  setLocaleToCookie,
  getLocaleFromServerCookie,
  detectLocaleFromAcceptLanguage,
} from "./utils/cookie";

// Type exports
export type {
  IntlConfig,
  IntlProviderProps,
  UseTranslationResult,
  TranslationFunction,
  TranslationOptions,
  Translation,
  TranslationResources,
  WithTranslationProps,
  IntlContextValue,
} from "./types";
