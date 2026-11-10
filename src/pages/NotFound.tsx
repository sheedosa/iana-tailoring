import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Title } from "../components/Layout";

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" description="That page is not in the catalogue." noindex />
      <Title title="That page is not in the catalogue" line="It may have moved. Begin again with the departments, or come in and ask us.">
        <div className="flex flex-wrap justify-center gap-3 pt-8"><Link to="/shop/all" className="btn">Open the catalogue</Link><Link to="/visit" className="btn btn-line">Find the shop</Link></div>
      </Title>
    </>
  );
}
