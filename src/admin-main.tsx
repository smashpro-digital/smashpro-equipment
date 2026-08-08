import { StrictMode, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { equipment } from "./data/equipment";
import "./styles/global.css";
import "./styles/admin.css";

const API_URL = import.meta.env.VITE_FLEET_ADMIN_API_URL as string | undefined;

function PassportAdmin() {
  const [assetId, setAssetId] = useState(equipment[0].fleetId);
  const [recordType, setRecordType] = useState("upgrade");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    if (!API_URL) { setMessage("Admin API is not configured. The record was not stored."); return; }
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${API_URL}/equipment/${encodeURIComponent(assetId)}/${recordType}`, { method: "POST", credentials: "include", body: form });
    setMessage(response.ok ? "Passport record saved." : "The server rejected the record. Nothing was published.");
  }
  return <main className="admin-shell"><header><p className="eyebrow">Private operations</p><h1>SP Fleet Passport Admin</h1><p>Authenticated server storage is required. Private costs, receipts, invoices, and ownership records must never be returned by the public passport endpoint.</p></header>
    <form onSubmit={submit}><section><h2>Record destination</h2><label>Equipment<select value={assetId} onChange={(e) => setAssetId(e.target.value)}>{equipment.map((item) => <option key={item.fleetId}>{item.fleetId}</option>)}</select></label><label>Record type<select name="record_type" value={recordType} onChange={(e) => setRecordType(e.target.value)}><option value="upgrade">Installed upgrade</option><option value="factory-option">Factory option</option><option value="service">Maintenance record</option><option value="attachment">Attachment</option><option value="media">Media / YouTube</option><option value="document">Manual / spec sheet / warranty</option><option value="purchase">Private purchase record</option><option value="receipt">Private receipt / invoice</option><option value="timeline">Timeline event</option></select></label></section>
      <section><h2>Core record</h2><label>Name / title<input name="name" required /></label><label>Category<input name="category" /></label><label>Description<textarea name="description" rows={4} /></label><label>Effective / install date<input name="effective_date" type="date" /></label><label>Status<select name="status"><option>planned</option><option>ordered</option><option>in-transit</option><option>installed</option><option>completed</option><option>removed</option></select></label><label>Milestone<select name="milestone"><option value="">Not a milestone</option><option value="first-machine">First Machine</option><option value="first-rental">First Rental</option><option value="first-100-hours">First 100 Hours</option><option value="first-revenue">First Revenue</option><option value="first-state">First State Worked</option><option value="first-youtube">First YouTube Episode</option><option value="first-major-upgrade">First Major Upgrade</option><option value="500-hours">500 Hours</option><option value="1000-hours">1,000 Hours</option></select></label><label className="check"><input name="public_display" type="checkbox" value="1" /> Approved for public display</label></section>
      <section><h2>Installation & documentation</h2><label>Installed by<input name="installed_by" /></label><label>Vendor<input name="vendor" /></label><label>Vendor / Amazon link<input name="vendor_url" type="url" /></label><label>YouTube link<input name="youtube_url" type="url" /></label><label>Video role<select name="video_role"><option>installation</option><option>walkaround</option><option>review</option><option>maintenance</option><option>short</option><option>build</option></select></label><label>Warranty<input name="warranty" /></label><label>Files<input name="files" type="file" multiple accept="image/*,.pdf,.doc,.docx" /></label></section>
      <section className="private-fields"><h2>Private financial & ROI ledger</h2><p>These values are admin-only and excluded from public API serializers.</p><label>Purchase cost<input name="purchase_cost" type="number" min="0" step="0.01" /></label><label>Labor cost<input name="labor_cost" type="number" min="0" step="0.01" /></label><label>Shipping actual<input name="shipping_actual" type="number" min="0" step="0.01" /></label><label>Tax actual<input name="tax_actual" type="number" min="0" step="0.01" /></label><label>Customs actual<input name="customs_actual" type="number" min="0" step="0.01" /></label><label>Estimated added value<input name="estimated_added_value" type="number" min="0" step="0.01" /></label><label>Current replacement cost<input name="current_replacement_cost" type="number" min="0" step="0.01" /></label><label>Estimated market value<input name="estimated_market_value" type="number" min="0" step="0.01" /></label><label>Rental revenue generated<input name="rental_revenue_generated" type="number" min="0" step="0.01" /></label><label>Maintenance investment<input name="maintenance_investment" type="number" min="0" step="0.01" /></label></section>
      <label>Notes<textarea name="notes" rows={5} /></label><button type="submit">Save private passport record</button>{message ? <p className="admin-message" role="status">{message}</p> : null}
    </form></main>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><PassportAdmin /></StrictMode>);
