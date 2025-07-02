import Cookies from "js-cookie";
import type { IntlConfig } from "../types";

const DEFAULT_COOKIE_NAME = "next-intl-ziad-locale";

export function getLocaleFromCookie(cookieName?: string): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return Cookies.get(cookieName || DEFAULT_COOKIE_NAME);
}

export function setLocaleToCookie(
  locale: string,
  config: Pick<IntlConfig, "cookieName" | "cookieOptions">
): void {
  if (typeof window === "undefined") {
    return;
  }

  const cookieName = config.cookieName || DEFAULT_COOKIE_NAME;

  // Build options carefully to avoid any undefined or invalid values
  const baseOptions = {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
    sameSite: "lax" as const,
  };

  // Safely merge user options, filtering out undefined values
  const userOptions = config.cookieOptions || {};
  const options: any = { ...baseOptions };

  if (userOptions.maxAge !== undefined) options.maxAge = userOptions.maxAge;
  if (userOptions.secure !== undefined) options.secure = userOptions.secure;
  if (userOptions.sameSite !== undefined)
    options.sameSite = userOptions.sameSite;
  if (userOptions.domain !== undefined) options.domain = userOptions.domain;
  if (userOptions.path !== undefined) options.path = userOptions.path;

  try {
    // Ensure locale is a string
    const localeString = String(locale);
    Cookies.set(cookieName, localeString, options);
  } catch (error) {
    console.warn("Failed to set locale cookie:", error);
    // Fallback: try with minimal options
    try {
      Cookies.set(cookieName, String(locale), { path: "/" });
    } catch (fallbackError) {
      console.error(
        "Failed to set locale cookie even with fallback:",
        fallbackError
      );
    }
  }
}

export function getLocaleFromServerCookie(
  cookieHeader?: string,
  cookieName?: string
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const name = cookieName || DEFAULT_COOKIE_NAME;
  const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

export function detectLocaleFromAcceptLanguage(
  acceptLanguageHeader?: string,
  supportedLocales: string[] = []
): string | undefined {
  if (!acceptLanguageHeader || supportedLocales.length === 0) {
    return undefined;
  }

  // Parse Accept-Language header
  const languages = acceptLanguageHeader
    .split(",")
    .map((lang) => {
      const [locale, q = "1"] = lang.trim().split(";q=");
      return {
        locale: locale.toLowerCase().split("-")[0], // Extract base locale (e.g., 'en' from 'en-US')
        quality: parseFloat(q),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const { locale } of languages) {
    if (supportedLocales.includes(locale)) {
      return locale;
    }
  }

  return undefined;
}
