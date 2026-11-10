import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { SizeFinder } from "../components/SizeFinder";
import { FittingLine, TitleTape } from "../components/Tape";
import { PhotoSlot } from "../components/Art";
import { img } from "../lib/store";
import { JACKET_LENGTHS, SITE } from "../data/site";

const tel = <a href={`tel:${SITE.phoneIntl}`} className="whitespace-nowrap underline underline-offset-4">{SITE.phone}</a>;
const crumbs = (name: string, path: string) => breadcrumbs([{ name: "Home", path: "/" }, { name, path }]);
const th = "label py-3 font-medium";

export function FindMySizes() {
  return (
    <>
      <Seo title="Find my sizes" path="/find-my-sizes" jsonLd={crumbs("Find my sizes", "/find-my-sizes")} description="Men's suits with the jacket and trousers in different sizes. Enter height, chest and waist for your jacket size and length, trouser waist and leg, and fit. I&A Formal, Tooting." />
      <section className="wrap grid gap-x-14 gap-y-5 pb-10 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="flex flex-col gap-4">
          <h1>Find my sizes</h1>
          <TitleTape />
        </div>
        <p className="t-lede measure">Our men's suits now come with the jacket and trousers in different sizes. Three measurements give you both, and the fit for your build. Saved on this device and marked on every suit.</p>
      </section>
      <section className="bg-sage">
        <div className="wrap py-10 sm:py-14"><SizeFinder big /></div>
      </section>
      <section className="wrap grid gap-x-14 gap-y-6 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <h2>How men's sizes work</h2>
        <div className="flex flex-col gap-4">
          <table className="w-full text-left">
            <thead><tr className="border-b border-ink"><th className={th}>Jacket length</th><th className={th}>For heights</th><th className={th}>Trouser leg</th></tr></thead>
            <tbody>
              {[["S", "under 5'8\"", "30"], ["R", "5'8\" to 6'0\"", "32"], ["L", "over 6'0\"", "34"]].map(([a, b, c]) => <tr key={a} className="border-b border-line"><td className="py-3.5">{a}</td><td className="py-3.5 text-mute">{b}</td><td className="py-3.5">{c}"</td></tr>)}
            </tbody>
          </table>
          <p className="max-w-[40rem]">Jacket size is your chest in inches ({JACKET_LENGTHS.join(", ")} lengths). Slim fit suits a chest about 8" bigger than the waist, tailored about 6", regular 4" or less. Between sizes, take the larger and have it altered in the shop.</p>
          <p className="max-w-[40rem] text-mute">Women's pieces go by UK dress size and kids' by age: [SIZE RANGES].</p>
        </div>
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

      {/* The title and the fitting line share one Ochre ground: the tape is the page. */}
      <section className="on-dark overflow-x-clip bg-ink text-paper">
        <div className="wrap grid gap-x-14 gap-y-8 pb-10 pt-10 sm:pt-14 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
          <div className="flex flex-col gap-5">
            <h1 className="t-hero">Cut for you, in Tooting.</h1>
            <p className="t-lede measure text-on-ink">Choose the cloth and the details. We measure you, fit it twice, and you collect a suit that was made for nobody else.</p>
          </div>
          <img src={img("looks/fitting")} alt="A tailor's hands pinning the back seam of a grey jacket" width="1100" height="1366" className="hidden aspect-[4/3] w-full rounded-pill object-cover object-[50%_18%] md:block" />
        </div>
        <div className="wrap pb-14 pt-4 sm:pb-20">
          <h2 className="sr-only">How it works</h2>
          <FittingLine />
        </div>
      </section>

      <section className="bg-sage">
        <div className="wrap grid items-center gap-x-14 gap-y-8 py-14 sm:py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <img src={img("products/swatches")} alt="Suiting cloth swatches fanned on linen beside a wooden rule" loading="lazy" width="1100" height="1366" className="aspect-[4/3] w-full rounded-pill object-cover md:aspect-[5/4]" />
          <div className="flex min-w-0 flex-col gap-4">
            <h2>Prices from {m.from}.</h2>
            <p className="t-lede measure">The price is agreed at your first visit, and {m.deposit} is paid as a deposit before we start.</p>
            <p className="text-mute">[CLOTH PRICE LIST TO COME]</p>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-6 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
        <div className="flex flex-col gap-3">
          <h2>No appointment needed.</h2>
          <p className="t-lede measure">Walk in any day, {SITE.hours.replace("Monday to Sunday, ", "")}. If you'd like a fitter ready for you, call ahead on {tel}.</p>
          <p className="text-mute">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end"><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink">Call ahead</a><Link to="/visit" className="btn btn-ghost">Find the shop</Link></div>
      </section>
    </>
  );
}

const ALTERATIONS = ["Trouser hem", "Jacket sleeves", "Trouser waist, in or out", "Dress or gown hem", "Dress taken in", "Jacket taken in"];

export function Alterations() {
  return (
    <>
      <Seo title="Alterations in Tooting" path="/alterations" jsonLd={[crumbs("Alterations", "/alterations"), { "@context": "https://schema.org", "@type": "Service", name: "Clothing alterations", provider: { "@id": `${SITE.url}/#store` }, areaServed: "London" }]}
        description={`Hems, sleeves, waists and dresses altered in the shop at ${SITE.address.street}, Tooting. Walk in, ${SITE.hours}.`} />
      <section className="wrap grid gap-x-14 gap-y-10 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <h1>Alterations</h1>
          <TitleTape />
          <p className="t-lede measure pt-1">Taken up, let out and made to fit: hems, sleeves, waists and dresses, done at {SITE.address.street}.</p>
          <p className="measure text-mute">Bring it in any day, {SITE.hours.replace("Monday to Sunday, ", "")}, or call {tel} to ask about a job first.</p>
          <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink mt-2 self-start">Call {SITE.phone}</a>
        </div>
        <div className="flex flex-col gap-3 lg:pt-3">
          <table className="w-full text-left">
            <caption className="mb-2 text-left"><span className="t-sub block">Price list to come</span><span className="text-mute">The rows show the kind of job; the shop's own list replaces them.</span></caption>
            <thead><tr className="border-b border-ink"><th className={th}>Alteration</th><th className={`${th} text-right`}>Price</th></tr></thead>
            <tbody>{ALTERATIONS.map((a) => <tr key={a} className="border-b border-line"><td className="py-3.5">{a}</td><td className="py-3.5 text-right text-mute">£[PRICE]</td></tr>)}</tbody>
          </table>
          <p className="text-mute">[USUAL TURNAROUND]</p>
        </div>
      </section>
      <section className="mt-16 bg-sage">
        <div className="wrap grid gap-x-14 gap-y-4 py-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <div className="flex flex-col gap-2"><h2>Want it made for you instead?</h2><p className="t-lede">Made to measure from {SITE.madeToMeasure.from}, with {SITE.madeToMeasure.fittings} fittings.</p></div>
          <Link to="/made-to-measure" className="btn btn-ink self-start lg:justify-self-end">See how made to measure works</Link>
        </div>
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" jsonLd={crumbs("Visit", "/visit")} description={`Walk in to be measured, try on or drop off alterations at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`} />
      <section className="bg-sage">
        <div className="wrap grid gap-x-14 gap-y-8 py-10 sm:py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-4">
            <h1 className="t-hero">Just walk in.</h1>
            <TitleTape />
            <p className="t-lede measure pt-1">No appointment needed to be measured, try something on or drop off alterations.</p>
            <address className="t-sub not-italic">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</address>
            <p>Open Monday to Sunday, 9am to 6pm.<br />Phone {tel}</p>
            <div className="flex flex-wrap gap-3 pt-1"><a href={maps} className="btn btn-ink">Open in Google Maps</a><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Call the shop</a></div>
          </div>
          <PhotoSlot art="shopfront" tone="ink" label="The shop front" line="84 Mitcham Road, seen from across the street." className="aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3]" />
        </div>
      </section>
      <section className="wrap grid gap-x-14 gap-y-6 pt-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <h2>Coming for made to measure?</h2>
          <p className="t-lede measure">You can still walk in. If you'd like a fitter free when you arrive, call ahead on {tel}.</p>
        </div>
        <ul className="flex flex-col border-t border-ink">
          {[["/made-to-measure", "Made to measure"], ["/alterations", "Alterations"], ["/delivery-returns", "Click and collect"]].map(([to, t]) => <li key={to} className="border-b border-line"><Link to={to} className="t-sub flex min-h-14 items-center underline decoration-transparent decoration-1 underline-offset-[0.3em] hover:decoration-current">{t}</Link></li>)}
        </ul>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery, r = SITE.returns;
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns" jsonLd={crumbs("Delivery and returns", "/delivery-returns")} description={`Standard delivery ${d.standard.price} (${d.standard.time}), express ${d.express.price} (${d.express.time}), free on orders of ${d.freeOver} and over, click and collect in Tooting. ${r.days}-day returns.`} />
      <section className="wrap flex flex-col gap-4 pb-10 pt-10 sm:pt-14">
        <h1>Delivery and returns</h1>
        <TitleTape />
        <p className="t-lede measure pt-1">Free delivery on orders of {d.freeOver} and over, or collect from the shop in Tooting.</p>
      </section>
      <section className="wrap grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <h2>Delivery</h2>
          <table className="w-full text-left">
            <thead><tr className="border-b border-ink"><th className={th}>Option</th><th className={th}>Price</th><th className={th}>Arrives</th></tr></thead>
            <tbody>
              {[[d.standard.name, d.standard.price, d.standard.time], [d.express.name, d.express.price, d.express.time]].map(([a, b, c]) => <tr key={a} className="border-b border-line"><td className="py-3.5 pr-3">{a}</td><td className="py-3.5 pr-3">{b}</td><td className="py-3.5 text-mute">{c}</td></tr>)}
            </tbody>
          </table>
          <p>Free delivery on orders of {d.freeOver} and over.</p>
          <p>{d.collect}, open {SITE.hours}.</p>
        </div>
        <div className="flex flex-col gap-3 lg:border-l lg:border-ink lg:pl-14">
          <h2>Returns</h2>
          <p className="t-lede">You have {r.days} days to return an item.</p>
          <p><b>Not returnable:</b> {r.excluded.join(", ").replace(/, ([^,]*)$/, " and $1")}. Please try these on in the shop before you buy.</p>
          <p className="text-mute">[HOW TO SEND A RETURN AND WHEN REFUNDS ARE MADE]</p>
        </div>
      </section>
    </>
  );
}
