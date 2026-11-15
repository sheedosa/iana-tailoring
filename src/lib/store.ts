// Commerce goes through this module only. Preview mode reads catalogue.json; at build the Shopify adapter
// (ported from iana-schoolwear) implements the same interface, with men's jacket and trousers as separate products
// linked by a "suit" metafield and sized by variant options (Chest + Length, Waist + Leg).
import catalogue from "../data/catalogue.json";
import variants from "../data/images.json";
import type { Fit, Sizes } from "../data/site";

export type Art = "jacket" | "waistcoat" | "gown" | "bridal" | "dress" | "party" | "jumpsuit" | "shirt" | "tie" | "trousers" | "shopfront";
export type Who = "men" | "women" | "kids";
export type Product = {
  handle: string;
  title: string;
  for: Who;
  kind: "suit" | "womens-suit" | "dress" | "shirt" | "trousers" | "accessory" | "kids" | "mtm";
  type: string;
  collections: string[];
  fit?: Fit;
  cloth: string;
  colour: string;
  images: string[];
  slot?: { art: Art; line: string };
  badge?: string;
  lengths?: ("S" | "R" | "L")[];
  legs?: (30 | 32 | 34)[];
  soldOut?: string[]; // e.g. "32/34" (trousers) or "44R" (jacket)
  noReturn?: "suits" | "bridal" | "prom";
  details: string;
};
export type Collection = { handle: string; title: string; blurb: string };

const data = catalogue as unknown as { collections: Collection[]; products: Product[] };

export const WHO: Record<Who, string> = { men: "Men", women: "Women", kids: "Kids" };

export const store = {
  /** The link-preview card (1200x630) for a piece: its own card when it has a photograph (made from that photograph by
      builds/v7/seo/_scripts/cards.mjs into public/img/og/p/), otherwise the site card. */
  card: (p: Product): string => (p.images.length ? `/img/og/p/${p.handle}.jpg` : "/img/og/og-home.jpg"),
  cardAlt: (p: Product): string => (p.images.length ? `${p.title}, photographed in a frame, beside the I & A Formal lockup` : "I & A Formal: formal wear for men, women and kids, three framed drawings of a suit, a bridal gown and a boy's suit"),
  collections: (): Collection[] => data.collections,
  collection: (handle: string) => data.collections.find((c) => c.handle === handle),
  products: (f: { collection?: string; who?: Who[]; type?: string[]; fit?: Fit[] } = {}): Product[] =>
    data.products.filter((p) =>
      (!f.collection || f.collection === "all" || p.collections.includes(f.collection)) &&
      (!f.who?.length || f.who.includes(p.for)) &&
      (!f.type?.length || f.type.includes(p.type)) &&
      (!f.fit?.length || (p.fit !== undefined && f.fit.includes(p.fit)))),
  product: (handle: string) => data.products.find((p) => p.handle === handle),
  /** Pieces that complete an outfit: a men's suit gets a shirt, a tie and spare trousers; others get their own section. */
  related: (p: Product): Product[] => {
    const pick = (handles: string[]) => handles.map((h) => data.products.find((x) => x.handle === h)).filter((x): x is Product => !!x && x.handle !== p.handle);
    if (p.kind === "suit") return pick(["white-formal-shirt", "sage-knitted-tie", "spare-trousers-charcoal", "made-to-measure"]).slice(0, 4);
    if (p.handle === "ivory-bridal-gown") return pick(["sage-midi-occasion-dress", "girls-ivory-occasion-dress", "boys-navy-suit", "tooting-grey-three-piece"]);
    return data.products.filter((x) => x.for === p.for && x.handle !== p.handle && x.kind !== "mtm").slice(0, 4);
  },
};

export const img = (path: string) => `${import.meta.env.BASE_URL}img/${path}.webp`;

/** A photograph with the widths cut for it by scripts/images.mjs, so the browser takes the smallest file that fills
    the frame. `width` and `height` are the source's own, which reserves the picture's shape before it arrives. */
export const photo = (path: string) => {
  const m = (variants as Record<string, { width: number; height: number; widths: number[] }>)[path];
  if (!m) return { src: img(path), srcSet: undefined, width: 1100, height: 1366 };
  const top = m.widths[m.widths.length - 1];
  return { src: img(`${path}-${top}`), srcSet: m.widths.map((w) => `${img(`${path}-${w}`)} ${w}w`).join(", "), width: m.width, height: m.height };
};
/** How wide a picture is shown: in a plate on a listing, and in the single column of a product or information page. */
export const SIZES = { plate: "(min-width: 48rem) 278px, 246px", page: "(min-width: 28rem) 390px, calc(100vw - 58px)" } as const;

/** Whether a men's suit or pair of trousers is cut in the shopper's saved jacket length and leg. Other pieces: null. */
export const cutIn = (p: Product, s: Sizes | null): boolean | null => {
  if (!s || (p.kind !== "suit" && p.kind !== "trousers")) return null;
  return (p.kind !== "suit" || !p.lengths || p.lengths.includes(s.length)) && (!p.legs || p.legs.includes(s.leg));
};

const NO_RETURN: Record<NonNullable<Product["noReturn"]>, string> = {
  suits: "Suits cannot be returned",
  bridal: "Bridal dresses cannot be returned",
  prom: "Prom dresses cannot be returned",
};
export const noReturnLine = (p: Product) => (p.noReturn ? NO_RETURN[p.noReturn] : null);
