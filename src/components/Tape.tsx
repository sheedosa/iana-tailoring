import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { SITE } from "../data/site";

// The tailor's tape. It appears once on the site: as the fitting line. Cells are inches; see .tape in index.css.
function Tape({ n, vertical = false, className = "", style, children }: { n: number; vertical?: boolean; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <span className={`tape ${vertical ? "tape-v" : ""} ${className}`} style={style} aria-hidden="true">
      {children}
      {Array.from({ length: n }, (_, i) => <i key={i} data-n={i > 0 ? i : ""} />)}
    </span>
  );
}

type Stage = { name: string; mark: string; line: string; note?: string };

/** Made to measure set out along a tape: five stages, with the deposit and the weeks marked where they fall.
    Only the client's confirmed facts appear; anything unknown is a labelled placeholder. */
export function FittingLine() {
  const m = SITE.madeToMeasure;
  const stages: Stage[] = [
    { name: "Choose the cloth", mark: `From ${m.from}`, line: "Walk in; no appointment is needed. You choose the cloth and the details with us." },
    { name: "Measured", mark: `${m.deposit} deposit`, line: `We take your measurements and agree the price, and you pay a ${m.deposit} deposit before we start.` },
    { name: "First fitting", mark: `Fitting 1 of ${m.fittings}`, line: "You try the suit part-made, and we mark every adjustment on you.", note: "[WEEK OF EACH FITTING TO COME]" },
    { name: "Second fitting", mark: `Fitting ${m.fittings} of ${m.fittings}`, line: "We make the last checks on the finished suit.", note: "[WEEK OF EACH FITTING TO COME]" },
    { name: "Collect", mark: `Usually ${m.weeks}`, line: `You collect the suit and pay the balance, usually ${m.weeks} after your first visit.` },
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
    setSel(Math.max(0, Math.min(last, Math.floor(((e.clientX - r.left) / r.width) * 5))));
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

      {/* Tablet and desktop: the tape runs across the column, the stages above it. */}
      <div className="hidden md:block">
        <ol className="grid grid-cols-5">
          {stages.map((x, i) => (
            <li key={x.name}>
              <button type="button" className="fit-stage" aria-pressed={sel === i} onClick={() => setSel(i)} onKeyDown={(e) => keys(e, i)}>
                <b>{x.name}</b>
                <span className="num text-on-green">{x.mark}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="fit-track" onPointerDown={scrub} onPointerMove={scrub}>
          <Tape n={60}><span className="tape-fill" /></Tape>
          <span className="tape-clip" />
        </div>
        <div key={sel} className="swap col gap-2 pt-10">
          <p className="t-lede text-chalk">{s.line}</p>
          {s.note && <p>{s.note}</p>}
        </div>
      </div>

      {/* Phone: the tape runs down the left edge. */}
      <div className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 md:hidden">
        <div className="relative">
          <Tape n={60} vertical className="absolute inset-y-0 left-0" style={{ "--u": "22px" } as CSSProperties}><span className="tape-fill" style={{ height: fill }} /></Tape>
        </div>
        <ol className="relative flex flex-col">
          {stages.map((x, i) => (
            <li key={x.name} ref={(el) => { rows.current[i] = el; }} className="fit-row">
              <button type="button" className="flex min-h-14 w-full flex-col justify-center gap-0.5 py-2.5 text-left" aria-pressed={sel === i} aria-expanded={sel === i} onClick={() => setSel(i)} onKeyDown={(e) => keys(e, i)}>
                <span className={`display text-[1.375rem] leading-tight text-chalk ${sel === i ? "underline decoration-1 underline-offset-[0.3em]" : ""}`}>{x.name}</span>
                <span className="num">{x.mark}</span>
              </button>
              {sel === i && (
                <div className="swap flex flex-col gap-1 pb-4">
                  <p>{x.line}</p>
                  {x.note && <p>{x.note}</p>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
