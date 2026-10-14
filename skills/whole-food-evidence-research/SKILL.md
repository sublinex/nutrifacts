---
name: whole-food-evidence-research
description: Research and curate a food profile whenever adding, reviewing, or expanding a whole-food species. Search reliable composition databases, primary literature, metabolomics and proteomics repositories; verify tissue-specific compounds, proteins, carbohydrates, real images, and image rights; reconcile source differences; and prepare cited records plus an explicit gap ledger for NutriFacts.
---

# Whole-food evidence research

Use this workflow for each food profile. Aim for broad, reproducible coverage across all relevant reliable source families. Do not claim to find everything or that a food lacks a compound because the compound was not found. The goal is an inspectable search with findings, conflicts, source coverage, and remaining gaps.

The project copy is canonical. Follow the research dossier template, the current evidence schema in data/evidence-record.schema.json, and CONTRIBUTING.md. Keep accepted claims in structured data under data/foods/; do not make the UI their only home.

## 1. Lock the food identity before searching

Create a food identity card before collecting claims. The default and only in-scope preparation for the first version is raw and uncooked:

- Accepted scientific name and taxonomic authority or identifier; capture synonyms used in older literature.
- Common name, food type, cultivar, breed or strain when known, maturity or ripeness, raw-form details, storage, and edible portion.
- Define what “whole” and “raw” mean for the food. Preserve raw-form details such as dry uncooked rice, dry uncooked beans, raw meat, or fresh raw produce; record milling, polishing, shelling, skin, and moisture state where available.
- Do not add cooked-food measurements to the raw profile. You may record a cooked source as an excluded lead in the dossier, with its preparation and reason for exclusion. Cooked profiles are out of scope unless the project owner later approves them as separate food records.
- Keep species-level, cultivar-level, food-form, and sample-level identity separate. A taxon match alone does not prove that an image, assay, or amount matches a named cultivar or preparation.

Do not merge foods that only share a common name. Resolve ambiguous names using an appropriate taxonomic source such as Plants of the World Online, NCBI Taxonomy, GBIF, or an animal registry. Save the identifier and lookup source in the dossier.

## 2. Map edible parts and tissue vocabulary

Build an anatomy map before attaching compounds to parts.

- Plants: use the real organ and anatomy, such as whole fruit, pericarp or skin, flesh or mesocarp, locule or gel, seed, leaf, stem, root, tuber, grain or caryopsis, bran, and germ.
- Animals: distinguish the source cut or organ from tissue types such as skeletal muscle, connective tissue, tendon, skin, adipose, nerve, blood or vessel, liver, bone, and marrow. Do not infer that every tissue is eaten or present in the named cut.
- Record source terminology. Map it to a site label only when the anatomy supports that mapping. Mark ambiguous histology unresolved.
- Add only parts backed by evidence for the named species and food. A part without a matching source is a gap, not an invitation to infer.

## 3. Search across relevant source families

Make a source-coverage ledger for every food. Search broadly across the families below. Record the date, exact queries, identifiers, useful results, exclusions, and access limits. Use taxon synonyms, common-name variants, food-form terms, part names, cultivar or breed names, and compound-class terms. Follow references backward and citations forward from relevant primary studies. Re-run searches with newly discovered synonyms and anatomy terms.

| Source family | Examples and what to extract |
| --- | --- |
| Government and national food-composition data | USDA FoodData Central, FAO/INFOODS, and national food tables. Match food form, preparation, portion, sampling, units, and method. |
| Primary food chemistry and food-science studies | PubMed, Europe PMC, Crossref, publisher full text, theses, and repositories. Extract actual sample, part, cultivar or breed, stage, method, units, detection limits, and replicates. Abstracts are useful for discovery; use full methods and results for specific claims when available. |
| Metabolomics and compound datasets | MetaboLights, Metabolomics Workbench, GNPS/MassIVE, MassBank, and study supplements. Check annotation level, standards, spectra, tissue, extraction, and whether a feature is identified or only putatively matched. |
| Proteomics and protein evidence | PRIDE/ProteomeXchange, MassIVE, PeptideAtlas, UniProt, and study supplements. Distinguish sample-level protein detection from gene expression, transcript evidence, homology, predicted proteins, and a reference proteome. Preserve accessions, peptide or method evidence, tissue, and sample details. |
| Curated chemical identity and structure | PubChem, ChEBI, KEGG, and other relevant registries for identifiers, formulas, synonyms, and structures. These identify molecules; they do not establish presence in a food. |
| Taxonomy and food-part verification | An appropriate taxonomic authority plus reliable anatomy or food-cut references. Preserve synonyms and identifiers used to connect records. |
| Real food imagery and image rights | Wikimedia Commons file pages, public-domain government repositories, botanical or herbarium repositories, museums, and contributor-owned photographs. Verify the depicted subject and exact license on the source page before bundling. |

Search every source family that is relevant and reasonably accessible. Do not stop after finding one convenient database row or paper. When a family has no relevant records, log the queries and outcome. If access is blocked, record the limit and leave that source family open. One reliable source may support a provisional claim when it is the only evidence found, but mark the limited source coverage. Prefer independent corroboration when it exists.

## 4. Extract one evidence record per claim and sample context

For every candidate compound, protein, protein group, carbohydrate fraction, or structural relationship, capture:

- Exact claim and source URL or DOI, full citation, and source terms.
- Taxon, named raw food form, edible part or tissue, cultivar or breed, maturity or development, storage, and sample size where available. Treat cooked or processed source samples as out-of-scope leads for this version and never use their amounts in a raw profile.
- Detected, predicted, or unknown status; measurement status; analytical method; original unit and basis; range or variation; detection or quantitation limits; conversion; and reliability category.
- Compound identifier and structure source where appropriate. For proteins, retain a supported accession or identity and sample evidence. For polymers and mixtures, do not invent one formula or unique 3D conformer.
- Whether the source supports sample-level presence, measurement, prediction, or only taxonomic or chemical background. Never turn database inheritance, a pathway, gene expression, or a sequence into sample-level detection.

Use the project reliability labels consistently: direct_measurement for a matching sample and part with method; limited_context when important context differs or is missing; predicted for inference; unreviewed for source-linked records awaiting project review; unknown when no useful source supports the claim. A label never replaces the explanation.

### Compare sources without manufacturing consensus

- Compare values only when analyte definition, raw food identity, tissue, basis, and method are compatible.
- Keep results from different cultivars, maturity, tissue, or extraction as separate records. Do not average unlike measurements or silently transfer a value to the featured food. Exclude cooked or processed results from the raw profile.
- Record disagreements and plausible source-specific explanations. Do not select the result that looks convenient.
- Show an amount only when a source gives a defensible quantity for a compatible sample. Preserve the reported value and any calculation. Qualitative claims have no amount.
- A source about one plant part or animal tissue cannot support another part without explicit evidence.

## 5. Represent carbohydrates without confusing free sugars and polymers

For every carbohydrate, label its level: free monosaccharide, disaccharide, oligosaccharide, starch or glycogen, fiber fraction, or named structural polysaccharide. Separate food-level measures such as dietary fiber from individual molecular species.

- Clearly label whether glucose, fructose, sucrose, galactose, or another sugar was measured as a free or soluble sugar in the food or is only a bound residue or repeat unit in a polymer.
- If supported, describe the polymer, tissue, unit composition, and linkage. Examples include cellulose as beta-(1→4)-linked glucose residues; xyloglucan as a glucose backbone with xylose residues; and pectin with galacturonic-acid-rich HG and rhamnose/GalA RG-I regions plus galactose/arabinose side-chain residues.
- A residue in cellulose or pectin is not a free-sugar measurement. State this and leave the food-specific amount blank when it was not measured for the named sample.
- Sucrose is a disaccharide made from glucose and fructose units, not a generic polymer monomer. Do not list every example sugar as present in every food.
- Complex carbohydrates are heterogeneous and may not have one formula, PubChem record, or 3D structure. Use a polymer/unit diagram and link to verified small-molecule structures for individual sugars when available.

## 6. Verify every image against identity and reuse terms

Use a real photograph or a taxonomically verified scientific photograph; never substitute an AI-generated specimen image. Before adding it:

1. Inspect the pixels and original file page. Confirm the depicted food, species when available, edible part, and form match the profile. Do not infer cultivar from appearance alone.
2. Confirm the source license and attribution, share-alike, non-commercial, and modification requirements. A search-result thumbnail is not license evidence.
3. Bundle a local optimized copy when terms allow. Record image path, source file page and file URL, creator, license and link, alt text, depicted subject, taxon, match scope, and crop/resizing/edit history.
4. Show a visible credit near the image. If the species or cultivar is not established, say so. If the species cannot be matched, do not show that image for the food.

## 7. Build a source-complete profile and expose gaps

Write claims as structured data separate from presentation. Keep citations expandable and near their evidence; image attribution remains visible. Make detected, predicted, measured, unquantified, and limited-context states clear to the public. Group researcher review by evidence and reliability.

For every food, use the dossier template to record:

- Source families checked, exact queries, dates, positive and negative outcomes, inaccessible sources, cooked/processed leads excluded, and follow-up query variants.
- Food parts covered; supported findings by tissue; candidates rejected and why; source conflicts; and unresolved questions.
- Image verification and license trail.
- Coverage status for food composition, compounds and metabolites, proteins, carbohydrate structure, parts or tissues, preparation forms, and species image.

“No evidence located in the sources searched” is acceptable. “Absent from the food” requires a suitable assay and sample that support an absence result. Do not call a profile complete; state which source families and sample contexts it covers.

## 8. Final review before adding records

Check every proposed record against the project schema:

1. Is the taxon and food form unambiguous?
2. Does the evidence connect the finding to this species and part?
3. Are detected and predicted claims separate? Are polymer units distinct from free compounds?
4. Do amount, unit, basis, range, method, sample, and conversion match the source?
5. Were all relevant independent source families searched and recorded? Are conflicts and scope limits retained?
6. Is the source license recorded? Is a bundled image real, correctly matched, reusable, locally attributed, and visually checked?
7. Is every included sample raw and uncooked, with its form described precisely? Are cooked or processed data kept out of the raw profile?
8. Can a researcher inspect the evidence and contribute to each remaining gap?

Leave an item unlisted or explicitly unresolved if the evidence does not answer these questions.
