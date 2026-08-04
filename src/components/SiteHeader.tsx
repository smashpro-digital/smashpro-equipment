import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  ["Equipment", "/equipment/#fleet"], ["Attachments", "/equipment/#attachments"], ["Rental Process", "/equipment/#rental-process"],
  ["For Contractors", "/equipment/#contractors"], ["Support", "https://smashpro.app/contact"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="SmashPro Equipment home"><span className="brand-mark">SP</span><span>SmashPro <small>Fleet Equipment</small></span></Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen((value) => !value)}>Menu</button>
        <div className={`nav-menu ${open ? "is-open" : ""}`} id="nav-menu">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="https://smashpro.app/contact">Request Availability</a>
        </div>
      </nav>
    </header>
  );
}
