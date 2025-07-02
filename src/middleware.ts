// Type-only imports to avoid dependency errors
type NextRequest = any;
type NextResponse = any;

// Dynamic imports for Next.js types when available
let NextRequest: any, NextResponse: any;
try {
  const nextServer = require("next/server");
  NextRequest = nextServer.NextRequest;
  NextResponse = nextServer.NextResponse;
} catch {
  // Next.js not available - middleware will be a no-op
}
import {
  detectLocaleFromAcceptLanguage,
  getLocaleFromServerCookie,
} from "./utils/cookie";
import type { MiddlewareConfig } from "./types";

const DEFAULT_COOKIE_NAME = "next-intl-ziad-locale";

export function createIntlMiddleware(config: MiddlewareConfig) {
  return function middleware(request: NextRequest) {
    // Return early if Next.js is not available
    if (!NextResponse) {
      return;
    }

    const pathname = request.nextUrl.pathname;
    const cookieName = config.cookieName || DEFAULT_COOKIE_NAME;

    // Skip if locale detection is disabled
    if (config.localeDetection === false) {
      return NextResponse.next();
    }

    // Skip if pathname already contains a locale
    const localeInPath = config.locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (localeInPath) {
      return NextResponse.next();
    }

    // Detect locale from cookie or Accept-Language header
    let detectedLocale = getLocaleFromServerCookie(
      request.headers.get("cookie") || "",
      cookieName
    );

    if (!detectedLocale || !config.locales.includes(detectedLocale)) {
      detectedLocale = detectLocaleFromAcceptLanguage(
        request.headers.get("accept-language") || "",
        config.locales
      );
    }

    const finalLocale = detectedLocale || config.defaultLocale;

    // Redirect to localized URL
    const redirectUrl = new URL(`/${finalLocale}${pathname}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set locale cookie if it's different from current
    if (detectedLocale !== finalLocale) {
      response.cookies.set(cookieName, finalLocale, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  };
}

export function createMiddleware(config: MiddlewareConfig) {
  return createIntlMiddleware(config);
}
