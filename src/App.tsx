import { Fragment, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { SizesProvider } from "./lib/sizes";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductPage } from "./pages/ProductPage";
import { Alterations, DeliveryReturns, FindMySizes, MadeToMeasure, Visit } from "./pages/Info";
import { NotFound } from "./pages/NotFound";

/** One mounting per history entry, so a page's own choices start fresh on a new visit and come back on Back (useKept). */
function PerEntry({ children }: { children: React.ReactNode }) {
  const { key } = useLocation();
  return <Fragment key={key}>{children}</Fragment>;
}

function Main({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return <main id="main" data-path={pathname.replace(/\/+$/, "") || "/"}>{children}</main>;
}

// Where each visited page was left, by history entry. A new page opens at the top (or at its anchor); Back and
// Forward return to where the person was; a reload stays put.
const KEEP = "iana-formal-scroll";
const left: Record<string, number> = (() => { try { return JSON.parse(sessionStorage.getItem(KEEP) ?? "{}") as Record<string, number>; } catch { return {}; } })();

function Scroll() {
  const { pathname, hash, key } = useLocation();
  const how = useNavigationType();
  const id = `${key}:${pathname}`;
  useEffect(() => {
    history.scrollRestoration = "manual";
    const save = () => { try { sessionStorage.setItem(KEEP, JSON.stringify(left)); } catch { /* private mode */ } };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, []);
  useEffect(() => {
    const note = () => { left[id] = window.scrollY; };
    window.addEventListener("scroll", note, { passive: true });
    return () => window.removeEventListener("scroll", note);
  }, [id]);
  useLayoutEffect(() => {
    if (how === "POP" && left[id] !== undefined) window.scrollTo(0, left[id]);
    else if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else if (how !== "POP") window.scrollTo(0, 0);
  }, [id, hash, how]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SizesProvider>
        <Scroll />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-chalk focus:text-ink focus:px-4 focus:py-3">Skip to content</a>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:handle" element={<PerEntry><Shop /></PerEntry>} />
            <Route path="/products/:handle" element={<PerEntry><ProductPage /></PerEntry>} />
            <Route path="/find-my-sizes" element={<FindMySizes />} />
            <Route path="/made-to-measure" element={<MadeToMeasure />} />
            <Route path="/alterations" element={<Alterations />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/delivery-returns" element={<DeliveryReturns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Main>
        <Footer />
      </SizesProvider>
    </BrowserRouter>
  );
}
