import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SizeFinder } from "../components/SizeFinder";
import { img } from "../lib/store";
import { JACKET_LENGTHS, SITE } from "../data/site";

export function FindMySizes() {
  return (
    <>
      <Seo title="Find my sizes" path="/find-my-sizes" description="Enter height, chest and waist to get your jacket size and length, trouser waist and leg, and the fit for your build. I&A Tailoring, Tooting." />
      <section className="wrap grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="label text-mute">Fit</p>
          <h1 className="text-[44px] sm:text-[56px]">Find my sizes</h1>
          <p className="max-w-xl text-[17px] text-mute">Three measurements. We work out your jacket size and length, your trouser waist and leg, and which of our fits suits your build. Saved on this device and shown on every product.</p>
          <div className="rounded-pill bg-sage p-6"><SizeFinder /></div>
          <h2 className="mt-6 text-[32px]">How our sizes work</h2>
          <table className="w-full max-w-xl text-left text-sm">
            <thead><tr className="border-b border-ink"><th className="py-3 font-normal">Jacket length</th><th className="py-3 font-normal">For heights</th><th className="py-3 font-normal">Trouser leg</th></tr></thead>
            <tbody>
              {[["S", "under 5'8\"", "30"], ["R", "5'8\" to 6'0\"", "32"], ["L", "over 6'0\"", "34"]].map(([a, b, c]) => <tr key={a} className="border-b border-line"><td className="py-3">{a}</td><td className="py-3 text-mute">{b}</td><td className="py-3">{c}"</td></tr>)}
            </tbody>
          </table>
          <p className="max-w-xl text-sm text-mute">Jacket size is your chest measurement in inches ({JACKET_LENGTHS.join(", ")} lengths). Slim fit suits a chest about 8" bigger than the waist; tailored about 6"; regular 4" or less. Between sizes, take the larger: alterations are free in store.</p>
        </div>
        <img src={img("looks/fitting")} alt="A tailor pinning a grey jacket in a fitting room" width="1100" height="1375" className="hidden aspect-[4/5] w-full rounded-pill object-cover lg:block" />
      </section>
    </>
  );
}

const SLOTS = ["Tue 4 Nov · 10:30", "Tue 4 Nov · 14:00", "Wed 5 Nov · 11:00", "Thu 6 Nov · 17:00", "Sat 8 Nov · 09:30", "Sun 9 Nov · 12:00"];

export function MadeToMeasure() {
  const [slot, setSlot] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  return (
    <>
      <Seo title="Made to measure suits in Tooting" path="/made-to-measure" description="A suit cut to you: choose the cloth, twenty measurements, two fittings in Tooting, ready in [WEEKS] weeks. Prices on the page. Book a free first fitting." />
      <section className="relative flex min-h-[520px] items-end bg-ink text-paper">
        <img src={img("looks/fitting")} alt="A tailor pinning the back seam of a grey jacket, seen from behind" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" aria-hidden="true" />
        <div className="wrap relative flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="label text-sage">Made to measure</p>
            <h1 className="text-[44px] text-paper sm:text-[64px]">A suit cut to you, in Tooting, from £[PRICE].</h1>
            <p className="text-[18px] text-[#e9dfe2]">Choose the cloth and the details. We take twenty measurements, cut to your posture, and fit it twice. Ready in [WEEKS] weeks.</p>
          </div>
          <a href="#book" className="btn btn-paper min-h-14">Book a fitting</a>
        </div>
      </section>

      <section className="wrap py-16">
        <h2 className="mb-8 text-[32px] sm:text-[40px]">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[["First visit · 45 min", "Cloth and measurements", "Pick from [N] cloths. We take twenty measurements and note your posture and how you like a jacket to sit."],
            ["Same visit", "Your choices", "Lapel, buttons, vents, lining, pockets, monogram. Pay a [DEPOSIT]% deposit and we start."],
            ["Week [X] · 30 min", "First fitting", "Try the suit basted together. We mark every adjustment on you."],
            ["Week [WEEKS] · 20 min", "Final fitting and collect", "Last checks, final press, and it's yours. Your measurements stay on file for next time."]].map(([k, t, d]) => (
            <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><p className="label text-mute">{k}</p><h3 className="text-xl">{t}</h3><p className="text-[15px] text-mute">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-sage py-16">
        <div className="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <img src={img("products/swatches")} alt="Suiting cloth swatches fanned on linen" loading="lazy" className="hidden aspect-[4/5] w-full max-w-md rounded-pill object-cover lg:block" />
          <div className="flex min-w-0 flex-col gap-5">
            <h2 className="text-[32px] sm:text-[40px]">Prices, on the page.</h2>
            <p className="text-[17px]">The cloth sets the price. Fittings, alterations and your choice of details are included.</p>
            <div className="w-full min-w-0 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-base">
              <thead><tr className="border-b border-ink"><th className="label py-3 font-normal text-mute">Cloth</th><th className="label py-3 font-normal text-mute">Two piece</th><th className="label py-3 font-normal text-mute">Three piece</th></tr></thead>
              <tbody>
                {[["Wool blend, everyday", "£[PRICE]", "£[PRICE]"], ["Pure wool, [MILL]", "£[PRICE]", "£[PRICE]"], ["Fine wool and mohair", "£[PRICE]", "£[PRICE]"], ["Extra trousers, any cloth", "from £[PRICE]", ""]].map(([a, b, c]) => <tr key={a} className="border-b border-ink/20"><td className="py-3.5">{a}</td><td className="py-3.5">{b}</td><td className="py-3.5">{c}</td></tr>)}
              </tbody></table></div>
            <p className="text-sm text-mute">Shirts made to measure from £[PRICE]. Office and uniform orders of five or more suits: ask for group pricing.</p>
          </div>
        </div>
      </section>

      <section id="book" className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">Book a fitting</p>
          <h2 className="text-[32px] sm:text-[40px]">Forty-five minutes with a fitter.</h2>
          <p className="text-[17px] text-mute">No charge for the first visit. Come as you are; bring the shoes you'll wear with the suit if you can.</p>
          <p>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours} · <a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a></p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-5 rounded-pill border border-ink p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex flex-col gap-1.5"><label htmlFor="b-name" className="label">Name</label><input id="b-name" required className="h-12 rounded-pill border border-ink bg-paper px-3 text-base" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="b-phone" className="label">Phone</label><input id="b-phone" type="tel" required className="h-12 rounded-pill border border-ink bg-paper px-3 text-base" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="b-for" className="label">What is it for</label><select id="b-for" className="h-12 rounded-pill border border-ink bg-paper px-3 text-base"><option>Work</option><option>Wedding</option><option>Occasion</option><option>Office order, 5 or more</option></select></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="b-when" className="label">Needed by</label><input id="b-when" type="date" className="h-12 rounded-pill border border-ink bg-paper px-3 text-base" /></div>
          <fieldset className="flex flex-col gap-2 sm:col-span-2">
            <legend className="label mb-2">Pick a slot <span className="normal-case tracking-normal text-mute">(sample times)</span></legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{SLOTS.map((s) => <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className={`min-h-12 rounded-pill border px-2 text-sm ${slot === s ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>{s}</button>)}</div>
          </fieldset>
          <button type="submit" className="btn btn-ink min-h-14 sm:col-span-2">Confirm fitting</button>
          <p role="status" className="text-sm text-mute sm:col-span-2">{sent ? "Concept preview: nothing has been booked. At launch this confirms by text and lands in the shop diary." : "We'll text to confirm. Reschedule any time up to the day before."}</p>
        </form>
      </section>

      <section className="wrap grid gap-4 sm:grid-cols-3 sm:gap-6">
        {[["Wedding parties", "The groom made to measure, groomsmen and boys matched off the rail in the same cloth.", "looks/father-son"], ["Women's made to measure", "Trouser suits, blazers and skirts, cut to you. Same process, same prices.", "looks/womens-black"], ["Office orders", "Five or more suits for a team: group fittings in the shop or at your office.", "products/shirts"]].map(([t, d, i]) => (
          <div key={t} className="relative flex min-h-[320px] items-end overflow-hidden rounded-pill text-paper"><img src={img(i, true)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><p className="relative w-full bg-gradient-to-t from-ink/85 to-transparent p-6 pt-16"><span className="display block text-[26px]">{t}</span><span className="text-sm">{d}</span></p></div>
        ))}
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" description={`Be measured, try suits on and have alterations done at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`} />
      <section className="relative flex min-h-[380px] items-end bg-ink"><img src={img("hero/street")} alt="A London street at dawn" className="absolute inset-0 h-full w-full object-cover" /><div className="wrap relative pb-8"><h1 className="inline-block rounded-pill bg-paper px-6 py-4 text-[44px] sm:text-[56px]">Visit us in Tooting</h1></div></section>
      <section className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Address</h2><p className="text-lg">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</p><a href={maps} className="inline-flex min-h-11 items-center underline">Open in Google Maps</a></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Opening hours</h2><p className="text-lg">{SITE.hours}</p><p className="text-mute">Walk in to be measured; book for made to measure.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Alterations</h2><p className="text-mute">Free on suits bought in store. [ALTERATIONS PRICE LIST] for everything else. Most jobs back within [DAYS] days.</p><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center underline">{SITE.phone}</a></div>
      </section>
      <section className="wrap pb-6"><div className="flex flex-col gap-4 rounded-pill bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[32px] text-paper">Want a fitter ready for you?</h2><p className="text-[#e9dfe2]">Book a free 45-minute made-to-measure appointment.</p></div><Link to="/made-to-measure#book" className="btn btn-paper shrink-0">Book a fitting</Link></div></section>
    </>
  );
}
