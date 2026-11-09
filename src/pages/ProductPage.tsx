import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard, priceLine } from "../components/ProductCard";
import { PhotoSlot } from "../components/Art";
import { NotFound } from "./NotFound";
import { img, noReturnLine, store, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { COLLARS, JACKET_CHESTS, JACKET_LENGTHS, KIDS_AGES, SITE, SLEEVES, TROUSER_LEGS, TROUSER_WAISTS, UK_SIZES } from "../data/site";

type PickProps = { on: boolean; dead?: boolean; mine?: boolean; children: React.ReactNode; onClick: () => void; label?: string };
const Pick = ({ on, dead, mine, children, onClick, label }: PickProps) => (
  <button type="button" aria-pressed={on} aria-label={label} disabled={dead} onClick={onClick} className="pick relative">
    {children}
    {mine && <span aria-hidden="true" className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${on ? "bg-paper" : "bg-ink"}`} />}
  </button>
);

function Grid<T extends string | number>({ legend, opts, value, set, mine, dead, cols = "grid-cols-4", fmt = (v) => String(v) }:
  { legend: string; opts: readonly T[]; value: T | null; set: (v: T) => void; mine?: T | null; dead?: (v: T) => boolean; cols?: string; fmt?: (v: T) => string }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="label mb-1.5">{legend}</legend>
      <div className={`grid gap-1.5 ${cols}`}>
        {opts.map((x) => {
          const d = dead?.(x) ?? false;
          return <Pick key={x} on={value === x} mine={mine === x} dead={d} onClick={() => set(x)} label={`${legend} ${fmt(x)}${mine === x ? ", your size" : ""}${d ? ", out of stock" : ""}`}>{fmt(x)}</Pick>;
        })}
      </div>
    </fieldset>
  );
}

const Chev = () => <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;
const Fold = ({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) => (
  <details open={open} className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center gap-3">{title}<Chev /></summary><div className="pb-5 text-base text-mute">{children}</div></details>
);

const fitNote = (p: Product) =>
  p.fit === "Slim" ? "Slim fit sits close, with a narrow lapel and a tapered leg."
    : p.fit === "Tailored" ? "Tailored fit sits close through the chest and waist, with a slight taper."
    : "Regular fit has a fuller chest and a straight leg.";

export function ProductPage() {
  const { handle = "" } = useParams();
  const p = store.product(handle);
  const { sizes } = useSizes();
  const [chest, setChest] = useState<number | null>(null);
  const [len, setLen] = useState<string | null>(null);
  const [waist, setWaist] = useState<number | null>(null);
  const [leg, setLeg] = useState<number | null>(null);
  const [ukJ, setUkJ] = useState<number | null>(null);
  const [ukT, setUkT] = useState<number | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [collar, setCollar] = useState<string | null>(null);
  const [sleeve, setSleeve] = useState<string | null>(null);
  useEffect(() => { setChest(null); setLen(null); setWaist(null); setLeg(null); setUkJ(null); setUkT(null); setAge(null); setCollar(null); setSleeve(null); }, [handle]);
  if (!p) return <NotFound />;

  const menSuit = p.kind === "suit";
  const c = chest ?? sizes?.chest ?? null, l = len ?? sizes?.length ?? null, w = waist ?? sizes?.waist ?? null, g = leg ?? sizes?.leg ?? null;
  const out = p.soldOut ?? [];
  const related = store.related(p);
  const path = `/products/${p.handle}`;
  const coll = p.collections[0];
  const collTitle = store.collection(coll)?.title ?? p.type;
  const noReturn = noReturnLine(p);
  const d = SITE.delivery;

  const sizing = (() => {
    if (menSuit || p.kind === "trousers") return (
      <div className="flex flex-col gap-3">
        {menSuit && <p className="label inline-flex self-start rounded-pill bg-sage px-2.5 py-1.5">Now: jacket and trousers in different sizes</p>}
        <div className={`grid gap-3 ${menSuit ? "md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : ""}`}>
          {menSuit && (
            <div className="flex flex-col gap-4 rounded-pill border border-ink p-4">
              <div className="flex items-baseline justify-between"><h2 className="label text-mute">Jacket</h2><span className="text-lg">£[PRICE]</span></div>
              <Grid legend="Chest" opts={JACKET_CHESTS} value={c} set={setChest} mine={sizes?.chest} />
              <Grid legend="Length" opts={JACKET_LENGTHS.filter((x) => !p.lengths || p.lengths.includes(x))} value={l as (typeof JACKET_LENGTHS)[number] | null} set={setLen} mine={sizes?.length} cols="grid-cols-3" dead={(x) => c !== null && out.includes(`${c}${x}`)} />
            </div>
          )}
          <div className="flex flex-col gap-4 rounded-pill border border-ink p-4">
            <div className="flex items-baseline justify-between"><h2 className="label text-mute">Trousers</h2><span className="text-lg">£[PRICE]</span></div>
            <Grid legend="Waist" opts={TROUSER_WAISTS} value={w} set={setWaist} mine={sizes?.waist} cols="grid-cols-5 xl:grid-cols-4" />
            <Grid legend="Leg" opts={TROUSER_LEGS.filter((x) => !p.legs || p.legs.includes(x))} value={g as (typeof TROUSER_LEGS)[number] | null} set={setLeg} mine={sizes?.leg} cols="grid-cols-3" dead={(x) => w !== null && out.includes(`${w}/${x}`)} />
          </div>
        </div>
        <p className="text-[14px] text-mute">{sizes ? <>The dot marks your saved sizes (<Link to="/find-my-sizes" className="underline">change</Link>). Struck-through sizes are out of stock.</> : <>Not sure? <Link to="/find-my-sizes" className="underline">Find my sizes</Link> from height, chest and waist.</>}</p>
      </div>
    );
    if (p.kind === "womens-suit") return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-pill border border-ink p-4"><div className="flex items-baseline justify-between"><h2 className="label text-mute">Jacket</h2><span className="text-lg">£[PRICE]</span></div><Grid legend="UK size" opts={UK_SIZES} value={ukJ} set={setUkJ} /></div>
        <div className="flex flex-col gap-3 rounded-pill border border-ink p-4"><div className="flex items-baseline justify-between"><h2 className="label text-mute">Trousers</h2><span className="text-lg">£[PRICE]</span></div><Grid legend="UK size" opts={UK_SIZES} value={ukT} set={setUkT} /></div>
      </div>
    );
    if (p.kind === "dress") return <Grid legend="UK size" opts={UK_SIZES} value={ukJ} set={setUkJ} />;
    if (p.kind === "kids") return <Grid legend="Age" opts={KIDS_AGES} value={age} set={setAge} cols="grid-cols-5 sm:grid-cols-8" />;
    if (p.kind === "shirt") return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Grid legend="Collar" opts={COLLARS} value={collar} set={setCollar} />
        <Grid legend="Sleeve" opts={SLEEVES} value={sleeve} set={setSleeve} />
      </div>
    );
    return null;
  })();

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.colour.toLowerCase()} ${p.cloth.toLowerCase()}.${menSuit ? " Jacket and trousers in different sizes." : ""} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: collTitle, path: `/shop/${coll}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.cloth, color: p.colour, brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <section className="wrap grid gap-6 pb-16 pt-5 lg:grid-cols-[1.1fr_1fr] lg:gap-x-14 lg:gap-y-6 lg:pt-10">
        <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="text-[14px] text-mute"><Link to="/" className="underline">Home</Link> · <Link to={`/shop/${coll}`} className="underline">{collTitle}</Link></nav>
          <h1 className="text-[34px] sm:text-[44px]">{p.title}</h1>
          <p className="text-lg">{priceLine(p)}</p>
          <p className="text-base text-mute">{[p.fit && menSuit ? `${p.fit} fit` : null, p.cloth, p.colour].filter(Boolean).join(" · ")}</p>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
          {p.images[0]
            ? <div className="overflow-hidden rounded-pill bg-sage"><img src={img(p.images[0])} alt={p.title} width="1100" height="1366" className="aspect-[4/5] w-full object-cover" /></div>
            : <PhotoSlot art={p.slot?.art ?? "jacket"} label={p.type} line={p.slot?.line ?? ""} className="aspect-[4/5]" />}
        </div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2 lg:self-start">
          {sizing}

          <div className="flex flex-col gap-2">
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink min-h-14">Reserve to try on</a>
            <p className="text-center text-[14px] text-mute">Call <a href={`tel:${SITE.phoneIntl}`} className="whitespace-nowrap underline">{SITE.phone}</a> or walk in. Online ordering opens at launch; this is a sample product.</p>
          </div>

          {noReturn && <p className="rounded-pill bg-stone px-4 py-3 text-base"><b>{noReturn}.</b> Please try it on in the shop before you buy.</p>}
          {menSuit && <p className="text-base">{fitNote(p)} Between sizes? Take the larger and have it altered in the shop.</p>}

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-line py-4 text-base">
            <dt className="text-mute">{d.standard.name}</dt><dd>{d.standard.price}, {d.standard.time}</dd>
            <dt className="text-mute">{d.express.name}</dt><dd>{d.express.price}, {d.express.time}</dd>
            <dt className="text-mute">Free delivery</dt><dd>On orders of {d.freeOver} and over</dd>
            <dt className="text-mute">Collect</dt><dd>{d.collect}</dd>
            <dt className="text-mute">Returns</dt><dd>{noReturn ? `${noReturn}` : `${SITE.returns.days} days`} · <Link to="/delivery-returns" className="underline">Details</Link></dd>
          </dl>

          <div>
            <Fold title="Details" open><p>{p.details}</p></Fold>
            <Fold title="Cloth and care"><p>[FABRIC COMPOSITION AND CARE]</p></Fold>
            {menSuit && <Fold title="Size guide"><p>Jacket size is your chest in inches. S, R and L are jacket lengths for heights under 5'8", 5'8" to 6'0", and over 6'0". Trousers are sized by waist and inside leg.</p></Fold>}
            <Fold title="Alterations"><p>Hems, sleeves and waists are altered in the shop. <Link to="/alterations" className="underline">See alterations</Link>.</p></Fold>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap pb-6">
          <h2 className="mb-6 text-[32px] sm:text-[36px]">{menSuit ? "Finish the outfit" : "You might also like"}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{related.map((x) => <ProductCard key={x.handle} p={x} />)}</div>
        </section>
      )}
    </>
  );
}
