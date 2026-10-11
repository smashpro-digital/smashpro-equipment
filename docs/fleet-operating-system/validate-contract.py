"""Validate the proposed OpenAPI and synthetic JSON examples; no network/API writes.

Requires jsonschema and openapi-spec-validator in a separate validation environment.
Run: python docs/fleet-operating-system/validate-contract.py
"""
import copy
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker
from openapi_spec_validator import validate

root = Path(__file__).resolve().parent
api = json.loads((root / "api.openapi.json").read_text(encoding="utf-8"))
examples = json.loads((root / "examples.json").read_text(encoding="utf-8"))
validate(api)
validators = {}
for name, schema in api["components"]["schemas"].items():
    Draft202012Validator.check_schema(schema)
    validators[name] = Draft202012Validator(
        {"$ref": f"#/components/schemas/{name}", "components": api["components"]},
        format_checker=FormatChecker(),
    )
for case in examples["cases"]:
    validators[case["schema"]].validate(case["value"])

fixtures = {case["schema"]: case["value"] for case in examples["cases"]}
negative_count = 0


def reject(name, value):
    global negative_count
    assert not validators[name].is_valid(value), f"Unexpectedly valid {name}"
    negative_count += 1


reject("PublicServiceSummary", {**fixtures["PublicServiceSummary"], "operatorId": "PRIVATE"})
reject("CheckIn", {**fixtures["CheckIn"], "operatorId": "SPOOFED-ACTOR"})
reject("CheckIn", {**fixtures["CheckIn"], "atlasRegion": "SPOOFED-REGION"})
reject("Coordinates", {"latitude": 91, "longitude": 0, "accuracyMeters": 1})
reject("CaptureLocation", {"status": "captured", "position": None, "declaredPlace": None, "capturedAt": "2030-01-15T13:00:00Z"})
reject("CaptureLocation", {"status": "denied", "position": {"latitude": 0, "longitude": 0, "accuracyMeters": 1}, "declaredPlace": None, "capturedAt": "2030-01-15T13:00:00Z"})
reject("ActivityInput", {**fixtures["ActivityInput"], "fuel": {"amount": 1, "unit": "liter", "kind": "diesel"}})
reject("ActivityInput", {**fixtures["ActivityInput"], "kind": "photo", "attachmentChange": None, "evidenceIds": []})
reject("Shift", {**fixtures["OperationsView"]["activeShift"], "state": "closed"})
reject("Meter", {"value": -1, "unit": "hours", "meterId": "SAMPLE", "capturedAt": "invalid"})
missing = copy.deepcopy(fixtures["CheckOut"])
del missing["closingMeter"]
reject("CheckOut", missing)

operation_count = 0
for path in api["paths"].values():
    for method, operation in path.items():
        operation_count += 1
        for response in operation["responses"].values():
            assert response["headers"]["Cache-Control"]["schema"]["const"] == "private, no-store"
        if method == "post":
            required = {p["name"] for p in operation["parameters"] if p.get("required") and p["in"] == "header"}
            assert {"X-CSRF-Token", "Idempotency-Key", "If-Match"} <= required
assert api["security"] == [{"passportSession": []}]
print(json.dumps({"openapi": "valid", "schemas": len(validators), "examples": len(examples["cases"]), "negative_payloads_rejected": negative_count, "protected_operations": operation_count}, indent=2))
