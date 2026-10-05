import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const root='docs/release-captures/passport-automation';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
  const page=await browser.newPage();
  for(const asset of ['ardhi','mzigo']) for(const width of [390,768,1440]){
    const files=['reference','after'].map(phase=>`data:image/png;base64,${readFileSync(`${root}/${phase}/${asset}-${width}.png`).toString('base64')}`);
    const result=await page.evaluate(async urls=>{
      const [before,after]=await Promise.all(urls.map(async url=>createImageBitmap(await (await fetch(url)).blob())));
      if(before.width!==after.width||before.height!==after.height)return {sameDimensions:false};
      const canvas=new OffscreenCanvas(before.width,256),ctx=canvas.getContext('2d',{willReadFrequently:true});
      let changed=0,maxChannelDifference=0;const bands=[];
      for(let y=0;y<before.height;y+=256){
        const h=Math.min(256,before.height-y);
        ctx.clearRect(0,0,canvas.width,256);ctx.drawImage(before,0,y,before.width,h,0,0,before.width,h);const a=ctx.getImageData(0,0,before.width,h).data;
        ctx.clearRect(0,0,canvas.width,256);ctx.drawImage(after,0,y,after.width,h,0,0,after.width,h);const b=ctx.getImageData(0,0,after.width,h).data;
        let bandChanged=0;
        for(let i=0;i<a.length;i+=4){const delta=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]));maxChannelDifference=Math.max(maxChannelDifference,delta);if(delta>8){changed++;bandChanged++;}}
        if(bandChanged>100)bands.push({y,changedPixels:bandChanged});
      }
      return {sameDimensions:true,width:before.width,height:before.height,changedPixels:changed,changedFraction:changed/(before.width*before.height),maxChannelDifference,bands};
    },files);
    result.asset=asset;results.push(result);console.log(JSON.stringify(result));
    assert.equal(result.sameDimensions,true);
  }
  writeFileSync(`${root}/visual-comparison.json`,JSON.stringify(results,null,2)+'\n');
  assert.ok(results.every(result=>result.changedFraction<0.01),'Protected Passport visual difference exceeds 1%; inspect before accepting');
} finally {await browser.close();}
