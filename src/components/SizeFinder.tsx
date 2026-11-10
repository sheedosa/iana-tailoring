import { useState } from "react";
import { suggestSizes } from "../data/site";
import { useSizes } from "../lib/sizes";

const num = (v: string, lo: number, hi: number) => { const n = Number(v); return v !== "" && n >= lo && n <= hi ? n : null; };
const LENGTH = { S: "short", R: "regular", L: "long" } as const;

// Height, chest and waist in; men's jacket size and length, trouser waist and leg, and a fit out.
// Four plain ruled fields, then the answer in words.
export function SizeFinder() {
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
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input id={id} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={v} onChange={(e) => { set(e.target.value.replace(/\D/g, "").slice(0, max)); setSaved(false); }} placeholder={ph} aria-invalid={bad || undefined} aria-describedby={bad ? "sf-err" : "sf-hint"} className="field" />
    </div>
  );
  const errs = Object.values(err);

  return (
    <div className="col gap-8">
      <form onSubmit={submit} noValidate className="flex w-full flex-col items-center gap-5">
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {field("sf-ft", "Height, feet", ft, setFt, "5", !!err.ft, 1)}
          {field("sf-in", "Height, inches", inch, setInch, "10", !!err.ft)}
          {field("sf-c", "Chest, inches", chest, setChest, "40", !!err.c)}
          {field("sf-w", "Waist, inches", waist, setWaist, "32", !!err.w)}
        </div>
        {errs.length > 0
          ? <ul id="sf-err" role="alert" className="flex flex-col font-bold">{errs.map((x) => <li key={x}>{x}</li>)}</ul>
          : <p id="sf-hint" className="t-small text-mute">Measure your chest and waist over a shirt.</p>}
        <button type="submit" className="btn">Work out my sizes</button>
      </form>

      <div role="status" className="flex w-full flex-col items-center gap-3">
        {sizes ? (
          <>
            <dl className="spec spec-even">
              <dt>Jacket</dt><dd><span className="num text-lg font-semibold">{sizes.chest}{sizes.length}</span>, a {sizes.chest} inch chest in the {LENGTH[sizes.length]} length</dd>
              <dt>Trousers</dt><dd><span className="num text-lg font-semibold">{sizes.waist}/{sizes.leg}</span>, a {sizes.waist} inch waist and a {sizes.leg} inch leg</dd>
              <dt>Fit</dt><dd>{sizes.fit}</dd>
            </dl>
            <p>{saved ? "These are saved on this device and marked on every men's suit." : "These are your saved sizes, marked on every men's suit."}</p>
            <button type="button" className="link" onClick={() => { setSizes(null); setSaved(false); }}>Clear my sizes</button>
          </>
        ) : <p className="text-mute">Your jacket and trouser sizes will appear here, and are then marked on every men's suit.</p>}
      </div>
    </div>
  );
}
