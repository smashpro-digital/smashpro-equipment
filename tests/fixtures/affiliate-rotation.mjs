import { approvedCatalog } from './field-technology.mjs';
// Synthetic approvals do not authorize the corresponding production creatives.
export function rotationCatalog(count = 5, now = Date.now()) {
  const payload = approvedCatalog(now), product = payload.items[0].products[0];
  product.image = { id: 1, creative_id: '4587303', url: 'https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518', width: 2160, height: 2700, alt: 'AKASO 360 front and rear views' };
  product.creatives = Array.from({ length: count }, (_, index) => {
    const id = String(9000000 + index), suffix = `?s=${id}&v=69454&q=542867&r=3121518`;
    return { id: index + 1, creative_record_id: index + 1, creative_id: id, placement_id: 9002, placement: payload.placement, campaign_id: 9003, media_property_id: 9004, property: 'hq', image_url: `https://www.awin1.com/cshow.php${suffix}`, tracking_url: `https://www.awin1.com/cread.php${suffix}`, width: 2832, height: 1920, alt: `Synthetic approved advertiser banner ${index + 1}`, weight: 1, display_order: index, valid_until: new Date(now + 60000).toISOString() };
  });
  return payload;
}
