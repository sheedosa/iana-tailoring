import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { SizeFinder } from "../components/SizeFinder";
import { FittingLine, Tape } from "../components/Tape";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

// The three doors, in equal measure. Each panel shows one piece from that side of the shop and says which.
const WHO = [
  { to: "/shop/men", title: "Men", sub: "Suits, shirts and ties", image: "hero/street-mobile", small: false, alt: "A man in a dark suit walking down a London street, seen from behind", pos: "object-[62%_50%]" },
  { to: "/shop/women", title: "Women", sub: "Suits, occasion, prom and bridal", image: "looks/womens-black", small: false, alt: "A black trouser suit worn with a cream blouse, cropped at the chin", pos: "object-[50%_20%]" },
  { to: "/shop/kids", title: "Kids", sub: "Page boys, suits and dresses", image: "looks/father-son", small: false, alt: "A boy and his father in matching navy suits walking to a church, seen from behind", pos: "object-[42%_70%]" },
];

const OCCASIONS = [
  { to: "/shop/bridal", t: "Weddings", d: "The bride, the groom, the page boys and the flower girls, all from one shop." },
  { to: "/shop/occasion", t: "Prom", d: "Prom dresses hemmed to your height, and suits with the jacket and trousers in your own sizes." },
  { to: "/shop/suits", t: "Work and interviews", d: "Men's and women's suits, white shirts and a spare pair of trousers." },
  { to: "/shop/kids", t: "Communions and parties", d: "Suits and occasion dresses for boys and girls." },
];

export function Home() {
  const m = SITE.madeToMeasure;
  const picks = ["mitcham-charcoal-suit", "midnight-satin-prom-dress", "broadway-navy-suit", "white-formal-shirt"].map((h) => store.product(h)!);
  return (
    <>
      <Seo title="Formal wear for men, women and kids in Tooting" path="/" description={`Suits, occasion and prom dresses, bridal and kids' formal wear. Made to measure from ${m.from} and alterations in our Tooting shop. Walk in, seven days a week.`} />

      {/* Hero: the headline, then the triptych. The Ochre ground stops part-way down the panels. */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 bottom-28 bg-ink sm:bottom-32" aria-hidden="true" />
        <div className="on-dark wrap relative grid gap-x-14 gap-y-4 pb-7 pt-8 text-paper sm:pt-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-end lg:pb-10 lg:pt-14">
          <h1 className="t-hero">Formal wear for men, women and kids.</h1>
          <p className="t-lede measure text-on-ink lg:pb-2">Suits, occasion and prom dresses, bridal and page boys, under one roof on Mitcham Road since {SITE.since}. Made to measure from {m.from}, alterations in the shop, and no appointment needed.</p>
        </div>
        <div className="wrap relative"><ul className="rail sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:gap-6" aria-label="Shop by who it's for">
          {WHO.map((w, i) => (
            <li key={w.to} className="rise w-[68vw] shrink-0 snap-start sm:w-auto" style={{ "--i": i } as React.CSSProperties}>
              <Link to={w.to} className="group flex flex-col">
                <span className="block overflow-hidden rounded-pill bg-deep"><img src={img(w.image, w.small)} alt={w.alt} fetchPriority={i === 0 ? "high" : undefined} width="1100" height="1366" className={`aspect-[3/4] w-full object-cover lg:aspect-[4/5] xl:aspect-[5/6] ${w.pos}`} /></span>
                <span className="flex h-28 flex-col justify-start pt-5 sm:h-32 sm:pt-6">
                  <span className="display t-section underline decoration-transparent decoration-1 underline-offset-[0.18em] group-hover:decoration-current">{w.title}</span>
                  <span className="voice text-mute">{w.sub}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul></div>
      </section>

      {/* The fitting line */}
      <section className="on-dark mt-10 overflow-x-clip bg-ink text-paper sm:mt-14">
        <div className="wrap flex flex-col gap-10 py-14 sm:py-20">
          <div className="grid gap-x-14 gap-y-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-end">
            <h2>Made to measure, from the first visit to the day you collect.</h2>
            <p className="t-lede text-on-ink">Five stages and two fittings, all in Tooting. <Link to="/made-to-measure" className="whitespace-nowrap underline underline-offset-4">How it works</Link></p>
          </div>
          <FittingLine />
        </div>
      </section>

      {/* Jacket and trousers in different sizes */}
      <section className="bg-sage">
        <div className="wrap grid gap-x-14 gap-y-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="flex flex-col gap-4">
            <h2>New: the jacket and trousers in different sizes.</h2>
            <p className="t-lede measure">A 40 regular jacket with 32/32 trousers, or whatever you measure. Give us three numbers and we'll mark your sizes on every men's suit.</p>
          </div>
          <SizeFinder />
        </div>
      </section>

      {/* In the shop now: a rail on phones, a row beside its heading on desktop */}
      <section className="wrap grid gap-x-10 gap-y-6 py-14 sm:py-20 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,4fr)]">
        <div className="flex items-end justify-between gap-4 xl:flex-col xl:items-start xl:justify-start">
          <h2>In the shop now</h2>
          <Link to="/shop/all" className="link shrink-0">See everything</Link>
        </div>
        <ul className="rail sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0">
          {picks.map((p) => <li key={p.handle} className="w-[62vw] shrink-0 snap-start sm:w-auto"><ProductCard p={p} /></li>)}
        </ul>
      </section>

      {/* Dressed for the day: an index, not cards */}
      <section className="wrap grid gap-x-14 gap-y-6 pb-14 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <h2>Dressed for the day</h2>
        <ul className="border-t border-ink">
          {OCCASIONS.map((o) => (
            <li key={o.t} className="border-b border-line">
              <Link to={o.to} className="group grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:items-baseline">
                <span className="t-sub underline decoration-transparent decoration-1 underline-offset-[0.25em] group-hover:decoration-current">{o.t}</span>
                <span className="text-mute">{o.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Visit */}
      <section className="on-dark bg-ink text-paper">
        <div className="wrap grid gap-x-14 gap-y-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <h2 className="t-title">Just walk in.</h2>
            <Tape n={7} end className="w-[11.5rem]" />
            <p className="t-lede measure text-on-ink">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}. Open {SITE.hours}. No appointment needed to be measured, try on or drop off alterations.</p>
            <div className="flex flex-wrap gap-3 pt-2"><Link to="/visit" className="btn btn-paper">Find the shop</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-outline-paper">Call {SITE.phone}</a></div>
          </div>
          <div className="flex flex-col gap-2 border-t border-paper/40 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3>Alterations</h3>
            <p className="voice">Taken up, let out, made to fit.</p>
            <p className="text-on-ink">Hems, sleeves, waists and dresses, done in the shop. Bring it in, or call to ask.</p>
            <Link to="/alterations" className="link self-start">Alterations and prices</Link>
          </div>
        </div>
      </section>
    </>
  );
}
