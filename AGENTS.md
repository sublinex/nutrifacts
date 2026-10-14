# NutriFacts contributor notes

## Product rules

- Keep food browsing clear to curious readers while making every claim inspectable by researchers.
- Never turn missing evidence into an absence claim. Show gaps as unknown or not yet linked.
- Keep detected, predicted, measured, and derived claims distinguishable. Never imply a prediction was detected in a sample.
- Display a quantity only with its unit, source, basis, and enough method or sample context to judge what it means. Keep reported values distinct from conversions and estimates.
- Attach the source identifier, citation, method, sample context, and source license to each record. Cite near the claim and let the reader expand source detail.
- Separate whole-food and part-specific evidence. Do not transfer a whole-food result to flesh, skin, seed, muscle, vessel, nerve, tendon, or another tissue without supporting evidence.
- Do not redistribute third-party content unless its license allows it. See `DATA-LICENSE.md`.
- Keep the experience free. Donations are optional and must not gate features, content, or researcher tools.

## Data contributions

- Keep scientific records separate from presentation code under `data/foods/`.
- Follow `data/evidence-record.schema.json`, `data/contribution.schema.json`, and the entry conventions in `CONTRIBUTING.md`.
- Treat downloaded UI drafts as proposals. A human review must check source quality, food identity, tissue/plant part, analytical method, units, license, and any conversion before accepting a record.
- Preserve uncertainty. Do not invent a per-gram quantity from a qualitative claim or a poorly matched sample.

## UI conventions

- Use the existing paper, ink, tomato, and moss palette; keep the page editorial and legible rather than dashboard-like.
- Maintain keyboard access, visible focus, usable mobile layouts, and reduced-motion support.
- Use clear language for the public view; keep methods and detailed provenance expandable.
