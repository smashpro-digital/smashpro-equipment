import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const home = readFileSync("src/pages/HomePage.tsx", "utf8");
const types = readFileSync("src/types/equipment.ts", "utf8");
const data = readFileSync("src/data/equipment.ts", "utf8");
const nyasi = readFileSync("src/data/nyasiEquipment.ts", "utf8");
const liftmate = readFileSync("src/data/liftmateEquipment.ts", "utf8");
const umba = readFileSync("src/data/umbaEquipment.ts", "utf8");
const config = readFileSync("vite.config.ts", "utf8");

test("showroom taxonomy is data-driven and separates Field Fleet from fabrication", () => {
  assert.match(types, /EquipmentShowroomGroup = "field-fleet" \| "fabrication"/);
  assert.equal((data.match(/showroomGroup: "field-fleet"/g) || []).length, 2);
  assert.match(nyasi, /showroomGroup: "field-fleet"/);
  assert.match(liftmate, /showroomGroup: "field-fleet"/);
  assert.match(umba, /showroomGroup: "fabrication"/);
  assert.match(home, /equipment\.filter\(item => item\.showroomGroup === "field-fleet"\)\.sort\(byShowroomOrder\)/);
  assert.match(home, /equipment\.filter\(item => item\.showroomGroup === "fabrication"\)/);
  assert.match(config, /asset_group: item\.showroomGroup/);
  assert.match(config, /showroom_order: item\.showroomOrder/);
});

test("Expo showroom presents the required semantic hierarchy", () => {
  const positions = ["id=\"fleet\"", "id=\"passports\"", "<AttachmentShowroom", "id=\"fabrication\"", "id=\"development\""].map(token => home.indexOf(token));
  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual([...positions].sort((a,b) => a-b), positions);
  assert.match(home, /Four machines\. Complementary roles\./);
  assert.match(home, /An Equipment Passport is the persistent public identity/);
  assert.match(home, /Concepts and prototypes remain discoverable/);
});
