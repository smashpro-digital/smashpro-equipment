import { Link } from "react-router-dom";
import { PageFrame } from "../components/PageFrame";

export function NotFoundPage() { return <PageFrame><section className="not-found shell"><p className="eyebrow">404 / Equipment route</p><h1>This path is not in the fleet.</h1><p>Return to the official SmashPro Equipment showroom.</p><Link className="button button--primary" to="/">View Equipment <span aria-hidden="true">→</span></Link></section></PageFrame>; }
