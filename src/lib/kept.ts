import { useState } from "react";
import { useLocation } from "react-router-dom";

// What a person chose on a page (a filter, a size), remembered per history entry while the site is open, so that
// Back returns to the page as they left it. Pages that use it are mounted once per entry (`PerEntry` in App.tsx).
// Nothing is kept on a first load, so the first render still matches the prerendered page.
const kept = new Map<string, unknown>();

export function useKept<T>(name: string, initial: T): [T, (v: T) => void] {
  const { key } = useLocation();
  const id = `${key}:${name}`;
  const [v, set] = useState<T>(() => (kept.has(id) ? (kept.get(id) as T) : initial));
  return [v, (x: T) => { kept.set(id, x); set(x); }];
}
