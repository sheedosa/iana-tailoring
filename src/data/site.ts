// Facts for I&A Tailoring. Business details are the company's (same shop as Schoolwear and Fashions).
// Anything the client has not confirmed lives in toConfirm and appears on pages only as a labelled placeholder.
export const SITE = {
  name: "I&A Tailoring",
  legalName: "I & A Fashions Limited",
  tradingAs: "I & A Tailoring",
  companyNumber: "07202123",
  vat: "338770178",
  since: 1993,
  address: { street: "84 Mitcham Road", area: "Tooting", city: "London", postcode: "SW17 9NG" },
  phone: "020 8767 8613",
  phoneIntl: "+442087678613",
  hours: "Monday to Sunday, 9am to 6pm",
  email: "",
  social: { instagram: "https://www.instagram.com/iafashions/", facebook: "https://www.facebook.com/iafashions/" },
  url: "https://sheedosa.github.io/iana-tailoring",
  family: [
    { name: "I&A Fashions", url: "https://sheedosa.github.io/iana-fashions/" },
    { name: "I&A Schoolwear", url: "https://sheedosa.github.io/iana-schoolwear/" },
  ],
  preview: true, // concept preview: sample products, ordering and booking switched off
  toConfirm: [
    "trading name (I & A Tailoring proposed)",
    "product range, names and prices",
    "whether suits are sold as separates today",
    "fits offered (slim / tailored / regular) and size runs",
    "alterations policy (free in store?)",
    "made-to-measure prices, deposit, lead time and number of fittings",
    "cloth books and mills",
    "delivery charges and returns window",
    "appointment slots and how bookings are taken",
  ],
};

// Sizing model for the fit finder. Thresholds are conventional menswear practice; the client confirms their own runs.
export const FITS = ["Slim", "Tailored", "Regular"] as const;
export type Fit = (typeof FITS)[number];
export const JACKET_CHESTS = [36, 38, 40, 42, 44, 46, 48, 50];
export const JACKET_LENGTHS = ["S", "R", "L"] as const;
export const TROUSER_WAISTS = [28, 30, 32, 34, 36, 38, 40, 42, 44];
export const TROUSER_LEGS = [30, 32, 34] as const;

export type Sizes = { chest: number; length: (typeof JACKET_LENGTHS)[number]; waist: number; leg: (typeof TROUSER_LEGS)[number]; fit: Fit };

/** Height in inches, chest and waist in inches → suggested sizes. Drop is chest minus waist. */
export function suggestSizes(heightIn: number, chest: number, waist: number): Sizes {
  const near = (arr: readonly number[], v: number) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const length = heightIn < 68 ? "S" : heightIn <= 72 ? "R" : "L";
  const leg = heightIn < 68 ? 30 : heightIn <= 72 ? 32 : 34;
  const drop = chest - waist;
  const fit: Fit = drop >= 8 ? "Slim" : drop >= 5 ? "Tailored" : "Regular";
  return { chest: near(JACKET_CHESTS, chest), length, waist: near(TROUSER_WAISTS, waist), leg, fit };
}
export const sizeLabel = (s: Sizes) => `${s.chest}${s.length} · ${s.waist}/${s.leg}`;
