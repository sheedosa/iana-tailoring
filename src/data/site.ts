// Facts for I&A Formal. Business details are the company's (same shop as Schoolwear and Fashions).
// Anything the client has not confirmed lives in toConfirm and appears on pages only as a labelled placeholder.
export const SITE = {
  name: "I&A Formal",
  legalName: "I & A Fashions Limited",
  tradingAs: "I & A Formal",
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
  // Confirmed by the client.
  delivery: {
    standard: { name: "Standard delivery", price: "£4.95", time: "5 working days" },
    express: { name: "Express delivery", price: "£7.95", time: "48 hours" },
    freeOver: "£100",
    collect: "Click and collect from 84 Mitcham Road, Tooting",
  },
  returns: { days: 28, excluded: ["suits", "bridal dresses", "prom dresses"] },
  madeToMeasure: { from: "£250", deposit: "50%", weeks: "4 to 6 weeks", fittings: 2 },
  appointments: "Walk in, no appointment needed",
  preview: true, // concept preview: sample products, ordering switched off
  toConfirm: [
    "product range, names and prices (every product on the site is a sample)",
    "fits offered (slim / tailored / regular) and size runs for men, women and kids",
    "alterations price list and usual turnaround",
    "made-to-measure cloths and the price list above £250",
    "whether made to measure covers women's and kids' pieces",
    "whether online orders can be altered in the shop",
    "photography of the range and the shop front",
    "how returns are sent, when refunds are made, and any click and collect charge",
  ],
};

export const deliveryLine = `Standard ${SITE.delivery.standard.price} · Express ${SITE.delivery.express.price} · Free over ${SITE.delivery.freeOver} · Click and collect in Tooting`;

// Sizing model for men's suits. Thresholds are conventional menswear practice; the client confirms their own runs.
export const FITS = ["Slim", "Tailored", "Regular"] as const;
export type Fit = (typeof FITS)[number];
export const JACKET_CHESTS = [36, 38, 40, 42, 44, 46, 48, 50];
export const JACKET_LENGTHS = ["S", "R", "L"] as const;
export const TROUSER_WAISTS = [28, 30, 32, 34, 36, 38, 40, 42, 44];
export const TROUSER_LEGS = [30, 32, 34] as const;
export const UK_SIZES = [6, 8, 10, 12, 14, 16, 18, 20];
export const KIDS_AGES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
export const COLLARS = ["14½", "15", "15½", "16", "16½", "17", "17½", "18"];
export const SLEEVES = ["33", "34", "35", "36"];

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
