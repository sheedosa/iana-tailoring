import { useState } from "react";
import { JACKET_CHESTS, TROUSER_WAISTS, suggestSizes } from "../data/site";
import { useSizes } from "../lib/sizes";
import { Ruler } from "./Tape";

const num = (v: string, lo: number, hi: number) => { const n = Number(v); return v !== "" && n >= lo && n <= hi ? n : null; };

// Height, chest and waist in → men's jacket size and length, trouser waist and leg, and a fit.
// The two rulers are lengths of the tape: the clip follows the numbers as they are typed, then settles on the saved size.
export function SizeFinder({ big = false }: { big?: boolean }) {
  const { sizes, setSizes } = useSizes();
  const [ft, setFt] = useState(""); const [inch, setInch] = useState(""); const [chest, setChest] = useState(""); const [waist, setWaist] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(ft) * 12 + Number(inch || 0), c = num(chest, 32, 56), w = num(waist, 26, 50);
    const bad: Record<string, string> = {};
    if (!Number(ft) || h < 54 || h > 84) bad.ft = "Enter your height in feet and inches, between 4ft 6in and 7ft.";
    if (c === null) bad.c = "Enter your chest in inches, between 32 and 56.";
    if (w === null) bad.w = "Enter your waist in inches, between 26 and 50.";
    setErr(bad);
    if (bad.ft || c === null || w === null) { setSaved(false); return; }
    setSizes(suggestSizes(h, c, w));
    setSaved(true);
  };
  const field = (id: string, label: string, v: string, set: (x: string) => void, ph: string, bad: boolean, max = 2) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={v} onChange={(e) => { set(e.target.value.replace(/\D/g, "").slice(0, max)); setSaved(false); }} placeholder={ph} aria-invalid={bad || undefined} aria-describedby={bad ? "sf-err" : "sf-hint"} className={`field ${bad ? "border-2" : ""}`} />
    </div>
  );
  const errs = Object.values(err);
  const cAt = num(chest, 32, 56) ?? sizes?.chest ?? null;
  const wAt = num(waist, 26, 50) ?? sizes?.waist ?? null;
  const fig = big ? "t-section" : "t-sub";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submit} noValidate className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end">
          {field("sf-ft", "Height, feet", ft, setFt, "5", !!err.ft, 1)}
          {field("sf-in", "Height, inches", inch, setInch, "10", !!err.ft)}
          {field("sf-c", "Chest, inches", chest, setChest, "40", !!err.c)}
          {field("sf-w", "Waist, inches", waist, setWaist, "32", !!err.w)}
          <button type="submit" className="btn btn-ink col-span-2 sm:col-span-1">Show my sizes</button>
        </div>
        {errs.length > 0
          ? <ul id="sf-err" role="alert" className="flex flex-col font-semibold">{errs.map((x) => <li key={x}>{x}</li>)}</ul>
          : <p id="sf-hint" className="t-small text-mute">Measure chest and waist over a shirt.</p>}
      </form>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="flex items-baseline justify-between gap-3"><span className="label">Jacket, by chest</span><span className={`display ${fig}`}>{sizes ? `${sizes.chest}${sizes.length}` : " "}</span></p>
          <Ruler from={JACKET_CHESTS[0] - 2} to={JACKET_CHESTS[JACKET_CHESTS.length - 1] + 2} at={cAt} />
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex items-baseline justify-between gap-3"><span className="label">Trousers, by waist</span><span className={`display ${fig}`}>{sizes ? `${sizes.waist}/${sizes.leg}` : " "}</span></p>
          <Ruler from={TROUSER_WAISTS[0] - 2} to={TROUSER_WAISTS[TROUSER_WAISTS.length - 1] + 2} at={wAt} />
        </div>
      </div>
      <p role="status" className={sizes ? "" : "text-mute"}>
        {sizes
          ? <><span className="voice">{sizes.fit} fit.</span> {saved ? "Saved on this device and marked on every men's suit." : "Your saved sizes, marked on every men's suit."} <button type="button" className="inline-flex min-h-11 items-center underline underline-offset-4" onClick={() => { setSizes(null); setSaved(false); }}>Clear</button></>
          : "Your jacket and trouser sizes are marked on the tape."}
      </p>
    </div>
  );
}
