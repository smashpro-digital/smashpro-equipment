import {showcaseFixture} from './media-showcase.mjs';
// Reviewed catalog values for local tests only. No fixture is imported by production.
const products=[
  {
    "name": "120cm invisible selfie stick",
    "product_id": 3,
    "category": "Camera support",
    "image": {
      "url": "https://cdn.shopify.com/s/files/1/0632/9037/6374/files/120cm_02.jpg?v=1761274200",
      "alt": "AKASO 120cm invisible selfie stick - official manufacturer product image",
      "source": "AKASO official store product photography",
      "width": 1500,
      "height": 1495,
      "product_id": 3, "purchase_verified": true
    },
    "shopping": {
      "url": "https://shopakaso.com/products/akaso-120cm-invisible-selfie-stick?variant=44352839352502",
      "kind": "details",
      "label": "VIEW PRODUCT",
      "product_id": 3, "purchase_verified": true
    }
  },
  {
    "name": "Rechargeable batteries",
    "product_id": 4,
    "category": "Power",
    "image": {
      "url": "https://cdn.shopify.com/s/files/1/0632/9037/6374/files/AKASO_360__02.jpg?v=1760412431",
      "alt": "AKASO rechargeable batteries - official manufacturer product image",
      "source": "AKASO official store product photography",
      "width": 2000,
      "height": 2000,
      "product_id": 4
    },
    "shopping": {
      "url": "https://shopakaso.com/products/akaso-360-camera-battery?variant=44332006637750",
      "kind": "details",
      "label": "VIEW PRODUCT",
      "product_id": 4
    }
  },
  {
    "name": "Battery charging case",
    "product_id": 5,
    "category": "Charging",
    "image": {
      "url": "https://cdn.shopify.com/s/files/1/0632/9037/6374/files/ActionCameraBatteryCharger_10.jpg?v=1760412431",
      "alt": "AKASO battery charging case - official manufacturer product image",
      "source": "AKASO official store product photography",
      "width": 1600,
      "height": 1600,
      "product_id": 5, "purchase_verified": true
    },
    "shopping": {
      "url": "https://shopakaso.com/products/akaso-360-camera-battery?variant=44332006670518",
      "kind": "details",
      "label": "VIEW PRODUCT",
      "product_id": 5, "purchase_verified": true
    }
  },
  {
    "name": "AKASO 360 carrying case",
    "product_id": 6,
    "category": "Protection",
    "image": {
      "url": "https://cdn.shopify.com/s/files/1/0632/9037/6374/files/360_Camera_Carrying_Case.png?v=1769672159",
      "alt": "AKASO 360 carrying case - official manufacturer product image",
      "source": "AKASO official store product photography",
      "width": 819,
      "height": 792,
      "product_id": 6
    },
    "shopping": {
      "url": "https://a.co/d/01Lk7JHj",
      "kind": "retailer",
      "label": "SHOP NOW",
      "product_id": 6
    }
  },
  {
    "name": "Protective carrying pouch",
    "product_id": 7,
    "category": "Protection",
    "image": {"url": "https://cdn.shopify.com/s/files/1/0632/9037/6374/files/b2066e5e826e581b37b149b3709f678e_1d508e23-6f64-490e-b0dc-891048098ae7.jpg?v=1763029956", "alt": "Official AKASO Creator Combo contents, with soft protective pouch at lower right", "width": 1600, "height": 1600, "source": "AKASO official Creator Combo contents image", "product_id": 7},
    "shopping": null
  }
];
export function creatorKitFixture(now=Date.now(),approvedImages=false){
 const value=showcaseFixture(now);
 value.passport.field_kit=value.passport.field_kit.map((item,i)=>{
  const product=products.find(p=>p.name===item.name);
  return {...item,...(product?{...product,image:approvedImages?product.image:null}:{}),display_order:(i+1)*10};
 });
 return value;
}
