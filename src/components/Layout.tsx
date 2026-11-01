import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE } from "../data/site";
import { useSizes } from "../lib/sizes";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/shop/suits", label: "Suits" },
  { to: "/shop/jackets", label: "Jackets" },
  { to: "/shop/trousers", label: "Trousers" },
  { to: "/shop/shirts", label: "Shirts" },
  { to: "/shop/women", label: "Women" },
  { to: "/shop/boys", label: "Boys" },
  { to: "/made-to-measure", label: "Made to measure", strong: true },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-tailoring-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Tailoring" className={className} width="340" height="44" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { label } = useSizes();
  return (
    <>
      {SITE.preview && <div className="bg-deep px-4 py-2 text-center text-[13px] text-paper">Concept preview · products are samples; ordering and booking open at launch</div>}
      <div className="bg-ink px-4 py-2 text-center text-[13px] tracking-wide text-paper">
        {label ? <>Your sizes: <b>{label}</b> · <Link to="/find-my-sizes" className="underline">change</Link></> : <>Jacket and trousers sold in your own two sizes · <Link to="/find-my-sizes" className="underline">find my sizes</Link></>}
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Shop" className="hidden gap-6 text-sm tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${n.strong ? "font-normal" : ""} ${isActive ? "border-ink" : "border-transparent hover:border-ink/40"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center">
            <Link to="/find-my-sizes" className="hidden min-h-11 items-center px-3 text-sm md:inline-flex">{label ? `My sizes: ${label}` : "Find my sizes"}</Link>
            <Link to="/shop/all" aria-label="Shop everything" className="inline-flex h-11 w-11 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </Link>
          </div>
        </div>
        {open && (
          <nav aria-label="Shop" className="border-t border-line bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/find-my-sizes" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">Find my sizes</Link>
              <Link to="/visit" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Visit the shop</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-sm text-[#d8c9cd]">Suits, shirts and made to measure from Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? " and " : ""}<a className="underline" href={f.url}>{f.name}</a></span>)}.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#d8c9cd]">Shop</h2>
          <ul className="flex flex-col">{NAV.slice(0, 6).map((n) => <li key={n.to}><Link to={n.to} className="inline-flex min-h-11 items-center text-sm">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#d8c9cd]">Service</h2>
          <ul className="flex flex-col">
            <li><Link to="/made-to-measure" className="inline-flex min-h-11 items-center text-sm">Made to measure</Link></li>
            <li><Link to="/find-my-sizes" className="inline-flex min-h-11 items-center text-sm">Find my sizes</Link></li>
            <li><Link to="/visit" className="inline-flex min-h-11 items-center text-sm">Alterations &amp; the shop</Link></li>
            <li><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center text-sm">{SITE.phone}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#d8c9cd]">Visit</h2>
          <p className="text-sm">{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <div className="mt-3 flex gap-4 text-sm"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline">Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-[#d8c9cd]">© {SITE.legalName}, trading as {SITE.tradingAs} · Company no. {SITE.companyNumber} · VAT {SITE.vat}</div>
    </footer>
  );
}
