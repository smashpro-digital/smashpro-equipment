import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";

const [port = "9225", appPort = "4174"] = process.argv.slice(2);
const output = path.resolve("docs/release-captures");
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
  response.setHeader("Content-Type", types[path.extname(target)] || "application/octet-stream"); fs.createReadStream(target).pipe(response);
});
await new Promise((resolve) => server.listen(Number(appPort), "127.0.0.1", resolve));
const createTarget = async () => (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const connect = (url) => new Promise((resolve, reject) => {
  const ws = new WebSocket(url); const pending = new Map(); const events = []; let id = 0;
  ws.addEventListener("open", () => resolve({ events, send(method, params = {}) { return new Promise((ok, fail) => { const commandId = ++id; pending.set(commandId, { ok, fail }); ws.send(JSON.stringify({ id: commandId, method, params })); }); }, close: () => ws.close() }));
  ws.addEventListener("error", reject);
  ws.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const promise = pending.get(message.id); pending.delete(message.id); message.error ? promise.fail(new Error(message.error.message)) : promise.ok(message.result); } else if (message.method) events.push(message); });
});
const waitFor = async (client, expression, timeoutMs = 6000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await client.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.result.value === true) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Browser condition timed out: ${expression}`);
};
const results = [];
for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  const page = await createTarget(); const client = await connect(page.webSocketDebuggerUrl);
  await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Log.enable");
  await client.send("Emulation.setDeviceMetricsOverride", { width, height: 1100, screenWidth: width, screenHeight: 1100, deviceScaleFactor: 1, mobile: width < 768 });
  await client.send("Page.navigate", { url: `http://127.0.0.1:${appPort}/equipment/sp-ardhi-26.html?utm_source=release&utm_campaign=ardhi26&utm_medium=web&utm_content=passport-release` });
  await waitFor(client, `document.readyState === "complete" && document.querySelectorAll('.project-grid article').length === 9`);
  await client.send("Runtime.evaluate", { expression: `window.scrollTo(0,document.querySelector('#projects')?.offsetTop||0)` }); await new Promise((resolve) => setTimeout(resolve, 350));
  const metrics = await client.send("Runtime.evaluate", { expression: `(() => { const links=[...document.querySelectorAll('.equipment-projects a[href]')]; const ids=[...document.querySelectorAll('[id]')].map(n=>n.id); const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(n=>Number(n.tagName.slice(1))); const first=links.find(a=>a.href.startsWith('smashpro-home:')); first?.focus(); return {innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),cards:document.querySelectorAll('.project-grid article').length,brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length,missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i).length,headingSkips:headings.filter((level,i)=>i&&level>headings[i-1]+1).length,ctaValid:Boolean(first?.href.includes('selected_service=')&&first.href.includes('equipment_source=SP-ARDHI-26')&&first.href.includes('equipment_required=SP-ARDHI-26')),utmPreserved:Boolean(first?.href.includes('utm_source=release')&&first.href.includes('utm_campaign=ardhi26')&&first.href.includes('utm_medium=web')&&first.href.includes('utm_content=passport-release')),keyboardFocus:document.activeElement===first}; })()`, returnByValue: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }); fs.writeFileSync(path.join(output, `ardhi-passport-projects-${width}.png`), Buffer.from(screenshot.data, "base64"));
  if ([390, 1440].includes(width)) { await client.send("Runtime.evaluate", { expression: `window.scrollTo(0,(document.querySelector('.project-cta')?.getBoundingClientRect().top||0)+window.scrollY-24)` }); await new Promise((resolve) => setTimeout(resolve, 250)); const cta = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }); fs.writeFileSync(path.join(output, `ardhi-passport-cta-${width}.png`), Buffer.from(cta.data, "base64")); }
  const errors = client.events.filter((event) => event.method === "Runtime.exceptionThrown" || (event.method === "Log.entryAdded" && event.params?.entry?.level === "error")).length;
  results.push({ width, ...metrics.result.value, errors }); client.close(); await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`);
}
for (const result of results) console.log(JSON.stringify(result));
await new Promise((resolve) => server.close(resolve));
if (results.some((r) => r.scrollWidth > r.innerWidth || r.cards !== 9 || r.brokenImages || r.missingAlt || r.duplicateIds || r.headingSkips || !r.ctaValid || !r.utmPreserved || !r.keyboardFocus || r.errors)) process.exitCode = 1;
