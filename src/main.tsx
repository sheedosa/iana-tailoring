import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

const app = <StrictMode><App /></StrictMode>;
const root = document.getElementById("root")!;
// A prerendered page is taken over where it stands (hydrated), so nothing is drawn twice and nothing flashes when
// the script starts. Only when the markup is for this very path; otherwise render from nothing.
const here = (window.location.pathname.slice(import.meta.env.BASE_URL.length - 1).replace(/\/+$/, "")) || "/";
if (!p && root.querySelector("main")?.getAttribute("data-path") === here) {
  // The page is already readable. Taking it over waits for its own turn after the script has been read, so the
  // two pieces of work never add up to one long pause under the thumb on a slow phone.
  setTimeout(() => hydrateRoot(root, app), 0);
} else { root.textContent = ""; createRoot(root).render(app); }

// scripts/prerender.mjs calls this to write each page exactly as React first renders it. Never loaded by a visitor.
(window as unknown as { __prerender?: () => Promise<string> }).__prerender = async () => (await import("react-dom/server")).renderToString(app);
