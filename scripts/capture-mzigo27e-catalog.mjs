import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";

const [port = "9238", appPort = "4182", output = "tmp/mzigo27e-catalog"] = process.argv.slice(2);
const route = "/equipment/catalog/sp-mzigo-27e/";
const heroPath = "/equipment/images/sp-mzigo-27e-catalog-hero-concept-2026-09-15.png";
fs.mkdirSync(output, { recursive: true });
const server = createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://127.0.0.1:${appPort}`).pathname;
  const relative = pathname.startsWith("/equipment/") ? pathname.slice(11) : pathname.slice(1);
  const requested = relative || "index.html";
  const target = path.resolve("dist", requested.endsWith("/") ? `${requested}index.html` : requested);
  const distRoot = `${path.resolve("dist")}${path.sep}`;
  if (!target.startsWith(distRoot) || !fs.existsSync(target)) { response.statusCode = 404; response.end("Not found"); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
  response.setHeader("Content-Type", types[path.extname(target)] || "application/octet-stream");
  fs.createReadStream(target).pipe(response);
});
await new Promise(resolve => server.listen(Number(appPort), "127.0.0.1", resolve));
const assetResponse = await fetch(`http://127.0.0.1:${appPort}${heroPath}`);
const assetResult = { status: assetResponse.status, contentType: assetResponse.headers.get("content-type"), bytes: (await assetResponse.arrayBuffer()).byteLength };
const createTarget = async () => (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const connect = url => new Promise((resolve, reject) => {
  const socket = new WebSocket(url); const pending = new Map(); let id = 0;
  socket.addEventListener("open", () => resolve({ send(method, params = {}) { return new Promise((ok, fail) => { const commandId = ++id; pending.set(commandId, { ok, fail }); socket.send(JSON.stringify({ id: commandId, method, params })); }); }, onMessage(callback) { socket.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (!message.id) callback(message); }); }, close: () => socket.close() }));
  socket.addEventListener("error", reject);
  socket.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const promise = pending.get(message.id); pending.delete(message.id); message.error ? promise.fail(new Error(message.error.message)) : promise.ok(message.result); } });
});
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await createTarget(); const client = await connect(page.webSocketDebuggerUrl); const errors = [];
    client.onMessage(message => { if (message.method === "Runtime.exceptionThrown" || (message.method === "Log.entryAdded" && message.params.entry.level === "error")) errors.push(message.method); });
    await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Log.enable");
    await client.send("Emulation.setDeviceMetricsOverride", { width, height: 1000, screenWidth: width, screenHeight: 1000, deviceScaleFactor: 1, mobile: width < 768 });
    await client.send("Page.navigate", { url: `http://127.0.0.1:${appPort}${route}` });
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const ready = await client.send("Runtime.evaluate", { expression: `document.readyState==='complete'&&document.querySelector('.mzigo27e-catalog-hero__media img')?.complete`, returnByValue: true });
      if (ready.result.value) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await client.send("Runtime.evaluate", { expression: `(async()=>{const image=document.querySelector('.mzigo27e-catalog-hero__media img');await image.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return true;})()`, returnByValue: true, awaitPromise: true });
    const metrics = await client.send("Runtime.evaluate", { expression: `(()=>{const image=document.querySelector('.mzigo27e-catalog-hero__media img');return {innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),heroSrc:image?.getAttribute('src'),heroCurrentSrc:image?.currentSrc,heroAlt:image?.getAttribute('alt'),heroNaturalWidth:image?.naturalWidth,heroNaturalHeight:image?.naturalHeight,brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc),heldConceptElsewhere:document.querySelectorAll('img[src*="sp-mzigo-27e-catalog-hero"]').length,title:document.title};})()`, returnByValue: true });
    const screenshot = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(output, `sp-mzigo-27e-${width}.png`), Buffer.from(screenshot.data, "base64"));
    results.push({ width, ...metrics.result.value, errors }); client.close(); await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`);
  }
} finally { await new Promise(resolve => server.close(resolve)); }
for (const result of results) console.log(JSON.stringify(result));
console.log(JSON.stringify({ asset: assetResult }));
fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({ asset: assetResult, results }, null, 2));
if (assetResult.status !== 200 || assetResult.contentType !== "image/png" || results.some(result => result.scrollWidth > result.innerWidth || result.heroSrc !== heroPath || !result.heroCurrentSrc?.endsWith(heroPath) || result.heroAlt !== "SmashPro SP-MZIGO-27E Electric Material Carrier" || result.heroNaturalWidth !== 941 || result.heroNaturalHeight !== 1672 || result.brokenImages.length || result.heldConceptElsewhere !== 1 || result.errors.length || !result.title.startsWith("SP-MZIGO-27E"))) process.exitCode = 1;
