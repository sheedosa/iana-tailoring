import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { SITE } from "../data/site";

// The tailor's tape: the site's one motif. Cells are inches; see .tape in index.css.
type TapeProps = { n: number; from?: number; end?: boolean; vertical?: boolean; every?: number; className?: string; style?: CSSProperties; children?: ReactNode };

export function Tape({ n, from = 0, end = false, vertical = false, every = 1, className = "", style, children }: TapeProps) {
  return (
    <span className={`tape ${vertical ? "tape-v" : ""} ${className}`} style={style} aria-hidden="true">
      {children}
      {end && <span className="tape-end" />}
      {Array.from({ length: n }, (_, i) => <i key={i} data-n={i > 0 && (from + i) % every === 0 ? from + i : ""} />)}
    </span>
  );
}

/** A short length under a page title. */
export const TitleTape = ({ className = "" }: { className?: string }) => <Tape n={7} end className={`w-[11.5rem] max-w-full ${className}`} />;

/** A stretch of tape used as a ruler: the scale runs from..to and the clip sits on `at`. */
export function Ruler({ from, to, at, every = 2 }: { from: number; to: number; at: number | null; every?: number }) {
  const n = to - from;
  const pos = at === null ? null : Math.max(0, Math.min(1, (at - from) / n)) * 100;
  return (
    <span className="relative block text-ink" aria-hidden="true">
      <Tape n={n} from={from} every={every} style={{ "--u": `${100 / n}%` } as CSSProperties}>
        <span className="tape-fill" style={{ width: pos === null ? 0 : `${pos}%` }} />
      </Tape>
      {pos !== null && <span className="tape-clip" style={{ left: `${pos}%` }} />}
    </span>
  );
}

type Stage = { name: string; figure: string; unit: string; mark: string; line: string; note?: string };

/** Made to measure as a tape: five stages set along it, with the deposit and the weeks marked where they fall.
    Only the client's confirmed facts appear; anything unknown is a labelled placeholder. */
export function FittingLine() {
  const m = SITE.madeToMeasure;
  const stages: Stage[] = [
    { name: "Walk in and choose cloth", figure: m.from, unit: "is where prices start", mark: `From ${m.from}`, line: "No appointment needed. Choose the cloth and the details." },
    { name: "Measured", figure: m.deposit, unit: "deposit before we start", mark: `${m.deposit} deposit`, line: `We take your measurements and agree the price, and you pay a ${m.deposit} deposit.` },
    { name: "First fitting", figure: `1 of ${m.fittings}`, unit: "fittings", mark: `Fitting 1 of ${m.fittings}`, line: "Try the suit part-made. We mark every adjustment on you.", note: "[WEEK OF EACH FITTING TO COME]" },
    { name: "Second fitting", figure: `${m.fittings} of ${m.fittings}`, unit: "fittings", mark: `Fitting ${m.fittings} of ${m.fittings}`, line: "The last checks on the finished suit.", note: "[WEEK OF EACH FITTING TO COME]" },
    { name: "Collect", figure: m.weeks.replace(" weeks", ""), unit: "weeks after your first visit, usually", mark: `Usually ${m.weeks}`, line: "Collect your suit and pay the balance." },
  ];
  const last = stages.length - 1;
  const [sel, setSel] = useState(0);
  const s = stages[sel];

  // Phone: the tape runs down the left edge and fills to the chosen stage.
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [fill, setFill] = useState(0);
  useLayoutEffect(() => {
    const place = () => { const el = rows.current[sel]; if (el) setFill(el.offsetTop + 22); };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [sel]);

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === "pointermove" && e.buttons !== 1) return;
    const r = e.currentTarget.getBoundingClientRect();
    setSel(Math.max(0, Math.min(last, Math.round(((e.clientX - r.left) / r.width) * 5))));
  };
  const keys = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const j = i + d;
    if (!d || j < 0 || j > last) return;
    e.preventDefault();
    setSel(j);
    const li = e.currentTarget.closest("li");
    (d > 0 ? li?.nextElementSibling : li?.previousElementSibling)?.querySelector("button")?.focus();
  };

  return (
    <div className="fit" style={{ "--sel": sel } as CSSProperties}>
      <p className="sr-only" aria-live="polite">{s.name}. {s.mark}. {s.line}</p>

      {/* Tablet and desktop: the tape runs across the page. */}
      <div className="hidden md:block">
        <ol className="grid grid-cols-5">
          {stages.map((x, i) => (
            <li key={x.name}>
              <button type="button" className="fit-stage" aria-pressed={sel === i} onClick={() => setSel(i)} onKeyDown={(e) => keys(e, i)}>
                <span className="t-sub">{x.name}</span>
                <span className="text-on-ink">{x.mark}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="fit-track" onPointerDown={scrub} onPointerMove={scrub}>
          <span className="tape-end fit-end" aria-hidden="true" />
          <Tape n={96}><span className="tape-fill" /></Tape>
          <span className="tape-clip" />
        </div>
        <div key={sel} className="swap grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-end pt-10">
          <p className="flex flex-col gap-2"><span className="t-figure">{s.figure}</span><span className="voice text-on-ink">{s.unit}</span></p>
          <div className="flex flex-col gap-2 pb-1 pl-3.5">
            <h3>{s.name}</h3>
            <p className="t-lede measure text-on-ink">{s.line}</p>
            {s.note && <p className="text-on-ink">{s.note}</p>}
          </div>
        </div>
      </div>

      {/* Phone: the tape runs down the left edge. */}
      <div className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 md:hidden">
        <div className="relative">
          <Tape n={60} end vertical className="absolute inset-y-0 left-0" style={{ "--u": "22px" } as CSSProperties}><span className="tape-fill" style={{ height: fill }} /></Tape>
        </div>
        <ol className="relative flex flex-col">
          {stages.map((x, i) => (
            <li key={x.name} ref={(el) => { rows.current[i] = el; }} className="fit-row">
              <button type="button" className="flex min-h-14 w-full flex-col justify-center gap-0.5 py-2.5 text-left" aria-pressed={sel === i} aria-expanded={sel === i} onClick={() => setSel(i)} onKeyDown={(e) => keys(e, i)}>
                <span className={`t-sub ${sel === i ? "underline decoration-1 underline-offset-[0.3em]" : ""}`}>{x.name}</span>
                <span className="text-on-ink">{x.mark}</span>
              </button>
              {sel === i && (
                <div className="swap flex flex-col gap-1 pb-4">
                  <p className="text-on-ink">{x.line}</p>
                  {x.note && <p className="text-on-ink">{x.note}</p>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** A bar pinned to the bottom of a phone screen once `watch` has scrolled out of view. It steps aside for the footer. */
export function StickyBar({ watch, children }: { watch: React.RefObject<HTMLElement | null>; children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const target = watch.current, footer = document.querySelector("footer");
    if (!target || !("IntersectionObserver" in window)) return;
    let away = false, foot = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.target === target) away = !e.isIntersecting; else foot = e.isIntersecting; }
      setShow(away && !foot);
    });
    io.observe(target);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [watch]);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-paper lg:hidden ${show ? "" : "hidden"}`} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="sheet wrap flex items-center justify-between gap-3 py-2.5">{children}</div>
    </div>
  );
}
