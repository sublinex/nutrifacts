# Contributing to NutriFacts

NutriFacts is a free, open project for learners and researchers. Contributions that add evidence, improve its interpretation, or make its gaps clearer are welcome.

The first version uses raw, uncooked reference foods. Describe the raw form precisely: dry uncooked rice or beans, raw meat, fresh produce, and any milling, polishing, shelling, skin, or moisture state. Keep cooked and processed sample results out of raw profiles; log them as excluded leads. They can only be added later as separate records if the project expands its scope.

## Start with a source

Use the in-app **Prepare a contribution** form to download a JSON proposal, or make a data change directly in a branch. Follow the multi-source research workflow in [the whole-food research skill](skills/whole-food-evidence-research/SKILL.md) and record source coverage in its [dossier template](skills/whole-food-evidence-research/research-dossier-template.md). Search every relevant reliable source family; do not treat one database row or paper as comprehensive coverage. Cite each claim and keep the source URL or DOI, sample identity, raw food part, evidence status, method, units, and original source terms with the record.

## Evidence language

- **Detected:** the source reports the compound or protein in an analyzed sample.
- **Predicted:** the source infers or predicts its presence; do not present this as measured detection.
- **Measured:** a method produced a quantitative result. Add the original unit and measurement basis.
- **Derived:** a value was calculated from reported measurements. Document the calculation and retain the original value and unit.
- **Uncertain / unreviewed:** evidence needs checking or lacks enough context. Do not display an amount as established.

Evidence quality depends on more than a badge. Reviewers consider the source type, analytical method, sample count and variation, cultivar or breed, preparation, storage, tissue resolution, and whether the finding applies to the named food. A single sample or method does not establish a universal food value.

For carbohydrates, distinguish a free or soluble sugar from a sugar residue bound inside a polymer. For example, glucose can be measured as a free sugar or appear as a linked structural unit in cellulose; these are different claims. Sucrose is a disaccharide made of glucose and fructose units, not a generic polymer monomer. Do not assign an amount to a raw food from a cooked sample, a different cultivar, or a different tissue.

Food listings use real photographs of the correct species and food form. Verify the image visually and inspect the source file page for its license before bundling it. Record creator, source file page, license and link, taxon match, what the image depicts, alt text, modifications, and a visible credit. Do not use AI-generated specimen images.

## Research reliability categories

The record has separate evidence, measurement, and reliability fields. Keep them distinct:

- `direct_measurement`: the source reports a measurement for the matching food part and identifies the analytical method. This describes directness; it does not claim the result is universal or independently replicated.
- `limited_context`: a measurement is reported, but important sample, method, preparation, or tissue details are missing or do not fully match the food profile.
- `predicted`: an inference or model output rather than a measured detection.
- `unreviewed`: a source-linked record or proposal has not received a project-level evidence review.
- `unknown`: no usable source supports the claim yet.

The researcher route can group and filter by these categories. Reviewers should record why a category fits and leave the record `unreviewed` when the evidence is not clear enough to classify. The current tomato sample entries are source-linked and measured, but remain `unreviewed` under this project’s rubric.

## Data and licenses

Original contributions are proposed under CC BY 4.0. Keep third-party data under its original license and include required attribution. Do not upload content just because it is publicly viewable. When redistribution is not allowed, link to the source and describe only what the terms permit. See `DATA-LICENSE.md`.

## Review before inclusion

Every proposal is reviewed before entering the public data. Reviewers should verify:

1. The food and tissue or plant part match the source.
2. The source supports the stated detected/predicted status.
3. Amounts retain the original unit, basis, range, sample count, and method where available.
4. Any unit conversion is reproducible and labeled as derived.
5. Citation, source license, and attribution are present and compatible.
6. Uncertainty is clear and the wording does not claim more than the evidence supports.

The first UI only downloads contribution drafts; it does not publish them automatically. Attach the draft to an Evidence contribution GitHub issue or submit a reviewed food JSON file in a pull request. Accepted records follow `data/evidence-record.schema.json`.
