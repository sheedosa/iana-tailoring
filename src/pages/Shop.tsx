import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { StickyBar, TitleTape } from "../components/Tape";
import { NotFound } from "./NotFound";
import { WHO, store, type Collection, type Who } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { FITS, SITE, type Fit, type Sizes } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every suit, dress, shirt and accessory for men, women and kids." };
const Crumb = ({ title }: { title: string }) => <nav aria-label="Breadcrumb" className="t-small"><Link to="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Home</Link> <span aria-hidden="true">/</span> {title}</nav>;

/** Men: the title on the left, the shopper's own sizes on the right. */
function MenTitle({ c, sizes }: { c: Collection; sizes: Sizes | null }) {
  return (
    <section className="wrap grid gap-x-14 gap-y-6 pb-8 pt-4 sm:pt-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
      <div className="flex flex-col gap-3">
        <Crumb title={c.title} />
        <h1 className="t-hero">{c.title}</h1>
        <TitleTape />
        <p className="t-lede measure pt-1">{c.blurb}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-ink pt-4">
        {sizes ? (
          <>
            <p className="voice">Suits are marked for you</p>
            <p className="display t-section">{sizes.chest}{sizes.length} jacket, {sizes.waist}/{sizes.leg} trousers</p>
            <Link to="/find-my-sizes" className="link self-start">Change my sizes</Link>
          </>
        ) : (
          <>
            <p className="t-sub">Jackets 36S to 50L, trousers 28/30 to 44/34</p>
            <p>Give us your height, chest and waist and we'll mark your sizes on every suit.</p>
            <Link to="/find-my-sizes" className="link self-start">Find my sizes</Link>
          </>
        )}
      </div>
    </section>
  );
}

/** Women: a Sage band, the title centred, with the ways in set beneath it. */
function WomenTitle({ c }: { c: Collection }) {
  const ways = ["occasion", "bridal", "suits"].map((h) => store.collection(h)).filter((x): x is Collection => !!x);
  return (
    <section className="bg-sage">
      <div className="wrap flex flex-col items-center gap-3 pb-10 pt-4 text-center sm:pb-14 sm:pt-8">
        <Crumb title={c.title} />
        <h1 className="t-hero">{c.title}</h1>
        <p className="voice max-w-xl">{c.blurb}</p>
        <ul className="flex flex-wrap justify-center gap-x-8 pt-2">
          {ways.map((w) => <li key={w.handle}><Link to={`/shop/${w.handle}`} className="t-sub inline-flex min-h-11 items-center underline decoration-1 underline-offset-[0.3em]">{w.title}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}

/** Kids: an Ochre band, the title on the left, the three kinds of piece as a list on the right. */
function KidsTitle({ c, types, type, pick }: { c: Collection; types: string[]; type: string[]; pick: (t: string) => void }) {
  return (
    <section className="on-dark bg-ink text-paper">
      <div className="wrap grid gap-x-14 gap-y-6 pb-10 pt-4 sm:pb-14 sm:pt-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
        <div className="flex flex-col gap-3">
          <Crumb title={c.title} />
          <h1 className="t-hero">{c.title}</h1>
          <p className="voice measure text-on-ink">{c.blurb}</p>
        </div>
        <ul className="border-t border-paper/50">
          {types.map((t) => (
            <li key={t} className="border-b border-paper/25">
              <button type="button" aria-pressed={type.includes(t)} onClick={() => pick(t)} className="t-sub flex min-h-14 w-full items-center justify-between gap-3 text-left">
                {t}<span className="font-sans text-base text-on-ink">{type.includes(t) ? "Showing" : "Show"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PlainTitle({ c }: { c: Collection }) {
  return (
    <section className="wrap flex flex-col gap-3 pb-8 pt-4 sm:pt-8">
      <Crumb title={c.title} />
      <h1>{c.title}</h1>
      <TitleTape />
      <p className="t-lede measure pt-1">{c.blurb}</p>
    </section>
  );
}

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const { sizes } = useSizes();
  const [who, setWho] = useState<Who[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [fit, setFit] = useState<Fit[]>([]);
  const [open, setOpen] = useState(false);
  const filterBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => { setWho([]); setType([]); setFit([]); setOpen(false); }, [handle]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
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
  const count = `${list.length} ${list.length === 1 ? "item" : "items"}`;
  const chosen: [string, () => void][] = [
    ...who.map((v): [string, () => void] => [WHO[v], () => tog(setWho, v)]),
    ...type.map((v): [string, () => void] => [v, () => tog(setType, v)]),
    ...fit.map((v): [string, () => void] => [`${v} fit`, () => tog(setFit, v)]),
  ];

  const group = <T extends string>(legend: string, opts: readonly T[], on: T[], set: (f: (x: T[]) => T[]) => void, n: (v: T) => number, show: (v: T) => string = (v) => v) =>
    opts.length > 1 && (
      <fieldset className="flex flex-col">
        <legend className="label mb-1.5">{legend}</legend>
        {opts.map((f) => <label key={f} className="flex min-h-11 cursor-pointer items-center gap-3"><input type="checkbox" checked={on.includes(f)} onChange={() => tog(set, f)} className="h-5 w-5 accent-[#45353a]" /> {show(f)} <span className="text-mute">({n(f)})</span></label>)}
      </fieldset>
    );
  const filters = (
    <>
      {group("For", whos, who, setWho, (v) => base.filter((p) => p.for === v).length, (v) => WHO[v])}
      {group("Type", types, type, setType, (v) => base.filter((p) => p.type === v).length)}
      {group("Men's suit fit", fits, fit, setFit, (v) => base.filter((p) => p.kind === "suit" && p.fit === v).length)}
    </>
  );
  const FilterIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>;

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      {handle === "men" ? <MenTitle c={c} sizes={sizes} />
        : handle === "women" ? <WomenTitle c={c} />
        : handle === "kids" ? <KidsTitle c={c} types={types} type={type} pick={(t) => tog(setType, t)} />
        : <PlainTitle c={c} />}

      <section className="wrap flex flex-col gap-4 pb-6 pt-5">
        <nav aria-label="Collections" className="-mx-4 flex gap-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
          {[ALL, ...store.collections()].map((x) => <Link key={x.handle} to={`/shop/${x.handle}`} aria-current={x.handle === handle ? "page" : undefined} className={`-mb-px inline-flex min-h-12 shrink-0 items-center whitespace-nowrap border-b-2 ${x.handle === handle ? "border-ink font-semibold" : "border-transparent hover:border-ink/40"}`}>{x.title}</Link>)}
        </nav>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button ref={filterBtn} type="button" className="chip gap-2 lg:hidden" aria-expanded={open} aria-controls="filters-m" onClick={() => setOpen(true)}>{FilterIcon} Filter{active ? ` (${active})` : ""}</button>
          <p aria-live="polite" className="mr-2">{count}{active ? ", filtered" : ""}</p>
          {chosen.map(([t, off]) => (
            <button key={t} type="button" onClick={off} className="chip gap-2 bg-sage" aria-label={`Remove filter: ${t}`}>{t}<svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" /></svg></button>
          ))}
          {active > 0 && <button type="button" onClick={clear} className="link">Clear all</button>}
        </div>
      </section>

      <section className="wrap grid gap-10 lg:grid-cols-[13.5rem_minmax(0,1fr)] xl:gap-14">
        <aside aria-label="Filters" className="hidden flex-col gap-7 self-start lg:sticky lg:top-24 lg:flex">
          {filters}
          <p className="border-t border-ink pt-4">Nothing quite right? Made to measure from {SITE.madeToMeasure.from}, with {SITE.madeToMeasure.fittings} fittings in Tooting. <Link to="/made-to-measure" className="font-semibold underline underline-offset-4">See how it works</Link></p>
        </aside>
        <div className="min-w-0">
          {list.length ? (
            <ul className={`grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 ${list.length % 3 === 1 && list.length <= 4 ? "xl:grid-cols-4" : "md:grid-cols-3"}`}>
              {list.map((p, i) => <li key={p.handle} className={i === 0 && list.length % 2 === 1 && list.length > 1 ? "col-span-2 md:col-span-1" : ""}><ProductCard p={p} eager={i < 2} /></li>)}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-3 border-t border-ink py-8">
              <h2 className="t-sub">Nothing matches those filters.</h2>
              <p className="text-mute">Take one off, or start again with everything in {c.title === "Everything" ? "the shop" : c.title}.</p>
              <button type="button" onClick={clear} className="btn btn-ink">Clear all filters</button>
            </div>
          )}
        </div>
      </section>

      {menSuits && (
        <section className="mt-16 bg-sage">
          <div className="wrap grid gap-x-14 gap-y-4 py-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
            <div className="flex flex-col gap-3"><h2>Jacket and trousers in different sizes</h2><p className="measure">Men's jackets by chest and length (36S to 50L). Trousers by waist and leg (28/30 to 44/34). Choose each on its own.</p></div>
            <Link to="/find-my-sizes" className="btn btn-ink self-start lg:justify-self-end">Find my sizes</Link>
          </div>
        </section>
      )}

      {/* Phone: filters open as a sheet; the bar keeps them in reach while the list scrolls. */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-deep/50 lg:hidden" onClick={() => setOpen(false)}>
          <div id="filters-m" role="dialog" aria-label="Filters" className="sheet flex max-h-[85dvh] flex-col bg-paper" onClick={(e) => e.stopPropagation()}>
            <div className="wrap flex items-center justify-between border-b border-line"><h2 className="t-sub">Filter</h2><button type="button" className="link" onClick={() => setOpen(false)}>Close</button></div>
            <div className="wrap flex flex-col gap-6 overflow-y-auto py-5">{filters}</div>
            <div className="wrap flex gap-3 border-t border-line py-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
              {active > 0 && <button type="button" onClick={clear} className="btn btn-ghost">Clear</button>}
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ink flex-1">Show {count}</button>
            </div>
          </div>
        </div>
      )}
      <StickyBar watch={filterBtn}>
        <p>{count}{active ? ", filtered" : ""}</p>
        <button type="button" className="btn btn-ink gap-2" onClick={() => setOpen(true)}>{FilterIcon} Filter{active ? ` (${active})` : ""}</button>
      </StickyBar>
    </>
  );
}
