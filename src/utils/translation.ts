import type {
  Translation,
  TranslationOptions,
  TranslationResources,
} from "../types";

export function getNestedValue(
  obj: Translation,
  path: string
): string | undefined {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

export function interpolateString(
  template: string,
  values: Record<string, string | number>,
  prefix = "{{",
  suffix = "}}"
): string {
  return template.replace(
    new RegExp(
      `${escapeRegExp(prefix)}([^${escapeRegExp(suffix)}]+)${escapeRegExp(
        suffix
      )}`,
      "g"
    ),
    (match, key) => {
      const trimmedKey = key.trim();
      return values[trimmedKey] !== undefined
        ? String(values[trimmedKey])
        : match;
    }
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createTranslationFunction(
  locale: string,
  resources: TranslationResources,
  fallbackLocale?: string,
  defaultNamespace = "common",
  interpolationConfig = { prefix: "{{", suffix: "}}" }
) {
  return function t(key: string, options: TranslationOptions = {}): string {
    const {
      ns = defaultNamespace,
      defaultValue,
      ...interpolationValues
    } = options;

    // Try to get translation from current locale
    let translation = getTranslationFromResources(resources, locale, ns, key);

    // Try fallback locale if translation not found
    if (!translation && fallbackLocale && fallbackLocale !== locale) {
      translation = getTranslationFromResources(
        resources,
        fallbackLocale,
        ns,
        key
      );
    }

    // Use default value if still no translation found
    if (!translation) {
      translation = defaultValue || key;
    }

    // Interpolate values if any
    if (Object.keys(interpolationValues).length > 0) {
      const validValues: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(interpolationValues)) {
        if (value !== undefined) {
          validValues[key] = value;
        }
      }
      translation = interpolateString(
        translation,
        validValues,
        interpolationConfig.prefix,
        interpolationConfig.suffix
      );
    }

    return translation;
  };
}

function getTranslationFromResources(
  resources: TranslationResources,
  locale: string,
  namespace: string,
  key: string
): string | undefined {
  const localeResources = resources[locale];
  if (!localeResources) {
    return undefined;
  }

  const namespaceTranslations = localeResources[namespace];
  if (!namespaceTranslations) {
    return undefined;
  }

  return getNestedValue(namespaceTranslations, key);
}

export async function loadTranslations(
  locale: string,
  namespace: string,
  loadPath?: string
): Promise<Translation> {
  if (!loadPath) {
    return {};
  }

  try {
    const path = loadPath
      .replace("{{lng}}", locale)
      .replace("{{ns}}", namespace);

    const response = await fetch(path);
    if (!response.ok) {
      console.warn(
        `Failed to load translations for ${locale}/${namespace}: ${response.status}`
      );
      return {};
    }

    const translations = await response.json();
    return translations;
  } catch (error) {
    console.warn(
      `Error loading translations for ${locale}/${namespace}:`,
      error
    );
    return {};
  }
}
