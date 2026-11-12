import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { sizeLabel, type Sizes } from "../data/site";

// The shopper's jacket and trouser sizes, remembered on this device. At launch this moves to the customer account.
type Ctx = { sizes: Sizes | null; setSizes: (s: Sizes | null) => void; label: string | null };
const SizesContext = createContext<Ctx>({ sizes: null, setSizes: () => {}, label: null });
const KEY = "iana-sizes";

export function SizesProvider({ children }: { children: ReactNode }) {
  // The first render matches the prerendered page (no sizes); the saved sizes are read straight after it, before the
  // browser paints again. index.html marks <html class="has-sizes"> ahead of that so their lines are already kept.
  const [sizes, set] = useState<Sizes | null>(null);
  useLayoutEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v) set(JSON.parse(v) as Sizes); } catch { /* private mode */ }
  }, []);
  const setSizes = (s: Sizes | null) => {
    set(s);
    document.documentElement.classList.toggle("has-sizes", s !== null);
    try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch { /* private mode */ }
  };
  return <SizesContext.Provider value={{ sizes, setSizes, label: sizes ? sizeLabel(sizes) : null }}>{children}</SizesContext.Provider>;
}

export const useSizes = () => useContext(SizesContext);
