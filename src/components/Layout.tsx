import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE, deliveryLine } from "../data/site";
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
const openHours = SITE.hours.replace("Monday to Sunday", "every day");

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-formal-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Formal" className={className} width="415" height="64" />;
}

/** Two centred tiers on every width. The lockup stands alone on the first; the departments run between rules on the
    second, which stays at the top of the window and scrolls sideways on a phone. */
export function Header() {
  const { label } = useSizes();
  const sizes = label ? `My sizes: ${label}` : "Find my sizes";
  return (
    <>
      <header className="on-green bg-green text-on-green">
        <div className="wrap grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-4 pt-5 sm:pb-5 sm:pt-7">
          <p className="t-small hidden text-left lg:block">Walk in, {openHours}</p>
          <Link to="/" className="col-start-2 inline-flex min-h-11 items-center"><Logo white className="h-7 w-auto sm:h-8" /></Link>
          <Link to="/find-my-sizes" className="t-small hidden min-h-11 items-center justify-self-end underline-offset-4 hover:underline lg:inline-flex">{sizes}</Link>
        </div>
      </header>
      <nav aria-label="Main" className="on-green sticky top-0 z-40 bg-green text-chalk">
        <div className="wrap"><span className="rule2" /></div>
        <div className="navrow">
          <ul className="mx-auto flex w-max gap-x-5 px-4 sm:gap-x-10 sm:px-8">
            {NAV.map((n) => <li key={n.to}><NavLink to={n.to} className={({ isActive }) => `inline-flex min-h-12 min-w-11 items-center justify-center whitespace-nowrap border-y-2 border-transparent ${isActive ? "border-b-chalk" : "hover:border-b-rule-green"}`}>{n.label}</NavLink></li>)}
            <li className="lg:hidden"><NavLink to="/find-my-sizes" className={({ isActive }) => `inline-flex min-h-12 min-w-11 items-center justify-center whitespace-nowrap border-y-2 border-transparent ${isActive ? "border-b-chalk" : ""}`}>{sizes}</NavLink></li>
          </ul>
        </div>
        <span className="block h-[2px] bg-brass" aria-hidden="true" />
      </nav>
    </>
  );
}

export const Crumbs = ({ trail = [], here }: { trail?: [string, string][]; here: string }) => (
  <nav aria-label="Breadcrumb" className="t-small flex flex-wrap items-center justify-center gap-x-2 text-mute">
    <Link to="/" className="inline-flex min-h-11 min-w-11 items-center justify-center underline underline-offset-4">Home</Link>
    {trail.map(([to, t]) => <span key={to} className="contents"><span aria-hidden="true">/</span><Link to={to} className="inline-flex min-h-11 min-w-11 items-center justify-center underline underline-offset-4">{t}</Link></span>)}
    <span aria-hidden="true">/</span><span>{here}</span>
  </nav>
);

/** A page title: centred, between double rules, with one line beneath the name. */
export function Title({ crumbs, title, line, hero = false, children }: { crumbs?: ReactNode; title: ReactNode; line?: ReactNode; hero?: boolean; children?: ReactNode }) {
  return (
    <section className="wrap flex flex-col items-center pb-6 pt-2 sm:pt-4">
      {crumbs ?? <span className="h-6 sm:h-8" aria-hidden="true" />}
      <div className="flex w-full max-w-[46rem] flex-col items-center gap-4 pt-2">
        <span className="rule2" aria-hidden="true" />
        <h1 className={hero ? "t-hero" : ""}>{title}</h1>
        {line && <p className="t-lede max-w-[34rem]">{line}</p>}
        <span className="rule2" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

/** A section heading between its own pair of rules, narrower than a page title. */
export const Heading = ({ children, id }: { children: ReactNode; id?: string }) => (
  <div className="mx-auto flex w-full max-w-[26rem] flex-col items-center gap-3">
    <span className="rule2" aria-hidden="true" /><h2 id={id}>{children}</h2><span className="rule2" aria-hidden="true" />
  </div>
);

const fl = "inline-flex min-h-11 items-center px-2 underline underline-offset-4 decoration-rule-green hover:decoration-chalk";

/** Green, centred, three lines: where we are, where to go, the small print. */
export function Footer() {
  const excluded = SITE.returns.excluded.join(", ").replace(/, ([^,]*)$/, " and $1");
  return (
    <footer className="on-green mt-20 bg-green text-on-green">
      <span className="block h-[2px] bg-brass" aria-hidden="true" />
      <div className="wrap flex flex-col items-center gap-6 py-12">
        <Logo white className="h-7 w-auto" />
        <address className="text-chalk">
          {SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />
          Open {SITE.hours}. No appointment is needed.<br />
          <a href={`tel:${SITE.phoneIntl}`} className="num inline-flex min-h-11 items-center text-lg underline underline-offset-4">{SITE.phone}</a>
        </address>
        <div className="w-full max-w-[46rem]"><span className="rule2" aria-hidden="true" /></div>
        <ul className="flex max-w-[46rem] flex-wrap justify-center gap-x-4">
          <li><Link to="/shop/suits" className={fl}>Suits</Link></li>
          <li><Link to="/shop/occasion" className={fl}>Prom and occasion</Link></li>
          <li><Link to="/shop/bridal" className={fl}>Bridal and wedding</Link></li>
          <li><Link to="/shop/all" className={fl}>The whole catalogue</Link></li>
          <li><Link to="/find-my-sizes" className={fl}>Find my sizes</Link></li>
          <li><Link to="/delivery-returns" className={fl}>Delivery and returns</Link></li>
          <li><a href={SITE.social.instagram} className={fl}>Instagram</a></li>
          <li><a href={SITE.social.facebook} className={fl}>Facebook</a></li>
          {SITE.family.map((f) => <li key={f.name}><a href={f.url} className={fl}>{f.name}</a></li>)}
        </ul>
        <p className="t-small max-w-[44rem]">
          {deliveryLine}. Returns within {SITE.returns.days} days, except {excluded}.<br />
          © {SITE.legalName}, trading as {SITE.tradingAs}. Company no. {SITE.companyNumber}, VAT {SITE.vat}.{SITE.preview ? " This is a preview: the pieces shown are samples and ordering opens at launch." : ""}
        </p>
      </div>
    </footer>
  );
}
