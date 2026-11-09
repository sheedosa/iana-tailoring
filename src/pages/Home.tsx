import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { SizeFinder } from "../components/SizeFinder";
import { MtmFacts } from "../components/MtmFacts";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

const WHO = [
  { to: "/shop/men", title: "Men", sub: "Suits, shirts, ties", image: "hero/street-mobile", pos: "object-[70%_40%]" },
  { to: "/shop/women", title: "Women", sub: "Suits, occasion, prom, bridal", image: "looks/womens-black", pos: "object-[50%_30%]" },
  { to: "/shop/kids", title: "Kids", sub: "Ages 2 to 16", image: "looks/father-son", pos: "object-[40%_60%]" },
];

const OCCASIONS = [
  { to: "/shop/bridal", t: "Weddings", d: "The bride, the groom, the page boys and the flower girls, all from one shop." },
  { to: "/shop/occasion", t: "Prom", d: "Prom dresses hemmed to your height, and suits with the jacket and trousers in your own sizes." },
  { to: "/shop/suits", t: "Work and interviews", d: "Men's and women's suits, white shirts and a spare pair of trousers." },
  { to: "/shop/kids", t: "Communions and parties", d: "Suits and occasion dresses for ages 2 to 16." },
];

export function Home() {
  const picks = ["mitcham-charcoal-suit", "midnight-satin-prom-dress", "broadway-navy-suit", "white-formal-shirt"].map((h) => store.product(h)!);
  return (
    <>
      <Seo title="Formal wear for men, women and kids in Tooting" path="/" description={`Suits, occasion and prom dresses, bridal and kids' formal wear. Made to measure from ${SITE.madeToMeasure.from} and alterations in our Tooting shop. Walk in, seven days a week.`} />

      <section className="bg-ink text-paper">
        <div className="wrap grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-20">
          <div className="flex flex-col gap-5">
            <p className="label text-sage">Tooting, London · since {SITE.since}</p>
            <h1 className="text-[42px] text-paper sm:text-[60px] xl:text-[68px]">Formal wear for men, women and kids.</h1>
            <p className="max-w-xl text-[18px] text-on-ink">Suits, occasion and prom dresses, bridal and page boys, under one roof on Mitcham Road. Made to measure from {SITE.madeToMeasure.from}, alterations in the shop, and no appointment needed.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/shop/all" className="btn btn-paper">Shop the range</Link>
              <Link to="/made-to-measure" className="btn btn-outline-paper">Made to measure</Link>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Shop by who it's for">
            {WHO.map((w, i) => (
              <li key={w.to} className={i === 1 ? "lg:-mt-10" : i === 2 ? "lg:mt-10" : ""}>
                <Link to={w.to} className="lift group flex flex-col gap-2">
                  <span className="block overflow-hidden rounded-pill bg-deep"><img src={img(w.image, w.image.startsWith("looks/"))} alt="" fetchPriority={i === 0 ? "high" : undefined} width="560" height="700" className={`aspect-[3/4] w-full object-cover sm:aspect-[4/5] ${w.pos}`} /></span>
                  <span className="display text-[24px] text-paper group-hover:underline sm:text-[30px]">{w.title}</span>
                  <span className="-mt-1 hidden text-[14px] text-on-ink sm:block">{w.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sage">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-4">
            <p className="label">New for men's suits</p>
            <h2 className="text-[32px] sm:text-[44px]">Now: jacket and trousers in different sizes.</h2>
            <p className="text-[17px]">A 40 regular jacket with 32/32 trousers, or whatever you measure. Give us three numbers and we'll mark your sizes on every suit.</p>
          </div>
          <SizeFinder />
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">In the shop now</h2>
          <Link to="/shop/all" className="label inline-flex min-h-11 items-center underline">See everything</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{picks.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <h2 className="mb-6 text-[32px] sm:text-[40px]">Dressed for the day</h2>
        <ul className="border-t border-ink">
          {OCCASIONS.map((o) => (
            <li key={o.t} className="border-b border-line">
              <Link to={o.to} className="group grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-8 sm:py-6">
                <span className="display text-[28px] group-hover:underline sm:text-[34px]">{o.t}</span>
                <span className="text-base text-mute">{o.d}</span>
                <span className="label hidden sm:inline" aria-hidden="true">Shop →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <div className="grid overflow-hidden rounded-pill bg-ink text-paper lg:grid-cols-[1fr_1.15fr]">
          <img src={img("products/swatches")} alt="Suiting cloth swatches in charcoal, navy, grey and sage beside a wooden rule" loading="lazy" width="1100" height="1366" className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full lg:max-h-[520px]" />
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-12">
            <p className="label text-sage">Made to measure</p>
            <h2 className="text-[32px] text-paper sm:text-[44px]">Your cloth, your cut, fitted twice in Tooting.</h2>
            <MtmFacts dark />
            <Link to="/made-to-measure" className="btn btn-paper self-start">How it works</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 border-t border-line pt-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="label text-mute">The shop</p>
          <h2 className="text-[32px] sm:text-[44px]">Just walk in.</h2>
          <p className="max-w-xl text-[17px]">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}. Open {SITE.hours}. No appointment needed to be measured, try on or drop off alterations.</p>
          <div className="flex flex-wrap gap-3 pt-2"><Link to="/visit" className="btn btn-ink">Find the shop</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Call {SITE.phone}</a></div>
        </div>
        <div className="flex flex-col gap-3 rounded-pill bg-stone p-6 sm:p-8">
          <h2 className="label">Alterations</h2>
          <p className="display text-[28px]">Taken up, let out, made to fit.</p>
          <p className="text-base text-mute">Hems, sleeves, waists and dresses, done in the shop. Bring it in, or call to ask.</p>
          <Link to="/alterations" className="label inline-flex min-h-11 items-center self-start underline">Alterations and prices</Link>
        </div>
      </section>
    </>
  );
}
