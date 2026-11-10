import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard, priceLine } from "../components/ProductCard";
import { StickyBar } from "../components/Tape";
import { garmentVT } from "../components/VLink";
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

/** One ruled row of the fitting card: the measurement's name on the left, its sizes on the right. */
function Row<T extends string | number>({ legend, opts, value, set, mine, dead, fmt = (v) => String(v) }:
  { legend: string; opts: readonly T[]; value: T | null; set: (v: T) => void; mine?: T | null; dead?: (v: T) => boolean; fmt?: (v: T) => string }) {
  return (
    <div role="group" aria-label={legend} className="card-row grid grid-cols-[3.75rem_minmax(0,1fr)] items-start gap-x-2 border-t border-line py-3">
      <span className="label flex min-h-11 items-center" aria-hidden="true">{legend}</span>
      <div className="flex flex-wrap gap-1">
        {opts.map((x) => {
          const d = dead?.(x) ?? false;
          return <Pick key={x} on={value === x} mine={mine === x} dead={d} onClick={() => set(x)} label={`${legend} ${fmt(x)}${mine === x ? ", your size" : ""}${d ? ", out of stock" : ""}`}>{fmt(x)}</Pick>;
        })}
      </div>
    </div>
  );
}

/** One piece on the card: its name, its price, and its rows. */
const Piece = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="flex flex-col px-4 pt-3 sm:px-5">
    <div className="flex items-baseline justify-between gap-3 pb-2"><h3>{name}</h3><span>£[PRICE]</span></div>
    {children}
  </div>
);

const Chev = () => <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;
const Fold = ({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) => (
  <details open={open} className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center gap-3 font-semibold">{title}<Chev /></summary><div className="pb-5 text-mute">{children}</div></details>
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
  const buy = useRef<HTMLAnchorElement>(null);
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

  const or = (v: string | number | null, w: string) => (v === null ? w : String(v));
  const pair = (a: string | number | null, b: string | number | null, an: string, bn: string, sep: string) =>
    a !== null && b !== null ? `${a}${sep}${b}` : a !== null ? `${a}, ${bn} to choose` : b !== null ? `${b}, ${an} to choose` : "to choose";
  const two = menSuit || p.kind === "womens-suit";
  // The card's top line: what has been chosen so far, in words.
  const chosen =
    menSuit ? `Jacket ${pair(c, l, "chest", "length", "")}; trousers ${pair(w, g, "waist", "leg", "/")}`
      : p.kind === "trousers" ? `Trousers ${pair(w, g, "waist", "leg", "/")}`
      : p.kind === "womens-suit" ? `Jacket ${or(ukJ, "to choose")}, trousers ${or(ukT, "to choose")}`
      : p.kind === "dress" ? `UK size ${or(ukJ, "to choose")}`
      : p.kind === "kids" ? `Age ${or(age, "to choose")}`
      : p.kind === "shirt" ? `Collar ${or(collar, "to choose")}, sleeve ${or(sleeve, "to choose")}`
      : null;

  const trouserRows = (
    <>
      <Row legend="Waist" opts={TROUSER_WAISTS} value={w} set={setWaist} mine={sizes?.waist} />
      <Row legend="Leg" opts={TROUSER_LEGS.filter((x) => !p.legs || p.legs.includes(x))} value={g as (typeof TROUSER_LEGS)[number] | null} set={setLeg} mine={sizes?.leg} dead={(x) => w !== null && out.includes(`${w}/${x}`)} />
    </>
  );
  const rows =
    menSuit ? (
      <>
        <Piece name="Jacket">
          <Row legend="Chest" opts={JACKET_CHESTS} value={c} set={setChest} mine={sizes?.chest} />
          <Row legend="Length" opts={JACKET_LENGTHS.filter((x) => !p.lengths || p.lengths.includes(x))} value={l as (typeof JACKET_LENGTHS)[number] | null} set={setLen} mine={sizes?.length} dead={(x) => c !== null && out.includes(`${c}${x}`)} />
        </Piece>
        <Piece name="Trousers">{trouserRows}</Piece>
      </>
    )
      : p.kind === "trousers" ? <Piece name="Trousers">{trouserRows}</Piece>
      : p.kind === "womens-suit" ? (
        <>
          <Piece name="Jacket"><Row legend="UK size" opts={UK_SIZES} value={ukJ} set={setUkJ} /></Piece>
          <Piece name="Trousers"><Row legend="UK size" opts={UK_SIZES} value={ukT} set={setUkT} /></Piece>
        </>
      )
      : p.kind === "dress" ? <div className="px-4 sm:px-5"><Row legend="UK size" opts={UK_SIZES} value={ukJ} set={setUkJ} /></div>
      : p.kind === "kids" ? <div className="px-4 sm:px-5"><Row legend="Age" opts={KIDS_AGES} value={age} set={setAge} /></div>
      : p.kind === "shirt" ? (
        <div className="px-4 sm:px-5">
          <Row legend="Collar" opts={COLLARS} value={collar} set={setCollar} />
          <Row legend="Sleeve" opts={SLEEVES} value={sleeve} set={setSleeve} />
        </div>
      )
      : null;

  const sizing = rows && (
    <div className="flex flex-col gap-3">
      <div className="@container rounded-pill border border-ink bg-paper">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink px-4 py-3 sm:px-5">
          <h2 className="t-sub">Fitting card</h2>
          <p className="voice not-italic" aria-live="polite">{chosen}</p>
        </div>
        <div className={two ? "grid @[38rem]:grid-cols-2 @[38rem]:divide-x @[38rem]:divide-ink [&>*+*]:border-t [&>*+*]:border-ink @[38rem]:[&>*+*]:border-t-0" : "[&_.card-row:first-of-type]:border-t-0"}>{rows}</div>
      </div>
      {menSuit && <p>New: choose the jacket and the trousers in different sizes. {fitNote(p)}</p>}
      {(menSuit || p.kind === "trousers") && <p className="text-mute">{sizes ? <>The dot marks your saved sizes (<Link to="/find-my-sizes" className="underline underline-offset-4">change</Link>). Struck-through sizes are out of stock.</> : <>Not sure? <Link to="/find-my-sizes" className="underline underline-offset-4">Find my sizes</Link> from height, chest and waist.</>}</p>}
    </div>
  );

  const voice = [p.fit && menSuit ? `${p.fit} fit` : null, p.cloth, p.colour].filter(Boolean).join(", ").toLowerCase().replace(/^./, (x) => x.toUpperCase());

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.colour.toLowerCase()} ${p.cloth.toLowerCase()}.${menSuit ? " Jacket and trousers in different sizes." : ""} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: collTitle, path: `/shop/${coll}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.cloth, color: p.colour, brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <section className="wrap grid gap-x-14 gap-y-5 pb-16 pt-3 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-x-8 lg:gap-x-14 lg:pt-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-2 md:col-start-2 md:row-start-1">
          <nav aria-label="Breadcrumb" className="t-small"><Link to="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Home</Link> <span aria-hidden="true">/</span> <Link to={`/shop/${coll}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{collTitle}</Link></nav>
          <h1>{p.title}</h1>
          <p className="voice">{voice}</p>
          <p className="t-lede pt-1">{priceLine(p)}</p>
        </div>

        <div className="md:sticky md:top-24 md:col-start-1 md:row-span-2 md:row-start-1 md:self-start">
          <div className="overflow-hidden rounded-pill bg-sage" style={garmentVT(p.handle)}>
            {p.images[0]
              ? <img src={img(p.images[0])} alt={p.title} width="1100" height="1366" className="aspect-[4/5] w-full object-cover" />
              : <PhotoSlot art={p.slot?.art ?? "jacket"} label={p.type} line={p.slot?.line ?? ""} className="aspect-[4/5]" />}
          </div>
        </div>

        <div className="flex flex-col gap-7 md:col-start-2 md:row-start-2 md:self-start">
          {sizing}

          <div className="flex flex-col gap-3">
            <a ref={buy} href={`tel:${SITE.phoneIntl}`} className="btn btn-ink min-h-14">Reserve to try on</a>
            <p>{noReturn && <><b>{noReturn}.</b> Please try it on in the shop before you buy. </>}Call <a href={`tel:${SITE.phoneIntl}`} className="whitespace-nowrap underline underline-offset-4">{SITE.phone}</a> or walk in. <span className="text-mute">Online ordering opens at launch; this is a sample product.</span></p>
            {menSuit && <p className="text-mute">Between sizes? Take the larger and have it altered in the shop.</p>}
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-line py-4">
            <dt className="text-mute">{d.standard.name}</dt><dd>{d.standard.price}, {d.standard.time}</dd>
            <dt className="text-mute">{d.express.name}</dt><dd>{d.express.price}, {d.express.time}</dd>
            <dt className="text-mute">Free delivery</dt><dd>On orders of {d.freeOver} and over</dd>
            <dt className="text-mute">Collect</dt><dd>{d.collect}</dd>
            <dt className="text-mute">Returns</dt><dd>{noReturn ? `${noReturn}.` : `${SITE.returns.days} days.`} <Link to="/delivery-returns" className="underline underline-offset-4">Delivery and returns</Link></dd>
          </dl>

          <div>
            <Fold title="Details" open><p>{p.details}</p></Fold>
            <Fold title="Cloth and care"><p>[FABRIC COMPOSITION AND CARE]</p></Fold>
            {menSuit && <Fold title="Size guide"><p>Jacket size is your chest in inches. S, R and L are jacket lengths for heights under 5'8", 5'8" to 6'0", and over 6'0". Trousers are sized by waist and inside leg.</p></Fold>}
            <Fold title="Alterations"><p>Hems, sleeves and waists are altered in the shop. <Link to="/alterations" className="underline underline-offset-4">See alterations</Link>.</p></Fold>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap flex flex-col gap-6">
          <h2>{menSuit ? "Finish the outfit" : "You might also like"}</h2>
          <ul className="rail sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0">{related.map((x) => <li key={x.handle} className="w-[62vw] shrink-0 snap-start sm:w-auto"><ProductCard p={x} /></li>)}</ul>
        </section>
      )}

      <StickyBar watch={buy}>
        <p className="min-w-0 leading-tight"><span className="block truncate font-semibold">{p.title}</span><span className="t-small block truncate text-mute">{priceLine(p)}</span></p>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink shrink-0 px-4">Reserve to try on</a>
      </StickyBar>
    </>
  );
}
