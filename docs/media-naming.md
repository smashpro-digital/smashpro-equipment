# Media naming

Public equipment media lives under `images/equipment/<fleet-id>/<role>/`.

- Use the lowercase fleet ID as the filename prefix.
- Use lowercase kebab-case descriptive words.
- Keep the source extension unless the image pipeline intentionally converts it.
- Use role directories such as `hero`, `factory`, and `shipping`.
- Add ISO dates (`YYYY-MM-DD`) when the date distinguishes an event or delivery batch.
- Retain verified source evidence under a `source` subdirectory with an `-original` suffix when it must remain alongside a public derivative.
- Never expose vendor download IDs, camera sequence numbers, spaces, parentheses, or mixed-case names in new public URLs.

Examples:

- `images/equipment/sp-ardhi-26/hero/sp-ardhi-26-hero.png`
- `images/equipment/sp-ardhi-26/factory/sp-ardhi-26-left-side-profile.jpg`
- `images/equipment/sp-ardhi-26/shipping/sp-ardhi-26-shipping-2026-08-21-01.png`
