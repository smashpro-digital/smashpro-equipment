import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";

const [port = "9225", appPort = "4174"] = process.argv.slice(2);
const output = path.resolve(process.argv[4] || "tmp/passport-standard");
fs.mkdirSync(output, { recursive: true });
const services = [
  ["mulch-material-moving", "Mulch / Material Moving", "Bucket"], ["gravel-rock-placement", "Gravel & Rock Placement", "Bucket"],
  ["topsoil-moving", "Topsoil Moving & Spreading", "Bucket"], ["driveway-gravel-refresh", "Driveway Gravel Refresh", "Bucket"],
  ["yard-debris-cleanup", "Yard Debris Cleanup", "Bucket"], ["pallet-material-placement", "Pallet & Material Placement", "Pallet Forks"],
  ["light-grading", "Light Grading", "Bucket"], ["backfill", "Backfill", "Bucket"], ["landscape-preparation", "Landscape Project Preparation", "Bucket"],
].map(([slug, name, attachment_required], index) => ({ id: index + 1, slug, name, tagline: "Custom property project reviewed by SmashPro.", equipment_required: "SP-ARDHI-26", attachment_required, quote_required: 1, prebooking_enabled: 1 }));
const server = createServer((request, response) => {
  if (request.url?.startsWith("/api/customer/catalog.php")) { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify({ ok: true, services })); return; }
  const pathname = new URL(request.url || "/", `http://127.0.0.1:${appPort}`).pathname;
  const relative = pathname.startsWith("/equipment/") ? pathname.slice("/equipment/".length) : pathname.slice(1);
  const target = path.resolve("dist", relative || "index.html");
  const distRoot = `${path.resolve("dist")}${path.sep}`;
  if (!target.startsWith(distRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) { response.statusCode = 404; response.end("Not found"); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".json": "application/json" };
  response.setHeader("Content-Type", types[path.extname(target)] || "application/octet-stream"); const size=fs.statSync(target).size; response.setHeader("Accept-Ranges","bytes"); const range=request.headers.range?.match(/bytes=(\d+)-(\d*)/); if(range) { const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1; response.writeHead(206,{"Content-Range":`bytes ${start}-${end}/${size}`,"Content-Length":end-start+1}); fs.createReadStream(target,{start,end}).pipe(response); } else { response.setHeader("Content-Length",size); fs.createReadStream(target).pipe(response); }
});
await new Promise((resolve) => server.listen(Number(appPort), "127.0.0.1", resolve));
const createTarget = async () => (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
let documentPayload = {ok:true,documents:[]};
const connect = (url) => new Promise((resolve, reject) => {
  const ws = new WebSocket(url); const pending = new Map(); const events = []; let id = 0;
  ws.addEventListener("open", () => resolve({ events, send(method, params = {}) { return new Promise((ok, fail) => { const commandId = ++id; pending.set(commandId, { ok, fail }); ws.send(JSON.stringify({ id: commandId, method, params })); }); }, close: () => ws.close() }));
  ws.addEventListener("error", reject);
  ws.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const promise = pending.get(message.id); pending.delete(message.id); message.error ? promise.fail(new Error(message.error.message)) : promise.ok(message.result); } else if (message.method) { events.push(message); if (message.method === "Fetch.requestPaused") { const commandId = ++id; ws.send(JSON.stringify({id:commandId,method:"Fetch.fulfillRequest",params:{requestId:message.params.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Access-Control-Allow-Origin",value:"*"}],body:Buffer.from(JSON.stringify(documentPayload)).toString("base64")}})); } } });
});
const waitFor = async (client, expression, timeoutMs = 15000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.result.value === true) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Browser condition timed out: ${expression}`);
};
const results = [];
try {
for (const slug of (process.env.PASSPORT_SLUG ? [process.env.PASSPORT_SLUG] : ['sp-mzigo-26', 'sp-ardhi-26'])) for (const width of (process.env.PASSPORT_WIDTH ? [Number(process.env.PASSPORT_WIDTH)] : [320,390,768,1440])) {
  documentPayload = {ok:true,documents:[]};
  const page = await createTarget(); const client = await connect(page.webSocketDebuggerUrl);
  const evaluate = async expression => { const r = await client.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true}); if(r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  const capture = async name => { await new Promise(r=>setTimeout(r,700)); const shot=await client.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); fs.writeFileSync(path.join(output,`${slug}-${width}-${name}.png`),Buffer.from(shot.data,'base64')); };
  try {
    await client.send('Page.enable'); await client.send('Runtime.enable'); await client.send('Log.enable');
    await client.send('Fetch.enable',{patterns:[{urlPattern:'*tech_companion.php*'}]});
    await client.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768});
    await client.send('Page.navigate',{url:`http://127.0.0.1:${appPort}/equipment/${slug}.html`});
    await waitFor(client, `document.readyState === 'complete' && !!document.querySelector('h1')`);
    await evaluate(`(()=>{const s=document.createElement('style');s.textContent='* { scroll-behavior:auto!important; }';document.head.append(s);})()`);
    await evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});} ))`);
    await capture('hero');
    const metrics = await evaluate(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),navigation:['passport','journey','history','service'].map(id=>({id,exists:!!document.getElementById(id)}))};})()`);
    if(slug==='sp-mzigo-26') {
      await waitFor(client,`document.querySelector('.passport-document-status')?.textContent.includes('No public factory documents')`);
      await evaluate(`location.hash='history-mzigo-factory-complete'`);
      await waitFor(client,`document.querySelector('#history-mzigo-factory-complete')?.open === true`);
      await evaluate(`document.querySelector('#journey').scrollIntoView()`); await capture('journey');
      await evaluate(`document.querySelector('#verification').scrollIntoView()`); await capture('requests');
      await evaluate(`document.querySelector('#evidence').scrollIntoView()`); await capture('archive');
      const playback=[];
      for(const phase of ['factory-build','finished-machine']) {
        await evaluate(`location.hash='mzigo-archive-${phase}'`);
        await waitFor(client,`!!document.querySelector('#mzigo-archive-${phase}') && !!document.querySelector('.mzigo-media-archive video')`);
        await evaluate(`(async()=>{const v=document.querySelector('.mzigo-media-archive video');v.muted=true;await v.play();})()`);
        await waitFor(client,`document.querySelector('.mzigo-media-archive video').currentTime > .2`);
        playback.push(await evaluate(`(()=>{const v=document.querySelector('.mzigo-media-archive video');v.pause();return {src:v.currentSrc,time:v.currentTime,duration:v.duration};})()`));
      }
      metrics.playback=playback;
      await evaluate(`(()=>{const input=document.querySelector('.archive-tools input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'remote controller');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await waitFor(client,`document.querySelectorAll('.archive-grid article').length===1`);
      metrics.search=true;
      await evaluate(`(()=>{const input=document.querySelector('.archive-tools input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await waitFor(client,`document.querySelectorAll('.archive-grid article').length===8`);
      await evaluate(`document.querySelector('.archive-grid button').focus();document.querySelector('.archive-grid button').click()`);
      await waitFor(client,`document.querySelector('.mzigo-archive-lightbox').open`); await capture('photo');
      await client.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await client.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await waitFor(client,`!document.querySelector('.mzigo-archive-lightbox').open`);
      metrics.photoFocusRestored=await evaluate(`document.activeElement===document.querySelector('.archive-grid button')`);
      await evaluate(`document.querySelector('.passport-generated-record>button').focus();document.querySelector('.passport-generated-record>button').click()`);
      await waitFor(client,`document.querySelector('.passport-document-dialog').open && !!document.querySelector('.window-sticker header img')`); await capture('document');
      metrics.document=await evaluate(`(()=>{window.print=()=>window.printCalls=(window.printCalls||0)+1;[...document.querySelectorAll('.sticker-actions button')].find(b=>b.textContent==='Print').click();return {pending:document.querySelector('.window-sticker').textContent.includes('K600 - verification pending'),printCalls:window.printCalls,scrollWidth:document.documentElement.scrollWidth};})()`);
      if(width===390) {
        await evaluate(`(()=>{const original=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download.endsWith('.png')){window.exportedPngLength=this.href.startsWith('data:image/png')?this.href.length:0;HTMLAnchorElement.prototype.click=original;}else original.call(this);};[...document.querySelectorAll('.sticker-actions button')].find(b=>b.textContent==='Download PNG').click();})()`);
        await waitFor(client,`window.exportedPngLength>10000`,30000);
        metrics.pngExport=true;
        const pdf=await client.send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
        fs.writeFileSync(path.join(output,'mzigo-configuration-record.pdf'),Buffer.from(pdf.data,'base64'));
      }
      await client.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await client.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await waitFor(client,`!document.querySelector('.passport-document-dialog').open`);
      metrics.documentFocusRestored=await evaluate(`document.activeElement===document.querySelector('.passport-generated-record>button')`);
    } else {
      await evaluate(`document.querySelector('#journey')?.scrollIntoView()`); await capture('journey');
      await evaluate(`document.querySelector('.ardhi-archive')?.scrollIntoView()`); await capture('archive');
      await evaluate(`document.querySelector('.archive-grid button')?.click()`);
      await waitFor(client,`!!document.querySelector('.media-lightbox')`); await capture('photo');
      await evaluate(`document.querySelector('.media-lightbox button').click()`);
      await waitFor(client,`!document.querySelector('.media-lightbox')`);
      await evaluate(`document.querySelector('.sticker-document-actions button').click()`);
      await waitFor(client,`!!document.querySelector('#window-sticker-viewer')`); await capture('document');
      await client.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await client.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await waitFor(client,`!document.querySelector('#window-sticker-viewer')`);
    }
    metrics.errors=client.events.filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Log.entryAdded'&&e.params?.entry?.level==='error')).map(e=>e.params);
    if(slug==='sp-mzigo-26' && width===390) {
      documentPayload={ok:false};
      await client.send('Page.reload',{ignoreCache:true});
      await waitFor(client,`!!document.querySelector('.passport-document-status button')`);
      metrics.documentError=true;
      documentPayload={ok:true,documents:[{document_id:1,title:'Browser fixture document',document_type:'factory_record',source_type:'Test fixture',document_url:'/equipment/sp-mzigo-26.html'}]};
      await evaluate(`document.querySelector('.passport-document-status button').click()`);
      await waitFor(client,`document.querySelector('.canonical-public-documents a')?.textContent.includes('Browser fixture document')`);
      metrics.documentRetry=await evaluate(`document.querySelector('.canonical-public-documents a').href === 'https://smashpro.app/equipment/sp-mzigo-26.html'`);
    }
    results.push({slug,...metrics}); console.log(JSON.stringify(results.at(-1)));
  } finally { client.close(); await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`); }
}
} finally { await new Promise(resolve=>server.close(resolve)); }
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
if(results.some(r=>r.scrollWidth>r.width||r.brokenImages.length||r.missingAlt||r.duplicates.length||r.errors.length||r.navigation.some(n=>!n.exists)||(r.slug==='sp-mzigo-26'&&(!r.search||!r.photoFocusRestored||!r.documentFocusRestored||!r.document.pending||r.document.printCalls!==1||(r.width===390&&(!r.documentError||!r.documentRetry||!r.pngExport)))))) process.exitCode=1;
