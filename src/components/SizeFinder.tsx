import { useState } from "react";
import { suggestSizes } from "../data/site";
import { useSizes } from "../lib/sizes";

// Height, chest, waist in → jacket size and length, trouser waist and leg, and a fit. Used on Home and /find-my-sizes.
export function SizeFinder({ compact = false }: { compact?: boolean }) {
  const { sizes, setSizes } = useSizes();
  const [ft, setFt] = useState(""); const [inch, setInch] = useState(""); const [chest, setChest] = useState(""); const [waist, setWaist] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(ft) * 12 + Number(inch || 0), c = Number(chest), w = Number(waist);
    if (!Number(ft) || h < 54 || h > 84 || c < 32 || c > 56 || w < 26 || w > 50) { setMsg("Check the numbers: height in feet and inches, chest and waist in inches."); return; }
    const s = suggestSizes(h, c, w);
    setSizes(s);
    setMsg(`Jacket ${s.chest}${s.length}, trousers ${s.waist}/${s.leg}, ${s.fit.toLowerCase()} fit. Saved on this device and shown on every product.`);
  };
  const field = (id: string, label: string, v: string, set: (x: string) => void, ph: string, max = 2) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} inputMode="numeric" value={v} onChange={(e) => set(e.target.value.replace(/\D/g, "").slice(0, max))} placeholder={ph} className="h-12 w-full min-w-0 rounded-pill border border-ink bg-paper px-3 text-base" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className={`grid gap-3 ${compact ? "max-w-xl" : "max-w-2xl"} grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end`}>
        {field("sf-ft", "Height (ft)", ft, setFt, "5", 1)}
        {field("sf-in", "Height (in)", inch, setInch, "10")}
        {field("sf-c", "Chest (in)", chest, setChest, "40")}
        {field("sf-w", "Waist (in)", waist, setWaist, "32")}
        <button type="submit" className="btn btn-ink col-span-2 sm:col-span-1">Show my sizes</button>
      </form>
      <p role="status" className="min-h-6 text-sm">{msg}</p>
      {sizes && (
        <div className="flex flex-wrap gap-3">
          {[["Jacket", `${sizes.chest}${sizes.length}`], ["Trousers", `${sizes.waist} / ${sizes.leg}`], ["Fit", sizes.fit]].map(([k, v]) => (
            <div key={k} className="rounded-pill bg-paper px-4 py-3"><p className="label text-mute">{k}</p><p className="text-xl font-normal">{v}</p></div>
          ))}
        </div>
      )}
    </div>
  );
}
