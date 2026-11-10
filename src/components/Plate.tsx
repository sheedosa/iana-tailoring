import { cutIn, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { Picture } from "./Art";
import { VLink } from "./VLink";
import { COLLARS, JACKET_CHESTS, KIDS_AGES, SITE, SLEEVES, TROUSER_WAISTS, UK_SIZES, sizeLabel } from "../data/site";

const LEN = { S: "short", R: "regular", L: "long" } as const;
const list = (xs: (string | number)[]) => xs.join(", ").replace(/, ([^,]*)$/, " and $1");
const ends = <T,>(xs: readonly T[]) => `${xs[0]} to ${xs[xs.length - 1]}`;

export const priceLine = (p: Product) =>
  p.kind === "suit" || p.kind === "womens-suit" ? <>Jacket <span className="num whitespace-nowrap">£[PRICE]</span>, trousers <span className="num whitespace-nowrap">£[PRICE]</span></>
    : p.kind === "mtm" ? <>From <span className="num">{SITE.madeToMeasure.from}</span>, with {SITE.madeToMeasure.fittings} fittings</>
    : <span className="num whitespace-nowrap">£[PRICE]</span>;

/** The sizes a piece can be chosen in, in words. These are the size runs on the product page, not a stock count. */
export const sizeRun = (p: Product): React.ReactNode => {
  const legs = `leg ${list(p.legs ?? [30, 32, 34])}`;
  switch (p.kind) {
    case "suit": return <>Jacket <span className="num">{ends(JACKET_CHESTS)}</span>, {list((p.lengths ?? ["S", "R", "L"]).map((l) => LEN[l]))}. Trousers <span className="num">{ends(TROUSER_WAISTS)}</span>, {legs}.</>;
    case "trousers": return <>Waist <span className="num">{ends(TROUSER_WAISTS)}</span>, {legs}.</>;
    case "womens-suit": return <>Jacket and trousers each in UK <span className="num">{ends(UK_SIZES)}</span>.</>;
    case "dress": return <>UK <span className="num">{ends(UK_SIZES)}</span>.</>;
    case "kids": return <>Ages <span className="num">{ends(KIDS_AGES)}</span>.</>;
    case "shirt": return <>Collar <span className="num">{ends(COLLARS)}</span>, sleeve <span className="num">{ends(SLEEVES)}</span>.</>;
    case "mtm": return <>Cut to your own measurements.</>;
    default: return null;
  }
};

/** One piece in the catalogue: the framed picture on one side, its specification on the other. */
export function Plate({ p, flip = false, eager = false }: { p: Product; flip?: boolean; eager?: boolean }) {
  const { sizes } = useSizes();
  const mine = cutIn(p, sizes);
  const mtm = p.kind === "mtm";
  const to = mtm ? "/made-to-measure" : `/products/${p.handle}`;
  const run = sizeRun(p);
  return (
    <article className={`plate ${flip ? "plate-flip" : ""}`}>
      <VLink to={to} className="plate-pic" tabIndex={-1} aria-hidden="true"><Picture p={p} eager={eager} /></VLink>
      <div className="plate-spec">
        <h2 className="t-plate"><VLink to={to} className="inline-flex min-h-11 items-center underline decoration-transparent decoration-1 underline-offset-[0.2em] hover:decoration-current">{p.title}</VLink></h2>
        <dl className="spec">
          <dt>Cloth</dt><dd>{p.cloth}</dd>
          <dt>Colour</dt><dd>{p.colour}</dd>
          {p.fit && <><dt>Fit</dt><dd>{p.fit}</dd></>}
          {run && <><dt>Sizes</dt><dd>{run}</dd></>}
          <dt>Price</dt><dd>{priceLine(p)}</dd>
        </dl>
        {sizes && mine !== null && (
          <p className="t-small flex items-center gap-2">
            {mine && <span className="inline-block h-2 w-2 rotate-45 bg-brass" aria-hidden="true" />}
            {mine ? <>Cut in your size, <span className="num">{p.kind === "suit" ? sizeLabel(sizes) : `${sizes.waist}/${sizes.leg}`}</span></>
              : <>Not cut in your {p.kind === "suit" && p.lengths && !p.lengths.includes(sizes.length) ? `${LEN[sizes.length]} jacket length` : `${sizes.leg} inch leg`}</>}
          </p>
        )}
        <VLink to={to} className="link">{mtm ? "How made to measure works" : "Sizes and details"}<span className="sr-only">: {p.title}</span></VLink>
      </div>
    </article>
  );
}
