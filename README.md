# next-intl-ziad

A lightweight, reliable internationalization library for React and Next.js that combines the best of `next-intl` and `react-i18next` while solving their major pain points.

[![npm version](https://badge.fury.io/js/next-intl-ziad.svg)](https://badge.fury.io/js/next-intl-ziad)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- 🚀 **Lightweight** - < 50kB bundle size, tree-shakable
- ⚡ **Fast** - Optimized for performance with minimal overhead
- 🔄 **SSR Support** - Full server-side rendering compatibility
- 🍪 **Cookie-based** - Automatic locale detection and persistence
- 📱 **Universal** - Works with React, Next.js App Router, and Pages Router
- 🛡️ **TypeScript** - Complete type safety and IntelliSense
- 🎯 **Zero Config** - No `next.config.js` modifications required
- 🔌 **Flexible** - JSON translations with nested or flat structure
- 🎣 **Hook-based** - Clean, modern React API

## 🚫 Problems Solved

### From next-intl:

- ❌ No client/server hydration mismatches
- ❌ No mandatory config wrapping or leaking
- ❌ No complex routing setup required

### From react-i18next:

- ❌ No bulky plugin chains or over-abstraction
- ❌ No complex initialization patterns
- ❌ No performance overhead from heavy dependencies

## 📦 Installation

```bash
npm install next-intl-ziad
# or
yarn add next-intl-ziad
# or
pnpm add next-intl-ziad
```

## 🚀 Quick Start

### Next.js App Router

#### 1. Create your translation files

```json
// public/locales/en/common.json
{
  "welcome": "Welcome to our app!",
  "greeting": "Hello {{name}}!",
  "navigation": {
    "home": "Home",
    "about": "About"
  }
}
```

```json
// public/locales/es/common.json
{
  "welcome": "¡Bienvenido a nuestra aplicación!",
  "greeting": "¡Hola {{name}}!",
  "navigation": {
    "home": "Inicio",
    "about": "Acerca de"
  }
}
```

#### 2. Setup middleware (optional but recommended)

```typescript
// middleware.ts
import { createMiddleware } from "next-intl-ziad/middleware";

export default createMiddleware({
  locales: ["en", "es", "fr"],
  defaultLocale: "en",
  cookieName: "my-app-locale", // optional
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

#### 3. Setup your layout

```tsx
// app/[locale]/layout.tsx
import { IntlProvider } from "next-intl-ziad";

const intlConfig = {
  defaultLocale: "en",
  locales: ["en", "es", "fr"],
  loadPath: "/locales/{{lng}}/{{ns}}.json", // optional for dynamic loading
  cookieName: "my-app-locale", // optional
  fallbackLocale: "en", // optional
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <IntlProvider config={intlConfig} initialLocale={params.locale}>
      {children}
    </IntlProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }, { locale: "fr" }];
}
```

#### 4. Use in your components

```tsx
// app/[locale]/page.tsx
"use client";
import { useTranslation, useLocale } from "next-intl-ziad";

export default function HomePage() {
  const { t } = useTranslation();
  const { locale, changeLocale } = useLocale();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("greeting", { name: "John" })}</p>
      <p>Current locale: {locale}</p>

      <button onClick={() => changeLocale("es")}>Español</button>
      <button onClick={() => changeLocale("en")}>English</button>
    </div>
  );
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
import { IntlProvider } from "next-intl-ziad";
import type { AppProps } from "next/app";

const intlConfig = {
  defaultLocale: "en",
  locales: ["en", "es", "fr"],
  resources: {
    en: {
      common: {
        welcome: "Welcome!",
        greeting: "Hello {{name}}!",
      },
    },
    es: {
      common: {
        welcome: "¡Bienvenido!",
        greeting: "¡Hola {{name}}!",
      },
    },
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider config={intlConfig}>
      <Component {...pageProps} />
    </IntlProvider>
  );
}
```

### Pure React

```tsx
// App.tsx
import { IntlProvider, useTranslation } from "next-intl-ziad";

const intlConfig = {
  defaultLocale: "en",
  locales: ["en", "es"],
  resources: {
    en: {
      common: {
        welcome: "Welcome to React!",
      },
    },
    es: {
      common: {
        welcome: "¡Bienvenido a React!",
      },
    },
  },
};

function MyComponent() {
  const { t, locale, changeLocale } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <button onClick={() => changeLocale(locale === "en" ? "es" : "en")}>
        Switch Language
      </button>
    </div>
  );
}

export default function App() {
  return (
    <IntlProvider config={intlConfig}>
      <MyComponent />
    </IntlProvider>
  );
}
```

## 📚 API Reference

### Configuration

```typescript
interface IntlConfig {
  defaultLocale: string; // Default language
  locales: string[]; // Supported languages
  cookieName?: string; // Cookie name for locale storage
  cookieOptions?: {
    // Cookie configuration
    maxAge?: number;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    domain?: string;
    path?: string;
  };
  fallbackLocale?: string; // Fallback when translation missing
  namespace?: string; // Default namespace (default: 'common')
  resources?: TranslationResources; // Inline translations
  loadPath?: string; // Dynamic loading path pattern
  interpolation?: {
    // Interpolation configuration
    prefix?: string; // Default: '{{'
    suffix?: string; // Default: '}}'
  };
}
```

### Hooks

#### `useTranslation()`

```typescript
const { t, locale, changeLocale, isLoading } = useTranslation();

// t: Translation function
// locale: Current locale string
// changeLocale: Function to change locale
// isLoading: Boolean indicating if translations are loading
```

#### `useLocale()`

```typescript
const { locale, changeLocale } = useLocale();
```

#### `useT()`

```typescript
const t = useT(); // Just the translation function
```

### Translation Function

```typescript
// Basic usage
t("welcome"); // "Welcome!"

// With interpolation
t("greeting", { name: "John" }); // "Hello John!"

// With default value
t("missing.key", { defaultValue: "Default text" });

// With namespace
t("button.submit", { ns: "forms" });

// Nested keys
t("navigation.menu.home"); // Supports nested JSON structure
```

### Higher-Order Component

```tsx
import { withTranslation } from "next-intl-ziad";

interface Props {
  title: string;
}

class MyClassComponent extends React.Component<Props & WithTranslationProps> {
  render() {
    const { t, locale, changeLocale } = this.props;
    return <h1>{t("welcome")}</h1>;
  }
}

export default withTranslation(MyClassComponent);
```

### Middleware Configuration

```typescript
interface MiddlewareConfig {
  locales: string[]; // Supported locales
  defaultLocale: string; // Default locale
  cookieName?: string; // Cookie name
  matcher?: string | string[]; // Path patterns to match
  localeDetection?: boolean; // Enable/disable detection (default: true)
}
```

## 🛣️ Language Switching

### Client-side switching

```tsx
const { changeLocale } = useLocale();

// Simple change
await changeLocale("es");

// With URL update (Next.js App Router)
const handleLanguageChange = async (newLocale: string) => {
  await changeLocale(newLocale);
  window.location.pathname = window.location.pathname.replace(
    /^\/[^\/]+/,
    `/${newLocale}`
  );
};
```

### Server-side detection

The middleware automatically:

1. Checks for locale in cookies
2. Falls back to `Accept-Language` header
3. Uses default locale as final fallback
4. Redirects to localized URL
5. Sets/updates locale cookie

## 🔧 SSR Support

### Next.js App Router

```tsx
// Server Component
import { createTranslationFunction } from "next-intl-ziad";

async function getTranslations(locale: string) {
  // Load translations server-side
  const resources = await loadServerTranslations(locale);
  return createTranslationFunction(locale, resources);
}

export default async function ServerPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations(params.locale);

  return (
    <div>
      <h1>{t("server.title")}</h1>
      <ClientComponent />
    </div>
  );
}
```

### Next.js Pages Router with getStaticProps/getServerSideProps

```tsx
import { GetStaticProps } from "next";
import { createTranslationFunction } from "next-intl-ziad";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const resources = await loadTranslations(locale);

  return {
    props: {
      locale,
      resources,
    },
  };
};

export default function Page({ locale, resources }: Props) {
  const t = createTranslationFunction(locale, resources);

  return (
    <IntlProvider config={config} initialLocale={locale}>
      <h1>{t("welcome")}</h1>
    </IntlProvider>
  );
}
```

## 📁 Translation File Organization

### Flat Structure

```json
{
  "welcome": "Welcome!",
  "button_submit": "Submit",
  "error_network": "Network error"
}
```

### Nested Structure (Recommended)

```json
{
  "welcome": "Welcome!",
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "errors": {
    "network": "Network error",
    "validation": "Validation failed"
  }
}
```

### Multiple Namespaces

```
public/
  locales/
    en/
      common.json     // General translations
      auth.json       // Authentication
      forms.json      // Form labels
    es/
      common.json
      auth.json
      forms.json
```

```tsx
// Usage with namespaces
t("login", { ns: "auth" }); // From auth.json
t("username", { ns: "forms" }); // From forms.json
t("welcome"); // From common.json (default)
```

## 🎨 Advanced Usage

### Dynamic Loading

```typescript
const config = {
  defaultLocale: "en",
  locales: ["en", "es", "fr"],
  loadPath: "/api/translations/{{lng}}/{{ns}}", // API endpoint
  // or
  loadPath: "/locales/{{lng}}/{{ns}}.json", // Static files
};
```

### Custom Interpolation

```typescript
const config = {
  // ... other config
  interpolation: {
    prefix: "${",
    suffix: "}",
  },
};

// Usage: "Hello ${name}!" instead of "Hello {{name}}!"
```

### Locale-specific Cookie Options

```typescript
const config = {
  // ... other config
  cookieOptions: {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    domain: ".example.com", // Subdomain sharing
  },
};
```

### Loading States

```tsx
function MyComponent() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return <h1>{t("welcome")}</h1>;
}
```

## 🧪 Testing

### Unit Testing with Vitest/Jest

```typescript
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "next-intl-ziad";
import MyComponent from "./MyComponent";

const mockConfig = {
  defaultLocale: "en",
  locales: ["en"],
  resources: {
    en: {
      common: {
        welcome: "Welcome Test!",
      },
    },
  },
};

test("renders translated text", () => {
  render(
    <IntlProvider config={mockConfig}>
      <MyComponent />
    </IntlProvider>
  );

  expect(screen.getByText("Welcome Test!")).toBeInTheDocument();
});
```

### Integration Testing

```typescript
import { createTranslationFunction } from "next-intl-ziad";

describe("Translation Function", () => {
  const resources = {
    en: { common: { hello: "Hello {{name}}!" } },
    es: { common: { hello: "¡Hola {{name}}!" } },
  };

  test("interpolates values correctly", () => {
    const t = createTranslationFunction("en", resources);
    expect(t("hello", { name: "World" })).toBe("Hello World!");
  });

  test("falls back to default locale", () => {
    const t = createTranslationFunction("fr", resources, "en");
    expect(t("hello", { name: "World" })).toBe("Hello World!");
  });
});
```

## 🔧 TypeScript Support

### Type-safe translations

```typescript
// types/i18n.ts
interface TranslationKeys {
  welcome: string;
  greeting: string;
  "navigation.home": string;
  "navigation.about": string;
}

declare module "next-intl-ziad" {
  interface TranslationFunction {
    (key: keyof TranslationKeys, options?: TranslationOptions): string;
  }
}
```

### Configuration types

```typescript
import type { IntlConfig } from "next-intl-ziad";

const config: IntlConfig = {
  defaultLocale: "en",
  locales: ["en", "es"],
  // TypeScript will enforce correct structure
};
```

## 🚀 Performance

- **Bundle size**: < 50kB minified
- **Tree shaking**: Import only what you use
- **Lazy loading**: Load translations on demand
- **Caching**: Automatic translation caching
- **SSR optimized**: Minimal hydration overhead

## 🔄 Migration

### From next-intl

1. Remove next-intl configuration from `next.config.js`
2. Replace imports:
   ```diff
   - import { useTranslations } from 'next-intl';
   + import { useTranslation } from 'next-intl-ziad';
   ```
3. Update translation calls:
   ```diff
   - const t = useTranslations('namespace');
   - t('key')
   + const { t } = useTranslation();
   + t('key', { ns: 'namespace' })
   ```

### From react-i18next

1. Remove i18next configuration
2. Replace imports:
   ```diff
   - import { useTranslation } from 'react-i18next';
   + import { useTranslation } from 'next-intl-ziad';
   ```
3. The API is mostly compatible!

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ziad-hatem/next-intl-ziad.git

# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run example app
cd example-app
npm install
npm run dev
```

### Running Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

## 📄 License

MIT © [Ziad Hatem](https://ziadhatem.live/)

## 🙏 Acknowledgments

This project is inspired by the excellent work of:

- [next-intl](https://next-intl-docs.vercel.app/) for Next.js integration patterns
- [react-i18next](https://react.i18next.com/) for React hook patterns
- The React and Next.js communities for best practices

---

**Made with ❤️ for the React and Next.js community**
