import { Link } from "react-router-dom";
import { cardImg, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { PhotoSlot } from "./Art";
import { SITE } from "../data/site";

function inMySizes(p: Product, label: string | null) {
  if (!label || p.kind !== "suit") return null;
  const [jacket, trousers] = label.split(" · ");
  const out = p.soldOut ?? [];
  return !out.includes(jacket) && !out.includes(trousers);
}

export const priceLine = (p: Product) =>
  p.kind === "suit" || p.kind === "womens-suit" ? <>Jacket <span className="whitespace-nowrap">£[PRICE]</span> · Trousers <span className="whitespace-nowrap">£[PRICE]</span></>
    : p.kind === "mtm" ? <>From {SITE.madeToMeasure.from} · {SITE.madeToMeasure.fittings} fittings</>
    : <span className="whitespace-nowrap">£[PRICE]</span>;

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const { label } = useSizes();
  const mine = inMySizes(p, label);
  const tag = mine === true ? "In your sizes" : mine === false ? "Low in your size" : p.badge;
  return (
    <Link to={p.kind === "mtm" ? "/made-to-measure" : `/products/${p.handle}`} className="lift group flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-pill bg-sage">
        {p.images[0]
          ? <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
          : <PhotoSlot art={p.slot?.art ?? "jacket"} label={p.type} line={p.slot?.line ?? ""} className="aspect-[4/5]" compact />}
        {tag && <span className={`label absolute left-3 top-3 rounded-pill px-2 py-1.5 text-[11px] ${mine === false ? "bg-ink text-paper" : "bg-paper"}`}>{tag}</span>}
      </div>
      <h3 className="text-base group-hover:underline">{p.title}{p.kind === "suit" && p.fit ? `, ${p.fit.toLowerCase()} fit` : ""}</h3>
      <p className="-mt-1.5 text-base text-mute">{priceLine(p)}</p>
    </Link>
  );
}
