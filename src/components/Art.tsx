import type { Art } from "../lib/store";

// Line drawings for labelled photo slots: one garment outline per kind, 1.5px strokes that stay 1.5px at any size.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const JACKET = (
  <>
    <path {...S} d="M70 38 L88 30 Q100 36 112 30 L130 38 L152 52 L160 210 L142 212 L138 112 L136 214 L64 214 L62 112 L58 212 L40 210 L48 52 Z" />
    <path {...S} d="M88 30 L78 72 L92 80 L100 122 M112 30 L122 72 L108 80 L100 122 M100 122 V214 M70 166 h20 M110 166 h20 M118 96 h14" />
    <circle {...S} cx="100" cy="142" r="2.5" /><circle {...S} cx="100" cy="168" r="2.5" />
  </>
);

const DRAW: Record<Art, React.ReactNode> = {
  jacket: JACKET,
  waistcoat: (
    <>
      {JACKET}
      <path {...S} d="M92 80 L100 104 L108 80" />
      <circle {...S} cx="100" cy="112" r="1.8" /><circle {...S} cx="100" cy="126" r="1.8" />
    </>
  ),
  gown: (
    <>
      <path {...S} d="M88 40 Q100 47 112 40 L115 62 Q108 90 112 110 L172 232 Q100 244 28 232 L88 110 Q92 90 85 62 Z" />
      <path {...S} d="M88 40 L86 28 M112 40 L114 28 M88 110 Q100 115 112 110 M100 115 L92 236 M100 115 L120 238" />
    </>
  ),
  dress: (
    <>
      <path {...S} d="M84 36 L72 44 L66 72 L80 76 L86 60 Q89 90 86 112 L64 196 Q100 206 136 196 L114 112 Q111 90 114 60 L120 76 L134 72 L128 44 L116 36 Q100 52 84 36 Z" />
      <path {...S} d="M86 112 Q100 117 114 112 M100 116 L94 140 M100 116 L108 138" />
    </>
  ),
  jumpsuit: (
    <>
      <path {...S} d="M84 36 Q100 52 116 36 L128 44 L124 72 L114 68 Q111 90 115 112 L132 216 L106 216 L100 132 L94 216 L68 216 L85 112 Q89 90 86 68 L76 72 L72 44 Z" />
      <path {...S} d="M85 112 Q100 117 115 112 M100 116 L92 136 M100 116 L109 134" />
    </>
  ),
  shirt: (
    <>
      <path {...S} d="M48 82 H152 V196 H48 Z M80 82 L100 104 L120 82 M80 82 L88 68 H112 L120 82 M100 104 V196" />
      <circle {...S} cx="100" cy="124" r="2" /><circle {...S} cx="100" cy="148" r="2" /><circle {...S} cx="100" cy="172" r="2" />
    </>
  ),
  tie: (
    <>
      <path {...S} d="M92 34 H108 L105 50 H95 Z M95 50 L84 192 L100 210 L116 192 L105 50" />
      <path {...S} d="M93 72 H107 M92 96 H108 M90 120 H110 M88 144 H112 M87 168 H113" />
    </>
  ),
  trousers: (
    <>
      <path {...S} d="M64 38 H136 L142 214 H114 L100 86 L86 214 H58 Z" />
      <path {...S} d="M64 52 H136 M100 52 V84 M74 52 L80 70 M126 52 L120 70" />
    </>
  ),
  shopfront: (
    <>
      <path {...S} d="M24 50 H176 V232 H24 Z M24 50 V86 H176 M38 108 H120 V200 H38 Z M136 108 H164 V232 M136 108 V232 M24 200 H120 M79 108 V200" />
      <path {...S} d="M58 64 h10 M78 64 h44 M58 72 h64" />
    </>
  ),
};

export function GarmentArt({ art, className = "" }: { art: Art; className?: string }) {
  return <svg viewBox="0 0 200 250" className={className} aria-hidden="true" focusable="false">{DRAW[art]}</svg>;
}

type Tone = "sage" | "ink" | "paper";
const TONES: Record<Tone, string> = { sage: "bg-sage text-ink", ink: "bg-ink text-paper", paper: "bg-paper text-ink border border-line" };

/** A designed placeholder where a photograph will go: brand ground, a line drawing, a caps label and one line on the shot. */
export function PhotoSlot({ art, label, line, tone = "sage", className = "", compact = false }: { art: Art; label: string; line: string; tone?: Tone; className?: string; compact?: boolean }) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-pill ${TONES[tone]} ${className}`} aria-hidden="true">
      <div className="flex min-h-0 flex-1 items-center justify-center p-4"><GarmentArt art={art} className={compact ? "h-[72%] max-h-64 w-auto" : "h-[78%] max-h-96 w-auto"} /></div>
      <div className={`flex flex-col gap-1 ${compact ? "p-3 sm:p-4" : "p-5 sm:p-6"}`}>
        <span className="label text-[11px]">{label}</span>
        <span className={`text-[13px] leading-snug ${tone === "ink" ? "text-[#e9dfe2]" : "text-mute"} ${compact ? "hidden sm:block" : ""}`}>Photo to come: {line}</span>
      </div>
    </div>
  );
}
