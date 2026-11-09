import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { SizeFinder } from "../components/SizeFinder";
import { MtmFacts } from "../components/MtmFacts";
import { PhotoSlot } from "../components/Art";
import { img } from "../lib/store";
import { JACKET_LENGTHS, SITE } from "../data/site";

const tel = <a href={`tel:${SITE.phoneIntl}`} className="whitespace-nowrap underline">{SITE.phone}</a>;
const crumbs = (name: string, path: string) => breadcrumbs([{ name: "Home", path: "/" }, { name, path }]);

export function FindMySizes() {
  return (
    <>
      <Seo title="Find my sizes" path="/find-my-sizes" jsonLd={crumbs("Find my sizes", "/find-my-sizes")} description="Men's suits with the jacket and trousers in different sizes. Enter height, chest and waist for your jacket size and length, trouser waist and leg, and fit. I&A Formal, Tooting." />
      <section className="wrap grid gap-12 py-10 sm:py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="label text-mute">Men's suits · new</p>
          <h1 className="text-[40px] sm:text-[56px]">Find my sizes</h1>
          <p className="max-w-xl text-[17px]">Our men's suits now come with the jacket and trousers in different sizes. Three measurements give you both, and the fit for your build. Saved on this device and marked on every suit.</p>
          <div className="rounded-pill bg-sage p-5 sm:p-6"><SizeFinder big /></div>
        </div>
        <div className="flex flex-col gap-4 lg:pt-24">
          <h2 className="text-[30px] sm:text-[34px]">How men's sizes work</h2>
          <table className="w-full text-left text-base">
            <thead><tr className="border-b border-ink"><th className="label py-3 font-normal">Jacket length</th><th className="label py-3 font-normal">For heights</th><th className="label py-3 font-normal">Trouser leg</th></tr></thead>
            <tbody>
              {[["S", "under 5'8\"", "30"], ["R", "5'8\" to 6'0\"", "32"], ["L", "over 6'0\"", "34"]].map(([a, b, c]) => <tr key={a} className="border-b border-line"><td className="py-3">{a}</td><td className="py-3 text-mute">{b}</td><td className="py-3">{c}"</td></tr>)}
            </tbody>
          </table>
          <p className="text-base text-mute">Jacket size is your chest in inches ({JACKET_LENGTHS.join(", ")} lengths). Slim fit suits a chest about 8" bigger than the waist, tailored about 6", regular 4" or less. Between sizes, take the larger and have it altered in the shop.</p>
          <p className="text-base text-mute">Women's pieces are in UK sizes 6 to 20; kids' by age, 2 to 16.</p>
        </div>
      </section>
    </>
  );
}

export function MadeToMeasure() {
  const m = SITE.madeToMeasure;
  const steps = [
    ["First visit", "Walk in. Choose the cloth and the details, we take your measurements, and you pay a " + m.deposit + " deposit."],
    ["First fitting", "Try the suit part-made. We mark every adjustment on you."],
    ["Second fitting", "The last checks on the finished suit."],
    ["Collection", `Usually ${m.weeks} after your first visit. Collect it and pay the balance.`],
  ];
  return (
    <>
      <Seo title="Made to measure in Tooting" path="/made-to-measure" jsonLd={[crumbs("Made to measure", "/made-to-measure"), { "@context": "https://schema.org", "@type": "Service", name: "Made to measure suits", provider: { "@id": `${SITE.url}/#store` }, areaServed: "London", offers: { "@type": "Offer", priceCurrency: "GBP", price: "250", description: "From £250, 50% deposit" } }]}
        description={`Made to measure from ${m.from}: ${m.deposit} deposit, ${m.fittings} fittings, usually ${m.weeks}. Walk in to 84 Mitcham Road, Tooting.`} />
      <section className="bg-ink text-paper">
        <div className="wrap grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="flex flex-col gap-5">
            <p className="label text-sage">Made to measure</p>
            <h1 className="text-[42px] text-paper sm:text-[60px]">Cut for you, in Tooting.</h1>
            <p className="max-w-xl text-[18px] text-on-ink">Choose the cloth and the details. We measure you, fit it twice, and you collect a suit that was made for nobody else.</p>
            <MtmFacts dark />
          </div>
          <img src={img("looks/fitting")} alt="A tailor's hands pinning the back seam of a grey jacket" width="1100" height="1366" className="aspect-[16/10] w-full rounded-pill object-cover object-[50%_6%]" />
        </div>
      </section>

      <section className="wrap grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="text-[32px] sm:text-[40px]">How it works</h2>
        <dl className="border-t border-ink">
          {steps.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-8">
              <dt className="display text-[24px]">{k}</dt><dd className="text-[17px] text-mute">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-sage py-14 sm:py-16">
        <div className="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <img src={img("products/swatches")} alt="Suiting cloth swatches fanned on linen beside a wooden rule" loading="lazy" width="1100" height="1366" className="aspect-[4/3] w-full rounded-pill object-cover" />
          <div className="flex min-w-0 flex-col gap-4">
            <h2 className="text-[32px] sm:text-[40px]">Prices from {m.from}.</h2>
            <p className="text-[17px]">The price is agreed at your first visit, and {m.deposit} is paid as a deposit before we start.</p>
            <p className="text-base text-mute">[CLOTH PRICE LIST TO COME]</p>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 py-14 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div className="flex flex-col gap-3">
          <h2 className="text-[32px] sm:text-[40px]">No appointment needed.</h2>
          <p className="max-w-xl text-[17px]">Walk in any day, {SITE.hours.replace("Monday to Sunday, ", "")}. If you'd like a fitter ready for you, call ahead on {tel}.</p>
          <p className="text-base text-mute">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</p>
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
      <section className="wrap grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="label text-mute">In the shop</p>
          <h1 className="text-[42px] sm:text-[56px]">Alterations</h1>
          <p className="max-w-lg text-[18px]">Taken up, let out and made to fit: hems, sleeves, waists and dresses, done at {SITE.address.street}.</p>
          <p className="max-w-lg text-[17px] text-mute">Bring it in any day, {SITE.hours.replace("Monday to Sunday, ", "")}, or call {tel} to ask about a job first.</p>
        </div>
        <div className="flex flex-col gap-3">
          <table className="w-full text-left text-base">
            <caption className="mb-3 text-left"><span className="display block text-[28px]">Price list to come</span><span className="text-[14px] text-mute">The rows show the kind of job; the shop's own list replaces them.</span></caption>
            <thead><tr className="border-b border-ink"><th className="label py-3 font-normal">Alteration</th><th className="label py-3 text-right font-normal">Price</th></tr></thead>
            <tbody>{ALTERATIONS.map((a) => <tr key={a} className="border-b border-line"><td className="py-3.5">{a}</td><td className="py-3.5 text-right text-mute">£[PRICE]</td></tr>)}</tbody>
          </table>
          <p className="text-[14px] text-mute">[USUAL TURNAROUND]</p>
        </div>
      </section>
      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-sage p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><h2 className="text-[28px] sm:text-[32px]">Want it made for you instead?</h2><p className="text-base">Made to measure from {SITE.madeToMeasure.from}, with {SITE.madeToMeasure.fittings} fittings.</p></div>
          <Link to="/made-to-measure" className="btn btn-ink shrink-0">Made to measure</Link>
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
        <div className="wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-5">
            <p className="label">Visit · {SITE.address.area}</p>
            <h1 className="text-[42px] sm:text-[60px]">Just walk in.</h1>
            <p className="max-w-lg text-[18px]">No appointment needed to be measured, try something on or drop off alterations.</p>
            <dl className="grid gap-4 border-t border-ink pt-5 text-[17px] sm:grid-cols-2">
              <div><dt className="label mb-1">Address</dt><dd>{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</dd></div>
              <div><dt className="label mb-1">Open</dt><dd>Monday to Sunday<br />9am to 6pm</dd></div>
              <div><dt className="label mb-1">Phone</dt><dd>{tel}</dd></div>
              <div><dt className="label mb-1">Map</dt><dd><a href={maps} className="underline">Open in Google Maps</a></dd></div>
            </dl>
          </div>
          <PhotoSlot art="shopfront" tone="ink" label="The shop front" line="84 Mitcham Road, seen from across the street." className="aspect-[4/3]" />
        </div>
      </section>
      <section className="wrap grid gap-6 py-14 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          <h2 className="text-[30px] sm:text-[36px]">Coming for made to measure?</h2>
          <p className="text-[17px]">You can still walk in. If you'd like a fitter free when you arrive, call ahead on {tel}.</p>
        </div>
        <ul className="flex flex-col border-t border-ink">
          {[["/made-to-measure", "Made to measure"], ["/alterations", "Alterations"], ["/delivery-returns", "Click and collect"]].map(([to, t]) => <li key={to} className="border-b border-line"><Link to={to} className="flex min-h-12 items-center justify-between text-[17px] hover:underline">{t}<span aria-hidden="true">→</span></Link></li>)}
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
      <section className="wrap flex max-w-3xl flex-col gap-10 py-10 sm:py-14">
        <div className="flex flex-col gap-4">
          <h1 className="text-[42px] sm:text-[56px]">Delivery and returns</h1>
          <p className="text-[18px]">Free delivery on orders of {d.freeOver} and over, or collect from the shop in Tooting.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[30px]">Delivery</h2>
          <table className="w-full text-left text-base">
            <thead><tr className="border-b border-ink"><th className="label py-3 font-normal">Option</th><th className="label py-3 font-normal">Price</th><th className="label py-3 font-normal">Arrives</th></tr></thead>
            <tbody>
              {[[d.standard.name, d.standard.price, d.standard.time], [d.express.name, d.express.price, d.express.time]].map(([a, b, c]) => <tr key={a} className="border-b border-line"><td className="py-3.5 pr-3">{a}</td><td className="py-3.5 pr-3">{b}</td><td className="py-3.5 text-mute">{c}</td></tr>)}
            </tbody>
          </table>
          <p className="text-[17px]">Free delivery on orders of {d.freeOver} and over.</p>
          <p className="text-[17px]">{d.collect}, open {SITE.hours}.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[30px]">Returns</h2>
          <p className="text-[17px]">You have {r.days} days to return an item.</p>
          <p className="rounded-pill bg-stone px-4 py-3 text-[17px]"><b>Not returnable:</b> {r.excluded.join(", ").replace(/, ([^,]*)$/, " and $1")}. Please try these on in the shop before you buy.</p>
          <p className="text-base text-mute">[HOW TO SEND A RETURN AND WHEN REFUNDS ARE MADE]</p>
        </div>
      </section>
    </>
  );
}
