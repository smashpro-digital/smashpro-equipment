import { useState } from 'react';
import type { FieldKitItem } from '../domain/mediaEquipment';

const groups={included:'Creator Combo contents',purchased:'Purchased separately',owned:'Owned equipment'};
export function CreatorKitCard({item,onVisit}:{item:FieldKitItem;onVisit?:(event:React.MouseEvent<HTMLAnchorElement>,item:FieldKitItem)=>void}){
 const [failedUrl,setFailedUrl]=useState<string|null>(null);
 const image=item.image&&item.image.url!==failedUrl?item.image:null;
 const shopping=(!item.lifecycle||item.lifecycle==='Available')?item.shopping:null;
 return <article className="creator-kit-card">
  <div className="creator-kit-card__image">{image?<img src={image.url} alt={image.alt} width={image.width} height={image.height} loading="lazy" onError={()=>setFailedUrl(image.url)}/>:<span>Product image unavailable</span>}</div>
  <div className="creator-kit-card__body">
   <p className="eyebrow">{item.category}</p>
   <h3>{item.name}</h3>
   <p className="creator-kit-card__badge">{item.lifecycle||'IN OUR KIT'}</p>
   <p className="creator-kit-card__ownership">{groups[item.group]}</p>
   {item.note&&<p>{item.note}</p>}
   <div className="creator-kit-card__footer">{shopping&&<>
    <p className="creator-kit-card__shopping-label">Explore this equipment</p>
    <p className="creator-kit-card__relationship">{shopping.kind==='affiliate'?'Affiliate link':shopping.kind==='retailer'?'Retailer link / Non-affiliate':'Manufacturer details / Non-affiliate'}</p>
    <a className="creator-kit-card__link" href={shopping.url} target="_blank" rel={shopping.kind==='affiliate'?'sponsored noopener noreferrer':'noopener noreferrer'} onClick={event=>onVisit?.(event,item)} aria-label={shopping.label+' - '+item.name}>{shopping.label}<span aria-hidden="true">&#8599;</span></a>
   </>}</div>
  </div>
 </article>;
}
