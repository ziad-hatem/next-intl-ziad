import { useState, useEffect, useCallback, useMemo } from "react";
import { IntlContext } from "./context";
import {
  createTranslationFunction,
  loadTranslations,
} from "./utils/translation";
import {
  getLocaleFromCookie,
  setLocaleToCookie,
  detectLocaleFromAcceptLanguage,
} from "./utils/cookie";
import type {
  IntlProviderProps,
  TranslationResources,
  IntlContextValue,
} from "./types";

export function IntlProvider({
  config,
  initialLocale,
  children,
}: IntlProviderProps) {
  const [locale, setLocale] = useState<string>(() => {
    // Determine initial locale
    if (initialLocale && config.locales.includes(initialLocale)) {
      return initialLocale;
    }

    // Try to get from cookie
    const cookieLocale = getLocaleFromCookie(config.cookieName);
    if (cookieLocale && config.locales.includes(cookieLocale)) {
      return cookieLocale;
    }

    // Try to detect from browser
    if (typeof window !== "undefined" && navigator.language) {
      const browserLocale = detectLocaleFromAcceptLanguage(
        navigator.language,
        config.locales
      );
      if (browserLocale) {
        return browserLocale;
      }
    }

    return config.defaultLocale;
  });

  const [resources, setResources] = useState<TranslationResources>(
    config.resources || {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadLocaleResources = useCallback(
    async (targetLocale: string) => {
      if (!config.loadPath) {
        return;
      }

      setIsLoading(true);
      try {
        const namespace = config.namespace || "common";
        const translations = await loadTranslations(
          targetLocale,
          namespace,
          config.loadPath
        );

        setResources((prev) => ({
          ...prev,
          [targetLocale]: {
            ...prev[targetLocale],
            [namespace]: translations,
          },
        }));
      } catch (error) {
        console.error(
          `Failed to load translations for locale: ${targetLocale}`,
          error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [config.loadPath, config.namespace]
  );

  const changeLocale = useCallback(
    async (newLocale: string) => {
      if (!config.locales.includes(newLocale)) {
        console.warn(
          `Locale "${newLocale}" is not supported. Supported locales: ${config.locales.join(
            ", "
          )}`
        );
        return;
      }

      setLocale(newLocale);
      setLocaleToCookie(newLocale, config);

      // Load translations if not already loaded
      const namespace = config.namespace || "common";
      if (!resources[newLocale]?.[namespace]) {
        await loadLocaleResources(newLocale);
      }
    },
    [config, resources, loadLocaleResources]
  );

  const t = useMemo(() => {
    return createTranslationFunction(
      locale,
      resources,
      config.fallbackLocale,
      config.namespace || "common",
      config.interpolation
        ? {
            prefix: config.interpolation.prefix || "{{",
            suffix: config.interpolation.suffix || "}}",
          }
        : undefined
    );
  }, [
    locale,
    resources,
    config.fallbackLocale,
    config.namespace,
    config.interpolation,
  ]);

  // Load initial translations if using loadPath
  useEffect(() => {
    const namespace = config.namespace || "common";
    if (config.loadPath && !resources[locale]?.[namespace]) {
      loadLocaleResources(locale);
    }
  }, [
    locale,
    config.loadPath,
    config.namespace,
    resources,
    loadLocaleResources,
  ]);

  const contextValue: IntlContextValue = useMemo(
    () => ({
      locale,
      t,
      changeLocale,
      isLoading,
      config,
      resources,
    }),
    [locale, t, changeLocale, isLoading, config, resources]
  );

  return (
    <IntlContext.Provider value={contextValue}>{children}</IntlContext.Provider>
  );
}
