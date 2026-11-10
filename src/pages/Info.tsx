import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { SizeFinder } from "../components/SizeFinder";
import { FittingLine } from "../components/Tape";
import { Engraving } from "../components/Art";
import { Crumbs, Heading, Title } from "../components/Layout";
import { img } from "../lib/store";
import { SITE } from "../data/site";

const tel = <a href={`tel:${SITE.phoneIntl}`} className="inl num whitespace-nowrap">{SITE.phone}</a>;
const crumbs = (name: string, path: string) => breadcrumbs([{ name: "Home", path: "/" }, { name, path }]);
const a = SITE.address;
const where = `${a.street}, ${a.area}, ${a.city} ${a.postcode}`;

export function FindMySizes() {
  return (
    <>
      <Seo title="Find my sizes" path="/find-my-sizes" jsonLd={crumbs("Find my sizes", "/find-my-sizes")} description="Men's suits with the jacket and trousers in different sizes. Enter height, chest and waist for your jacket size and length, trouser waist and leg, and fit. I&A Formal, Tooting." />
      <Title crumbs={<Crumbs here="Find my sizes" />} title="Find my sizes" line="Our men's suits are sold as a jacket and trousers, each in its own size. Three measurements give you both, and the fit for your build." />
      <section className="wrap"><SizeFinder /></section>
      <section className="wrap col gap-5 pt-16">
        <Heading>How men's sizes work</Heading>
        <table className="table num">
          <thead><tr><th>Jacket length</th><th>For heights</th><th>Trouser leg</th></tr></thead>
          <tbody>
            {[["Short (S)", "under 5'8\"", "30"], ["Regular (R)", "5'8\" to 6'0\"", "32"], ["Long (L)", "over 6'0\"", "34"]].map(([x, y, z]) => <tr key={x}><td>{x}</td><td>{y}</td><td>{z}"</td></tr>)}
          </tbody>
        </table>
        <p>The jacket size is your chest in inches. The slim fit suits a chest about 8 inches larger than the waist, the tailored fit about 6 inches, and the regular fit 4 inches or less. If you are between two sizes, take the larger and we will alter it in the shop.</p>
        <p className="text-mute">Women's pieces go by UK dress size and kids' pieces by age: [SIZE RANGES].</p>
      </section>
    </>
  );
}

export function MadeToMeasure() {
  const m = SITE.madeToMeasure;
  return (
    <>
      <Seo title="Made to measure in Tooting" path="/made-to-measure" jsonLd={[crumbs("Made to measure", "/made-to-measure"), { "@context": "https://schema.org", "@type": "Service", name: "Made to measure suits", provider: { "@id": `${SITE.url}/#store` }, areaServed: "London", offers: { "@type": "Offer", priceCurrency: "GBP", price: "250", description: "From £250, 50% deposit" } }]}
        description={`Made to measure from ${m.from}: ${m.deposit} deposit, ${m.fittings} fittings, usually ${m.weeks}. Walk in to 84 Mitcham Road, Tooting.`} />
      <Title crumbs={<Crumbs here="Made to measure" />} title="Made to measure" line="You choose the cloth and the details. We measure you, fit the suit twice, and you collect it from the shop.">
        <dl className="spec spec-even mt-8 max-w-[30rem]">
          <dt>Price</dt><dd>From <span className="num">{m.from}</span></dd>
          <dt>Deposit</dt><dd><span className="num">{m.deposit}</span>, paid before we start</dd>
          <dt>Fittings</dt><dd>{m.fittings}, both in the shop</dd>
          <dt>Ready</dt><dd>Usually {m.weeks} after your first visit</dd>
          <dt>Appointment</dt><dd>None needed; walk in</dd>
        </dl>
      </Title>

      <section className="on-green mt-6 bg-green text-on-green" aria-labelledby="stages">
        <div className="wrap flex flex-col gap-10 py-14 sm:py-20">
          <div className="text-chalk"><Heading id="stages">The five stages</Heading></div>
          <FittingLine />
        </div>
      </section>

      <section className="wrap flex flex-col items-center gap-6 pt-16">
        <Heading>The cloth</Heading>
        <span className="frame w-full max-w-[26rem]"><img src={img("products/swatches")} alt="Suiting cloth swatches fanned out beside a wooden rule" loading="lazy" width="1100" height="1366" className="aspect-[4/3] object-cover object-[50%_40%]" /></span>
        <div className="col gap-3">
          <p>The cloth you choose sets the price, which we agree with you at your first visit. Prices start at <span className="num">{m.from}</span>.</p>
          <p className="text-mute">[CLOTH PRICE LIST TO COME]</p>
        </div>
      </section>

      <section className="wrap col gap-4 pt-16">
        <Heading>Come in and we will measure you</Heading>
        <address className="t-lede">{where}<br />Open {SITE.hours}</address>
        <p>You do not need an appointment. If you would like a fitter to be free when you arrive, telephone {tel} before you set out.</p>
        <Link to="/visit" className="link">Find the shop</Link>
      </section>
    </>
  );
}

const ALTERATIONS = ["Trouser hem", "Jacket sleeves", "Trouser waist, in or out", "Dress or gown hem", "Dress taken in", "Jacket taken in"];

export function Alterations() {
  return (
    <>
      <Seo title="Alterations in Tooting" path="/alterations" jsonLd={[crumbs("Alterations", "/alterations"), { "@context": "https://schema.org", "@type": "Service", name: "Clothing alterations", provider: { "@id": `${SITE.url}/#store` }, areaServed: "London" }]}
        description={`Hems, sleeves, waists and dresses altered in the shop at ${a.street}, Tooting. Walk in, ${SITE.hours}.`} />
      <Title crumbs={<Crumbs here="Alterations" />} title="Alterations" line={<>We take up hems, shorten sleeves, let waists in or out and fit dresses, all at {a.street}.</>}>
        <p className="col pt-8"><span>Bring the garment in on any day, {SITE.hours.replace("Monday to Sunday, ", "")}. To ask about a job first, telephone {tel}.</span></p>
      </Title>
      <section className="wrap col gap-4">
        <table className="table">
          <caption className="pb-4"><span className="t-plate display block">The price list is to come</span><span className="text-mute">These rows show the kind of work we do. The shop's own list will replace them.</span></caption>
          <thead><tr><th className="w-1/2 text-right">Alteration</th><th className="w-1/2 text-left">Price</th></tr></thead>
          <tbody>{ALTERATIONS.map((x) => <tr key={x}><td className="text-right">{x}</td><td className="num text-left text-mute">£[PRICE]</td></tr>)}</tbody>
        </table>
        <p className="text-mute">[USUAL TURNAROUND]</p>
      </section>
      <section className="wrap col gap-3 pt-14">
        <span className="rule2" aria-hidden="true" />
        <p className="pt-3">If you would sooner have a suit made for you, made to measure costs from <span className="num">{SITE.madeToMeasure.from}</span>, with {SITE.madeToMeasure.fittings} fittings.</p>
        <Link to="/made-to-measure" className="link">How made to measure works</Link>
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.street}, ${a.city} ${a.postcode}`)}`;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" jsonLd={crumbs("Visit", "/visit")} description={`Walk in to be measured, try on or drop off alterations at ${a.street}, ${a.city} ${a.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`} />
      <Title crumbs={<Crumbs here="Visit" />} title="Visit the shop" line="You do not need an appointment to be measured, to try something on or to leave a garment for alteration.">
        <div className="col gap-4 pt-8">
          <address className="t-lede">{a.street}<br />{a.area}, {a.city} {a.postcode}</address>
          <p>Open {SITE.hours}.<br />Telephone {tel}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1"><a href={maps} className="btn">Open in Google Maps</a><a href={`tel:${SITE.phoneIntl}`} className="btn btn-line">Telephone the shop</a></div>
        </div>
      </Title>
      <section className="wrap flex flex-col items-center gap-2 pt-4">
        <figure className="flex w-full max-w-[24rem] flex-col items-center gap-2">
          <span className="frame w-full"><Engraving art="shopfront" /></span>
          <figcaption className="t-small text-mute">A drawing stands here until the shop front at {a.street} is photographed.</figcaption>
        </figure>
      </section>
      <section className="wrap col gap-3 pt-14">
        <Heading>Coming for made to measure</Heading>
        <p>You can still walk in. If you would like a fitter to be free when you arrive, telephone {tel} before you set out.</p>
        <p className="flex flex-wrap justify-center gap-x-8"><Link to="/made-to-measure" className="link">Made to measure</Link><Link to="/alterations" className="link">Alterations</Link><Link to="/delivery-returns" className="link">Click and collect</Link></p>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery, r = SITE.returns;
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns" jsonLd={crumbs("Delivery and returns", "/delivery-returns")} description={`Standard delivery ${d.standard.price} (${d.standard.time}), express ${d.express.price} (${d.express.time}), free on orders of ${d.freeOver} and over, click and collect in Tooting. ${r.days}-day returns.`} />
      <Title crumbs={<Crumbs here="Delivery and returns" />} title="Delivery and returns" line={<>Delivery is free on orders of {d.freeOver} and over, or you may collect from the shop in Tooting.</>} />
      <section className="wrap col gap-4">
        <h2 className="t-plate">Delivery</h2>
        <table className="table">
          <thead><tr><th>Option</th><th>Price</th><th>Arrives</th></tr></thead>
          <tbody>
            {[[d.standard.name, d.standard.price, d.standard.time], [d.express.name, d.express.price, d.express.time]].map(([x, y, z]) => <tr key={x}><td>{x}</td><td className="num">{y}</td><td>{z}</td></tr>)}
          </tbody>
        </table>
        <p>{d.collect}, open {SITE.hours}.</p>
      </section>
      <section className="wrap col gap-4 pt-14">
        <h2 className="t-plate">Returns</h2>
        <p className="t-lede">You have {r.days} days to return an item.</p>
        <p>{r.excluded.join(", ").replace(/, ([^,]*)$/, " and $1").replace(/^./, (x) => x.toUpperCase())} cannot be returned. Please try these on in the shop before you buy.</p>
        <p className="text-mute">[HOW TO SEND A RETURN AND WHEN REFUNDS ARE MADE]</p>
      </section>
    </>
  );
}
