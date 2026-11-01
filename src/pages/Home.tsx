import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { SizeFinder } from "../components/SizeFinder";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

const PIECES = [
  { to: "/shop/suits", title: "Suits", sub: "Two and three piece, as separates", image: "products/charcoal-suit" },
  { to: "/shop/shirts", title: "Shirts", sub: "Collar and sleeve sized", image: "products/shirts" },
  { to: "/shop/women", title: "Women", sub: "Trouser suits, blazers, blouses", image: "looks/womens-black" },
  { to: "/shop/boys", title: "Boys", sub: "Weddings, proms, communions", image: "looks/father-son" },
];

export function Home() {
  const suits = store.products({ collection: "suits" }).filter((p) => p.kind === "suit").slice(0, 3);
  const shirt = store.product("white-easy-iron-shirt")!;
  return (
    <>
      <Seo title="Suits in your two sizes, made to measure in Tooting" path="/" description="Workwear suits sold as separates, so the jacket and trousers each come in your size. Shirts, women's and boys' suits, and made to measure with two fittings in Tooting, London." />

      <section className="relative flex min-h-[600px] items-center bg-ink text-paper lg:min-h-[700px]">
        <picture>
          <source media="(max-width: 767px)" srcSet={img("hero/street-mobile")} />
          <img src={img("hero/street")} alt="A man in a charcoal suit walking down a Georgian London street at dawn" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-transparent" aria-hidden="true" />
        <div className="wrap relative py-16">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="label text-sage">Workwear suits · Tooting, London</p>
            <h1 className="text-[44px] text-paper sm:text-[64px]">A suit in your two sizes, not one.</h1>
            <p className="max-w-xl text-[18px] text-[#e9dfe2]">Buy the jacket in 40R and the trousers in 32/32. Every suit here is sold as separates, with free alterations in our Tooting shop. Or have one made to measure.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/shop/suits" className="btn btn-paper">Shop suits</Link>
              <Link to="/find-my-sizes" className="btn btn-outline-paper">Find my sizes</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 border-b border-line py-14 sm:grid-cols-3">
        {[
          ["Separates", "Jacket and trousers priced apart. Mix a 40R with 32/32 or 36/30; the price is the same as the matching pair."],
          ["Alterations", "Sleeves, hems and waist adjusted free on any suit bought in store. Online orders: bring it in within [DAYS] days."],
          ["Made to measure", "Choose the cloth, we take twenty measurements, two fittings, ready in [WEEKS] weeks. From £[PRICE]."],
        ].map(([t, d]) => <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">{t}</h2><p className="text-[17px]">{d}</p></div>)}
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">Shop by piece</h2>
          <Link to="/shop/all" className="label inline-flex min-h-11 items-center underline">View everything</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-4">
          {PIECES.map((c) => (
            <Link key={c.to} to={c.to} className="lift flex flex-col gap-2.5">
              <div className="overflow-hidden rounded-pill bg-sage"><img src={img(c.image, true)} alt="" loading="lazy" width="560" height="700" className="aspect-[4/5] w-full object-cover" /></div>
              <span className="text-lg">{c.title}</span>
              <span className="-mt-2 text-sm text-mute">{c.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Find my sizes</p>
            <h2 className="text-[32px] sm:text-[44px]">Three measurements. Your jacket and trouser sizes, remembered.</h2>
            <p className="text-[17px]">Height, chest and waist. We tell you your jacket size and length, your trouser waist and leg, and the fit that suits your build. Shown on every product from then on.</p>
            <SizeFinder compact />
          </div>
          <img src={img("looks/fitting")} alt="A tailor pinning the back of a grey jacket in a fitting room" loading="lazy" width="1100" height="1375" className="hidden aspect-[4/5] w-full max-w-md justify-self-end rounded-pill object-cover lg:block" />
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">Suits for work</h2>
          <Link to="/shop/suits" className="label inline-flex min-h-11 items-center underline">All suits</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{[...suits, shirt].map((p) => <ProductCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap pb-16">
        <div className="grid overflow-hidden rounded-pill bg-ink text-paper lg:grid-cols-2">
          <img src={img("products/swatches")} alt="Suiting cloth swatches in charcoal, navy, grey and sage" loading="lazy" className="h-full min-h-[320px] w-full object-cover" />
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-14">
            <p className="label text-sage">Made to measure</p>
            <h2 className="text-[32px] text-paper sm:text-[44px]">Your cloth, your cut, two fittings in Tooting.</h2>
            <p className="text-[17px] text-[#e9dfe2]">Choose from [N] cloths. We take twenty measurements, cut the suit to your posture and shape, and fit it twice before you take it home.</p>
            <div className="flex gap-8 py-2">
              {[["£[PRICE]", "two-piece, from"], ["[WEEKS]", "weeks to collect"], ["2", "fittings included"]].map(([n, l]) => <div key={l}><p className="display text-[36px] text-paper">{n}</p><p className="text-sm text-[#d8c9cd]">{l}</p></div>)}
            </div>
            <Link to="/made-to-measure" className="btn btn-paper self-start">Book a fitting</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-4 pb-16 sm:grid-cols-3 sm:gap-6">
        {[
          { to: "/shop/occasion", k: "Occasion", t: "Weddings & the wedding party", image: "looks/father-son" },
          { to: "/shop/suits", k: "Edit", t: "The interview", image: "looks/navy-cuff" },
          { to: "/made-to-measure", k: "For teams", t: "Office & uniform orders", image: "products/shirts" },
        ].map((e) => (
          <Link key={e.t} to={e.to} className="lift relative flex min-h-[320px] items-end overflow-hidden rounded-pill text-paper sm:min-h-[400px]">
            <img src={img(e.image, true)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="relative w-full bg-gradient-to-t from-ink/85 to-transparent p-6 pt-16"><span className="label block opacity-90">{e.k}</span><span className="display block text-[30px]">{e.t}</span></span>
          </Link>
        ))}
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t border-line pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="label text-mute">The shop</p>
          <h2 className="text-[32px] sm:text-[40px]">{SITE.address.street}, {SITE.address.area}.</h2>
          <p className="text-mute">Open {SITE.hours}. Walk in to be measured, or book so a fitter is ready for you. Part of the I&amp;A family, in Tooting since {SITE.since}.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/made-to-measure" className="btn btn-ink">Book a fitting</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">{SITE.phone}</a></div>
      </section>
    </>
  );
}
