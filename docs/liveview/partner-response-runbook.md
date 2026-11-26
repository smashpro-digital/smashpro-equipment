# SP-LiveVest / SP-LiveView: loading partner responses

All product-line data lives in `src/data/liveviewProducts.ts`. The page renders a commercial
field only when `commercialRecordErrors` / `partnerRecordErrors` return no errors; anything
else falls back to the plain concept card. `tests/livevest-catalog.test.mjs` fails the build if
shipped data contains an unbacked claim.

| When this arrives | Fill in | Required evidence |
| --- | --- | --- |
| Signed partnership / supply agreement | partner `status: "confirmed"`, `agreementRef` | Agreement ID or signed email reference |
| Written logo permission | partner `approvedLogo` (`kind: "logo"`) | `approvalRef`, `approvedBy`, `approvedAt` |
| Sponsorship (separate from partnership) | partner `sponsorship` | Confirmed partner + approval reference |
| Manufacturer specs | product `manufacturer.specs[]`, `verified: true` | `source` on every spec (document + section) |
| Product renders / photos | product `images[]` with `stage` | Approval record; concept renders stay labelled |
| Affiliate programme | product `affiliate` | Confirmed partner, programme terms ref, https URL, commission disclosure, no discount codes |
| Approved price | product `pricing` + `readiness.pricingApproved` | Owner pricing approval ref |
| Ready to sell | `availability` progression + all `readiness` gates | Inventory, fulfilment, partner terms, product approval. Checkout stays hard-disabled in code until a separate release. |

Never add: invented prices, discount or coupon codes, "official partner" wording without an
agreement, or manufacturer claims (certification, waterproofing, battery life) that aren't in the
manufacturer's written documentation.
