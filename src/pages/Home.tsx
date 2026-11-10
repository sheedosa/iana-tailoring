import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Engraving } from "../components/Art";
import { FittingLine } from "../components/Tape";
import { Heading, Title } from "../components/Layout";
import type { Art } from "../lib/store";
import { SITE } from "../data/site";

// The three doors, in equal measure. Each is a framed drawing in the catalogue's hand.
const DOORS: { to: string; title: string; line: string; art: Art; small?: boolean }[] = [
  { to: "/shop/men", title: "Men", line: "Suits, shirts, ties and spare trousers", art: "jacket" },
  { to: "/shop/women", title: "Women", line: "Trouser suits, occasion, prom and bridal", art: "gown" },
  { to: "/shop/kids", title: "Kids", line: "Page boys, suits and dresses", art: "waistcoat", small: true },
];

export function Home() {
  const m = SITE.madeToMeasure;
  const a = SITE.address;
  return (
    <>
      <Seo title="Formal wear for men, women and kids in Tooting" path="/" description={`Suits, occasion and prom dresses, bridal and kids' formal wear. Made to measure from ${m.from} and alterations in our Tooting shop. Walk in, seven days a week.`} />

      <Title hero title="Formal wear for men, women and kids" line={<>We have dressed Tooting from {a.street} since {SITE.since}. Come in and we will measure you.</>} />

      <section className="wrap">
        <ul className="mx-auto grid max-w-[66rem] grid-cols-3 gap-x-3 sm:gap-x-8" aria-label="The three departments">
          {DOORS.map((d, i) => (
            <li key={d.to}>
              <Link to={d.to} className="group flex h-full flex-col items-center gap-3 sm:gap-4">
                <span className="frame rise !p-1.5 sm:!p-3" style={{ "--i": i } as CSSProperties}><Engraving art={d.art} small={d.small} className="!aspect-[3/5] sm:!aspect-[3/4]" /></span>
                <span className="display t-section underline decoration-transparent decoration-1 underline-offset-[0.2em] group-hover:decoration-current">{d.title}</span>
                <span className="t-small -mt-2 text-mute sm:text-[1.0625rem]">{d.line}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="col pt-10">
          <span>Shopping for a particular day? See <Link to="/shop/occasion" className="inl">prom and occasion</Link>, <Link to="/shop/bridal" className="inl">bridal and wedding</Link>, or <Link to="/shop/suits" className="inl">every suit</Link> we keep.</span>
        </p>
      </section>

      {/* The fitting line: the only tape on the site. */}
      <section className="on-green mt-16 bg-green text-on-green sm:mt-20" aria-labelledby="mtm">
        <div className="wrap flex flex-col gap-10 py-14 sm:py-20">
          <div className="col gap-5 text-chalk">
            <Heading id="mtm">Made to measure</Heading>
            <p className="t-lede text-on-green">A suit cut for you costs from <span className="num">{m.from}</span>. You pay a {m.deposit} deposit, come in for {m.fittings} fittings, and collect it usually {m.weeks} after your first visit.</p>
          </div>
          <FittingLine />
          <p><Link to="/made-to-measure" className="link text-chalk">Read how made to measure works</Link></p>
        </div>
      </section>

      <section className="wrap col gap-5 pt-16 sm:pt-20">
        <Heading>Your jacket and trouser size</Heading>
        <p>A man's suit here is sold as a jacket, by chest and length, and trousers, by waist and leg, so each half is chosen in its own size. Give us your height, chest and waist and we will mark your size on every suit.</p>
        <Link to="/find-my-sizes" className="btn btn-line">Find my sizes</Link>
      </section>

      <section className="wrap col gap-5 pt-16 sm:pt-20">
        <Heading>Walk in</Heading>
        <address className="t-lede">{a.street}, {a.area}, {a.city} {a.postcode}<br />Open {SITE.hours}</address>
        <p>You do not need an appointment to be measured, to try something on or to leave a garment for alteration. If you would like to ask first, telephone <a href={`tel:${SITE.phoneIntl}`} className="inl num whitespace-nowrap">{SITE.phone}</a>.</p>
        <p className="flex flex-wrap justify-center gap-x-8"><Link to="/visit" className="link">Find the shop</Link><Link to="/alterations" className="link">Alterations</Link></p>
      </section>
    </>
  );
}
