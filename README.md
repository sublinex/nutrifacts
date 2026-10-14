# NutriFacts

An open field guide to the compounds in whole foods. NutriFacts is designed for curious readers, students, teachers, and researchers: readable first, inspectable all the way down to the source.

**Everything is free to use.** The app code is MIT licensed. Original data contributions are proposed under CC BY 4.0, and each record retains its source and source-license details. GitHub Sponsors is configured as an optional support route; donations never unlock features or data.

## Current preview

This first UI preview includes one cited USDA Foundation Foods example: raw grape tomatoes (FoodData Central ID 321360). It shows a few reported measurements converted from per 100 g to per gram, expands methods and citations on demand, distinguishes food-level from tissue-level gaps, and provides an interactive PubChem structure panel for supported molecules.

This is a UI foundation, not a complete food composition database. A missing record means evidence has not been added and reviewed here; it does not mean a compound is absent from the food. Tissue/plant-part entries and protein identities are not filled unless a source supports them.

The contribution form downloads a JSON draft locally. It does not publish or accept records automatically. Every contribution needs human review before it joins the data.

## Run locally

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```sh
npm install
npm run dev
```

Create `.env.local` from `.env.example` to configure the optional donation link after the project owner activates a payment page:

```text
VITE_DONATION_URL=https://github.com/sponsors/YOUR_ACCOUNT
```

Donation configuration is optional; no data or feature depends on it.

## Where things live

- `src/App.tsx` — explorer interactions and page structure
- `src/App.css`, `src/index.css` — visual system and responsive layout
- `data/foods/usda-fdc-321360.json` — cited food and evidence records
- `data/evidence-record.schema.json` — versioned shape for accepted records
- `data/contribution.schema.json` — portable contribution draft shape
- `src/data/index.ts` — typed data import for the UI
- `DATA-LICENSE.md` — licensing and third-party data rules
- `CONTRIBUTING.md` — evidence and review guidance
- `AGENTS.md` — project-specific conventions for contributors and coding agents

## Evidence model

Each finding should preserve food identity, tissue or plant part, detected/predicted status, measurement method, sample context, units, range when reported, citation, and source license. Derived values must keep their original value and a reproducible conversion. Reliability depends on the method and sample fit; a badge alone is not a substitute for provenance.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [DATA-LICENSE.md](DATA-LICENSE.md) before proposing data.

## Roadmap

1. Establish the accessible, evidence-forward explorer UI.
2. Define and validate the versioned record schema and compatibility rules for source data.
3. Build researcher views for evidence quality, review queues, and source-specific uncertainty.
4. Add structured food, plant-part, animal-tissue, protein, and carbohydrate records as evidence allows.
5. Connect GitHub contribution drafts to issue and pull-request review.
6. Expand the molecule catalog and improve 2D/3D viewing with linked structure sources.

## Data sources

The sample food values link to [USDA FoodData Central](https://fdc.nal.usda.gov/food-details/321360/nutrients). The molecular structure links to [PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/structures). The project will only bundle external datasets when their licenses allow it; see the third-party data guidance in `DATA-LICENSE.md`.
