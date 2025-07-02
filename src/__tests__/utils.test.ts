import { describe, it, expect } from "vitest";
import {
  getNestedValue,
  interpolateString,
  createTranslationFunction,
} from "../utils/translation";
import { detectLocaleFromAcceptLanguage } from "../utils/cookie";

describe("Translation Utils", () => {
  describe("getNestedValue", () => {
    it("should get nested values from object", () => {
      const obj = {
        level1: {
          level2: {
            key: "value",
          },
        },
      };

      expect(getNestedValue(obj, "level1.level2.key")).toBe("value");
      expect(getNestedValue(obj, "level1.level2.nonexistent")).toBeUndefined();
      expect(getNestedValue(obj, "nonexistent")).toBeUndefined();
    });
  });

  describe("interpolateString", () => {
    it("should interpolate values into string", () => {
      const template = "Hello {{name}}, you have {{count}} messages";
      const values = { name: "John", count: 5 };

      expect(interpolateString(template, values)).toBe(
        "Hello John, you have 5 messages"
      );
    });

    it("should handle missing values", () => {
      const template = "Hello {{name}}, you have {{count}} messages";
      const values = { name: "John" };

      expect(interpolateString(template, values)).toBe(
        "Hello John, you have {{count}} messages"
      );
    });
  });

  describe("createTranslationFunction", () => {
    const resources = {
      en: {
        common: {
          hello: "Hello",
          greeting: "Hello {{name}}",
          nested: {
            key: "Nested value",
          },
        },
      },
      es: {
        common: {
          hello: "Hola",
        },
      },
    };

    it("should return translation for existing key", () => {
      const t = createTranslationFunction("en", resources);
      expect(t("hello")).toBe("Hello");
    });

    it("should handle interpolation", () => {
      const t = createTranslationFunction("en", resources);
      expect(t("greeting", { name: "John" })).toBe("Hello John");
    });

    it("should handle nested keys", () => {
      const t = createTranslationFunction("en", resources);
      expect(t("nested.key")).toBe("Nested value");
    });

    it("should fallback to key when translation missing", () => {
      const t = createTranslationFunction("en", resources);
      expect(t("missing.key")).toBe("missing.key");
    });

    it("should use default value when provided", () => {
      const t = createTranslationFunction("en", resources);
      expect(t("missing.key", { defaultValue: "Default" })).toBe("Default");
    });

    it("should fallback to fallback locale", () => {
      const t = createTranslationFunction("fr", resources, "en");
      expect(t("hello")).toBe("Hello");
    });
  });
});

describe("Cookie Utils", () => {
  describe("detectLocaleFromAcceptLanguage", () => {
    it("should detect locale from Accept-Language header", () => {
      const supportedLocales = ["en", "es", "fr"];

      expect(
        detectLocaleFromAcceptLanguage("en-US,en;q=0.9", supportedLocales)
      ).toBe("en");
      expect(
        detectLocaleFromAcceptLanguage(
          "es-ES,es;q=0.8,en;q=0.7",
          supportedLocales
        )
      ).toBe("es");
      expect(
        detectLocaleFromAcceptLanguage("de-DE,de;q=0.9", supportedLocales)
      ).toBeUndefined();
    });

    it("should respect quality values", () => {
      const supportedLocales = ["en", "es", "fr"];

      expect(
        detectLocaleFromAcceptLanguage("es;q=0.7,en;q=0.9", supportedLocales)
      ).toBe("en");
    });

    it("should handle empty or invalid headers", () => {
      const supportedLocales = ["en", "es", "fr"];

      expect(
        detectLocaleFromAcceptLanguage("", supportedLocales)
      ).toBeUndefined();
      expect(
        detectLocaleFromAcceptLanguage(undefined, supportedLocales)
      ).toBeUndefined();
    });
  });
});
