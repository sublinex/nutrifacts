import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { GLViewer } from '3dmol'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FilePlus2,
  FlaskConical,
  Heart,
  Leaf,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { evidence, tomatoCarbohydrateMap, tomatoFood, tomatoPartContext } from './data'
import './App.css'

type Tissue = 'Whole fruit' | 'Flesh' | 'Skin' | 'Seeds'
type EvidenceView = 'Everything' | 'Nutrients' | 'Carbohydrates' | 'Proteins'

const tissues: Tissue[] = ['Whole fruit', 'Flesh', 'Skin', 'Seeds']
const searchableFood = /tomato|tomatoes|grape/i
const formatNumber = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value)
const formatRange = ({ min, max }: { min: number; max: number }) => `${formatNumber(min)}–${formatNumber(max)}`
const formatFormula = (formula: string) => formula.replace(/[0-9]/g, (digit) => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)])
const capitalize = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`

function Molecule3DPreview({ cid, name }: { cid: number; name: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'interactive' | 'fallback'>('loading')

  useEffect(() => {
    let isMounted = true
    let viewer: GLViewer | null = null
    const mount = mountRef.current
    const resizeObserver = mount ? new ResizeObserver(() => viewer?.resize()) : null
    if (mount && resizeObserver) resizeObserver.observe(mount)

    async function loadStructure() {
      try {
        const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`)
        if (!response.ok) throw new Error('PubChem conformer unavailable')
        const structure = await response.text()
        const $3Dmol = await import('3dmol')
        if (!isMounted || !mount) return
        viewer = $3Dmol.createViewer(mount, { backgroundColor: '#fffefa', antialias: true })
        viewer.addModel(structure, 'sdf')
        viewer.setStyle({}, { sphere: { scale: 0.24 }, stick: { radius: 0.14 } })
        viewer.zoomTo()
        viewer.render()
        viewer.resize()
        setStatus('interactive')
      } catch {
        if (isMounted) setStatus('fallback')
      }
    }

    void loadStructure()
    return () => {
      isMounted = false
      resizeObserver?.disconnect()
      viewer?.clear()
    }
  }, [cid])

  return <>
    <div className="molecule-3d-mount" ref={mountRef} role="img" aria-label={`Interactive three-dimensional conformer of ${name}. Drag the viewer to rotate it.`} />
    {status === 'loading' && <div className="viewer-unavailable"><FlaskConical size={17} /><span>Loading PubChem 3D conformer…</span></div>}
    {status === 'fallback' && <img className="molecule-3d-fallback" src={`https://pubchem.ncbi.nlm.nih.gov/image/img3d.cgi?cid=${cid}`} alt={`${name} static three-dimensional conformer from PubChem`} />}
    {status === 'interactive' && <span className="canvas-corner">3D · DRAG TO ROTATE</span>}
  </>
}

function App() {
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState<'Food' | 'Compound'>('Food')
  const [activeTissue, setActiveTissue] = useState<Tissue>('Whole fruit')
  const [activeView, setActiveView] = useState<EvidenceView>('Everything')
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  const [activeCompound, setActiveCompound] = useState('lycopene')
  const [moleculeMode, setMoleculeMode] = useState<'2D' | '3D'>('2D')
  const [isContributionOpen, setIsContributionOpen] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestedFood, setSuggestedFood] = useState<string>(tomatoFood.name)
  const [suggestedCompound, setSuggestedCompound] = useState('')
  const [hasAmount, setHasAmount] = useState(false)

  useEffect(() => {
    if (!isContributionOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsContributionOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isContributionOpen])

  const visibleEvidence = useMemo(() => {
    let items = activeView === 'Everything'
      ? evidence
      : activeView === 'Carbohydrates'
        ? evidence.filter((item) => item.category === 'Carbohydrate')
        : activeView === 'Proteins'
          ? []
          : evidence.filter((item) => item.category !== 'Carbohydrate')

    const query = search.trim().toLowerCase()
    if (query && (searchMode === 'Compound' || ['lycopene', 'vitamin c', 'dietary fiber', 'protein'].some((term) => query.includes(term)))) {
      items = items.filter((item) => `${item.name} ${item.unit_label} ${item.category}`.toLowerCase().includes(query))
    }
    return items
  }, [activeView, search, searchMode])

  const showSearchResults = searchFocused && search.trim().length > 0
  const hasFoodMatch = searchMode === 'Food'
    ? searchableFood.test(search)
    : evidence.some((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))

  function openContribution(suggestedFood: string = tomatoFood.name) {
    setDraftSaved(false)
    setHasAmount(false)
    setIsContributionOpen(true)
    setSuggestedFood(suggestedFood)
    setSuggestedCompound(searchMode === 'Compound' ? search.trim() : '')
  }

  function saveContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const rawAmount = String(formData.get('amount') ?? '').trim()
    const rawUnit = String(formData.get('unit') ?? '').trim()
    const rawSampleCount = String(formData.get('sampleCount') ?? '').trim()
    const draft = {
      schema_version: '0.2',
      submission_status: 'draft_for_review',
      food: String(formData.get('food') ?? '').trim(),
      raw_food_state: 'raw_uncooked',
      raw_form_details: String(formData.get('rawFormDetails') ?? '').trim(),
      tissue_or_plant_part: String(formData.get('foodPart') ?? '').trim(),
      compound: String(formData.get('compound') ?? '').trim(),
      finding_type: String(formData.get('findingType') ?? 'compound'),
      evidence_status: String(formData.get('evidenceStatus') ?? 'detected'),
      amount: rawAmount ? {
        value: Number(rawAmount),
        unit: rawUnit,
        basis: String(formData.get('basis') ?? '').trim() || null,
        sample_count: rawSampleCount ? Number(rawSampleCount) : null,
        reliability_category: 'unreviewed',
      } : null,
      source_locator: String(formData.get('source') ?? '').trim(),
      method: String(formData.get('method') ?? '').trim() || null,
      contributor_note: String(formData.get('note') ?? '').trim() || null,
      proposed_data_license: 'CC BY 4.0',
      review_note: 'This file is a proposal. It is not part of the public dataset until reviewed and accepted.',
    }
    const file = new Blob([`${JSON.stringify(draft, null, 2)}\n`], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `nutrifacts-${draft.compound.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-draft.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setDraftSaved(true)
  }

  function selectSearchSuggestion(value: string) {
    setSearch(value)
    setSearchFocused(false)
    if (['lycopene', 'vitamin c', 'dietary fiber'].includes(value.toLowerCase())) {
      setSearchMode('Compound')
      setActiveView('Everything')
    } else {
      setSearchMode('Food')
    }
  }

  const selectedItem = evidence.find((item) => item.id === activeCompound) ?? evidence[0]
  const activePartContext = tomatoPartContext.parts.find((part) => part.id === activeTissue.toLowerCase())
  const configuredRepositoryUrl = import.meta.env.VITE_REPOSITORY_URL as string | undefined
  const repositoryUrl = configuredRepositoryUrl?.trim() || 'https://github.com/sublinex/nutrifacts'
  const contributionIssueUrl = `${repositoryUrl}/issues/new?template=evidence-contribution.yml`
  const donationUrl = (import.meta.env.VITE_DONATION_URL as string | undefined)?.trim()

  return (
    <div className="app-shell">
      <div className="announcement"><span className="announcement-dot" /> An open field guide to food chemistry <span className="announcement-divider">/</span> <a href="#about">Free to explore, open to contribute <ArrowUpRight size={13} /></a></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="NutriFacts home"><span className="wordmark-icon"><Leaf size={18} /></span><span>nutri<span>facts</span></span><sup>OPEN</sup></a>
        <nav aria-label="Main navigation" className="main-nav">
          <a className="nav-active" href="#explore">Explore</a>
          <a href="#research">For researchers</a>
          <a href="#about">About the data</a>
        </nav>
        <div className="header-actions">
          <a className="support-link" href={donationUrl || '#support'}><Heart size={15} /> Support</a>
          <a className="contribute-top" href="#gaps" onClick={(event) => { event.preventDefault(); openContribution() }}><FilePlus2 size={15} /> Contribute</a>
        </div>
      </header>

      <main id="top">
        <section className="intro-section" id="explore">
          <div className="intro-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE OPEN FOOD COMPOSITION ATLAS</div>
            <h1>Food has a story<br />at every <em>scale.</em></h1>
            <p className="intro-lede">Explore the compounds inside whole foods, the evidence behind them, and what we still need to learn.</p>
            <div className="search-wrap">
              <div className="search-mode" role="group" aria-label="Search by">
                {(['Food', 'Compound'] as const).map((mode) => <button key={mode} className={searchMode === mode ? 'mode-active' : ''} onClick={() => setSearchMode(mode)}>{mode}</button>)}
              </div>
              <label className="search-box">
                <Search size={18} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)} onKeyDown={(event) => { if (event.key === 'Enter' && search.trim()) setSearchFocused(false) }} placeholder={searchMode === 'Food' ? 'Search foods: tomato, rice, beans…' : 'Search compounds: lycopene, starch…'} aria-label={searchMode === 'Food' ? 'Search foods' : 'Search compounds'} />
                <kbd>↵</kbd>
              </label>
              {showSearchResults && <div className="search-popover" role="listbox" aria-label="Search results">
                {hasFoodMatch ? <button className="search-result" onMouseDown={() => selectSearchSuggestion(searchMode === 'Compound' ? search : tomatoFood.name)}><span className="result-thumb"><img src={tomatoFood.image.path} alt="" /></span><span><strong>{searchMode === 'Compound' ? search : tomatoFood.name}</strong><small>{searchMode === 'Compound' ? 'Compound in this food profile' : `${tomatoFood.scientific_name} · ${tomatoFood.preparation}`}</small></span><ChevronRight size={16} /></button> : <div className="search-empty"><strong>No cited {searchMode.toLowerCase()} entry yet</strong><span>Help add a source for “{search}”.</span><button onMouseDown={(event) => { event.preventDefault(); setSearchFocused(false); openContribution(searchMode === 'Food' ? search : tomatoFood.name) }}>Suggest an entry <ArrowUpRight size={13} /></button></div>}
              </div>}
            </div>
            <div className="intro-footnote"><ShieldCheck size={15} /> Amounts appear only where a cited measurement supports them.</div>
          </div>
          <figure className="intro-art">
            <div className="art-index">SPECIMEN 001 <span>·</span> FRUIT</div>
            <img className="food-photo" src={tomatoFood.image.path} alt={tomatoFood.image.alt} />
            <figcaption className="art-caption"><span>RAW · WHOLE</span><span><i>{tomatoFood.scientific_name}</i></span><span className="image-credit">Photo <a href={tomatoFood.image.source_url} target="_blank" rel="noreferrer">{tomatoFood.image.creator}</a> · <a href={tomatoFood.image.license_url} target="_blank" rel="noreferrer">{tomatoFood.image.license}</a></span></figcaption>
          </figure>
        </section>

        {searchMode === 'Food' && search.trim() && !searchableFood.test(search) ? <section className="no-food-profile">
          <div className="empty-orbit"><Search size={21} /></div><div><span className="eyebrow small-eyebrow">NO CITED FOOD PROFILE YET</span><h2>“{search.trim()}” isn’t in this preview.</h2><p>We won’t fill the gap with guessed values. Start a sourced proposal and help build the next food profile.</p><button className="primary-action" onClick={() => openContribution(search.trim())}><FilePlus2 size={15} /> Prepare a food draft <ArrowUpRight size={14} /></button><button className="clear-preview" onClick={() => setSearch('')}>Return to grape tomato example</button></div>
        </section> : <section className="food-workspace" aria-labelledby="food-title">
          <div className="food-heading">
            <div><div className="eyebrow small-eyebrow">FOOD PROFILE <span className="profile-divider">/</span> FOUNDATION FOODS</div><h2 id="food-title">{tomatoFood.name}<span className="food-mark">↗</span></h2><p className="food-subtitle">A USDA Foundation Foods sample record <span>·</span> FoodData Central ID {tomatoFood.source.food_data_central_id}</p></div>
            <a className="source-button" href={tomatoFood.source.url} target="_blank" rel="noreferrer"><BookOpen size={15} /> USDA record <ExternalLink size={12} /></a>
          </div>

          <div className="workspace-grid">
            <div className="evidence-panel">
              <div className="tissue-head"><div><span className="section-kicker">LOOKING AT</span><strong>{activeTissue}</strong></div><span className="tissue-hint"><CircleHelp size={14} /> Part-specific data when available</span></div>
              <div className="tissue-tabs" role="tablist" aria-label="Plant part">
                {tissues.map((tissue, index) => <button role="tab" aria-selected={activeTissue === tissue} className={activeTissue === tissue ? 'tissue-active' : ''} key={tissue} onClick={() => { setActiveTissue(tissue); setActiveView('Everything'); setSearch('') }}><span className="tab-index">0{index + 1}</span>{tissue}{tissue !== 'Whole fruit' && <span className="tab-gap">gap</span>}</button>)}
              </div>

              {activeTissue === 'Whole fruit' ? <>
                <div className="evidence-toolbar">
                  <div><h3>What’s been measured</h3><span className="results-count">{visibleEvidence.length} records <i>·</i> this food sample</span></div>
                  <label className="filter-select"><span className="sr-only">Filter evidence category</span><select value={activeView} onChange={(event) => setActiveView(event.target.value as EvidenceView)}><option>Everything</option><option>Nutrients</option><option>Carbohydrates</option><option>Proteins</option></select><ChevronDown size={14} /></label>
                </div>
                {search.trim() && searchMode === 'Compound' && <div className="filter-note">Showing matches for <strong>{search}</strong><button onClick={() => setSearch('')}>Clear</button></div>}
                <div className="evidence-list">
                  {visibleEvidence.map((item, index) => <article className={`evidence-row ${expandedSource === item.id ? 'row-expanded' : ''}`} key={item.id}>
                    <div className="row-number">0{index + 1}</div>
                    <button className={`molecule-token token-${item.id}`} aria-label={`View ${item.name} structure`} onClick={() => { setActiveCompound(item.id); setMoleculeMode('2D') }}><span>{item.id === 'lycopene' ? 'C₄₀' : item.id === 'vitamin-c' ? 'C₆' : '—'}</span><span>{item.id === 'lycopene' ? 'H₅₆' : item.id === 'vitamin-c' ? 'H₈O₆' : 'fiber'}</span></button>
                    <div className="row-main"><button className="compound-name" onClick={() => { setActiveCompound(item.id); setMoleculeMode('2D') }}>{item.name}<ArrowUpRight size={13} /></button><span className="compound-type">{item.unit_label}</span></div>
                    <div className="row-amount"><strong>{formatNumber(item.measurement.display_per_gram.value)} {item.measurement.display_per_gram.unit}</strong><span>range {formatRange(item.measurement.display_per_gram.range)} {item.measurement.display_per_gram.unit}</span></div>
                    <div className="row-evidence"><span className="measured-pill"><span /> {capitalize(item.evidence_status)} · {capitalize(item.measurement_status.replace('_', ' '))}</span><span className="sample-count">n = {item.measurement.sample_count} samples</span></div>
                    <button className="source-toggle" aria-expanded={expandedSource === item.id} onClick={() => setExpandedSource(expandedSource === item.id ? null : item.id)}>{expandedSource === item.id ? 'Hide source' : 'Source & method'}<ChevronDown size={14} /></button>
                    {expandedSource === item.id && <div className="source-detail"><div className="source-detail-mark"><BookOpen size={15} /></div><div><strong>{item.sources[0].name}</strong><p>{item.sources[0].citation}</p><p><b>Source measurement:</b> {formatNumber(item.measurement.reported.value)} {item.measurement.reported.unit}; range {formatRange(item.measurement.reported.range)} {item.measurement.reported.unit}.</p><p><b>Displayed value:</b> {formatNumber(item.measurement.display_per_gram.value)} {item.measurement.display_per_gram.unit}; {item.measurement.conversion}.</p><p><b>Method:</b> {item.method.name} · {item.method.details}</p><p><b>Research reliability:</b> {item.reliability_category.replace('_', ' ')}</p><p><b>Evidence review:</b> {item.curation_status}</p><p><b>Source terms:</b> {item.sources[0].license}</p><p>{item.note}</p><div className="source-links"><a href={item.sources[0].url} target="_blank" rel="noreferrer">Open USDA record <ExternalLink size={12} /></a>{item.method.reference_doi && <a href={`https://doi.org/${item.method.reference_doi}`} target="_blank" rel="noreferrer">Method reference · DOI <ExternalLink size={12} /></a>}</div></div></div>}
                  </article>)}
                  {visibleEvidence.length === 0 && <div className="no-data-row"><div className="empty-orbit"><FlaskConical size={21} /></div><div><strong>{activeView === 'Proteins' ? 'Protein identities await curation' : 'No matching evidence in this profile'}</strong><p>{activeView === 'Proteins' ? 'A public ripe-tomato pericarp proteomics dataset exists, but its protein identities and sample details have not been curated into this grape-tomato record.' : 'Clear the search or choose another evidence category.'}</p>{activeView === 'Proteins' && <a className="no-data-source" href="https://proteomecentral.proteomexchange.org/cgi/GetDataset?ID=PXD004932" target="_blank" rel="noreferrer">Open PRIDE dataset PXD004932 <ExternalLink size={11} /></a>}</div>{activeView === 'Proteins' && <button className="text-action" onClick={() => openContribution()}>Add a source <ArrowUpRight size={14} /></button>}</div>}
                </div>
                {(activeView === 'Everything' || activeView === 'Carbohydrates') && <section className="carbohydrate-map" aria-labelledby="carbohydrate-map-title">
                  <div className="carb-map-heading"><div><span className="section-kicker">STRUCTURE & LITERATURE CONTEXT</span><h3 id="carbohydrate-map-title">Carbohydrate map</h3></div><span className="carb-map-tag">AMOUNTS NOT TRANSFERRED</span></div>
                  <p className="carb-map-note">{tomatoCarbohydrateMap.note}</p>
                  {(['Soluble sugars', 'Cell-wall polysaccharides'] as const).map((group) => <div className="carb-group" key={group}>
                    <h4>{group}</h4>
                    <div className="carb-grid">{tomatoCarbohydrateMap.records.filter((record) => record.group === group).map((record) => {
                      const sources = record.source_ids.map((sourceId) => tomatoCarbohydrateMap.sources.find((source) => source.id === sourceId)).filter((source) => source !== undefined)
                      return <article className="carb-card" key={record.id}>
                        <div className="carb-card-meta"><span className="carb-class">{record.class}</span><span className="carb-status">{capitalize(record.evidence_status)} · {record.reliability_category.replace('_', ' ')}</span></div>
                        <h5>{record.name}</h5>
                        <p className="carb-part"><Leaf size={13} /> {record.part}</p>
                        <p className="carb-relationship">{record.relationship}</p>
                        {record.building_blocks.length > 0 && <div className="building-blocks"><span>UNITS / COMPONENTS</span><ul>{record.building_blocks.map((block) => <li key={`${record.id}-${block.name}`}><strong>{block.name}</strong><small>{block.role}</small></li>)}</ul></div>}
                        <div className="carb-amount-note">No amount shown for this USDA grape-tomato sample.</div>
                        <details className="carb-source-details"><summary>Study, sample & sources</summary><p><strong>Study sample:</strong> {record.sample_context}</p><p><strong>Food part:</strong> {record.part}</p>{sources.map((source) => <div className="carb-source" key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.name} <ExternalLink size={11} /></a><p>{source.citation}</p><span>Terms recorded: {source.license}</span></div>)}</details>
                      </article>
                    })}</div>
                  </div>)}
                  <p className="carb-map-footnote">Glucose and fructose are shown as free sugars when measured in fruit. Glucose, galactose, arabinose, xylose, rhamnose, and galacturonic acid can also appear as bound residues in structural carbohydrates; these are different chemical contexts.</p>
                </section>}
                <div className="not-listed-note"><Sparkles size={15} /><span><strong>Not listed here doesn’t mean absent.</strong> It means a compatible, cited record hasn’t been linked yet.</span><button onClick={() => openContribution()}>Suggest evidence <ArrowUpRight size={13} /></button></div>
              </> : <section className="tissue-context" id="gaps" aria-labelledby="part-context-title"><div className="part-context-stamp"><span>RESEARCH<br />LEADS</span><ArrowDownRight size={15} /></div><div className="part-context-copy"><div className="gap-eyebrow"><span /> PART-SPECIFIC LITERATURE · LIMITED CONTEXT</div><h3 id="part-context-title">{activePartContext?.label ?? activeTissue} studies need curation.</h3><p>{activePartContext?.summary}</p><p className="part-context-sample"><strong>Sample fit:</strong> {activePartContext?.sample_context} No study amount is transferred to this USDA grape-tomato sample.</p><details className="part-source-details"><summary>View part-matched research sources</summary>{activePartContext?.sources.map((source) => <div className="part-source" key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} <ExternalLink size={11} /></a><p>{source.citation}</p><small>Terms recorded: {source.license}</small></div>)}</details><button className="primary-action" onClick={() => openContribution()}><FilePlus2 size={15} /> Prepare a contribution <ArrowUpRight size={14} /></button><a className="part-dossier-link" href="https://github.com/sublinex/nutrifacts/blob/main/data/foods/usda-fdc-321360.research.md" target="_blank" rel="noreferrer">Open the full source-coverage dossier <ExternalLink size={11} /></a></div></section>}
            </div>

            <aside className="molecule-panel" aria-label="Molecule viewer">
              <div className="molecule-panel-head"><div><span className="section-kicker">MOLECULE VIEWER</span><strong>{selectedItem.name}</strong></div><span className="viewer-index">MOL · 00{evidence.findIndex((item) => item.id === selectedItem.id) + 1}</span></div>
              <div className={`molecule-canvas ${moleculeMode === '3D' ? 'canvas-3d' : ''}`}>
                {moleculeMode === '2D' && selectedItem.pubchem_cid !== null ? <img className="structure-image" src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${selectedItem.pubchem_cid}/PNG?record_type=2d`} alt={`${selectedItem.name} two-dimensional chemical structure from PubChem`} onError={(event) => { event.currentTarget.style.display = 'none'; const sibling = event.currentTarget.nextElementSibling as HTMLElement | null; if (sibling) sibling.style.display = 'grid' }} /> : null}
                {moleculeMode === '3D' ? <Molecule3DPreview cid={selectedItem.pubchem_cid!} name={selectedItem.name} /> : <div className="structure-fallback" style={{ display: selectedItem.kind === 'food_fraction' ? 'grid' : undefined }}><div className="fallback-molecule"><span>{selectedItem.formula ? formatFormula(selectedItem.formula) : 'fraction'}</span><span className="fallback-rule" /><span>{selectedItem.name}</span></div><span>{selectedItem.kind === 'food_fraction' ? 'FOOD FRACTION · NOT ONE MOLECULE' : '2D STRUCTURE PREVIEW'}</span></div>}
                {moleculeMode === '2D' && <span className="canvas-corner">2D / PUBCHEM</span>}
              </div>
              <div className="viewer-tools">{selectedItem.kind === 'food_fraction' ? <span className="fraction-label">FOOD FRACTION</span> : <div className="molecule-switch" role="group" aria-label="Molecule view mode"><button className={moleculeMode === '2D' ? 'switch-active' : ''} onClick={() => setMoleculeMode('2D')}>2D</button>{selectedItem.pubchem_3d_conformer_available ? <button className={moleculeMode === '3D' ? 'switch-active' : ''} onClick={() => setMoleculeMode('3D')}>3D <Sparkles size={11} /></button> : <button className="switch-disabled" disabled title="PubChem has no generated 3D conformer for this flexible compound.">3D <CircleHelp size={10} /></button>}</div>}{selectedItem.pubchem_cid !== null && <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedItem.pubchem_cid}`} target="_blank" rel="noreferrer">Open in PubChem <ExternalLink size={12} /></a>}</div>
              <div className="molecule-meta"><span>FORMULA</span><strong>{selectedItem.formula ? formatFormula(selectedItem.formula) : '—'}</strong><span>STRUCTURE SOURCE</span><a href="https://pubchem.ncbi.nlm.nih.gov/docs/structures" target="_blank" rel="noreferrer">PubChem PUG REST <ExternalLink size={11} /></a></div>
              <div className="viewer-disclaimer"><CircleHelp size={14} /><span>{selectedItem.kind === 'food_fraction' ? 'Dietary fiber is a food fraction, not one molecule with a single chemical structure.' : selectedItem.pubchem_3d_conformer_available ? 'The PubChem conformer is a computed molecule view; it does not show the molecule inside food tissue.' : 'PubChem lists a 2D lycopene structure but no generated 3D conformer for this flexible molecule.'}</span></div>
            </aside>
          </div>
          <div className="workspace-foot"><span><ShieldCheck size={14} /> Evidence status and units stay attached to each record.</span><a href="#about">How we describe evidence <ArrowUpRight size={13} /></a></div>
        </section>}

        <section className="principles-section" id="research">
          <div className="principles-title"><div className="eyebrow small-eyebrow">BUILT FOR CURIOSITY. OPEN TO SCRUTINY.</div><h2>See what’s known.<br /><em>Help verify the rest.</em></h2></div>
          <div className="principle-list">
            <article><span className="principle-num">01</span><div><h3>Evidence is visible</h3><p>Expand a record to see its source, method, sample count, and any reported range.</p></div><BookOpen size={18} /></article>
            <article><span className="principle-num">02</span><div><h3>Gaps are part of the map</h3><p>Missing, predicted, and measured findings are kept distinct. Unknown is not the same as absent.</p></div><CircleHelp size={18} /></article>
            <article><span className="principle-num">03</span><div><h3>Contributions start with a citation</h3><p>Prepare a small, portable evidence draft. Researchers can review and validate before it joins the dataset.</p></div><FilePlus2 size={18} /></article>
          </div>
        </section>

        <section className="about-strip" id="about"><div className="about-icon"><ShieldCheck size={20} /></div><div><strong>Open code. Open data. No paywall.</strong><p>App code is MIT licensed. Curated contributions are proposed under CC BY 4.0, with source terms recorded per entry. USDA FoodData Central is public domain.</p></div><a href="https://fdc.nal.usda.gov/api-guide/" target="_blank" rel="noreferrer">Data and attribution policy <ArrowUpRight size={13} /></a></section>
      </main>

      <footer className="site-footer" id="support"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-icon"><Leaf size={16} /></span><span>nutri<span>facts</span></span><sup>OPEN</sup></a><p>Good questions grow from good evidence.</p><div className="footer-links"><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a><a href={contributionIssueUrl} target="_blank" rel="noreferrer">Contribute <ArrowUpRight size={12} /></a>{donationUrl ? <a href={donationUrl} target="_blank" rel="noreferrer"><Heart size={12} /> Optional donations <ArrowUpRight size={12} /></a> : <a href={repositoryUrl} target="_blank" rel="noreferrer"><Heart size={12} /> Optional support on GitHub <ArrowUpRight size={12} /></a>}</div><small>Free for everyone · Made to be shared</small></footer>

      {isContributionOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsContributionOpen(false) }}>
        <section className="contribution-modal" role="dialog" aria-modal="true" aria-labelledby="contribution-title">
          <div className="modal-heading"><div className="modal-icon"><FilePlus2 size={18} /></div><button className="modal-close" aria-label="Close contribution form" onClick={() => setIsContributionOpen(false)}><X size={18} /></button></div>
          <span className="eyebrow small-eyebrow">COMMUNITY EVIDENCE DRAFT</span><h2 id="contribution-title">Add a missing piece.</h2><p className="modal-intro">Raw, uncooked foods only in this first version. Attach a source and describe exactly what it supports. This downloads a review draft; it won’t publish directly to the database.</p>
          <form onSubmit={saveContribution} className="contribution-form">
            <label>Food species and form<input name="food" required defaultValue={suggestedFood} placeholder="e.g. Solanum lycopersicum, grape tomato" /></label>
            <label>Raw form details<input name="rawFormDetails" required placeholder="e.g. ripe fresh fruit; dry uncooked grain; raw chicken breast" /></label>
            <label>Compound, protein, or finding<input name="compound" required defaultValue={suggestedCompound} placeholder="e.g. an identified protein" autoFocus /></label>
            <div className="form-row"><label>Finding type<select name="findingType" defaultValue="compound"><option value="compound">Small molecule / compound</option><option value="protein">Protein</option><option value="protein_group">Protein group or family</option><option value="carbohydrate">Carbohydrate or fraction</option><option value="other">Other finding</option></select></label><label>Evidence status<select name="evidenceStatus" defaultValue="detected"><option value="detected">Detected in a sample</option><option value="predicted">Predicted / inferred</option><option value="unknown">Unclear — needs review</option></select></label></div>
            <label>Tissue or plant part<input name="foodPart" required defaultValue={activeTissue} placeholder="e.g. tomato seed, skeletal muscle, vessel" /></label>
            <label>Source URL or DOI<input name="source" required placeholder="https://… or 10.xxxx/…" /></label>
            <div className="form-row amount-row"><label>Amount, if reliably reported<input name="amount" type="number" min="0" step="any" placeholder="Leave blank if unknown" onChange={(event) => setHasAmount(event.currentTarget.value.length > 0)} /></label><label>Unit{hasAmount && <span className="required-mark"> · required with amount</span>}<input name="unit" placeholder="e.g. µg/g" required={hasAmount} /></label></div>
            <div className="form-row"><label>Measurement basis<input name="basis" placeholder="e.g. per 100 g fresh weight" /></label><label>Sample count<input name="sampleCount" type="number" min="1" step="1" placeholder="if reported" /></label></div>
            <label>Method or sample details<input name="method" placeholder="e.g. LC-MS/MS, tomato seed sample" /></label>
            <label>Note for reviewers<textarea name="note" rows={2} placeholder="Context, uncertainty, or what should be checked" /></label>
            <label className="license-check"><input name="licenseAgreement" type="checkbox" required /><span>I have the right to share this contribution under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>, and I’ve included its source.</span></label>
            <div className="modal-footer"><span><ShieldCheck size={14} /> Drafts need human review</span><button type="submit" className="primary-action">Download draft <ArrowDownRight size={15} /></button></div>
            {draftSaved && <div className="draft-success" role="status"><Check size={15} /> Draft downloaded. <a href={contributionIssueUrl} target="_blank" rel="noreferrer">Open a GitHub evidence issue <ExternalLink size={12} /></a> and attach it.</div>}
          </form>
        </section>
      </div>}
    </div>
  )
}

export default App
