import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE, deliveryLine } from "../data/site";
import { store } from "../lib/store";
import { useSizes } from "../lib/sizes";
import { Tape } from "./Tape";

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
    <div className="on-dark bg-deep text-paper">
      <div className="wrap flex min-h-[34px] items-center justify-between gap-3 text-[14px]">
        <p className="truncate"><span className="md:hidden">Free delivery on orders of {SITE.delivery.freeOver} and over</span><span className="hidden md:inline">Free delivery on orders of {SITE.delivery.freeOver} and over, click and collect in Tooting, walk in seven days a week.</span></p>
        {SITE.preview && <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px]" title="Concept preview: products are samples and ordering opens at launch">Preview</span>}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { label } = useSizes();
  const { pathname } = useLocation();
  const close = () => setOpen(false);
  useEffect(close, [pathname]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      const bar = document.querySelector<HTMLElement>("header");
      if (e.key === "Escape") { setOpen(false); bar?.querySelector<HTMLElement>("button[aria-controls]")?.focus(); return; }
      if (e.key !== "Tab" || !bar) return;
      // Keep Tab inside the header and its open panel.
      const stops = [...bar.querySelectorAll<HTMLElement>("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !bar.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !bar.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <>
      <Strip />
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="-ml-2 inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={close}><Logo className="h-6 w-auto sm:h-7" /></Link>
          <nav aria-label="Main" className="hidden gap-7 lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b ${isActive ? "border-ink" : "border-transparent hover:border-ink/50"}`}>{n.label}</NavLink>)}
          </nav>
          <Link to="/find-my-sizes" className="inline-flex min-h-11 items-center px-1 underline-offset-4 hover:underline sm:px-2">{label ? <><span className="hidden sm:inline">My sizes:&nbsp;</span>{label}</> : <>Find my sizes</>}</Link>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Main" className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper lg:hidden">
            <div className="wrap flex min-h-full flex-col gap-8 pb-10 pt-4">
              <ul className="flex flex-col">
                {NAV.map((n) => <li key={n.to} className="border-b border-line"><Link to={n.to} onClick={close} className="t-sub flex min-h-14 items-center">{n.label}</Link></li>)}
              </ul>
              <ul className="flex flex-col">
                {[["/shop/all", "Shop everything"], ["/find-my-sizes", "Find my sizes"], ["/delivery-returns", "Delivery and returns"]].map(([to, t]) => <li key={to}><Link to={to} onClick={close} className="flex min-h-11 items-center">{t}</Link></li>)}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <Tape n={40} end className="-mx-4 sm:-mx-8" />
                <a href={`tel:${SITE.phoneIntl}`} className="t-sub inline-flex min-h-11 items-center self-start underline underline-offset-4">{SITE.phone}</a>
                <p>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />Open {SITE.hours}. {SITE.appointments}.</p>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

const fl = "inline-flex min-h-11 items-center hover:underline underline-offset-4";

export function Footer() {
  const excluded = SITE.returns.excluded.join(", ").replace(/, ([^,]*)$/, " and $1");
  return (
    <footer className="on-dark bg-deep text-paper">
      <Tape n={96} end className="on-dark" />
      <div className="wrap grid gap-x-10 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-sm text-on-ink">Formal wear for men, women and kids, made to measure and altered in Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? " and " : ""}<a className="underline underline-offset-4" href={f.url}>{f.name}</a></span>)}.</p>
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
            <li><Link to="/delivery-returns" className={fl}>Delivery and returns</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 text-on-ink">Visit</h2>
          <p className="py-2.5">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br />{SITE.appointments}</p>
          <a href={`tel:${SITE.phoneIntl}`} className={`${fl} t-sub`}>{SITE.phone}</a>
          <div className="flex gap-5"><a href={SITE.social.instagram} className={`${fl} underline`}>Instagram</a><a href={SITE.social.facebook} className={`${fl} underline`}>Facebook</a></div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap grid gap-3 py-6 text-[14px] text-on-ink lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <p>{deliveryLine}. {SITE.returns.days}-day returns, except {excluded}.</p>
          <p className="lg:text-right">© {SITE.legalName}, trading as {SITE.tradingAs}. Company no. {SITE.companyNumber}, VAT {SITE.vat}.{SITE.preview ? " Concept preview: products are samples and ordering opens at launch." : ""}</p>
        </div>
      </div>
    </footer>
  );
}
