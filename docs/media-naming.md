# Media naming

Public equipment media lives directly under `images/` because the production host does not reliably serve nested media paths.

- Use the lowercase fleet ID as the filename prefix.
- Use lowercase kebab-case descriptive words.
- Keep the source extension unless the image pipeline intentionally converts it.
- Include the media role in the descriptive filename, such as `hero`, `factory`, or `shipping`.
- Add ISO dates (`YYYY-MM-DD`) when the date distinguishes an event or delivery batch.
- Retain verified source evidence with an `-original` suffix when it must remain alongside a public derivative.
- Never expose vendor download IDs, camera sequence numbers, spaces, parentheses, or mixed-case names in new public URLs.

Examples:

- `images/sp-ardhi-26-hero.png`
- `images/sp-ardhi-26-left-side-profile.jpg`
- `images/sp-ardhi-26-shipping-2026-08-21-01.png`
