import { createContext, useContext, useState, type ReactNode } from "react";
import { sizeLabel, type Sizes } from "../data/site";

// The shopper's jacket and trouser sizes, remembered on this device. At launch this moves to the customer account.
type Ctx = { sizes: Sizes | null; setSizes: (s: Sizes | null) => void; label: string | null };
const SizesContext = createContext<Ctx>({ sizes: null, setSizes: () => {}, label: null });
const KEY = "iana-sizes";

export function SizesProvider({ children }: { children: ReactNode }) {
  const [sizes, set] = useState<Sizes | null>(() => {
    try { const v = localStorage.getItem(KEY); return v ? (JSON.parse(v) as Sizes) : null; } catch { return null; }
  });
  const setSizes = (s: Sizes | null) => {
    set(s);
    try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch { /* private mode */ }
  };
  return <SizesContext.Provider value={{ sizes, setSizes, label: sizes ? sizeLabel(sizes) : null }}>{children}</SizesContext.Provider>;
}

export const useSizes = () => useContext(SizesContext);
