import { useState } from "react";
import { suggestSizes } from "../data/site";
import { useSizes } from "../lib/sizes";

// Height, chest, waist in → men's jacket size and length, trouser waist and leg, and a fit. Used on Home and /find-my-sizes.
export function SizeFinder({ big = false, tone = "sage" }: { big?: boolean; tone?: "sage" | "paper" }) {
  const { sizes, setSizes } = useSizes();
  const [ft, setFt] = useState(""); const [inch, setInch] = useState(""); const [chest, setChest] = useState(""); const [waist, setWaist] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(ft) * 12 + Number(inch || 0), c = Number(chest), w = Number(waist);
    if (!Number(ft) || h < 54 || h > 84 || c < 32 || c > 56 || w < 26 || w > 50) { setMsg("Check the numbers: height in feet and inches, chest and waist in inches."); return; }
    setSizes(suggestSizes(h, c, w));
    setMsg("Saved on this device. Your sizes are marked on every men's suit.");
  };
  const field = (id: string, label: string, v: string, set: (x: string) => void, ph: string, max = 2) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} inputMode="numeric" autoComplete="off" value={v} onChange={(e) => set(e.target.value.replace(/\D/g, "").slice(0, max))} placeholder={ph} className="h-12 w-full min-w-0 rounded-pill border border-ink bg-paper px-3 text-base" />
    </div>
  );
  const card = tone === "sage" ? "bg-paper" : "bg-sage";

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex max-w-2xl flex-col gap-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end">
          {field("sf-ft", "Height ft", ft, setFt, "5", 1)}
          {field("sf-in", "Height in", inch, setInch, "10")}
          {field("sf-c", "Chest", chest, setChest, "40")}
          {field("sf-w", "Waist", waist, setWaist, "32")}
          <button type="submit" className="btn btn-ink col-span-2 sm:col-span-1">Show my sizes</button>
        </div>
        <p className="text-[14px] text-mute">Chest and waist in inches, measured over a shirt.</p>
      </form>
      <p role="status" className={msg ? "text-base" : "sr-only"}>{msg}</p>
      {sizes && (
        <div className={`grid gap-px overflow-hidden rounded-pill grid-cols-2 sm:grid-cols-3`}>
          {[["Jacket", `${sizes.chest}${sizes.length}`], ["Trousers", `${sizes.waist}/${sizes.leg}`], ["Fit", sizes.fit]].map(([k, v]) => (
            <div key={k} className={`${card} ${k === "Fit" ? "col-span-2 sm:col-span-1" : ""} ${big ? "px-3 py-4 sm:px-6 sm:py-6" : "px-3 py-3 sm:px-4"}`}><p className="label text-mute">{k}</p><p className={`display ${big ? "text-[40px] sm:text-[56px]" : "text-[26px] sm:text-[30px]"}`}>{v}</p></div>
          ))}
        </div>
      )}
    </div>
  );
}
