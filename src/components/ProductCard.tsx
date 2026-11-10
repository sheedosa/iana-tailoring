import { cardImg, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { PhotoSlot } from "./Art";
import { VLink, garmentVT } from "./VLink";
import { SITE, type Sizes } from "../data/site";

function inMySizes(p: Product, s: Sizes | null) {
  if (!s || p.kind !== "suit") return null;
  const out = p.soldOut ?? [];
  return !out.includes(`${s.chest}${s.length}`) && !out.includes(`${s.waist}/${s.leg}`);
}

export const priceLine = (p: Product) =>
  p.kind === "suit" || p.kind === "womens-suit" ? <>Jacket <span className="whitespace-nowrap">£[PRICE]</span>, trousers <span className="whitespace-nowrap">£[PRICE]</span></>
    : p.kind === "mtm" ? <>From {SITE.madeToMeasure.from}, with {SITE.madeToMeasure.fittings} fittings</>
    : <span className="whitespace-nowrap">£[PRICE]</span>;

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const { sizes } = useSizes();
  const mine = inMySizes(p, sizes);
  const tag = mine === true ? "In your sizes" : mine === false ? "Low in your size" : p.badge;
  const mtm = p.kind === "mtm";
  return (
    <VLink to={mtm ? "/made-to-measure" : `/products/${p.handle}`} className="group flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-pill bg-sage" style={mtm ? undefined : garmentVT(p.handle)}>
        {p.images[0]
          ? <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
          : <PhotoSlot art={p.slot?.art ?? "jacket"} label={p.type} line={p.slot?.line ?? ""} className="aspect-[4/5]" compact />}
        {tag && <span className={`absolute left-2.5 top-2.5 rounded-pill px-2 py-1 text-[13px] font-semibold ${mine === false ? "bg-ink text-paper" : "bg-paper text-ink"}`}>{tag}</span>}
      </div>
      <h3 className="text-[1.125rem] leading-snug underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-current">{p.title}{p.kind === "suit" && p.fit ? `, ${p.fit.toLowerCase()} fit` : ""}</h3>
      <p className="-mt-1.5 text-mute">{priceLine(p)}</p>
    </VLink>
  );
}
