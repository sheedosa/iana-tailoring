import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { img, store } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { JACKET_CHESTS, JACKET_LENGTHS, SITE, TROUSER_LEGS, TROUSER_WAISTS } from "../data/site";

const Pick = ({ on, dead, children, onClick, label }: { on: boolean; dead?: boolean; children: React.ReactNode; onClick: () => void; label?: string }) => (
  <button type="button" aria-pressed={on} aria-label={label} disabled={dead} onClick={onClick}
    className={`h-11 min-w-12 rounded-pill border px-3 text-sm ${on ? "border-ink bg-ink text-paper" : dead ? "border-line text-mute line-through" : "border-ink hover:bg-stone"}`}>{children}</button>
);

export function ProductPage() {
  const { handle = "" } = useParams();
  const p = store.product(handle);
  const { sizes } = useSizes();
  const [active, setActive] = useState(0);
  const [chest, setChest] = useState<number | null>(null);
  const [len, setLen] = useState<string | null>(null);
  const [waist, setWaist] = useState<number | null>(null);
  const [leg, setLeg] = useState<number | null>(null);
  const [jacket, setJacket] = useState(true);
  const [trousers, setTrousers] = useState(true);
  useEffect(() => { setActive(0); setChest(null); setLen(null); setWaist(null); setLeg(null); setJacket(true); setTrousers(true); }, [handle]);
  if (!p) return <NotFound />;

  const isSuit = p.kind === "suit" || p.kind === "trousers";
  const hasJacket = p.kind === "suit";
  const c = chest ?? sizes?.chest ?? null, l = len ?? sizes?.length ?? null, w = waist ?? sizes?.waist ?? null, g = leg ?? sizes?.leg ?? null;
  const out = p.soldOut ?? [];
  const jDead = (ch: number, le: string) => out.includes(`${ch}${le}`);
  const tDead = (wa: number, lg: number) => out.includes(`${wa}/${lg}`);
  const related = store.products({ collection: p.collections[0] }).filter((x) => x.handle !== p.handle).slice(0, 4);
  const path = `/products/${p.handle}`;
  const coll = p.collections[0];

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={`/img/${p.images[0]}.webp`}
        description={`${p.title}, ${p.fit.toLowerCase()} fit in ${p.cloth.toLowerCase()}.${hasJacket ? " Jacket and trousers sold separately in your own sizes." : ""} I&A Tailoring, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: p.type, path: `/shop/${coll}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, image: p.images.map((i) => absolute(`/img/${i}.webp`)), material: p.cloth, color: p.colour, brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-pill bg-sage"><img src={img(p.images[active])} alt={`${p.title}, view ${active + 1} of ${p.images.length}`} width="1100" height="1375" className="aspect-[4/5] w-full object-cover" /></div>
          {p.images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {p.images.map((im, i) => <button key={im + i} type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-pressed={i === active} className={`h-24 w-20 overflow-hidden rounded-pill border-2 ${i === active ? "border-ink" : "border-transparent"}`}><img src={img(im, !im.startsWith("hero/"))} alt="" className="h-full w-full object-cover" /></button>)}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · <Link to={`/shop/${coll}`} className="underline">{p.type}</Link></nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-[36px] sm:text-[44px]">{p.title}</h1>
            <p className="text-sm text-mute">{p.fit} fit · {p.cloth} · {p.colour}</p>
          </div>

          {isSuit ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {hasJacket && (
                <fieldset className="flex flex-col gap-3 rounded-pill border border-ink p-4">
                  <div className="flex items-baseline justify-between"><legend className="label text-mute">Jacket</legend><span className="text-lg">£[PRICE]</span></div>
                  <div className="flex flex-col gap-1.5"><label htmlFor="chest" className="label">Chest</label>
                    <select id="chest" value={c ?? ""} onChange={(e) => setChest(Number(e.target.value))} className="h-11 rounded-pill border border-ink bg-paper px-2 text-sm"><option value="" disabled>Choose</option>{JACKET_CHESTS.map((x) => <option key={x} value={x}>{x}{sizes?.chest === x ? " · your size" : ""}</option>)}</select></div>
                  <div className="flex flex-col gap-1.5"><p className="label">Length</p><div className="grid grid-cols-3 gap-1.5">{JACKET_LENGTHS.filter((x) => !p.lengths || p.lengths.includes(x)).map((x) => <Pick key={x} on={l === x} dead={c !== null && jDead(c, x)} onClick={() => setLen(x)} label={`Length ${x}${c !== null && jDead(c, x) ? ", out of stock" : ""}`}>{x}</Pick>)}</div></div>
                  <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={jacket} onChange={() => setJacket(!jacket)} className="h-[18px] w-[18px] accent-[#45353a]" /> Add jacket{c && l ? `, ${c}${l}` : ""}</label>
                </fieldset>
              )}
              <fieldset className="flex flex-col gap-3 rounded-pill border border-ink p-4">
                <div className="flex items-baseline justify-between"><legend className="label text-mute">Trousers</legend><span className="text-lg">£[PRICE]</span></div>
                <div className="flex flex-col gap-1.5"><label htmlFor="waist" className="label">Waist</label>
                  <select id="waist" value={w ?? ""} onChange={(e) => setWaist(Number(e.target.value))} className="h-11 rounded-pill border border-ink bg-paper px-2 text-sm"><option value="" disabled>Choose</option>{TROUSER_WAISTS.map((x) => <option key={x} value={x}>{x}{sizes?.waist === x ? " · your size" : ""}</option>)}</select></div>
                <div className="flex flex-col gap-1.5"><p className="label">Leg</p><div className="grid grid-cols-3 gap-1.5">{TROUSER_LEGS.filter((x) => !p.legs || p.legs.includes(x)).map((x) => <Pick key={x} on={g === x} dead={w !== null && tDead(w, x)} onClick={() => setLeg(x)} label={`Leg ${x}${w !== null && tDead(w, x) ? ", out of stock" : ""}`}>{x}</Pick>)}</div></div>
                {hasJacket && <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={trousers} onChange={() => setTrousers(!trousers)} className="h-[18px] w-[18px] accent-[#45353a]" /> Add trousers{w && g ? `, ${w}/${g}` : ""}</label>}
              </fieldset>
            </div>
          ) : p.kind === "shirt" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5"><label htmlFor="collar" className="label">Collar</label><select id="collar" defaultValue="" className="h-11 rounded-pill border border-ink bg-paper px-2 text-sm"><option value="" disabled>Choose</option>{["14½", "15", "15½", "16", "16½", "17", "17½", "18"].map((x) => <option key={x}>{x}</option>)}</select></div>
              <div className="flex flex-col gap-1.5"><label htmlFor="sleeve" className="label">Sleeve</label><select id="sleeve" defaultValue="" className="h-11 rounded-pill border border-ink bg-paper px-2 text-sm"><option value="" disabled>Choose</option>{["33", "34", "35", "36"].map((x) => <option key={x}>{x}</option>)}</select></div>
            </div>
          ) : p.kind === "boys" ? (
            <fieldset className="flex flex-col gap-2"><legend className="label mb-2 text-mute">Age</legend><div className="flex flex-wrap gap-2">{["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"].map((a) => <Pick key={a} on={false} onClick={() => {}}>{a}</Pick>)}</div></fieldset>
          ) : null}
          {sizes && isSuit && <p className="text-sm text-mute">Sizes marked "your size" come from Find my sizes. Struck-through options are out of stock online.</p>}

          <div className="flex flex-col gap-3">
            <button type="button" disabled className="btn btn-ink min-h-14 cursor-not-allowed opacity-60">Online ordering opens at launch</button>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Reserve to try on in Tooting · {SITE.phone}</a>
            <p className="text-center text-sm text-mute">Concept preview: sample product. Prices and stock come at launch.</p>
          </div>

          {isSuit && <div className="flex gap-3 rounded-pill bg-sage p-4 text-sm"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0"><path d="M4 20h16M6 20V9l6-5 6 5v11" /></svg><p>{p.fit} fit {p.fit === "Slim" ? "sits close with a narrow lapel and tapered leg" : p.fit === "Tailored" ? "sits close through the chest and waist with a slight taper" : "has a fuller chest and a straight leg"}. Between sizes? Take the larger; we'll alter it free in store.</p></div>}

          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Details</summary><p className="pb-4 text-mute">{p.details}</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Cloth and care</summary><p className="pb-4 text-mute">[FABRIC COMPOSITION]. Dry clean. Hang on a shaped hanger; steam rather than press between cleans.</p></details>
            {isSuit && <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Fit and size guide</summary><p className="pb-4 text-mute">Jacket size is your chest in inches; S, R and L are jacket lengths for heights under 5'8", 5'8" to 6'0", and over 6'0". Trouser size is waist and inside leg.</p></details>}
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Alterations, delivery and returns</summary><p className="pb-4 text-mute">Free alterations on suits bought or collected in store. [DELIVERY TERMS]. [RETURNS WINDOW]. Confirmed with the client before launch.</p></details>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap pb-6">
          <h2 className="mb-6 text-[32px] sm:text-[36px]">Finish the outfit</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{related.map((x) => <ProductCard key={x.handle} p={x} />)}</div>
        </section>
      )}
    </>
  );
}
