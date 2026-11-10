import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { priceLine } from "../components/Plate";
import { Picture } from "../components/Art";
import { VLink } from "../components/VLink";
import { Crumbs, Heading, Title } from "../components/Layout";
import { NotFound } from "./NotFound";
import { noReturnLine, store, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { COLLARS, JACKET_CHESTS, JACKET_LENGTHS, KIDS_AGES, SITE, SLEEVES, TROUSER_LEGS, TROUSER_WAISTS, UK_SIZES } from "../data/site";

const LEN = { S: "Short", R: "Regular", L: "Long" } as const;

/** The size matrix: every size the piece can be chosen in, one key each. The brass mark is the shopper's saved size. */
function Matrix<C extends string | number, R extends string | number>({ name, head, cols, rows, rowName, code, say, value, pick, mine }:
  { name: string; head: string; cols: readonly C[]; rows: readonly R[]; rowName: (r: R) => string; code: (c: C, r: R) => string; say: (c: C, r: R) => string; value: string | null; pick: (v: string) => void; mine?: string | null }) {
  return (
    <div role="group" aria-label={name} className="matrix" style={{ "--c": cols.length, "--r": rows.length } as React.CSSProperties}>
      <span className="mx-head" aria-hidden="true">{head}</span>
      {cols.map((c) => <span key={c} className="mx-head" aria-hidden="true">{c}</span>)}
      {rows.map((r) => (
        <Fragment key={r}>
          <span className="mx-row" aria-hidden="true">{rowName(r)}</span>
          {cols.map((c) => {
            const v = code(c, r);
            return <button key={v} type="button" className="mx-cell" aria-pressed={value === v} aria-label={`${say(c, r)}${mine === v ? ", your saved size" : ""}`} onClick={() => pick(v)}>{v}{mine === v && <span className="mx-mine" aria-hidden="true" />}</button>;
          })}
        </Fragment>
      ))}
    </div>
  );
}

/** One run of sizes with nothing to cross it against: a row of keys. */
function Keys<T extends string | number>({ name, opts, value, pick }: { name: string; opts: readonly T[]; value: string | null; pick: (v: string) => void }) {
  return (
    <div role="group" aria-label={name} className="flex flex-col items-center gap-2">
      <span className="text-mute" aria-hidden="true">{name}</span>
      <div className="keys">{opts.map((o) => <button key={o} type="button" className="mx-cell" aria-pressed={value === String(o)} aria-label={`${name} ${o}`} onClick={() => pick(String(o))}>{o}</button>)}</div>
    </div>
  );
}

const Half = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="flex w-full flex-col items-center gap-3">
    <h3>{name} <span className="num pl-2 font-normal">£[PRICE]</span></h3>
    {children}
  </div>
);

const fitNote = (p: Product) =>
  p.fit === "Slim" ? "The slim fit sits close, with a narrow lapel and a tapered leg."
    : p.fit === "Tailored" ? "The tailored fit sits close through the chest and waist, with a slight taper."
    : "The regular fit has a fuller chest and a straight leg.";

export function ProductPage() {
  const { handle = "" } = useParams();
  const p = store.product(handle);
  const { sizes } = useSizes();
  const [a, setA] = useState<string | null>(null); // jacket, UK size, age or collar
  const [b, setB] = useState<string | null>(null); // trousers or sleeve
  useEffect(() => { setA(null); setB(null); }, [handle]);
  if (!p) return <NotFound />;

  const menSuit = p.kind === "suit";
  const lengths = JACKET_LENGTHS.filter((x) => !p.lengths || p.lengths.includes(x));
  const legs = TROUSER_LEGS.filter((x) => !p.legs || p.legs.includes(x));
  // The shopper's saved sizes, where this piece is cut in them.
  const myJ = sizes && lengths.includes(sizes.length) ? `${sizes.chest}${sizes.length}` : null;
  const myT = sizes && legs.includes(sizes.leg) ? `${sizes.waist}/${sizes.leg}` : null;
  const j = menSuit ? a ?? myJ : a;
  const t = menSuit ? b ?? myT : p.kind === "trousers" ? a ?? myT : b;
  const related = store.related(p);
  const path = `/products/${p.handle}`;
  const coll = p.collections[0];
  const collTitle = store.collection(coll)?.title ?? p.type;
  const noReturn = noReturnLine(p);
  const d = SITE.delivery;
  const or = (v: string | null) => v ?? "to choose";

  const jacket = <Matrix name="Jacket size" head="Chest" cols={JACKET_CHESTS} rows={lengths} rowName={(r) => LEN[r]} code={(c, r) => `${c}${r}`} say={(c, r) => `Jacket, ${c} inch chest, ${LEN[r].toLowerCase()}`} value={j} pick={setA} mine={myJ} />;
  const trousers = (set: (v: string) => void) => <Matrix name="Trouser size" head="Waist" cols={TROUSER_WAISTS} rows={legs} rowName={(r) => `Leg ${r}`} code={(c, r) => `${c}/${r}`} say={(c, r) => `Trousers, ${c} inch waist, ${r} inch leg`} value={t} pick={set} mine={myT} />;

  const sizing =
    menSuit ? { body: <><Half name="Jacket">{jacket}</Half><Half name="Trousers">{trousers(setB)}</Half></>, chosen: `Jacket ${or(j)}, trousers ${or(t)}` }
      : p.kind === "trousers" ? { body: trousers(setA), chosen: `Trousers ${or(t)}` }
      : p.kind === "womens-suit" ? { body: <><Half name="Jacket"><Keys name="UK size, jacket" opts={UK_SIZES} value={a} pick={setA} /></Half><Half name="Trousers"><Keys name="UK size, trousers" opts={UK_SIZES} value={b} pick={setB} /></Half></>, chosen: `Jacket ${or(a)}, trousers ${or(b)}` }
      : p.kind === "dress" ? { body: <Keys name="UK size" opts={UK_SIZES} value={a} pick={setA} />, chosen: `UK size ${or(a)}` }
      : p.kind === "kids" ? { body: <Keys name="Age" opts={KIDS_AGES} value={a} pick={setA} />, chosen: `Age ${or(a)}` }
      : p.kind === "shirt" ? { body: <><Keys name="Collar" opts={COLLARS} value={a} pick={setA} /><Keys name="Sleeve" opts={SLEEVES} value={b} pick={setB} /></>, chosen: `Collar ${or(a)}, sleeve ${or(b)}` }
      : null;

  const line = [p.fit && menSuit ? `${p.fit} fit` : null, p.cloth, p.colour].filter(Boolean).join(", ").toLowerCase().replace(/^./, (x) => x.toUpperCase());

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.colour.toLowerCase()} ${p.cloth.toLowerCase()}.${menSuit ? " Jacket and trousers in different sizes." : ""} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: collTitle, path: `/shop/${coll}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.cloth, color: p.colour, brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <Title crumbs={<Crumbs trail={[[`/shop/${coll}`, collTitle]]} here={p.title} />} title={p.title} line={line} />

      <section className="wrap flex flex-col items-center gap-8">
        <figure className="flex w-full max-w-[26rem] flex-col items-center gap-2">
          <Picture p={p} eager className="w-full" />
          {!p.images[0] && <figcaption className="t-small text-mute">A drawing of the piece. Its photograph is to come.</figcaption>}
        </figure>

        <div className="col gap-3">
          <p className="t-lede">{priceLine(p)}</p>
          <p>{p.details}</p>
          {menSuit && <p>{fitNote(p)}</p>}
        </div>

        {sizing && (
          <div className="flex w-full flex-col items-center gap-7">
            <Heading>Choose your size</Heading>
            {sizing.body}
            {(menSuit || p.kind === "trousers") && (
              <p className="max-w-[38rem]">
                {sizes ? <><span className="mr-2 inline-block h-2 w-2 rotate-45 bg-brass align-middle" aria-hidden="true" />The brass mark is your saved size. <Link to="/find-my-sizes" className="inl">Change my sizes</Link></>
                  : <>Not sure of your size? <Link to="/find-my-sizes" className="inl">Find my sizes</Link> from your height, chest and waist.</>}
                {menSuit && " If you are between two sizes, take the larger and we will alter it in the shop."}
              </p>
            )}
            <p className="num text-lg" aria-live="polite">{sizing.chosen}</p>
          </div>
        )}

        <div className="col gap-3">
          <a href={`tel:${SITE.phoneIntl}`} className="btn min-h-14 w-full max-w-[22rem]">Reserve to try on</a>
          <p>Telephone <a href={`tel:${SITE.phoneIntl}`} className="inl num whitespace-nowrap">{SITE.phone}</a> and we will put it aside, or walk in. This piece is a sample; ordering opens at launch.</p>
          {noReturn && <p><b>{noReturn}.</b> Please try it on in the shop before you buy.</p>}
        </div>

        <div className="col gap-8 pt-4">
          <div className="flex w-full flex-col items-center gap-3">
            <h2 className="t-plate">Delivery and returns</h2>
            <dl className="spec spec-even">
              <dt>{d.standard.name}</dt><dd><span className="num">{d.standard.price}</span>, {d.standard.time}</dd>
              <dt>{d.express.name}</dt><dd><span className="num">{d.express.price}</span>, {d.express.time}</dd>
              <dt>Free delivery</dt><dd>On orders of <span className="num">{d.freeOver}</span> and over</dd>
              <dt>Collect</dt><dd>{d.collect}</dd>
              <dt>Returns</dt><dd>{noReturn ? `${noReturn}.` : `Within ${SITE.returns.days} days.`}</dd>
            </dl>
            <Link to="/delivery-returns" className="link">Delivery and returns in full</Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="t-plate">Cloth and care</h2>
            <p>[FABRIC COMPOSITION AND CARE]</p>
          </div>
          {menSuit && (
            <div className="flex flex-col items-center gap-2">
              <h2 className="t-plate">How the sizes work</h2>
              <p>The jacket size is your chest in inches. Short, regular and long are jacket lengths for heights under 5'8", from 5'8" to 6'0", and over 6'0". Trousers are sized by waist and inside leg.</p>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <h2 className="t-plate">Alterations</h2>
            <p>Hems, sleeves and waists are altered in the shop. <Link to="/alterations" className="inl">Read about alterations</Link></p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="flex w-full max-w-[44rem] flex-col items-center gap-5 pt-6">
            <Heading>{menSuit ? "To finish the outfit" : "From the same department"}</Heading>
            <ul className="w-full border-t border-hair">
              {related.map((x) => (
                <li key={x.handle} className="border-b border-hair">
                  <VLink to={x.kind === "mtm" ? "/made-to-measure" : `/products/${x.handle}`} className="group grid min-h-14 grid-cols-1 items-baseline gap-x-6 py-3 sm:grid-cols-[1fr_1fr]">
                    <span className="text-lg underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-current sm:text-right">{x.title}</span>
                    <span className="text-mute sm:text-left">{x.cloth === "Your choice" ? "Your cloth" : `${x.cloth}, ${x.colour.toLowerCase()}`}. {priceLine(x)}</span>
                  </VLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
