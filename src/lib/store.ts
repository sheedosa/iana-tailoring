// Commerce goes through this module only. Preview mode reads catalogue.json; at build the Shopify adapter
// (ported from iana-schoolwear) implements the same interface, with men's jacket and trousers as separate products
// linked by a "suit" metafield and sized by variant options (Chest + Length, Waist + Leg).
import catalogue from "../data/catalogue.json";
import type { Fit } from "../data/site";

export type Art = "jacket" | "waistcoat" | "gown" | "dress" | "jumpsuit" | "shirt" | "tie" | "trousers" | "shopfront";
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

export const img = (path: string, small = false) => `${import.meta.env.BASE_URL}img/${path}${small ? "-sm" : ""}.webp`;
export const cardImg = (path: string) => img(path, !path.startsWith("hero/"));

const NO_RETURN: Record<NonNullable<Product["noReturn"]>, string> = {
  suits: "Suits can't be returned",
  bridal: "Bridal dresses can't be returned",
  prom: "Prom dresses can't be returned",
};
export const noReturnLine = (p: Product) => (p.noReturn ? NO_RETURN[p.noReturn] : null);
