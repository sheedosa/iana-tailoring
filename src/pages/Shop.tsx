import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { FITS, type Fit } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every suit, jacket, pair of trousers, shirt and accessory." };

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const { label } = useSizes();
  const [fit, setFit] = useState<Fit[]>([]);
  const [cloth, setCloth] = useState<string[]>([]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const cloths = [...new Set(base.map((p) => p.cloth))].filter((x) => x !== "Your choice").sort();
  const list = store.products({ collection: handle, fit, cloth });
  const tog = <T,>(set: (f: (x: T[]) => T[]) => void, v: T) => set((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} I&A Tailoring, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      {label && <div className="bg-sage"><div className="wrap flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><p>Showing stock for <b>{label}</b>. <Link to="/find-my-sizes" className="inline-flex min-h-11 items-center underline">Change my sizes</Link></p></div></div>}

      <section className="wrap flex flex-col gap-4 pb-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · {c.title}</nav>
        <h1 className="text-[44px] sm:text-[56px]">{c.title}</h1>
        <p className="max-w-2xl text-[17px] text-mute">{c.blurb}</p>
        <nav aria-label="Collections" className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...store.collections()].map((x) => <Link key={x.handle} to={`/shop/${x.handle}`} className="chip" aria-current={x.handle === handle ? "page" : undefined}>{x.title}</Link>)}
        </nav>
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-1">
            <legend className="label mb-2 text-mute">Fit</legend>
            {FITS.map((f) => <label key={f} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={fit.includes(f)} onChange={() => tog(setFit, f)} className="h-[18px] w-[18px] accent-[#45353a]" /> {f} <span className="text-mute">({base.filter((p) => p.fit === f).length})</span></label>)}
          </fieldset>
          {cloths.length > 1 && (
            <fieldset className="flex flex-col gap-1">
              <legend className="label mb-2 text-mute">Cloth</legend>
              {cloths.map((f) => <label key={f} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={cloth.includes(f)} onChange={() => tog(setCloth, f)} className="h-[18px] w-[18px] accent-[#45353a]" /> {f} <span className="text-mute">({base.filter((p) => p.cloth === f).length})</span></label>)}
            </fieldset>
          )}
          <div className="flex flex-col gap-2 rounded-pill bg-ink p-4 text-paper">
            <p className="text-sm font-normal">Nothing quite right?</p>
            <p className="text-sm text-[#d8c9cd]">Made to measure from £[PRICE], two fittings in Tooting.</p>
            <Link to="/made-to-measure" className="label inline-flex min-h-11 items-center text-paper underline">Book a fitting</Link>
          </div>
        </aside>
        <div className="min-w-0">
          <p className="mb-5 text-sm text-mute" aria-live="polite">{list.length} {list.length === 1 ? "item" : "items"}</p>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">{list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 3} />)}</div>
          ) : (
            <div className="rounded-pill bg-stone p-8 text-center"><p>Nothing matches those filters.</p><button type="button" onClick={() => { setFit([]); setCloth([]); }} className="btn btn-ghost mt-4">Clear filters</button></div>
          )}
        </div>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-sage p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-[28px] sm:text-[32px]">How suit sizes work here</h2><p className="text-mute">Jackets by chest and length (36S to 50L). Trousers by waist and leg (28/30 to 44/34). Any suit bought in store is altered free.</p></div>
          <Link to="/find-my-sizes" className="btn btn-ink shrink-0">Find my sizes</Link>
        </div>
      </section>
    </>
  );
}
