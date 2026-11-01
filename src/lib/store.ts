// Commerce goes through this module only. Preview mode reads catalogue.json; at build the Shopify adapter
// (ported from iana-schoolwear) implements the same interface, with jacket and trousers as separate products
// linked by a "suit" metafield and sized by variant options (Chest + Length, Waist + Leg).
import catalogue from "../data/catalogue.json";
import type { Fit } from "../data/site";

export type Product = {
  handle: string;
  title: string;
  kind: "suit" | "shirt" | "trousers" | "accessory" | "boys" | "mtm";
  type: string;
  collections: string[];
  fit: Fit;
  cloth: string;
  colour: string;
  images: string[];
  badge?: string;
  lengths?: ("S" | "R" | "L")[];
  legs?: (30 | 32 | 34)[];
  soldOut?: string[]; // e.g. "32/34" (trousers) or "44R" (jacket)
  details: string;
};
export type Collection = { handle: string; title: string; blurb: string };

const data = catalogue as unknown as { collections: Collection[]; products: Product[] };

export const store = {
  collections: (): Collection[] => data.collections,
  collection: (handle: string) => data.collections.find((c) => c.handle === handle),
  products: (f: { collection?: string; fit?: Fit[]; cloth?: string[] } = {}): Product[] =>
    data.products.filter((p) =>
      (!f.collection || f.collection === "all" || p.collections.includes(f.collection)) &&
      (!f.fit?.length || f.fit.includes(p.fit)) &&
      (!f.cloth?.length || f.cloth.includes(p.cloth))),
  product: (handle: string) => data.products.find((p) => p.handle === handle),
};

export const img = (path: string, small = false) => `${import.meta.env.BASE_URL}img/${path}${small ? "-sm" : ""}.webp`;
export const cardImg = (path: string) => img(path, !path.startsWith("hero/"));
