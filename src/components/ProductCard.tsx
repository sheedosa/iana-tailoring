import { Link } from "react-router-dom";
import { cardImg, type Product } from "../lib/store";
import { useSizes } from "../lib/sizes";

function inMySizes(p: Product, label: string | null) {
  if (!label || p.kind !== "suit") return null;
  const [jacket, trousers] = label.split(" · ");
  const out = p.soldOut ?? [];
  return !out.includes(jacket) && !out.includes(trousers);
}

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const { label } = useSizes();
  const mine = inMySizes(p, label);
  const price = p.kind === "suit" ? "Jacket £[PRICE] · Trousers £[PRICE]" : p.kind === "mtm" ? "From £[PRICE] · two fittings" : "£[PRICE]";
  return (
    <Link to={p.kind === "mtm" ? "/made-to-measure" : `/products/${p.handle}`} className="lift group flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-pill bg-sage">
        <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
        {mine === true ? <span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px]">In your sizes</span>
          : mine === false ? <span className="label absolute left-3 top-3 rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Low in your size</span>
          : p.badge ? <span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px]">{p.badge}</span> : null}
      </div>
      <h3 className="text-base group-hover:underline">{p.title}{p.kind === "suit" ? `, ${p.fit.toLowerCase()} fit` : ""}</h3>
      <p className="-mt-1.5 text-sm text-mute">{price}{p.kind !== "mtm" ? ` · ${p.cloth}` : ""}</p>
    </Link>
  );
}
