import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { WHO, store, type Who } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { FITS, SITE, type Fit } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every suit, dress, shirt and accessory for men, women and kids." };

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const { label } = useSizes();
  const [who, setWho] = useState<Who[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [fit, setFit] = useState<Fit[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => { setWho([]); setType([]); setFit([]); setOpen(false); }, [handle]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const whos = (Object.keys(WHO) as Who[]).filter((w) => base.some((p) => p.for === w));
  const types = [...new Set(base.map((p) => p.type))];
  const fits = FITS.filter((f) => base.some((p) => p.kind === "suit" && p.fit === f));
  const list = store.products({ collection: handle, who, type, fit });
  const active = who.length + type.length + fit.length;
  const tog = <T,>(set: (f: (x: T[]) => T[]) => void, v: T) => set((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));
  const clear = () => { setWho([]); setType([]); setFit([]); };
  const menSuits = handle === "men" || handle === "suits";

  const group = <T extends string>(legend: string, opts: readonly T[], on: T[], set: (f: (x: T[]) => T[]) => void, count: (v: T) => number, show: (v: T) => string = (v) => v) =>
    opts.length > 1 && (
      <fieldset className="flex flex-col gap-1">
        <legend className="label mb-2 text-mute">{legend}</legend>
        {opts.map((f) => <label key={f} className="flex min-h-11 cursor-pointer items-center gap-3 text-base"><input type="checkbox" checked={on.includes(f)} onChange={() => tog(set, f)} className="h-[18px] w-[18px] accent-[#45353a]" /> {show(f)} <span className="text-mute">({count(f)})</span></label>)}
      </fieldset>
    );

  const filters = (
    <>
      {group("For", whos, who, setWho, (v) => base.filter((p) => p.for === v).length, (v) => WHO[v])}
      {group("Type", types, type, setType, (v) => base.filter((p) => p.type === v).length)}
      {group("Men's suit fit", fits, fit, setFit, (v) => base.filter((p) => p.kind === "suit" && p.fit === v).length)}
      {active > 0 && <button type="button" onClick={clear} className="label inline-flex min-h-11 items-center self-start underline">Clear filters</button>}
    </>
  );

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <section className="wrap flex flex-col gap-3 pb-5 pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-[14px] text-mute"><Link to="/" className="underline">Home</Link> · {c.title}</nav>
        <h1 className="text-[40px] sm:text-[56px]">{c.title}</h1>
        <p className="max-w-2xl text-[17px] text-mute">{c.blurb}</p>
        {label && menSuits && <p className="text-base">Men's suits are marked for <b>{label}</b>. <Link to="/find-my-sizes" className="inline-flex min-h-11 items-center underline">Change my sizes</Link></p>}
        <nav aria-label="Collections" className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...store.collections()].map((x) => <Link key={x.handle} to={`/shop/${x.handle}`} className="chip" aria-current={x.handle === handle ? "page" : undefined}>{x.title}</Link>)}
        </nav>
        <div className="flex items-center justify-between gap-3 pt-1 lg:hidden">
          <button type="button" className="chip gap-2" aria-expanded={open} aria-controls="filters-m" onClick={() => setOpen(!open)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filter{active ? ` (${active})` : ""}
          </button>
          <p className="text-[14px] text-mute" aria-live="polite">{list.length} {list.length === 1 ? "item" : "items"}</p>
        </div>
        {open && <div id="filters-m" className="flex flex-col gap-6 rounded-pill border border-line p-4 lg:hidden">{filters}</div>}
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="hidden flex-col gap-7 lg:flex">
          {filters}
          <div className="flex flex-col gap-2 rounded-pill bg-ink p-5 text-paper">
            <p className="display text-[22px] text-paper">Nothing quite right?</p>
            <p className="text-base text-on-ink">Made to measure from {SITE.madeToMeasure.from}, with {SITE.madeToMeasure.fittings} fittings in Tooting.</p>
            <Link to="/made-to-measure" className="label inline-flex min-h-11 items-center text-paper underline">Made to measure</Link>
          </div>
        </aside>
        <div className="min-w-0">
          <p className="mb-5 hidden text-[14px] text-mute lg:block" aria-live="polite">{list.length} {list.length === 1 ? "item" : "items"}</p>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">{list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 2} />)}</div>
          ) : (
            <div className="rounded-pill bg-stone p-8 text-center"><p>Nothing matches those filters.</p><button type="button" onClick={clear} className="btn btn-ghost mt-4">Clear filters</button></div>
          )}
        </div>
      </section>

      {menSuits && (
        <section className="wrap">
          <div className="flex flex-col gap-4 rounded-pill bg-sage p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div><h2 className="text-[28px] sm:text-[32px]">Jacket and trousers in different sizes</h2><p className="text-base text-mute">Men's jackets by chest and length (36S to 50L). Trousers by waist and leg (28/30 to 44/34). Choose each on its own.</p></div>
            <Link to="/find-my-sizes" className="btn btn-ink shrink-0">Find my sizes</Link>
          </div>
        </section>
      )}
    </>
  );
}
