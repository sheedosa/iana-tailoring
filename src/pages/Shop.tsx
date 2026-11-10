import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Plate } from "../components/Plate";
import { Crumbs, Title } from "../components/Layout";
import { NotFound } from "./NotFound";
import { cutIn, store, type Collection } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { FITS, JACKET_CHESTS, SITE, TROUSER_WAISTS, type Fit, type Sizes } from "../data/site";

const ALL = { handle: "all", title: "The whole catalogue", blurb: "Every suit, dress, shirt and accessory for men, women and kids." };
const LEN = { S: "short", R: "regular", L: "long" } as const;
const a = SITE.address;
const tel = <a href={`tel:${SITE.phoneIntl}`} className="inl num whitespace-nowrap">{SITE.phone}</a>;

/** Men: the shopper's own size comes first, then the fit. */
function MenHead({ sizes, mine, setMine, fits, fit, setFit }: { sizes: Sizes | null; mine: boolean; setMine: (v: boolean) => void; fits: Fit[]; fit: Fit | null; setFit: (f: Fit | null) => void }) {
  return (
    <div className="col gap-2 pt-6">
      {sizes ? (
        <>
          <p>Your saved size is a <span className="num font-semibold">{sizes.chest}{sizes.length}</span> jacket and <span className="num font-semibold">{sizes.waist}/{sizes.leg}</span> trousers. It is marked on every suit.</p>
          <div className="flex flex-wrap justify-center gap-x-6">
            <button type="button" className="opt" aria-pressed={mine} onClick={() => setMine(!mine)}>Show only suits and trousers cut in my size</button>
            <Link to="/find-my-sizes" className="link">Change my sizes</Link>
          </div>
        </>
      ) : (
        <>
          <p>Jackets run from a <span className="num">{JACKET_CHESTS[0]}</span> to a <span className="num">{JACKET_CHESTS[JACKET_CHESTS.length - 1]}</span> inch chest in short, regular and long. Trousers run from a <span className="num">{TROUSER_WAISTS[0]}</span> to a <span className="num">{TROUSER_WAISTS[TROUSER_WAISTS.length - 1]}</span> inch waist. Tell us your height, chest and waist and we will mark your size on every suit.</p>
          <Link to="/find-my-sizes" className="link">Find my sizes</Link>
        </>
      )}
      {fits.length > 1 && (
        <div role="group" aria-label="Suit fit" className="flex flex-wrap items-center justify-center gap-x-5">
          <span className="text-mute">Suit fit</span>
          <button type="button" className="opt" aria-pressed={fit === null} onClick={() => setFit(null)}>Any</button>
          {fits.map((f) => <button key={f} type="button" className="opt" aria-pressed={fit === f} onClick={() => setFit(f)}>{f}</button>)}
        </div>
      )}
    </div>
  );
}

/** Prom and bridal are chosen in the shop: the visit leads. */
function ComeIn({ what, excluded }: { what: string; excluded: string }) {
  return (
    <div className="col gap-3 pt-8">
      <h2 className="t-plate">Come in and try {what} on</h2>
      <p>You do not need an appointment. We are at {a.street}, {a.area}, {a.city} {a.postcode}, open {SITE.hours}. Telephone {tel} if you would like to ask about a dress first.</p>
      <p>{excluded} cannot be returned, so please try yours on in the shop before you buy.</p>
    </div>
  );
}

export function Shop() {
  const { handle = "all" } = useParams();
  const c: Collection | undefined = handle === "all" ? ALL : store.collection(handle);
  const { sizes } = useSizes();
  const [type, setType] = useState<string | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  const [mine, setMine] = useState(false);
  useEffect(() => { setType(null); setFit(null); setMine(false); }, [handle]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const men = handle === "men";
  const types = [...new Set(base.map((p) => p.type))];
  const fits = FITS.filter((f) => base.some((p) => p.kind === "suit" && p.fit === f));
  const onlyMine = men && mine && sizes !== null;
  const list = base.filter((p) =>
    (!type || p.type === type) &&
    (!men || !fit || (p.kind === "suit" && p.fit === fit)) &&
    (!onlyMine || cutIn(p, sizes) === true));
  const filtered = list.length !== base.length;
  const clear = () => { setType(null); setFit(null); setMine(false); };
  const n = (k: number) => `${k} ${k === 1 ? "piece" : "pieces"}`;

  return (
    <>
      <Seo title={handle === "all" ? "Everything" : c.title} path={`/shop/${handle}`} description={`${c.blurb} I&A Formal, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <Title crumbs={<Crumbs here={c.title} />} title={c.title.replace("&", "and")} line={men ? `${c.blurb.split(". ")[0]}.` : c.blurb}>
        {men && <MenHead sizes={sizes} mine={mine} setMine={setMine} fits={fits} fit={fit} setFit={setFit} />}
        {handle === "women" && (
          <div className="col gap-2 pt-8">
            <p>Prom and bridal dresses are best chosen in the shop, where we can hem and fit them for you. Come in and try them on; you do not need an appointment.</p>
            <p className="flex flex-wrap justify-center gap-x-8"><Link to="/shop/occasion" className="link">Prom and occasion</Link><Link to="/shop/bridal" className="link">Bridal and wedding</Link></p>
          </div>
        )}
        {handle === "occasion" && <ComeIn what="a prom dress" excluded="Prom dresses and suits" />}
        {handle === "bridal" && <ComeIn what="the gown" excluded="Bridal dresses and suits" />}
        {handle === "suits" && sizes === null && <p className="col pt-8"><span>Men's suits are sold as a jacket and trousers, each in its own size. <Link to="/find-my-sizes" className="inl">Find my sizes</Link> from your height, chest and waist.</span></p>}
        {handle === "kids" && types.length > 1 && (
          <div role="group" aria-label="Kind of piece" className="flex flex-wrap items-center justify-center gap-x-5 pt-8">
            <button type="button" className="opt" aria-pressed={type === null} onClick={() => setType(null)}>Everything</button>
            {types.map((t) => <button key={t} type="button" className="opt" aria-pressed={type === t} onClick={() => setType(t)}>{t.replace("Kids' ", "").replace(/^./, (x) => x.toUpperCase())}</button>)}
          </div>
        )}
        <p className="t-small pt-4 text-mute" aria-live="polite">
          {filtered ? `Showing ${list.length} of ${n(base.length)}.` : `${n(base.length).replace(/^./, (x) => x.toUpperCase())}.`}{SITE.preview ? " The pieces shown are samples; prices and ordering follow at launch." : ""}
        </p>
      </Title>

      <section className="wrap">
        <div className="mx-auto max-w-[60rem]">
          {list.length ? (
            <ul>
              {list.map((p, i) => <li key={p.handle} className={i ? "border-t border-hair" : ""}><Plate p={p} flip={i % 2 === 1} eager={i < 2} /></li>)}
            </ul>
          ) : (
            <div className="col gap-4 border-y border-hair py-12">
              <h2 className="t-plate">Nothing in {c.title} matches that choice</h2>
              <p>{onlyMine && sizes ? <>No piece here is cut in a {LEN[sizes.length]} jacket with a {sizes.leg} inch leg in that fit. Made to measure starts at <span className="num">{SITE.madeToMeasure.from}</span>.</> : "Take the choice off to see every piece again."}</p>
              <button type="button" onClick={clear} className="btn">Show every piece</button>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
