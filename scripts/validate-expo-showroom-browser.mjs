import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { chromium } from "@playwright/test";

const port = 4192;
const output = resolve("tmp/expo-showroom-browser");
mkdirSync(output, { recursive: true });
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".webp":"image/webp" };
const server = createServer((request,response) => {
  if (request.url === "/favicon.ico") { response.statusCode=204; response.end(); return; }
  const pathname = new URL(request.url || "/", `http://127.0.0.1:${port}`).pathname;
  const relative = pathname.startsWith("/equipment/") ? pathname.slice(11) : pathname.slice(1);
  const target = resolve("dist", relative || "index.html");
  const root = `${resolve("dist")}${sep}`;
  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) { response.statusCode=404; response.end("Not found"); return; }
  response.setHeader("Content-Type", types[extname(target)] || "application/octet-stream");
  createReadStream(target).pipe(response);
});
await new Promise(resolveListen => server.listen(port,"127.0.0.1",resolveListen));

const widths = [360,375,390,412,430,768,1440];
const browser = await chromium.launch({ headless:true });
const results=[];
try {
  for (const width of widths) {
    const page=await browser.newPage({ viewport:{ width,height:1000 }, deviceScaleFactor:1, isMobile:width<768, hasTouch:width<768 });
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    page.on("console",message=>{ if(message.type()==="error") errors.push(message.text()); });
    await page.goto(`http://127.0.0.1:${port}/equipment/`,{waitUntil:"networkidle"});
    const metrics=await page.evaluate(()=>{
      const ids=[...document.querySelectorAll("[id]")].map(node=>node.id);
      const jump=[...document.querySelectorAll(".showroom-jump a")];
      return {
        innerWidth,
        scrollWidth:document.documentElement.scrollWidth,
        fieldCards:document.querySelectorAll(".equipment-grid--field .equipment-card").length,
        fabricationCards:document.querySelectorAll(".equipment-grid--fabrication .equipment-card").length,
        fieldText:document.querySelector(".equipment-grid--field")?.textContent || "",
        fabricationText:document.querySelector(".equipment-grid--fabrication")?.textContent || "",
        mzigoCardImage:document.querySelector(".equipment-card--sp-mzigo-26 img")?.getAttribute("src") || "",
        brokenImages:[...document.images].filter(image=>image.complete&&!image.naturalWidth).map(image=>image.src),
        missingAlt:[...document.images].filter(image=>!image.hasAttribute("alt")).length,
        duplicateIds:ids.filter((id,index)=>ids.indexOf(id)!==index),
        jumpTargets:jump.map(link=>({href:link.getAttribute("href"),height:link.getBoundingClientRect().height,target:Boolean(document.querySelector(link.getAttribute("href")))})),
        sections:["fleet","passports","attachments","fabrication","development"].map(id=>document.getElementById(id)?.offsetTop ?? -1),
      };
    });
    assert.ok(metrics.scrollWidth<=metrics.innerWidth,`horizontal overflow at ${width}`);
    assert.equal(metrics.fieldCards,4,`Field Fleet card count at ${width}`);
    assert.equal(metrics.fabricationCards,1,`Fabrication card count at ${width}`);
    for(const id of ["SP-ARDHI-26","SP-MZIGO-26E","SP-NYASI-26","SP-LIFTMATE-27"]) assert.match(metrics.fieldText,new RegExp(id));
    assert.doesNotMatch(metrics.fieldText,/SP-UMBA-26/);
    assert.match(metrics.fabricationText,/SP-UMBA-26/);
    assert.equal(metrics.mzigoCardImage,"/equipment/images/sp-mzigo-26e-hero-artwork-2026-09-09.png");
    assert.equal(metrics.brokenImages.length,0);
    assert.equal(metrics.missingAlt,0);
    assert.equal(metrics.duplicateIds.length,0);
    assert.ok(metrics.jumpTargets.every(link=>link.target&&link.height>=44));
    assert.deepEqual([...metrics.sections].sort((a,b)=>a-b),metrics.sections);
    assert.deepEqual(errors,[]);
    if ([390,1440].includes(width)) await page.screenshot({path:`${output}/showroom-${width}.png`,fullPage:true});
    results.push({width,...metrics,errors});
    await page.close();
  }
  console.log(JSON.stringify(results.map(({width,scrollWidth,fieldCards,fabricationCards,errors})=>({width,scrollWidth,fieldCards,fabricationCards,errors})),null,2));
} finally { await browser.close(); await new Promise(resolveClose=>server.close(resolveClose)); }
