import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { TitleTape } from "../components/Tape";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-4 py-16 sm:py-24">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <h1>That page isn't here</h1>
      <TitleTape />
      <p className="t-lede measure pt-1">It may have moved. Start with the range, or walk in and ask.</p>
      <div className="flex flex-wrap gap-3"><Link to="/shop/all" className="btn btn-ink">Shop the range</Link><Link to="/visit" className="btn btn-ghost">Find the shop</Link></div>
    </section>
  );
}
