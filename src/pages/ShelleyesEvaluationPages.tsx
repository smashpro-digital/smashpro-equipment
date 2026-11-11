import { PageFrame } from '../components/PageFrame';
import { ButtonLink } from '../components/ButtonLink';
import '../styles/shelleyes-evaluation.css';

const evaluationReference = 'SP-MED-S7P-EVAL-26';
const evaluationUrl = '/equipment/shelleyes-s7p-evaluation.html';
const studyUrl = 'https://smashpro.app/smashpro-live-view-contractor-camera-case-study/';

const capabilities = [
  { label: 'Connectivity', value: 'LTE / Wi-Fi 6 / Bluetooth 5.4', note: 'Manufacturer-reported. Carrier support is unconfirmed.' },
  { label: 'Streaming', value: 'RTMP / RTMPS', note: 'Manufacturer-reported protocol support; integration not yet tested.' },
  { label: 'Local evidence', value: '32 GB sample configuration', note: 'Recording, timestamp and GPS workflows require validation.' },
  { label: 'Integration', value: 'Third-party API proposed', note: 'Documentation, licensing, security and activation remain open questions.' },
];

const questions = [
  'Will the US variant connect reliably to the selected LTE carrier and meet required device certifications?',
  'Can a SmashPro-controlled endpoint receive, authorize and terminate a secure low-latency feed?',
  'What are the full API, device, connectivity and ongoing support requirements?',
  'Can recordings survive a dropped signal, keep accurate timestamps and follow a defined retention policy?',
  'Will mounting, battery life, weather exposure and heat be practical across a real service shift?',
  'How will worker consent, customer permission, visible recording status and restricted access work?',
];

const tests = [
  { number: '01', name: 'Secure live view', focus: 'Authorized operator-to-client feed, session start/stop, latency and transport security.', result: 'Not tested' },
  { number: '02', name: 'Real-world connectivity', focus: 'LTE carrier compatibility, indoor/outdoor coverage and reconnection.', result: 'Not tested' },
  { number: '03', name: 'Offline continuity', focus: 'Local capture during outages, timestamps, GPS and safe recovery.', result: 'Not tested' },
  { number: '04', name: 'Operator comfort', focus: 'Mount security, accessory fit, battery and temperature during extended jobs.', result: 'Not tested' },
  { number: '05', name: 'Permission by design', focus: 'Worker opt-in, customer authorization, private zones, access logs and retention.', result: 'Not tested' },
  { number: '06', name: 'Contractor onboarding', focus: 'Device setup, access revocation, support and practical fleet administration.', result: 'Not tested' },
];

function StudyNav({ current }: { current: 'passport' | 'study' }) {
  return <nav className="s7p-nav" aria-label="Evaluation pages">
    <a aria-current={current === 'passport' ? 'page' : undefined} href={evaluationUrl}>Evaluation passport</a>
    <a aria-current={current === 'study' ? 'page' : undefined} href={studyUrl}>Field study</a>
  </nav>;
}

function StageNotice() {
  return <div className="s7p-stage" role="status">
    <span className="s7p-stage__dot" aria-hidden="true" />
    <div><strong>Research / Pre-acquisition</strong><p>Manufacturer dialogue is underway. SmashPro has not purchased, received, deployed or field-tested this camera.</p></div>
  </div>;
}

export function ShelleyesEvaluationPassportPage() {
  return <PageFrame><div className="s7p-page">
    <div className="shell s7p-topline"><a href="/equipment/">Equipment</a><span>/</span><a href="/equipment/sp-med-cam-001.html">Field media</a><span>/</span><span>S7+ evaluation</span></div>
    <section className="s7p-hero shell" aria-labelledby="s7p-passport-title">
      <div className="s7p-hero__content"><p className="eyebrow">SmashPro Field Media / Candidate 01</p><p className="s7p-kicker">Shelleyes · S7+ 4G LTE Body Camera</p><h1 id="s7p-passport-title">The next view<br/><em>of field work.</em></h1>
        <p className="s7p-lead">We are evaluating whether a wearable LTE camera could power a permission-based Live View experience for SmashPro Home Services and future contractor teams.</p>
        <div className="s7p-actions"><ButtonLink href={studyUrl}>Explore the field study</ButtonLink><ButtonLink href="#evaluation-questions" variant="outline">See open questions</ButtonLink></div>
      </div>
      <aside className="s7p-identity" aria-label="Evaluation identity"><span className="s7p-identity__label">Evaluation reference</span><strong>{evaluationReference}</strong><span>Research record · 2026</span><div className="s7p-identity__divider"/><span className="s7p-identity__label">Lifecycle</span><p>Candidate / Pre-purchase</p><span className="s7p-identity__label">Fleet asset</span><p>Not assigned</p><span className="s7p-identity__label">Permanent passport ID</span><p>Not assigned</p></aside>
    </section>
    <div className="shell"><StageNotice/><StudyNav current="passport"/></div>
    <section className="s7p-section shell" aria-labelledby="s7p-why"><p className="eyebrow">01 / The use case</p><h2 id="s7p-why">More than a body camera.</h2><p className="s7p-intro">Imagine a customer choosing to see progress while an authorized contractor is on site. The goal is clearer communication and documentation with explicit permission, not constant recording or workforce surveillance.</p><div className="s7p-three"><article><span>01</span><h3>Visibility on demand</h3><p>A time-limited live session available only to people authorized for that job.</p></article><article><span>02</span><h3>Field documentation</h3><p>Site context, progress evidence and incident review under an agreed retention policy.</p></article><article><span>03</span><h3>Operator-first design</h3><p>Comfortable mounting, simple controls and the ability to stop or pause recording.</p></article></div></section>
    <section className="s7p-band"><div className="s7p-section shell"><p className="eyebrow">02 / Candidate specification</p><h2>What the manufacturer reports.</h2><p className="s7p-intro">These specifications are preliminary supplier information, not independent SmashPro performance claims or evidence of carrier certification.</p><div className="s7p-spec-grid">{capabilities.map(item=><article key={item.label}><span>{item.label}</span><h3>{item.value}</h3><p>{item.note}</p></article>)}</div><p className="s7p-footnote">The supplier also lists LTE-FDD bands B2/B3/B4/B5/B7/B8/B28/B66, GPS and timestamped recording. Actual US carrier activation and feature behavior remain unverified. A self-hosted workflow has been discussed, but API access and terms have not been finalized.</p></div></section>
    <section id="evaluation-questions" className="s7p-section shell"><p className="eyebrow">03 / Engineering gate</p><h2>Questions before acquisition.</h2><ol className="s7p-questions">{questions.map((question,index)=><li key={question}><span>{String(index+1).padStart(2,'0')}</span>{question}</li>)}</ol></section>
    <section className="s7p-section shell s7p-close"><div><p className="eyebrow">04 / Evidence status</p><h2>Documenting the decision.</h2><p>Manufacturer dialogue is recorded. Technical validation, sample acquisition, commissioning and real-world trials are still outstanding. This page will be updated as evidence is collected.</p></div><div className="s7p-evidence"><div><strong>Manufacturer discussion</strong><span className="s7p-pill s7p-pill--inprogress">In progress</span></div><div><strong>Engineering review</strong><span className="s7p-pill">Open</span></div><div><strong>Device received</strong><span className="s7p-pill">No</span></div><div><strong>Field validation</strong><span className="s7p-pill">Not started</span></div></div></section>
    <section className="s7p-endcap"><div className="shell"><p className="eyebrow">Follow the evaluation</p><h2>From candidate to<br/>proven field workflow.</h2><p>See the test plan, transparent findings and what a future client pilot could include.</p><ButtonLink href={studyUrl}>View the field study</ButtonLink><p className="s7p-disclaimer">This is an independent SmashPro evaluation, not an endorsement, a confirmed manufacturer partnership, or an available commercial service. No supplier logo, image or field-test result is represented here.</p></div></section>
  </div></PageFrame>;
}

export function ShelleyesFieldStudyPage() {
  return <PageFrame><div className="s7p-page">
    <div className="shell s7p-topline"><a href="/equipment/">Equipment</a><span>/</span><span>Live View field study</span></div>
    <section className="s7p-hero s7p-hero--study shell" aria-labelledby="s7p-study-title"><div className="s7p-hero__content"><p className="eyebrow">SmashPro / Technology Field Study</p><p className="s7p-kicker">Working concept · No active pilot</p><h1 id="s7p-study-title">See the work.<br/><em>Stay in the loop.</em></h1><p className="s7p-lead">Could a field technician share a secure, temporary first-person view with a homeowner or property manager? We're testing the concept before promising the service.</p><div className="s7p-actions"><ButtonLink href="#study-method">View evaluation plan</ButtonLink><ButtonLink href={evaluationUrl} variant="outline">Camera evaluation passport</ButtonLink></div></div><aside className="s7p-study-card"><span>THE BIG QUESTION</span><p>Can real-time visibility make field service clearer, safer and easier to manage—without giving up privacy or operator control?</p><strong>Proposed, not yet proven.</strong></aside></section>
    <div className="shell"><StageNotice/><StudyNav current="study"/></div>
    <section className="s7p-section shell"><p className="eyebrow">01 / Why we are exploring it</p><h2>Useful visibility.<br/>Clear boundaries.</h2><p className="s7p-intro">Photos and completion updates are valuable, but some projects benefit from seeing work as it happens. SmashPro is exploring a job-scoped Live View option where the contractor and customer agree in advance when a session is appropriate.</p><div className="s7p-three"><article><span>HOMEOWNERS</span><h3>Understand the progress</h3><p>Opt in to a scheduled view or receive a verified job update without staying on site.</p></article><article><span>PROPERTY TEAMS</span><h3>Reduce uncertainty</h3><p>Review approved on-site context across properties while keeping access job-specific.</p></article><article><span>CONTRACTORS</span><h3>Work with control</h3><p>Start and end sessions deliberately; protect personal time, bystanders and private spaces.</p></article></div></section>
    <section className="s7p-band" id="study-method"><div className="s7p-section shell"><p className="eyebrow">02 / Evaluation roadmap</p><h2>What we need to prove.</h2><p className="s7p-intro">A manufacturer-supplied S7+ LTE camera is one candidate. Testing has not begun, and these entries are hypotheses—not results.</p><div className="s7p-test-list">{tests.map(test=><article key={test.number}><span className="s7p-test-number">{test.number}</span><div><h3>{test.name}</h3><p>{test.focus}</p></div><span className="s7p-pill">{test.result}</span></article>)}</div></div></section>
    <section className="s7p-section shell"><p className="eyebrow">03 / Safeguards first</p><h2>Privacy is part of the product.</h2><div className="s7p-three"><article><span>CONSENT</span><h3>Every session is intentional</h3><p>Worker participation and customer permission must be explicit, revocable and recorded. No automatic always-on feed.</p></article><article><span>ACCESS</span><h3>Only the right people</h3><p>Job-specific permissions, secure transport, access logging and a defined end to each viewing session.</p></article><article><span>RETENTION</span><h3>Keep only what's needed</h3><p>Clear retention and deletion rules, with no public live links and protections for private areas and bystanders.</p></article></div><p className="s7p-footnote">Separate wellness concepts, such as optional contractor check-ins or wearable telemetry, would require their own opt-in, privacy review and validation. A camera cannot determine hydration needs or diagnose a medical issue.</p></section>
    <section className="s7p-section shell s7p-close"><div><p className="eyebrow">04 / Decision standard</p><h2>From field test<br/>to client pilot.</h2><p>If the equipment passes connectivity, usability, security, consent and cost-of-ownership review, SmashPro can design a limited client pilot. A service offering, rollout timeline and pricing will only be announced after those gates.</p></div><div className="s7p-evidence"><div><strong>Concept defined</strong><span className="s7p-pill s7p-pill--inprogress">Yes</span></div><div><strong>Supplier dialogue</strong><span className="s7p-pill s7p-pill--inprogress">Active</span></div><div><strong>Bench test</strong><span className="s7p-pill">Pending</span></div><div><strong>Customer pilot</strong><span className="s7p-pill">Not offered</span></div></div></section>
    <section className="s7p-endcap"><div className="shell"><p className="eyebrow">SmashPro Live View / Exploratory</p><h2>Have a workflow<br/>worth exploring?</h2><p>We're interested in learning where homeowner, property-management and commercial teams need better jobsite visibility. Tell us what a useful, permission-based pilot would need to solve.</p><ButtonLink href="mailto:smashprohq@gmail.com?subject=SmashPro%20Live%20View%20pilot%20interest">Discuss pilot requirements</ButtonLink><p className="s7p-disclaimer">Research only. Live View is not currently offered for sale or deployment. Shelleyes is a device candidate, not a confirmed sponsor or reseller relationship. Evaluation reference: {evaluationReference}.</p></div></section>
  </div></PageFrame>;
}
