import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";

const [port = "9231", appPort = "4181"] = process.argv.slice(2);
const server = createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://127.0.0.1:${appPort}`).pathname;
  const relative = pathname.startsWith("/equipment/") ? pathname.slice(11) : pathname.slice(1);
  const requested = relative || "index.html";
  const target = path.resolve("dist", requested.endsWith("/") ? `${requested}index.html` : requested);
  const distRoot = `${path.resolve("dist")}${path.sep}`;
  if (!target.startsWith(distRoot) || !fs.existsSync(target)) { response.statusCode = 404; response.end("Not found"); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
  response.setHeader("Content-Type", types[path.extname(target)] || "application/octet-stream"); fs.createReadStream(target).pipe(response);
});
await new Promise((resolve) => server.listen(Number(appPort), "127.0.0.1", resolve));
const createTarget = async () => (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const connect = (url) => new Promise((resolve, reject) => { const socket = new WebSocket(url); const pending = new Map(); let id = 0; socket.addEventListener("open", () => resolve({ send(method, params = {}) { return new Promise((ok, fail) => { const commandId = ++id; pending.set(commandId, { ok, fail }); socket.send(JSON.stringify({ id: commandId, method, params })); }); }, close: () => socket.close() })); socket.addEventListener("error", reject); socket.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const promise = pending.get(message.id); pending.delete(message.id); message.error ? promise.fail(new Error(message.error.message)) : promise.ok(message.result); } }); });
const results = [];
for (const width of [320, 390, 768, 1024, 1440]) {
  const page = await createTarget(); const client = await connect(page.webSocketDebuggerUrl); await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Emulation.setDeviceMetricsOverride", { width, height: 1000, screenWidth: width, screenHeight: 1000, deviceScaleFactor: 1, mobile: width < 768 }); await client.send("Page.navigate", { url: `http://127.0.0.1:${appPort}/equipment/catalog/` });
  for (let attempt = 0; attempt < 60; attempt += 1) { const ready = await client.send("Runtime.evaluate", { expression: `document.readyState === 'complete' && document.querySelectorAll('.catalog-card').length === 1 && [...document.images].every(image => image.complete && image.naturalWidth > 0)`, returnByValue: true }); if (ready.result.value) break; await new Promise((resolve) => setTimeout(resolve, 100)); }
  const metrics = await client.send("Runtime.evaluate", { expression: `(async() => { const ids=[...document.querySelectorAll('[id]')].map(n=>n.id); const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(n=>Number(n.tagName.slice(1))); const filter=document.querySelector('.catalog-filters button:nth-child(2)'); filter?.click(); filter?.focus(); await new Promise(r=>setTimeout(r,100)); const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0); return {innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),products:document.querySelectorAll('.catalog-card').length,brokenImages:broken.length,brokenSources:broken.map(i=>i.currentSrc),missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i).length,headingSkips:headings.filter((level,i)=>i&&level>headings[i-1]+1).length,filterPressed:filter?.getAttribute('aria-pressed')==='true',keyboardFocus:document.activeElement===filter,title:document.title}; })()`, returnByValue: true, awaitPromise: true }); results.push({ width, ...metrics.result.value }); client.close(); await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`);
}
for (const result of results) console.log(JSON.stringify(result)); await new Promise((resolve) => server.close(resolve));
if (results.some((r) => r.scrollWidth > r.innerWidth || r.products !== 1 || r.brokenImages || r.missingAlt || r.duplicateIds || r.headingSkips || !r.filterPressed || !r.keyboardFocus || !r.title.startsWith("SmashPro Equipment Catalog"))) process.exitCode = 1;
