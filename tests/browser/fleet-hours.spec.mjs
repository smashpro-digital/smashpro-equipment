import { test, expect } from "@playwright/test";

const endpoint = "**/dashboard/api/public_fleet_hours.php?asset=SP-ARDHI-26";
const path = "/equipment/sp-ardhi-26.html";
const cacheKey = "public-fleet-hours:SP-ARDHI-26:v1";
const reading = {
  value: "12.1", meter_type: "engine_hours", unit: "h", source: "meter_photo",
  verification: "pending", observed_at: "2026-10-01", received_at: "2026-10-02T12:00:00Z",
  approved_at: "2026-10-03T12:00:00Z",
  private_note: "SECRET NOTE", operator: "SECRET OPERATOR",
};
const payload = { ok: true, asset_id: "SP-ARDHI-26", status: "available", reading, history: [reading], customer: "SECRET CUSTOMER" };

async function respond(page, body = payload) {
  await page.route(endpoint, route => route.fulfill({ json: body }));
}

test("loading then public reading and history use the same reviewed projection", async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route(endpoint, async route => { await gate; await route.fulfill({ json: payload }); });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mission-dashboard")).toContainText("Loading reading");
  release();
  await expect(page.locator("#mission-dashboard")).toContainText("12.1 h · pending");
  await expect(page.locator("#service")).toContainText("Engine hours: 12.1 h");
  await expect(page.locator("#service")).toContainText("Source: Meter photo · Verification: pending");
  await expect(page.locator("#fleet-meter-history [aria-label='Public meter reading history']")).toContainText("12.1 h");
  await expect(page.locator("#maintenance")).toContainText("Engine hours: 12.1 h");
  await expect(page.locator("#maintenance")).toContainText("Source: Meter photo · Verification: pending");
  await expect(page.locator("#service")).toContainText("Observed: 2026-10-01");
  await expect(page.locator("#service")).toContainText("Last reported: 2026-10-02T12:00:00Z");
  await expect(page.locator("#reported-operating-time")).toContainText("roughly five hours");
  await expect(page.locator("#reported-operating-time")).toContainText("not an actual meter observation or current service hours");
  await expect(page.locator("#mission-dashboard")).not.toContainText("~5 reported");
  await expect(page.locator("#maintenance")).toContainText("DEF-003");
  await expect(page.locator("#maintenance")).toContainText("service release remains blocked");
  const cached = JSON.parse(await page.evaluate(key => localStorage.getItem(key), cacheKey));
  expect(cached.reading.private_note).toBeUndefined();
  expect(cached.history[0].operator).toBeUndefined();
  expect(cached.customer).toBeUndefined();
  await expect(page.locator("body")).not.toContainText("SECRET");
});

test("unknown observation is not substituted with receipt time", async ({ page }) => {
  await respond(page, { ...payload, reading: { ...reading, observed_at: null, verification: "verified", source: "telematics" } });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("Observed: Unknown · Last reported: 2026-10-02T12:00:00Z");
  await expect(page.locator("#service")).toContainText("Source: Telematics · Verification: verified");
});

test("network failure displays cached data only as stale", async ({ page }) => {
  await respond(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("12.1 h");
  await page.unrouteAll();
  await page.route(endpoint, route => route.abort());
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("Stale cached reading");
  await expect(page.locator("#mission-dashboard")).toContainText("12.1 h · pending · stale");
  await expect(page.locator("#mission-dashboard")).toContainText("Stale cached reading");
  await expect(page.locator("#maintenance")).toContainText("service release remains blocked");
});

test("network failure without a cache is unavailable", async ({ page }) => {
  await page.route(endpoint, route => route.abort());
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("Reading unavailable");
  await expect(page.locator("#maintenance")).toContainText("service release remains blocked");
  await expect(page.locator("#mission-dashboard")).not.toContainText("0.0 verified");
});

test("authoritative unavailable response clears old cached data", async ({ page }) => {
  await respond(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("12.1 h");
  await page.unrouteAll();
  await respond(page, { ok: true, asset_id: "SP-ARDHI-26", status: "unavailable", reading: null, history: [] });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("Reading unavailable");
  expect(await page.evaluate(key => localStorage.getItem(key), cacheKey)).toBeNull();
});

test("approved public history remains visible when there is no current projection", async ({ page }) => {
  const priorReading = { ...reading, value: "11.4", source: "owner_reported" };
  await respond(page, {
    ok: true,
    asset_id: "SP-ARDHI-26",
    status: "unavailable",
    reading: null,
    history: [priorReading],
  });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mission-dashboard")).toContainText("Reading unavailable");
  await expect(page.locator("#maintenance")).toContainText("Reading unavailable");
  await expect(page.locator("#fleet-meter-history [aria-label='Public meter reading history']")).toContainText("11.4 h");
});

test("invalid API data is unavailable and cannot revive the old cache", async ({ page }) => {
  await respond(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("12.1 h");
  await page.unrouteAll();
  await respond(page, { ...payload, reading: { ...reading, value: "12.1 SECRET" } });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#service")).toContainText("Reading unavailable");
  expect(await page.evaluate(key => localStorage.getItem(key), cacheKey)).toBeNull();
});

test("wrong asset, inconsistent units and malformed history are rejected", async ({ page }) => {
  const invalid = [
    { ...payload, asset_id: "OTHER" },
    { ...payload, reading: { ...reading, unit: "mi" } },
    { ...payload, history: [{ ...reading, verification: ["verified"] }] },
    { ...payload, status: "unavailable", reading },
  ];
  for (const body of invalid) {
    await page.unrouteAll();
    await respond(page, body);
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#service")).toContainText("Reading unavailable");
  }
});
