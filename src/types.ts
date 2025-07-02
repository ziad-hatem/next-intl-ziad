import { ReactNode } from "react";

export interface Translation {
  [key: string]: string | Translation;
}

export interface TranslationResources {
  [locale: string]: {
    [namespace: string]: Translation;
  };
}

export interface IntlConfig {
  defaultLocale: string;
  locales: string[];
  cookieName?: string;
  cookieOptions?: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    domain?: string;
    path?: string;
  };
  fallbackLocale?: string;
  namespace?: string;
  resources?: TranslationResources;
  loadPath?: string;
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
}

export interface IntlContextValue {
  locale: string;
  t: TranslationFunction;
  changeLocale: (locale: string) => Promise<void>;
  isLoading: boolean;
  config: IntlConfig;
  resources: TranslationResources;
}

export interface UseTranslationResult {
  t: TranslationFunction;
  locale: string;
  changeLocale: (locale: string) => Promise<void>;
  isLoading: boolean;
}

export interface TranslationFunction {
  (key: string, options?: TranslationOptions): string;
}

export interface TranslationOptions {
  defaultValue?: string;
  ns?: string;
  [key: string]: string | number | undefined;
}

export interface IntlProviderProps {
  config: IntlConfig;
  initialLocale?: string;
  children: ReactNode;
}

export interface WithTranslationProps {
  t: TranslationFunction;
  locale: string;
  changeLocale: (locale: string) => Promise<void>;
  isLoading: boolean;
}

export interface MiddlewareConfig {
  locales: string[];
  defaultLocale: string;
  cookieName?: string;
  matcher?: string | string[];
  localeDetection?: boolean;
}
