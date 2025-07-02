import { createContext, useContext } from "react";
import type { IntlContextValue } from "./types";

export const IntlContext = createContext<IntlContextValue | null>(null);

export function useIntlContext(): IntlContextValue {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error("useIntlContext must be used within an IntlProvider");
  }
  return context;
}
