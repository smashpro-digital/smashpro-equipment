import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><Link className="brand" to="/"><span className="brand-mark">SP</span><span>SmashPro <small>Fleet Equipment</small></span></Link><p className="footer-note">Professional equipment. Clear standards. Work-forward support.</p></div>
        <div><h2>Showroom</h2><a href="/equipment/#fleet">Equipment</a><a href="/equipment/#attachments">Attachments</a><a href="/equipment/#rental-process">Rental Process</a></div>
        <div><h2>Network</h2><a href="/equipment/#contractors">Contractors</a><a href="https://smashpro.app/contact">Support</a><a href="https://smashpro.app/">Main SmashPro Site</a></div>
        <div><h2>Legal</h2><p>Availability, specifications, requirements, and supported attachments may change. Confirm current details before planning work.</p></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} SmashPro Fleet</span><span>Power. Precision. Purpose.</span></div>
    </footer>
  );
}
