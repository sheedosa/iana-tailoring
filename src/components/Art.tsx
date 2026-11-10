import type { CSSProperties, ReactNode } from "react";
import { img, type Art, type Product } from "../lib/store";
import { garmentVT } from "./VLink";

// The catalogue's drawings: one hand for every piece. Each garment is drawn on a 300 x 400 plate in a single
// line weight, on a dressmaker's stand or a hanger, with ruled shading in the folds. A piece keeps its drawing
// until its photograph is taken.
const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.15, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const B = { ...L, fill: "var(--plate, #d8e2dc)" };          // a body: covers what stands behind it
const H = { fill: "url(#eng-h)", stroke: "none" };          // ruled shading
const K = { fill: "url(#eng-k)", stroke: "none" };          // knit, lace and tulle
const Mirror = ({ children }: { children: ReactNode }) => <>{children}<g transform="matrix(-1 0 0 1 300 0)">{children}</g></>;

const Defs = () => (
  <defs>
    <pattern id="eng-h" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="3.2" stroke="currentColor" strokeWidth="0.75" /></pattern>
    <pattern id="eng-k" width="4" height="4" patternUnits="userSpaceOnUse"><line x1="0" y1="2" x2="4" y2="2" stroke="currentColor" strokeWidth="0.6" /></pattern>
  </defs>
);

/** The stand: a neck cap and finial above, a pole and foot below the hem. */
const Stand = ({ hem = 300, foot = true }: { hem?: number; foot?: boolean }) => (
  <>
    <path {...L} d="M150 30 V37" /><circle {...L} cx="150" cy="27" r="3" />
    <path {...B} d="M137 41 Q150 34 163 41 L161 60 H139 Z" />
    <path {...L} d="M137 41 Q150 47 163 41" />
    {foot && <path {...L} d={`M150 ${hem} V368 M150 368 L118 386 M150 368 L182 386 M150 368 V388 M112 388 H124 M176 388 H188 M144 390 H156`} />}
  </>
);
const Hanger = ({ y = 46 }: { y?: number }) => <path {...L} d={`M150 ${y} V${y - 12} Q150 ${y - 24} 159 ${y - 24} Q168 ${y - 24} 168 ${y - 16}`} />;
const Shirt = ({ tie = 172 }: { tie?: number }) => (
  <>
    <path {...L} d="M139 59 L150 80 L161 59" />
    <path {...L} d={`M145 78 H155 L153 88 H147 Z M147 88 L144 ${tie - 10} L150 ${tie} L156 ${tie - 10} L153 88`} />
    <path {...H} d={`M150 88 H153 L156 ${tie - 10} L150 ${tie} Z`} />
  </>
);

/* Jacket: the outline of both halves, then the pieces that mirror. */
const JACKET_BODY = "M139 59 L128 63 L94 82 Q84 87 82 102 L74 256 L98 262 L99 260 L100 296 Q122 306 137 304 Q149 301 150 284 Q151 301 163 304 Q178 306 200 296 L201 260 L202 262 L226 256 L218 102 Q216 87 206 82 L172 63 L161 59 Z";
const jacket = (
  <>
    <Stand hem={300} />
    <path {...B} d={JACKET_BODY} />
    <path {...B} stroke="none" d="M139 59 L150 182 L161 59 Z" />
    <Shirt />
    <Mirror>
      <path {...L} d="M139 59 L149 181 M128 63 L117 99 L126 105 L112 113 L149 181 M126 105 L140 88" />
      <path {...L} d="M98 262 L106 130 M75 244 L99 250 M109 232 L135 230 V238 L109 240 Z M123 150 L121 229" />
      <path {...H} d="M98 262 L106 130 L111 146 L104 260 Z M112 113 L149 181 L148 188 L110 119 Z" />
      <circle {...L} cx="79.5" cy="238" r="1.3" /><circle {...L} cx="80" cy="231" r="1.3" /><circle {...L} cx="80.5" cy="224" r="1.3" />
    </Mirror>
    <path {...L} d="M150 182 V284 M167 141 L188 138 M167 144 L188 141" />
    <circle {...L} cx="150" cy="192" r="2.4" /><circle {...L} cx="150" cy="218" r="2.4" />
  </>
);

const threePiece = (
  <>
    <Stand hem={300} />
    <path {...B} d={JACKET_BODY.replace("Q149 301 150 284 Q151 301 164 304", "L132 300 L140 268 L150 280 L160 268 L168 300 L164 304")} />
    <path {...B} stroke="none" d="M139 59 L150 150 L161 59 Z" />
    <Shirt tie={148} />
    <Mirror>
      {/* waistcoat */}
      <path {...L} d="M139 59 L150 150 M133 196 L140 268 L150 280 M134 226 L146 224 M134 229 L146 227" />
      {/* jacket, open */}
      <path {...L} d="M128 63 L116 99 L125 105 L110 113 L131 192 L132 300" />
      <path {...L} d="M98 262 L106 130 M75 244 L99 250 M108 234 L127 232 V240 L108 242 Z" />
      <path {...H} d="M98 262 L106 130 L111 146 L104 260 Z M110 113 L131 192 L132 300 L138 268 L135 196 L139 150 L139 59 L134 110 Z" />
      <circle {...L} cx="79.5" cy="238" r="1.3" /><circle {...L} cx="80" cy="231" r="1.3" /><circle {...L} cx="80.5" cy="224" r="1.3" />
    </Mirror>
    <path {...L} d="M150 150 V280" />
    {[166, 188, 210, 232, 254].map((y) => <circle key={y} {...L} cx="150" cy={y} r="2.1" />)}
  </>
);

const trousers = (
  <>
    <Hanger y={52} />
    <path {...L} d="M100 52 H200 M100 52 V60 M200 52 V60" />
    <path {...B} d="M106 60 H194 V74 L204 352 H160 L150 132 L140 352 H96 L106 74 Z" />
    <path {...L} d="M106 74 H194 M150 74 V122 Q150 132 142 132 M124 60 V74 M176 60 V74" />
    <Mirror>
      <path {...L} d="M112 76 L124 104 M122 76 L116 352" />
      <path {...H} d="M150 132 L140 352 H131 L146 122 L150 122 Z" />
      <path {...L} d="M112 55 h8 v8 h-8 z" />
    </Mirror>
    <circle {...L} cx="150" cy="67" r="2" />
  </>
);

const shirt = (
  <>
    <path {...B} d="M82 104 H218 V336 H82 Z" />
    <path {...H} d="M82 336 H218 V104 H224 V342 H88 Z" />
    <path {...B} d="M118 104 L110 80 Q150 64 190 80 L182 104 L150 140 Z" />
    <path {...L} d="M118 104 L150 140 L182 104 M126 84 Q150 76 174 84 M144 144 V336 M156 144 V336 M82 262 H144 M156 262 H218 M82 284 H144 M156 284 H218" />
    {[170, 204, 238, 310].map((y) => <circle key={y} {...L} cx="150" cy={y} r="2.1" />)}
    {/* the bow tie */}
    <path {...B} d="M144 133 H156 V149 H144 Z" />
    <Mirror><path {...B} d="M144 136 L120 126 V156 L144 146 Z" /><path {...H} d="M144 136 L132 131 V151 L144 146 Z" /></Mirror>
  </>
);

const tie = (
  <>
    <Mirror><path {...B} d="M141 70 L112 36 L124 28 L150 60 Z" /></Mirror>
    <path {...B} d="M139 68 H161 L157 92 H143 Z" />
    <path {...B} d="M143 92 L132 352 H168 L157 92 Z" />
    <path {...K} d="M143 92 L132 352 H168 L157 92 Z" />
    <path {...H} d="M150 92 H157 L168 352 H156 Z" />
    <path {...L} d="M141 76 H159 M142 84 H158" />
  </>
);

const prom = (
  <>
    <Stand foot={false} />
    <path {...L} d="M139 60 Q122 62 118 78 M161 60 Q178 62 182 78" />
    <path {...B} d="M134 62 L130 96 Q128 128 137 162 Q112 262 62 370 Q130 388 196 380 Q240 390 280 380 Q212 300 163 162 Q172 128 170 96 L166 62 L164 62 L162 92 Q156 104 150 96 Q144 104 138 92 L136 62 Z" />
    <path {...L} d="M137 162 Q150 168 163 162 M143 165 Q128 270 104 378 M150 166 Q150 280 152 384 M157 165 Q180 270 222 384 M150 96 V118" />
    <path {...H} d="M143 165 Q128 270 104 378 L122 381 Q138 270 146 166 Z M157 165 Q180 270 222 384 L244 386 Q200 290 161 164 Z M163 162 Q172 128 170 96 L164 100 Q166 130 158 163 Z" />
  </>
);

const bridal = (
  <>
    <Stand foot={false} />
    <path {...B} d="M130 66 Q116 70 112 84 L124 90 L128 100 Q124 128 136 152 Q84 250 30 366 Q150 396 270 366 Q216 250 164 152 Q176 128 172 100 L176 90 L188 84 Q184 70 170 66 Q150 82 130 66 Z" />
    <path {...K} d="M130 66 Q116 70 112 84 L124 90 L128 100 Q124 128 136 152 Q150 158 164 152 Q176 128 172 100 L176 90 L188 84 Q184 70 170 66 Q150 82 130 66 Z" />
    <path {...L} d="M136 152 Q150 158 164 152 M128 100 q5.5 6 11 0 q5.5 6 11 0 q5.5 6 11 0 q5.5 6 11 0" />
    <path {...L} d="M58 306 Q150 330 242 306 M44 336 Q150 362 256 336 M140 156 Q112 260 84 380 M150 157 V389 M160 156 Q188 260 216 380" />
    <path {...H} d="M140 156 Q112 260 84 380 L104 384 Q126 262 146 157 Z M160 156 Q188 260 216 380 L236 376 Q204 250 164 153 Z" />
  </>
);

const midi = (
  <>
    <Stand hem={304} />
    <path {...B} d="M136 60 L116 68 L96 104 L114 114 L124 98 Q126 124 124 150 L96 296 Q150 312 204 296 L176 150 Q174 124 176 98 L186 114 L204 104 L184 68 L164 60 L150 92 Z" />
    <path {...L} d="M136 60 L170 150 M164 60 L150 92 M124 150 Q150 158 176 150 M124 144 Q150 152 176 144 M170 148 Q186 160 180 186 M170 148 Q168 170 174 190" />
    <path {...L} d="M132 154 L116 300 M150 156 L150 305 M166 154 L184 300" />
    <path {...H} d="M150 156 V305 L164 303 L158 155 Z M136 60 L170 150 L166 152 L130 66 Z M96 104 L114 114 L116 108 L100 98 Z" />
  </>
);

const party = (
  <>
    <Stand hem={300} />
    <path {...B} d="M134 60 Q126 64 122 76 L126 110 Q124 132 130 150 Q98 200 78 288 Q150 310 222 288 Q202 200 170 150 Q176 132 174 110 L178 76 Q174 64 166 60 Q150 78 134 60 Z" />
    <path {...K} d="M130 150 Q98 200 78 288 Q150 310 222 288 Q202 200 170 150 Z" />
    <path {...L} d="M130 150 Q150 156 170 150 M128 142 Q150 148 172 142 M106 204 Q150 220 194 204 M90 248 Q150 268 210 248 M168 146 q12 6 10 22 M168 146 q2 12 -2 22" />
    <path {...H} d="M150 154 Q170 152 170 150 Q202 200 222 288 Q200 296 184 298 Q176 210 150 154 Z" />
  </>
);

const jumpsuit = (
  <>
    <Stand hem={360} foot={false} />
    <path {...B} d="M136 60 L118 68 L104 100 L120 108 L126 96 Q128 124 126 150 L92 366 H144 L150 196 L156 366 H208 L174 150 Q172 124 174 96 L180 108 L196 100 L182 68 L164 60 L150 104 Z" />
    <path {...L} d="M136 60 L150 104 L164 60 M126 150 Q150 157 174 150 M126 144 Q150 151 174 144 M150 150 V196 M150 150 q-14 10 -10 34 M150 150 q8 14 4 36" />
    <Mirror><path {...L} d="M134 156 L112 366" /><path {...H} d="M150 196 L144 366 H130 L146 180 Z" /></Mirror>
  </>
);

const shopfront = (
  <>
    <path {...B} d="M30 70 H270 V372 H30 Z" />
    <path {...L} d="M30 122 H270 M30 132 H270 M46 152 H186 V330 H46 Z M116 152 V330 M206 152 H254 V372 M206 152 V372 M30 330 H186 M30 372 H270 M12 372 H288 M214 262 h6" />
    <path {...H} d="M46 152 H116 V330 H46 Z M214 162 H246 V250 H214 Z" />
    <path {...L} d="M214 162 H246 V250 H214 Z M30 70 L22 58 H278 L270 70" />
  </>
);

const DRAW: Record<Art, ReactNode> = { jacket, waistcoat: threePiece, gown: prom, bridal, dress: midi, party, jumpsuit, shirt, tie, trousers, shopfront };

/** A drawing on its Sage plate, 3:4. `small` draws a child's piece at four-fifths the scale. */
export function Engraving({ art, small = false, className = "", title }: { art: Art; small?: boolean; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 300 400" className={`aspect-[3/4] bg-sage text-green ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <Defs />
      <g transform={small ? "translate(30 68) scale(0.8)" : undefined}>{DRAW[art]}</g>
    </svg>
  );
}

/** A piece's picture in its frame: the photograph if there is one, otherwise its drawing. */
export function Picture({ p, eager = false, className = "", style }: { p: Product; eager?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`frame ${className}`} style={{ ...(p.kind === "mtm" ? {} : garmentVT(p.handle)), ...style }}>
      {p.images[0]
        ? <img src={img(p.images[0])} alt={p.title} loading={eager ? "eager" : "lazy"} width="1100" height="1366" className="aspect-[3/4] object-cover" />
        : <Engraving art={p.slot?.art ?? "jacket"} small={p.for === "kids"} title={`${p.title}, drawn`} />}
    </span>
  );
}
