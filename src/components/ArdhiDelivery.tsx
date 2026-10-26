import { ardhiDelivery, ardhiDeliveryStages, ardhiDeliveryVideos, ardhiMediaSlots, ardhiMediaCollections } from '../data/ardhiDelivery';
import { ardhiPortArrival } from '../data/ardhiPortArrival';
import type { Equipment } from '../types/equipment';
import { ArdhiHomecoming } from './ArdhiHomecoming';
import { EquipmentWatch } from './EquipmentWatch';
import '../styles/ardhi-delivery.css';

export function ArdhiDeliveryJourney() {
  return <section id="journey" className="section shell ardhi-delivery" aria-labelledby="ardhi-delivery-title">
    <header><p className="eyebrow">SP-ARDHI-26 / Verified delivery</p><h2 id="ardhi-delivery-title">Delivered.<br />The next chapter begins.</h2><p>{ardhiDelivery.summary}</p></header>
    <div className="ardhi-delivery-proof"><p className="eyebrow">Delivered / Receiving inspection</p><dl>
      <div><dt>Final-mile delivery</dt><dd><time dateTime={ardhiDelivery.date}>October 26, 2026</time> · Complete</dd></div>
      <div><dt>Carrier</dt><dd>{ardhiDelivery.carrier}</dd></div><div><dt>PRO</dt><dd>{ardhiDelivery.pro}</dd></div>
      <div><dt>Freight origin</dt><dd>{ardhiDelivery.origin}</dd></div><div><dt>Crated weight</dt><dd>{ardhiDelivery.cratedWeight}</dd></div>
      <div><dt>Manufacturer package dimensions</dt><dd>{ardhiPortArrival.package.dimensions}</dd></div>
    </dl><p>{ardhiDelivery.evidence}</p><a href="#history-future-5">Read the delivery event</a></div>
    <ol className="ardhi-delivery-stages" aria-label="Delivery and receiving milestones">{ardhiDeliveryStages.map(stage => <li key={stage.title} className={`is-${stage.state}`} aria-current={stage.state === 'current' ? 'step' : undefined}><small>{stage.state === 'current' ? 'Current chapter' : stage.state === 'complete' ? 'Complete' : 'Pending'}</small><a href={stage.href}>{stage.title}</a><p>{stage.detail}</p></li>)}</ol>
    <p className="flagship-note">Crated weight is not operating weight. Separate customs and warehouse dates remain unverified. No delivery address or GPS location is published. Arrival does not establish operational or rental readiness.</p>
  </section>;
}

export function ArdhiDeliveryMedia({ item }: { item: Equipment }) {
  const unboxingPhotos = item.gallery.filter(photo => photo.group === 'commissioning' && photo.kind !== 'video');
  const photos = item.gallery.filter(photo => photo.group === 'delivery' && photo.kind !== 'video');
  return <section className="section shell ardhi-delivery" id="delivery-media" aria-labelledby="ardhi-delivery-media-title">
    <header><p className="eyebrow">Arrival / Unboxing / Commissioning</p><h2 id="ardhi-delivery-media-title">From crate to first start.</h2><p>Follow ARDHI's arrival through reviewed photographs and SmashPro HQ videos. Crate opening is documented; receiving inspection and commissioning remain pending.</p></header>
    <h3>Delivery photo gallery</h3>
    <div className="ardhi-delivery-media-grid">{photos.length ? photos.map(photo => <figure key={photo.id ?? photo.src}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /><figcaption>{photo.caption}</figcaption></figure>) : <article className="ardhi-media-pending"><p className="eyebrow">Photograph pending publication</p><h4>Shipping crate on the ground</h4><p>The delivery photograph is confirmed by the owner but is not yet available in this public gallery. It will appear after upload and privacy review.</p></article>}</div>
    <div id="unboxing-photos"><h3>Crate disassembly / Unboxing photos</h3><p>Crate opening and panel removal documented October 26, 2026. ARDHI remains on its shipping base; inspection results and operational readiness are not verified.</p>
      <div className="ardhi-delivery-media-grid">{unboxingPhotos.map(photo => <figure key={photo.id ?? photo.src}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /><figcaption>{photo.caption}</figcaption></figure>)}</div>
    </div>
    <div id="watch-ardhi"><h3>Watch ARDHI</h3><EquipmentWatch videos={ardhiDeliveryVideos} equipmentId={item.fleetId} channelUrl="https://www.youtube.com/@SmashProHQ" emptyMessage="Unboxing and first-start episodes are pending. Verified Shorts and full-length videos will appear here after publication." /></div>
    <div className="ardhi-delivery-media-grid">{ardhiMediaSlots.map(slot => <article className="ardhi-media-pending" key={slot.id}><p className="eyebrow">AWAITING MEDIA</p><h4>{slot.title}</h4><p>{slot.detail}</p></article>)}</div>
    <details className="flagship-disclosure"><summary>Media collections / evidence still needed</summary><p>SmashPro HQ is the publishing channel. Records reference existing media IDs; no additional uploads or publications are simulated.</p><div className="ardhi-delivery-media-grid">{ardhiMediaCollections.map(collection => <article key={collection.id}><h4>{collection.title}</h4><p>{collection.mediaIds.length ? <a href={collection.id === 'delivery' ? '#delivery-media' : '#unboxing-photos'}>Reviewed photographs available</a> : 'AWAITING MEDIA'}</p><ul>{collection.slots.map(slot => <li key={slot}>{slot}</li>)}</ul></article>)}</div></details>
    <ArdhiHomecoming />
    <nav className="ardhi-delivery-links" aria-label="Follow ARDHI across SmashPro"><a href="/media/">Media Center</a><a href="/equipment/#fleet">Equipment Showcase</a><a href="/">SmashPro stories</a><a id="check-in" href="/k/ARDHI26-K01/">Operator access / sign-in required</a><a href="/dashboard/">Digital HQ · sign-in required</a></nav>
  </section>;
}
