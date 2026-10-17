import { useEffect, useState } from 'react';
import { PageFrame } from '../components/PageFrame';
import { ButtonLink } from '../components/ButtonLink';
import { MEDIA_API, MEDIA_ASSET, receivedMediaPassport, type MediaPassport } from '../domain/mediaEquipment';
import '../styles/media-equipment.css';
import { CreatorKitCard } from '../components/CreatorKitCard';
import { FieldMediaVideoCard } from '../components/FieldMediaVideoCard';
import type { FieldMediaVideo } from '../domain/mediaEquipment';

const channel = 'https://www.youtube.com/@SmashProHQ';
const disclosure = 'SmashPro participates in the AKASO Affiliate Program and may earn a commission from qualifying purchases, at no additional cost to the buyer.';
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
  const unboxing=passport?.footage.find(video=>video.category.toLowerCase()==='unboxing');
  const otherVideos=passport?.footage.filter(video=>video.id!==unboxing?.id)??[];
  function videoEngagement(action: string, video: FieldMediaVideo) {
    if(passport) track(`media_video_${action}`,passport,{content_id:video.id,video_id:video.videoId,content_campaign_id:video.campaignId});
  }
  function shop(placement: string) {
    return card&&passport?<ButtonLink href={card.url} sponsored onClick={e=>{if(Date.now()>=card.validUntil){e.preventDefault();setPassport(null);return;}track('media_affiliate_click',passport,{cta_placement:placement});}}>Shop AKASO 360</ButtonLink>:null;
  }
  return <PageFrame><div className="media-passport shell">
    <nav className="media-passport__breadcrumb" aria-label="Breadcrumb"><a href="/equipment/">Equipment</a><span>/</span><span>Field Media</span></nav>
    {!passport ? <section className="section" aria-live="polite"><p className="eyebrow">SmashPro Field Media &middot; {MEDIA_ASSET}</p><h1>{loading?'Loading equipment passport':'Equipment passport unavailable'}</h1><p>{loading?'Retrieving approved public information.':'Approved equipment information is temporarily unavailable. Please try again later.'}</p><ButtonLink href="/equipment/">Explore equipment</ButtonLink></section> : <>
      <section className="media-passport__hero" aria-labelledby="media-title">
        <div><p className="eyebrow">SmashPro Field Media &middot; {passport.assetId}</p><p className="media-passport__product">{passport.identity.name} <span>{passport.identity.bundle}</span></p><h1 id="media-title">Capture the work.<br/><em>Own the story.</em></h1>
          <p className="media-passport__lead">Every equipment operation creates moments worth documenting. We're developing field-camera setups for equipment demonstrations, attachment changes, jobsite progress, and behind-the-scenes footage.</p>
          <p className="media-passport__status">{passport.identity.status}</p><p>{passport.identity.summary}</p>
          <div className="media-passport__actions">{shop('hero')}<ButtonLink href={unboxing?'#unboxing':'#field-footage'} variant="quiet">{unboxing?'Watch our unboxing':'Explore field stories'}</ButtonLink></div>
          {card&&<p className="media-passport__disclosure">{disclosure}</p>}
        </div>
        <figure className="media-passport__visual">{card?.image&&!imageFailed?<img src={card.image.url} alt={card.image.alt} width={card.image.width} height={card.image.height} onError={()=>setImageFailed(true)}/>:<div className="media-passport__image-fallback">{passport.identity.name}<small>Product imagery unavailable</small></div>}<figcaption>{card?.image&&!imageFailed?'Official AKASO product imagery':'SmashPro Field Media'}</figcaption>
        </figure>
      </section>
      <div className="media-passport__manifesto"><span>POWER. PRECISION. PURPOSE.</span><p>Independently purchased. Learning in public. Built around real work.</p></div>
      {unboxing&&<section className="media-passport__section media-passport__unboxing" id="unboxing" aria-labelledby="unboxing-title">
        <div className="media-passport__section-heading"><p className="eyebrow">01 / The first look</p><h2 id="unboxing-title">See what's<br/>in the box.</h2><p className="media-passport__lead">We purchased the AKASO 360 Creator Combo to explore how 360-degree video can help equipment operators document real work.</p><p>Watch our unboxing before we take the camera into the field. This is a first look, not a completed field-performance review.</p><dl className="media-passport__facts"><div><dt>Video*</dt><dd>5.7K 360 capture</dd></div><div><dt>Photos*</dt><dd>72MP 360 photos</dd></div><div><dt>Field readiness</dt><dd>Testing in progress</dd></div></dl><p className="media-passport__note">*Manufacturer-stated specifications, not SmashPro test results. <a href="https://shopakaso.com/products/akaso-360" target="_blank" rel="noopener noreferrer">Source: AKASO specifications</a>.</p><a href="#field-kit">Explore what's in our field kit &#8594;</a><div className="media-passport__actions">{shop('unboxing')}</div>{card&&<p className="media-passport__disclosure">{disclosure}</p>}</div>
        <FieldMediaVideoCard key={unboxing.id} video={unboxing} onEngagement={videoEngagement}/>
      </section>}
      <section className="media-passport__section" aria-labelledby="operator-title"><p className="eyebrow">02 / A wider perspective</p><h2 id="operator-title">The shots you didn't<br/>know you missed.</h2><p className="media-passport__lead">A conventional camera follows one frame. 360 capture opens up the possibility of choosing another perspective after the work is done.</p><div className="media-passport__grid">{[['01','The work around you','Equipment operation, attachment changes, loading and unloading: useful moments can happen outside a conventional frame.'],['02','One moment. More perspectives.','Reframe recorded footage to explore multiple viewing directions, equipment demonstrations, and behind-the-scenes moments.'],['03','From jobsite to story','Explore vertical Shorts, progress updates and equipment inspections from your field footage. Editing and camera performance still need testing.']].map(([n,title,text])=><article key={n}><span className="media-passport__number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="media-passport__note">A storytelling tool, not a replacement for dedicated safety cameras, required observers, or safe operating procedures. AKASO field performance has not yet been validated by SmashPro.</p></section>
      <section className="media-passport__section" id="field-footage" aria-labelledby="footage-title"><p className="eyebrow">03 / The field journal</p><h2 id="footage-title">SmashPro field tests.</h2><p className="media-passport__lead">From opening the box to documenting the work. Published stories are selected and reviewed individually.</p>{otherVideos.length?<div className="media-passport__videos">{otherVideos.map(video=><FieldMediaVideoCard key={video.id} video={video} onEngagement={videoEngagement}/>)}</div>:<div className="media-passport__journal-empty">{unboxing?<><span className="eyebrow">Published / Unboxing</span><h3>{unboxing.title}</h3><a href="#unboxing">Watch the first chapter &#8593;</a></>:<p>No approved public videos are available yet.</p>}<p>Next chapters under consideration: ARDHI operator POV, attachment demonstrations, equipment walkthroughs, battery endurance and Equip Expo. These are planned topics, not completed tests.</p></div>}<ButtonLink href={channel} external variant="quiet">Visit SmashPro Equipment on YouTube</ButtonLink></section>
      <section className="media-passport__section" id="field-kit" aria-labelledby="field-kit-title"><p className="eyebrow">04 / The working setup</p><h2 id="field-kit-title">What's in our field kit.</h2><p className="media-passport__lead">The camera and accessories in SmashPro's kit. See what came with the Creator Combo and what we added separately. Purchase links are provided where verified; inclusion in our kit is not a claim of completed field testing.</p><div className="creator-kit-grid">{passport.fieldKit.map(item=><CreatorKitCard key={item.productId??item.name} item={item} onVisit={(event,selected)=>{
          if(Date.now()>=Math.min(passport.validUntil,card?.validUntil??Infinity)){event.preventDefault();setPassport(null);return;}
          track(selected.shopping?.kind==='affiliate'?'media_affiliate_click':'media_product_details',passport,{cta_placement:'field-kit',product_id:selected.productId});
        }}/>)}</div>{passport.fieldKit.some(item=>item.shopping?.kind==='affiliate')&&<p className="media-passport__disclosure">{disclosure}</p>}{!passport.fieldKit.length&&<p>Public kit details are awaiting review.</p>}</section>
      <section className="media-passport__section" id="microfab-accessories" aria-labelledby="microfab-title"><p className="eyebrow">05 / SmashPro MicroFab</p><h2 id="microfab-title">Built for the field.</h2><p className="media-passport__lead">We're exploring custom accessories around the practical challenges of documenting equipment operations.</p>
        {passport.accessories.length?<div className="media-passport__grid">{passport.accessories.map(a=><article key={a.product_id}><p className="eyebrow">{a.prototype_status}</p><h3>{a.name}</h3><p>{a.description}</p><p>{a.product_id}{a.revision?` - Revision ${a.revision}`:''}</p>{a.material&&<p>{a.material}</p>}</article>)}</div>:<div className="media-passport__grid">{[['Mount the perspective','Camera adapters and equipment-specific mounts.'],['Protect the setup','Protective accessory holders and field-media storage organizers.'],['Identify the kit','QR identification tags and operator camera kit organization.']].map(([name,text])=><article key={name}><p className="eyebrow">Concept</p><h3>{name}</h3><p>{text}</p></article>)}</div>}<p className="media-passport__note">Concept / Prototype / Testing / Available / Retired. Concepts shown here are not built, validated or available to purchase.</p><ButtonLink href="/equipment/sp-umba-26.html" variant="quiet" onClick={()=>track('media_accessory_interest',passport)}>Explore SmashPro MicroFab</ButtonLink>
      </section>
      <section className="media-passport__section media-passport__kit" id="operator-kit" aria-labelledby="kit-title"><p className="eyebrow">06 / Future setups</p><h2 id="kit-title">Build your operator<br/>camera kit.</h2><p className="media-passport__lead">Valuable work deserves useful footage. We're exploring camera and mounting solutions around real equipment operations.</p><div className="media-passport__grid">{['Starter Operator Kit','360 Field Capture Kit','Equipment Content Creator Kit'].map(name=><article key={name}><p className="eyebrow">Concept / Coming soon</p><h3>{name}</h3><p>Proposed setup. Contents, compatibility, pricing and availability have not been established.</p></article>)}</div><p>No kit is currently offered for sale or preorder.</p><p>SmashPro purchased its camera independently. AKASO is an affiliate relationship, not a sponsor; no free camera is claimed.</p>{shop('closing')}{card&&<p className="media-passport__disclosure">{disclosure}</p>}</section>
      <section className="media-passport__section"><p className="eyebrow">One connected workflow</p><h2>Machines. Making. Media.</h2><p>Explore the equipment doing the work, the MicroFab capability supporting it, and the field stories taking shape.</p><ButtonLink href="/equipment/#fleet">Meet the SmashPro fleet</ButtonLink></section>
    </>}
  </div></PageFrame>;
}
