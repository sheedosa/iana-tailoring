import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE, deliveryLine } from "../data/site";
import { store } from "../lib/store";
import { useSizes } from "../lib/sizes";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/shop/men", label: "Men" },
  { to: "/shop/women", label: "Women" },
  { to: "/shop/kids", label: "Kids" },
  { to: "/made-to-measure", label: "Made to measure" },
  { to: "/alterations", label: "Alterations" },
  { to: "/visit", label: "Visit" },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-formal-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Formal" className={className} width="415" height="64" />;
}

/** One strip above the header: a confirmed fact on the left, the preview tag on the right. */
function Strip() {
  return (
    <div className="bg-deep text-paper">
      <div className="wrap flex min-h-[34px] items-center justify-between gap-3 text-[13px] tracking-wide">
        <p className="truncate"><span className="sm:hidden">Free delivery over {SITE.delivery.freeOver}</span><span className="hidden sm:inline">Free delivery on orders of {SITE.delivery.freeOver} and over · Click and collect in Tooting · Walk in seven days a week</span></p>
        {SITE.preview && <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px]" title="Concept preview: products are samples and ordering opens at launch">Preview</span>}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { label } = useSizes();
  const close = () => setOpen(false);
  return (
    <>
      <Strip />
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="-ml-2 inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={close}><Logo className="h-6 w-auto sm:h-7" /></Link>
          <nav aria-label="Main" className="hidden gap-6 text-[15px] tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/40"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center">
            <Link to="/find-my-sizes" className="inline-flex min-h-11 items-center px-1 text-[15px] underline-offset-4 hover:underline sm:px-2">{label ? <><span className="hidden sm:inline">My sizes:&nbsp;</span>{label}</> : <>Sizes</>}</Link>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={close} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/shop/all" onClick={close} className="flex min-h-12 items-center border-b border-line text-lg">Shop everything</Link>
              <Link to="/find-my-sizes" onClick={close} className="flex min-h-12 items-center border-b border-line text-lg">Find my sizes</Link>
              <Link to="/delivery-returns" onClick={close} className="flex min-h-12 items-center text-lg">Delivery &amp; returns</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

const fl = "inline-flex min-h-11 items-center hover:underline";

export function Footer() {
  return (
    <footer className="mt-20 bg-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-sm text-on-ink">Formal wear for men, women and kids, made to measure and altered in Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? " and " : ""}<a className="underline" href={f.url}>{f.name}</a></span>)}.</p>
          <p className="max-w-sm text-[14px] text-on-ink">{deliveryLine}. {SITE.returns.days}-day returns, except {SITE.returns.excluded.join(", ").replace(/, ([^,]*)$/, " and $1")}.</p>
        </div>
        <div>
          <h2 className="label mb-3 text-on-ink">Shop</h2>
          <ul className="flex flex-col">{store.collections().map((c) => <li key={c.handle}><Link to={`/shop/${c.handle}`} className={fl}>{c.title}</Link></li>)}<li><Link to="/shop/all" className={fl}>Everything</Link></li></ul>
        </div>
        <div>
          <h2 className="label mb-3 text-on-ink">Service</h2>
          <ul className="flex flex-col">
            <li><Link to="/made-to-measure" className={fl}>Made to measure</Link></li>
            <li><Link to="/alterations" className={fl}>Alterations</Link></li>
            <li><Link to="/find-my-sizes" className={fl}>Find my sizes</Link></li>
            <li><Link to="/delivery-returns" className={fl}>Delivery &amp; returns</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 text-on-ink">Visit</h2>
          <p>{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <a href={`tel:${SITE.phoneIntl}`} className={`${fl} mt-1`}>{SITE.phone}</a>
          <div className="flex gap-4"><a href={SITE.social.instagram} className={`${fl} underline`}>Instagram</a><a href={SITE.social.facebook} className={`${fl} underline`}>Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-on-ink">© {SITE.legalName}, trading as {SITE.tradingAs} · Company no. {SITE.companyNumber} · VAT {SITE.vat}{SITE.preview ? " · Concept preview: products are samples; ordering opens at launch" : ""}</div>
    </footer>
  );
}
