import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { SizesProvider } from "./lib/sizes";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductPage } from "./pages/ProductPage";
import { Alterations, DeliveryReturns, FindMySizes, MadeToMeasure, Visit } from "./pages/Info";
import { NotFound } from "./pages/NotFound";

function Main({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return <main id="main" data-path={pathname}>{children}</main>;
}

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SizesProvider>
        <ScrollTop />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-chalk focus:text-ink focus:px-4 focus:py-3">Skip to content</a>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:handle" element={<Shop />} />
            <Route path="/products/:handle" element={<ProductPage />} />
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
