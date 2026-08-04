import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const entries = ["index.html", "sp-ardhi-26.html", "sp-mzigo-26.html"];

test("protected HTML entry files exist", () => {
  entries.forEach((entry) => assert.equal(existsSync(entry), true, `${entry} must exist`));
});

test("Vite is configured for the equipment base path and physical entries", () => {
  const config = readFileSync("vite.config.ts", "utf8");
  assert.match(config, /base:\s*["']\/equipment\/["']/);
  entries.forEach((entry) => assert.match(config, new RegExp(entry.replace(".", "\\."))));
});

test("protected equipment routes are registered", () => {
  const routes = readFileSync("src/app/App.tsx", "utf8");
  assert.match(routes, /sp-ardhi-26\.html/);
  assert.match(routes, /sp-mzigo-26\.html/);
});

test("equipment data does not claim public availability", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  assert.doesNotMatch(data, /available now|rent now|book now/i);
  assert.match(data, /availability not announced/);
});
