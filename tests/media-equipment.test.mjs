import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { approvedCatalog } from './fixtures/field-technology.mjs';
const options={compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}};
const moduleUrl=code=>'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
const compile=path=>ts.transpileModule(readFileSync(path,'utf8'),options).outputText;
const creative=moduleUrl(compile('src/domain/affiliateCreatives.ts'));
const field=moduleUrl(compile('src/domain/fieldTechnology.ts').replace('./affiliateCreatives.ts',creative));
const {mediaPassport,receivedMediaPassport}=await import(moduleUrl(compile('src/domain/mediaEquipment.ts').replace('./fieldTechnology.ts',field)));
function fixture(now){const catalog=approvedCatalog(now);catalog.items[0].products[0].links[0].placement='equipment.media.sp-med-cam-001';return {ok:true,schema_version:1,property:'hq',generated_at:new Date(now).toISOString(),valid_until:new Date(now+60000).toISOString(),passport:{asset_id:'SP-MED-CAM-001',placement:'equipment.media.sp-med-cam-001',media_property_id:1,identity:{name:'AKASO 360',manufacturer:'AKASO',bundle:'Creator Combo',category:'Field Media Equipment',status:'Received',summary:'Commissioning pending'},catalog:catalog.items,footage:[],accessories:[],kit:{status:'in_development',commerce_eligible:false}}};}
test('approved camera projection preserves tracking bytes and strips unrelated private fields',()=>{const now=Date.now(),value=fixture(now);value.passport.identity.serial_number='PRIVATE';const result=mediaPassport(value,now);assert.equal(result.card.url,value.passport.catalog[0].products[0].links[0].url);assert.equal(result.identity.serial_number,undefined);assert.deepEqual(result.footage,[]);});
test('missing approval, wrong property, wrong asset, stale lease and invalid kit fail closed',()=>{const now=Date.now();for(const mutate of [v=>v.ok=false,v=>v.property='garage',v=>v.passport.asset_id='SP-ARDHI-26',v=>v.passport.placement='gear',v=>v.valid_until=new Date(now-1).toISOString(),v=>v.passport.kit.commerce_eligible=true]){const v=fixture(now);mutate(v);assert.equal(mediaPassport(v,now),null);}assert.equal(mediaPassport(null),null);});
test('affiliate withdrawal removes purchase link without inventing a substitute',()=>{const now=Date.now(),v=fixture(now);v.passport.catalog=[];assert.equal(mediaPassport(v,now).card,null);});
test('footage must identify this capture device and a safe YouTube destination',()=>{const now=Date.now(),v=fixture(now);v.passport.footage=[{id:1,capture_device:'SP-ARDHI-26',title:'Wrong device',url:'https://youtu.be/abcdefghijk'},{id:2,capture_device:'SP-MED-CAM-001',title:'Unsafe',url:'javascript:alert(1)'},{id:3,capture_device:'SP-MED-CAM-001',publication_status:'published',approval_status:'approved',channel_id:'UC2wKsAtGR55PZMAUNuk2r6g',title:'Test fixture',url:'https://www.youtube.com/watch?v=abcdefghijk'}];assert.deepEqual(mediaPassport(v,now).footage.map(x=>x.id),[3]);});
test('unapproved compatibility and accidental commerce cannot enter accessory presentation',()=>{const now=Date.now(),v=fixture(now);v.passport.accessories=[{product_id:'test',name:'Fixture',prototype_status:'DISCOVERY',compatibility:'SP-MED-CAM-001',commerce_eligible:true}];assert.deepEqual(mediaPassport(v,now).accessories,[]);});
test('physical HTML route and sitemap carry the canonical camera URL',()=>{for(const file of ['sp-med-cam-001.html','public/sitemap.xml'])assert.ok(readFileSync(file,'utf8').includes('https://smashpro.app/equipment/sp-med-cam-001.html'));assert.ok(readFileSync('vite.config.ts','utf8').includes('"sp-med-cam-001.html"'));});

test('server clock skew does not extend authorization lease',()=>{const now=Date.now(),server=Math.floor((now+18000)/1000)*1000,v=fixture(server);const p=receivedMediaPassport(v,new Date(server).toUTCString(),now-500,now);assert.ok(p);assert.ok(p.validUntil-now<=60000);assert.equal(receivedMediaPassport(v,'invalid',now,now),null);});

test('approved subject videos retain unknown capture provenance and require channel approval',()=>{const now=Date.now(),v=fixture(now);const video={id:42,capture_device:null,subject_equipment:'SP-MED-CAM-001',title:'Unboxing',url:'https://www.youtube.com/shorts/UfznEcnYz5k',publication_status:'published',approval_status:'approved',channel_id:'UC2wKsAtGR55PZMAUNuk2r6g',category:'Unboxing',display_order:10,published_at:null};v.passport.footage=[video];const result=mediaPassport(v,now).footage[0];assert.equal(result.videoId,'UfznEcnYz5k');assert.equal(result.recordingDevice,null);assert.equal(result.publishedAt,null);for(const change of [{approval_status:'draft'},{channel_id:'Garage'},{publication_status:'planned'},{subject_equipment:'SP-ARDHI-26'}]){v.passport.footage=[{...video,...change}];assert.deepEqual(mediaPassport(v,now).footage,[]);}});
test('kit projection allowlists public fields and rejects unknown group',()=>{const now=Date.now(),v=fixture(now);v.passport.field_kit=[{name:'Case',group:'purchased',note:'Public',serial:'SECRET'},{name:'Other',group:'private'}];const items=mediaPassport(v,now).fieldKit;assert.equal(items.length,1);assert.equal(items[0].name,'Case');assert.equal(items[0].group,'purchased');assert.equal(items[0].serial,undefined);assert.equal(items[0].image,null);assert.equal(items[0].shopping,null);});

test('kit links cannot inject affiliate tracking, unsafe destinations or wrong product images',()=>{
 const now=Date.now(),v=fixture(now);
 const item={name:'Battery',group:'included',product_id:3,note:'Public',image:{product_id:4,url:'https://cdn.shopify.com/s/files/1/0632/9037/6374/files/battery.jpg',alt:'Battery',source:'AKASO',width:100,height:100}};
 for(const url of ['javascript:alert(1)','https://shopakaso.com.evil.test/products/test','https://shopakaso.com/products/test?tag=madeup','https://user:pass@shopakaso.com/products/test']){
  v.passport.field_kit=[{...item,shopping:{kind:'details',url,product_id:3}}];
  const out=mediaPassport(v,now).fieldKit[0];assert.equal(out.shopping,null);assert.equal(out.image,null);
 }
 v.passport.field_kit=[{...item,shopping:{kind:'affiliate',url:'https://www.awin1.com/cread.php?invented=1',product_id:3}}];
 assert.equal(mediaPassport(v,now).fieldKit[0].shopping,null);
});
test('kit camera reuses approved tracking bytes and loses CTA when catalog is withdrawn',()=>{
 const now=Date.now(),v=fixture(now),product=v.passport.catalog[0].products[0];
 v.passport.field_kit=[{name:'Camera',group:'owned',product_id:product.id}];
 assert.equal(mediaPassport(v,now).fieldKit[0].shopping.url,product.links[0].url);
 v.passport.catalog=[];assert.equal(mediaPassport(v,now).fieldKit[0].shopping,null);
});
test('future nonavailable kit products never show shopping actions',()=>{
 const now=Date.now(),v=fixture(now);
 for(const lifecycle of ['Concept','Prototype','Testing','Retired']){
  v.passport.field_kit=[{name:'Mount',group:'owned',product_id:3,lifecycle,shopping:{kind:'details',product_id:3,url:'https://shopakaso.com/products/example'}}];
  assert.equal(mediaPassport(v,now).fieldKit[0].shopping,null);
 }
});
