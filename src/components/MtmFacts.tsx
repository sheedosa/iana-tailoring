import { SITE } from "../data/site";

// Confirmed made-to-measure terms, shown as one clean row wherever made to measure is offered.
export function MtmFacts({ dark = false }: { dark?: boolean }) {
  const m = SITE.madeToMeasure;
  const rows = [["Price", `From ${m.from}`], ["Deposit", m.deposit], ["Ready in", `Usually ${m.weeks}`], ["Fittings", String(m.fittings)]];
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-pill sm:grid-cols-4 ${dark ? "bg-paper/20" : "bg-line"}`}>
      {rows.map(([k, v]) => (
        <div key={k} className={`flex flex-col gap-1 px-4 py-4 ${dark ? "bg-ink" : "bg-paper"}`}>
          <dt className={`label ${dark ? "text-sage" : "text-mute"}`}>{k}</dt>
          <dd className={`text-[19px] leading-tight ${dark ? "text-paper" : ""}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
