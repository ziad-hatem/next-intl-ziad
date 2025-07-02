import React from "react";
import { useIntlContext } from "./context";
import type { UseTranslationResult, WithTranslationProps } from "./types";

export function useTranslation(): UseTranslationResult {
  const { t, locale, changeLocale, isLoading } = useIntlContext();

  return {
    t,
    locale,
    changeLocale,
    isLoading,
  };
}

export function useLocale() {
  const { locale, changeLocale } = useIntlContext();

  return {
    locale,
    changeLocale,
  };
}

export function useT() {
  const { t } = useIntlContext();
  return t;
}

// Higher-Order Component for class components
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & WithTranslationProps>
): React.ComponentType<P> {
  return function WithTranslationComponent(props: P) {
    const translationProps = useTranslation();

    return React.createElement(Component, { ...props, ...translationProps });
  };
}
