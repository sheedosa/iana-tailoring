import type { ComponentProps, MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** A link that carries shared elements across the page change (a garment on a card becomes the garment on its page).
    Falls back to a plain link where the browser has no view transitions, on modified clicks, and under reduced motion.
    `carry` is for a page that draws the same bottle twice (the Home shelf and the finder result): the bottle inside
    this link, marked `data-carry`, takes the shared name at the moment of the click, and any other holder gives it up. */
export function VLink({ to, onClick, carry, ...rest }: ComponentProps<typeof Link> & { to: string; carry?: string }) {
  const navigate = useNavigate();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const doc = document as Doc;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (carry) {
      const name = `bottle-${carry}`;
      const own = e.currentTarget.querySelector<HTMLElement>("[data-carry]") ?? document.querySelector<HTMLElement>(`[data-carry="${carry}"]`);
      if (own) {
        document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]').forEach((el) => { if (el.style.viewTransitionName === name) el.style.viewTransitionName = "none"; });
        own.style.viewTransitionName = name;
      }
    }
    doc.startViewTransition(() => flushSync(() => navigate(to)));
  };
  return <Link to={to} onClick={go} {...rest} />;
}

/** The name a garment's picture shares on a card and on its page, so one becomes the other. */
export const garmentVT = (handle: string) => ({ viewTransitionName: `garment-${handle}` });
