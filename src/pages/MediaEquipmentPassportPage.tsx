import { useEffect, useState } from 'react';
import { PageFrame } from '../components/PageFrame';
import { ButtonLink } from '../components/ButtonLink';
import { MEDIA_API, MEDIA_ASSET, receivedMediaPassport, type MediaPassport } from '../domain/mediaEquipment';
import '../styles/media-equipment.css';

const channel = 'https://www.youtube.com/@SmashProHQ';
const disclosure = 'SmashPro participates in the AKASO Affiliate Program and may earn a commission from qualifying purchases made through affiliate links, at no additional cost to you.';
function track(event: string, passport: MediaPassport, detail: Record<string, unknown> = {}) {
  const target = window as unknown as {dataLayer?: Record<string, unknown>[]};
  target.dataLayer ??= [];
  target.dataLayer.push({event,asset_id:passport.assetId,media_property_id:passport.propertyId,campaign_id:passport.campaignId,placement:'equipment.media.sp-med-cam-001',...detail});
}

export function MediaEquipmentPassportPage() {
  const [passport, setPassport] = useState<MediaPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    let disposed=false, viewed=false; let controller: AbortController | null=null;
    let expiry: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      controller?.abort(); const active=new AbortController(); controller=active;
      const started=Date.now();const timeout=setTimeout(()=>active.abort(),5000);
      try {
        const response=await fetch(MEDIA_API,{signal:active.signal,cache:'no-store',credentials:'omit',redirect:'error',headers:{Accept:'application/json'}});
        if(!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw Error('Unavailable');
        const next=receivedMediaPassport(await response.json(),response.headers.get('date'),started);
        if(disposed || controller!==active)return;
        clearTimeout(expiry);setPassport(next);setLoading(false);
        if(next){expiry=setTimeout(()=>setPassport(null),Math.max(0,Math.min(next.validUntil,next.card?.validUntil??Infinity)-Date.now()));if(!viewed){track('media_passport_view',next);viewed=true;}}
      }catch{if(!disposed&&controller===active){clearTimeout(expiry);setPassport(null);setLoading(false);}}
      finally{clearTimeout(timeout);}
    }
    function visible(){controller?.abort();clearTimeout(expiry);setPassport(null);if(!document.hidden)void refresh();}
    void refresh();const interval=setInterval(()=>{if(!document.hidden)void refresh();},15000);
    document.addEventListener('visibilitychange',visible);
    return()=>{disposed=true;controller?.abort();clearTimeout(expiry);clearInterval(interval);document.removeEventListener('visibilitychange',visible);};
  },[]);
  const card=passport?.card;
  return <PageFrame><div className="media-passport shell">
    <nav className="media-passport__breadcrumb" aria-label="Breadcrumb"><a href="/equipment/">Equipment</a><span>/</span><span>Field Media</span></nav>
    {!passport ? <section className="section" aria-live="polite"><p className="eyebrow">SmashPro Field Media · {MEDIA_ASSET}</p><h1>{loading?'Loading equipment passport':'Equipment passport unavailable'}</h1><p>{loading?'Retrieving approved public information.':'Approved equipment information is temporarily unavailable. Please try again later.'}</p><ButtonLink href="/equipment/">Explore equipment</ButtonLink></section> : <>
      <section className="media-passport__hero" aria-labelledby="media-title">
        <div><p className="eyebrow">SmashPro Field Media · {passport.assetId}</p><p className="media-passport__product">{passport.identity.name} <span>{passport.identity.bundle}</span></p><h1 id="media-title">Capture the work.<br/><em>Own the story.</em></h1>
          <p className="media-passport__lead">Every equipment operation creates moments worth documenting. We're developing field-camera setups for equipment demonstrations, attachment changes, jobsite progress, and behind-the-scenes footage.</p>
          <p className="media-passport__status">{passport.identity.status}</p><p>{passport.identity.summary}</p>
          <div className="media-passport__actions">{card&&<ButtonLink href={card.url} sponsored onClick={e=>{if(Date.now()>=card.validUntil){e.preventDefault();setPassport(null);return;}track('media_affiliate_click',passport);}}>Shop AKASO 360</ButtonLink>}<ButtonLink href={passport.footage.length?'#field-footage':channel} external={!passport.footage.length} variant="quiet">{passport.footage.length?'Watch field footage':'Follow SmashPro Equipment'}</ButtonLink></div>
          {card&&<p className="media-passport__disclosure">{disclosure}</p>}
        </div>
        <figure className="media-passport__visual">{card?.image&&!imageFailed?<img src={card.image.url} alt={card.image.alt} width={card.image.width} height={card.image.height} onError={()=>setImageFailed(true)}/>:<div className="media-passport__image-fallback">{passport.identity.name}<small>Product imagery unavailable</small></div>}<figcaption>{card?.image&&!imageFailed?'Official AKASO product imagery':'SmashPro Field Media'}</figcaption></figure>
      </section>
      <section className="media-passport__section" aria-labelledby="operator-title"><p className="eyebrow">The operator's perspective</p><h2 id="operator-title">Your equipment is working.<br/>Is your camera?</h2><p className="media-passport__lead">Everyday work can become a useful demonstration, customer update, training resource, or field story. Positioning a camera thoughtfully helps preserve those moments.</p><div className="media-passport__grid">{[['Document the process','Mini skid steer operation, attachment changes, and loading or unloading.'],['Show the progress','Landscaping, before-and-after documentation, and jobsite updates.'],['Share what you learn','Equipment inspections, maintenance demonstrations, and setup decisions.']].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><ButtonLink href="#operator-kit" variant="quiet">Explore operator camera setups</ButtonLink></section>
      <section className="media-passport__section" id="microfab-accessories" aria-labelledby="microfab-title"><p className="eyebrow">SmashPro MicroFab</p><h2 id="microfab-title">Built for the field.</h2><p className="media-passport__lead">We're exploring accessories around the practical challenges of documenting equipment operations.</p>
        {passport.accessories.length?<div className="media-passport__grid">{passport.accessories.map(a=><article key={a.product_id}><p className="eyebrow">{a.prototype_status}</p><h3>{a.name}</h3><p>{a.description}</p><p>{a.product_id}{a.revision?` · Revision ${a.revision}`:''}</p>{a.material&&<p>{a.material}</p>}</article>)}</div>:<><p>Proposed development categories — no fabricated or tested products are being offered.</p><ul className="media-passport__concepts"><li>Equipment camera mounting adapters</li><li>Protective camera storage</li><li>Cable-management clips</li><li>Tripod and mounting accessories</li><li>Field-media organization</li><li>Operator camera mounts</li></ul></>}
        <ButtonLink href="/equipment/sp-umba-26.html" variant="quiet" onClick={()=>track('media_accessory_interest',passport)}>Explore SmashPro MicroFab</ButtonLink>
      </section>
      <section className="media-passport__section media-passport__kit" id="operator-kit" aria-labelledby="kit-title"><p className="eyebrow">In development</p><h2 id="kit-title">The SmashPro<br/>Operator Camera Kit</h2><p className="media-passport__lead">Practical camera setups for operators who want to document their work without assembling every accessory themselves.</p><div className="media-passport__grid"><article><h3>The camera</h3><p>Purchased separately through an approved affiliate link.</p></article><article><h3>The field accessories</h3><p>Proposed SmashPro-fabricated mounts, protection, storage, and setup guidance. Design and testing remain pending.</p></article><article><h3>The future bundle</h3><p>Resale rights, inventory, pricing, fulfillment, and warranty responsibilities must be established before any bundle is offered.</p></article></div><p>No kit is currently offered for sale or preorder.</p><ButtonLink href={channel} external variant="quiet" onClick={()=>track('media_kit_interest',passport)}>Follow kit development</ButtonLink></section>
      <section className="media-passport__section" id="field-footage" aria-labelledby="footage-title"><p className="eyebrow">Captured with this camera</p><h2 id="footage-title">See what the camera captures.</h2>{passport.footage.length?<div className="media-passport__grid">{passport.footage.map(v=><article key={v.id}><h3>{v.title}</h3><p>{v.description}</p><ButtonLink href={v.url} external variant="quiet" onClick={()=>track('media_video_open',passport,{content_id:v.id})}>Watch on YouTube</ButtonLink></article>)}</div>:<p className="media-passport__lead">No approved footage captured with this AKASO 360 has been published here yet. Camera tests and field stories will appear after capture provenance and publication review.</p>}<ButtonLink href={channel} external variant="quiet">Visit SmashPro Equipment on YouTube</ButtonLink></section>
      <section className="media-passport__section"><p className="eyebrow">One connected workflow</p><h2>Machines. Making. Media.</h2><p>Explore the equipment doing the work, the MicroFab capability supporting it, and the field stories taking shape.</p><ButtonLink href="/equipment/#fleet">Meet the SmashPro fleet</ButtonLink></section>
    </>}
  </div></PageFrame>;
}
