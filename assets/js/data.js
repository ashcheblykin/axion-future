/* =============================================================================
   data.js — everything the demo says. One document, read by every module.
   Nothing here is fetched: the page ships with its content, the way the Lens
   prototype ships with its register. Chats, widgets, signals, the Library sheet,
   the scheduled runs, the agent's scripted replies.
   ============================================================================= */
window.DATA = (() => {

  /* ---- who ------------------------------------------------------------------ */
  const user = { name: 'Aleksand Shcheblykin', email: 'a.shcheblykin@axionx.ai', initials: 'AS', org: 'Axion · MOMAH' };

  const models = [
    { id: 'gpt56',  name: 'GPT-5.6 Luna',     note: 'default · fast' },
    { id: 'axi2',   name: 'Axi Reason 2',     note: 'long-horizon planning' },
    { id: 'fable',  name: 'Claude Fable 5.1', note: 'careful · verified' },
    { id: 'gem35',  name: 'Gemini 3.5 Pro',   note: 'multimodal' },
  ];

  /* ---- the signals shelf (the same five the Lens draws) ------------------------ */
  const signals = [
    { id: 'taif',    title: 'Parts fell from a ride at Al Jabal Al Akhdar resort', place: 'Taif Amana', dot: '#ff5050', thumb: 'assets/figma/sig-thumb-1.jpg', lens: { subject: 'taif' },
      kind: 'Recreational facility safety', when: 'Today 09:14', severity: 'Critical' },
    { id: 'asiacup', title: 'AFC Asian Cup 2027 — readiness of the zones around the stadiums', place: 'Riyadh · Jeddah · Eastern Region', dot: '#e5ab3c', thumb: 'globe', lens: { subject: 'asiacup' },
      kind: 'Event readiness', when: 'Yesterday', severity: 'Watch' },
    { id: 'clean',   title: 'Rising platform trend on street cleanliness — south Riyadh', place: 'Qassim Amana', dot: '#ff5050', thumb: 'assets/figma/sig-thumb-3.jpg', lens: { subject: 'clean' },
      kind: 'Public realm', when: 'Today 07:40', severity: 'High' },
    { id: 'jeddah',  title: 'Facade sections fell from an existing building', place: 'Jeddah Amana', dot: '#ff5050', thumb: null, lens: { subject: 'jeddah' },
      kind: 'Building safety', when: 'Mon 16:02', severity: 'Critical' },
    { id: 'asiacup2', title: 'AFC Asian Cup 2027 — readiness of the zones around the stadiums', place: 'Riyadh · Jeddah · Eastern Region', dot: '#e5ab3c', thumb: 'globe', lens: { subject: 'asiacup' },
      kind: 'Event readiness', when: 'Yesterday', severity: 'Watch' },
  ];

  /* ---- the timeline widget's record and forecasts --------------------------------
     The geometry is the frame's (a 736-wide plot, 57 tall); the values are what the
     reading means at each point, so a tooltip can say a number rather than a pixel. */
  const timeline = {
    title: 'August 2026',
    metric: 'Inspection coverage',
    target: 70,
    months: ['Mar 2025','Jun 2025','Sep 2025','Dec 2025','Mar 2026','Jun 2026','Sep 2026','Dec 2026','Mar 2027','Jun 2027','Sep 2027'],
    /* the record: x in plot px, y in plot px, the value read there */
    record: [ { x: 2, y: 57, v: 41.0 }, { x: 94, y: 43, v: 52.4 }, { x: 206, y: 39, v: 58.1 }, { x: 419, y: 25, v: 74.9 } ],
    marks:  [ { x: 183, y: 40, v: 56.8, label: 'Inspection drive · Feb 2026' }, { x: 301, y: 34, v: 63.5, label: 'Licence renewals · Jun 2026' }, { x: 421, y: 25, v: 74.9, label: 'Now · Aug 2026' } ],
    now: { x: 456 },                                  /* the white upright */
    risk: { x: 498, label: 'Season start · Dec 2026', note: 'Without the package the score dips under 70% here' },
    forecasts: {
      base: { color: '#e5ab3c', label: 'No action',           pts: [ { x: 422, y: 25, v: 74.9 }, { x: 747, y: 25, v: 74.2 } ] },
      act:  { color: '#00d39b', label: 'With action package', pts: [ { x: 421.5, y: 25, v: 74.9 }, { x: 705.5, y: 2, v: 90.0 } ] },
    },
    past: { w: 419 },
  };

  /* ---- the widgets the agent can open on the right -------------------------------- */
  const widgets = {
    scene: { id: 'scene', title: 'Riyard scene', h: 436, kind: 'scene', lens: { subject: 'taif', lens: 'scene' }, fallback: 'assets/figma/scene-riyadh.jpg' },
    kpis:  { id: 'kpis',  title: 'Global KPIs',  h: 604, kind: 'kpis',  lens: { subject: 'taif', lens: 'location' }, fallback: 'assets/figma/globe.png' },
    signals: { id: 'signals', title: 'Signals', h: 372, kind: 'signals' },
    chart: { id: 'chart', title: 'Compliance · Taif vs Jeddah', h: 300, kind: 'chart' },
    actions: { id: 'actions', title: 'Action package', h: 420, kind: 'actions' },
  };

  /* ---- the incident block the open chat carries -------------------------------------- */
  const incident = {
    type: 'incident',
    card: {
      title: 'Timeline & current situation',
      rows: [
        { t: '09:14', text: 'Trending content detected by social listening' },
        { t: '09:44', text: 'Location and establishment verified via BaladyLens' },
        { t: '10:26', text: 'Ride shut down and perimeter fenced' },
        { t: '11:50', text: 'Engineering check of similar rides on site' },
        { t: '12:50', text: 'Final safety report and restart decision', flag: 'Decision needed', now: true },
      ],
    },
    photo: 'assets/figma/ride-photo.jpg',
    meta: [
      { text: 'Taif Amana · Recreational facility safety · Al Jabal Al Akhdar resort — rides area · ' },
      { text: 'Licence no. H-48221', href: '#/library' },
      { text: ' · ' },
      { text: 'Post on X ↗', href: 'https://x.com', external: true },
    ],
  };

  const actionPackage = {
    type: 'actions',
    title: 'Action package · close the gap that allowed this',
    intro: 'Measures that close the gap which allowed the event — not the event itself.',
    items: [
      { text: 'Certified engineering inspection before every operating season — as a licence condition', scope: 'City-wide', when: 'Within 30 days', owner: 'Licensing & Safety', effect: 'Covers every high-risk ride licensed in Taif' },
      { text: 'Raise inspection coverage of high-risk rides from 41% to 90%', scope: 'City-wide', when: 'Before season end', owner: 'Inspection teams', effect: 'The slice that allowed this event' },
      { text: 'Social-listening alert routed to the on-duty engineer, not the media desk', scope: 'Kingdom-wide', when: 'This week', owner: 'Axion operations', effect: 'Detection to shutdown under 60 minutes' },
    ],
  };

  const forecastText = 'If delayed detection and shutdowns continue, the compliance score below 70% will worsen through Q4 2026 and into 2027. Structural failures without preventive inspections may lead to regulatory action from Taif Amana, risking licence suspension for facility H-48221. Each incident damages reputation, eroding visitor trust and reducing attendance by 12–18%. By mid-2027, the resort may fall below operational viability, making recovery costly.';

  /* ---- chats ------------------------------------------------------------------------- */
  const ksaTitles = [
    ['Population density by districts', 'info'], ['Traffic heat map', 'ghost'], ['5G coverage area analysis', 'ghost'],
    ['Clusters of sales points', 'info'], ['Population migration Q3', 'ghost'], ['Delivery zones for couriers', 'ghost'],
    ['Isochrones 15 min from the metro', 'ghost'], ['Accident distribution for August', 'ghost'], ["Competitors' trading zones", 'positive'],
    ['Coverage of mobile towers', 'warning'], ['Commuter migration flows', 'info'], ['POI density by categories', 'ghost'],
    ['Flooding forecast zones', 'negative'], ['Pedestrian accessibility index', 'warning'], ['Logistics routes KSA', 'ghost'], ['Road network load', 'ghost'],
  ];
  const cityTitles = [
    ['Population density by districts', 'info'], ['Traffic heat map', 'ghost'], ['5G coverage area analysis', 'info'],
    ['Clusters of sales points', 'info'], ['Population migration Q3', 'ghost'], ['Delivery zones for couriers', 'ghost'],
    ['Isochrones 15 min from the metro', 'ghost'], ['Accident distribution for August', 'ghost'], ["Competitors' trading zones", 'ghost'],
    ['Coverage of mobile towers', 'ghost'], ['Commuter migration flows', 'ghost'], ['POI density by categories', 'ghost'],
    ['Flooding forecast zones', 'ghost'], ['Pedestrian accessibility index', 'ghost'], ['Logistics routes KSA', 'ghost'], ['Road network load', 'ghost'],
  ];
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const chats = {};
  const mk = (project, title, dot, extra) => {
    const id = project + '-' + slug(title);
    chats[id] = Object.assign({ id, project, title, dot, messages: [], widgets: [] }, extra || {});
    return id;
  };

  /* the open conversation — the accident in August is the Taif ride */
  const seeded = {
    'ksa-accident-distribution-for-august': {
      widgets: ['scene', 'kpis'],
      messages: [
        { role: 'user', text: "So the ride was shut down by 10:26, that's good, but walk me through these signals — are these all related events or separate reports?" },
        { role: 'agent', ago: '5 min ago',
          text: 'The incident was recorded at 09:14 via social monitoring: video showing detached metal parts of the attraction.',
          blocks: [incident],
          console: [['search_signals', 'query="Al Jabal Al Akhdar" · window=24h', 212], ['lens.open', 'subject=taif · lens=media', 340], ['registry.verify', 'BaladyLens · licence H-48221', 128]] },
        { role: 'user', text: 'What will happen if nothing is done?' },
        { role: 'agent', ago: '1 min ago', dim: true,
          text: forecastText,
          blocks: [{ type: 'timeline' }],
          console: [['forecast.run', 'metric=inspection_coverage · horizon=Sep 2027 · branches=2', 1460], ['kpi.read', 'compliance_score · Taif Amana', 96]] },
      ],
    },
    'ksa-population-density-by-districts': {
      widgets: ['kpis'],
      messages: [
        { role: 'user', text: 'Which Riyadh districts crossed 12,000 people per km² this quarter?' },
        { role: 'agent', ago: '2 h ago', text: 'Four districts crossed the line in Q3: Al Olaya, Al Malaz, Al Batha and Al Shumaisi. Al Batha grew fastest — 9.4% quarter on quarter — driven by worker housing conversions along King Fahd Road.',
          blocks: [{ type: 'kpis', items: [
            { label: 'Al Olaya', value: '13,210', unit: '/km²', delta: '+3.1%', color: 'var(--info)', pct: 88 },
            { label: 'Al Malaz', value: '12,870', unit: '/km²', delta: '+4.6%', color: 'var(--info)', pct: 86 },
            { label: 'Al Batha', value: '12,405', unit: '/km²', delta: '+9.4%', color: 'var(--warning)', pct: 83 },
            { label: 'Al Shumaisi', value: '12,060', unit: '/km²', delta: '+2.2%', color: 'var(--positive)', pct: 80 } ] }],
          console: [['census.query', 'district_density · q=2026Q3', 420], ['map.render', 'choropleth · 47 districts', 210]] },
      ],
    },
    'ksa-traffic-heat-map': {
      widgets: ['kpis'],
      messages: [
        { role: 'user', text: 'Where is the evening peak worst on the ring road this week?' },
        { role: 'agent', ago: '3 h ago', text: 'The Northern Ring between Exit 5 and Exit 8 holds the worst evening peak: average speed 19 km/h between 16:40 and 18:20, 34% below the same week last year. The cause is the lane closure at the Al Thumamah interchange, scheduled to end on 14 September.',
          blocks: [{ type: 'chart', title: 'Average speed · Northern Ring · 16:00–19:00', unit: 'km/h', bars: [ ['Exit 3–5', 31], ['Exit 5–8', 19], ['Exit 8–10', 27], ['Exit 10–12', 38], ['Exit 12–14', 44] ], color: 'var(--warning)', max: 60 }],
          console: [['traffic.read', 'segment_speed · ring_road · 7d', 380], ['works.lookup', 'permits near Al Thumamah', 140]] },
      ],
    },
    'ksa-flooding-forecast-zones': {
      widgets: ['kpis'],
      messages: [
        { role: 'user', text: 'Show me the wadis that will overflow if we get the 40 mm scenario again.' },
        { role: 'agent', ago: 'Yesterday', text: 'Under the 40 mm / 2 h scenario three channels exceed bank height: Wadi Hanifah at Al Uraija (by 0.6 m), Wadi Laban at the Dirab crossing (0.4 m) and the Al Batha storm drain at the Al Malaz box culvert (0.9 m). 2,140 residential units sit inside the resulting flood prints; 61% of them were already flagged in the March assessment.',
          blocks: [{ type: 'kpis', items: [
            { label: 'Units in flood print', value: '2,140', delta: 'March: 1,890', color: 'var(--negative)', pct: 72 },
            { label: 'Culverts under capacity', value: '3', delta: 'of 27 assessed', color: 'var(--warning)', pct: 11 },
            { label: 'Warning lead time', value: '46', unit: 'min', delta: 'target 90', color: 'var(--negative)', pct: 51 } ] },
            actionPackage ],
          console: [['hydro.simulate', 'scenario=40mm/2h · basins=3', 2210], ['registry.intersect', 'residential parcels × flood print', 510]] },
      ],
    },
    'ksa-coverage-of-mobile-towers': {
      widgets: ['kpis'],
      messages: [
        { role: 'user', text: 'Any districts where the AFC Asian Cup fan zones have no 5G at all?' },
        { role: 'agent', ago: 'Yesterday', text: 'Two of the eleven planned fan zones — Al Sulai and the Jeddah Corniche north extension — have no 5G tower within 800 m. Both have operator permits pending since May; STC lists the Corniche mast as "site access blocked". I have opened the readiness signal beside this thread.',
          blocks: [{ type: 'signals', ids: ['asiacup'] }],
          console: [['coverage.query', 'tech=5G · radius=800m · sites=fan_zones', 640], ['permits.status', 'operator=STC,Mobily', 220]] },
      ],
    },
    'ksa-pedestrian-accessibility-index': {
      widgets: ['scene'],
      messages: [
        { role: 'user', text: 'Walk me down Olaya Street — is the new sidewalk continuous?' },
        { role: 'agent', ago: '2 d ago', text: 'The July capture of Olaya Street shows the sidewalk continuous for 293 m on the east side; the west side breaks twice at driveway aprons without kerb ramps (at 118 m and 204 m from the Tahlia junction). I have opened the street capture on the right — drag to look around, scroll to walk.',
          blocks: [],
          console: [['scene.open', 'olaya-street · 3.43M splats', 900], ['accessibility.score', 'segment=olaya-east', 180]] },
      ],
    },
    'ksa-clusters-of-sales-points': {
      widgets: [],
      messages: [
        { role: 'user', text: 'Cluster the new retail licences from August by street.' },
        { role: 'agent', ago: '3 d ago', text: 'August produced 412 new retail licences. 58% fall into four clusters: Tahlia Street (91), Al Takhassusi (66), King Abdullah Road at Exit 9 (49) and the Diriyah Boulevard approach (33). The Diriyah cluster is new — no licences there in the previous twelve months.',
          blocks: [{ type: 'chart', title: 'New retail licences · August 2026', unit: 'licences', bars: [ ['Tahlia', 91], ['Al Takhassusi', 66], ['KAR · Exit 9', 49], ['Diriyah Blvd', 33], ['Other', 173] ], color: 'var(--info)', max: 180 }],
          console: [['licences.query', 'type=retail · month=2026-08', 300], ['cluster.dbscan', 'eps=250m · min=12', 410]] },
      ],
    },
    "ksa-competitors-trading-zones": {
      widgets: [],
      messages: [
        { role: 'user', text: 'Overlap between the three pharmacy chains in the north?' },
        { role: 'agent', ago: '4 d ago', text: 'Nahdi, Al Dawaa and Whites overlap in 14 catchments north of the ring road; in nine of them every chain has a branch within 600 m of the others. The remaining north-side catchments with none of the three: Al Arid west and Al Narjis east — both above 9,000 residents.',
          blocks: [],
          console: [['poi.query', 'category=pharmacy · brand in (Nahdi, Al Dawaa, Whites)', 260], ['catchment.overlap', 'radius=600m', 330]] },
      ],
    },
  };

  for (const [t, d] of ksaTitles) mk('ksa', t, d);
  for (const [t, d] of cityTitles) mk('cityview', t, d);
  for (const [id, s] of Object.entries(seeded)) Object.assign(chats[id], s);

  const projects = [
    { id: 'ksa', name: 'KSA insights', icon: 'alpha', chats: ksaTitles.map(([t]) => 'ksa-' + slug(t)) },
    { id: 'cityview', name: 'Cityview', icon: 'alpha', chats: cityTitles.map(([t]) => 'cityview-' + slug(t)) },
  ];

  /* ---- the agent's replies: keyed by what the question is about ------------------------
     Each reply is text + the blocks it draws + the widgets it opens + the console lines it
     logs while thinking. `follow` are the three suggestions offered under the reply. */
  const replies = [
    { match: /\b(scene|street|3d|walk|olaya|capture|look around)\b/i,
      text: 'Opening the Olaya Street capture on the right — 3.43M splats, shot in July 2026, 293 m of street. Drag to look, scroll to walk. The rides area itself has no capture yet; the closest measured street is 214 km away, so treat this as the stand-in it is.',
      widgets: ['scene'], follow: ['Show the same street in February', 'Where are the kerb ramps missing?', 'Open the resort on the map'],
      console: [['scene.open', 'olaya-street · lens=scene', 880], ['scene.register', 'bounds=24.691,46.685 → 24.694,46.688', 60]] },
    { match: /\b(kpi|kpis|global|map|globe|where|location|planet)\b/i,
      text: 'Here is the Kingdom read on the planet — the six documented cases as pins, the amanas washed by their compliance band. Taif sits at 41% inspection coverage for high-risk rides against a 90% target; city-wide coverage is on target, which is exactly why this slice was missed.',
      widgets: ['kpis'], follow: ['Which amana is lowest on high-risk rides?', 'Compare Taif with Jeddah', 'What changed since March?'],
      console: [['kpi.read', 'inspection_coverage · scope=high_risk_rides', 130], ['map.render', 'planet · 6 pins · band wash', 240]] },
    { match: /\b(nothing|happen|forecast|worse|if we wait|project|2027)\b/i,
      text: forecastText, blocks: [{ type: 'timeline' }], follow: ['What does the action package change?', 'Show the December risk', 'Who owns the inspections?'],
      console: [['forecast.run', 'metric=inspection_coverage · horizon=Sep 2027 · branches=2', 1460], ['kpi.read', 'compliance_score · Taif Amana', 96]] },
    { match: /\b(action|do|measure|package|fix|prevent|recommend|should)\b/i,
      text: 'Three measures close the gap that allowed this event — not the event itself. Two are city-wide and sit with Licensing and the inspection teams; the third is ours: route the social-listening alert to the on-duty engineer instead of the media desk, which takes detection-to-shutdown from 72 minutes to under 60.',
      blocks: [actionPackage], follow: ['Commit all three', 'What does this cost?', 'Draft the licence condition'],
      console: [['measures.rank', 'gap=high_risk_ride_inspection · candidates=24', 720], ['owner.resolve', 'Licensing & Safety · Inspection teams', 90]] },
    { match: /\b(compare|jeddah|riyadh|qassim|versus|vs)\b/i,
      text: 'Against the other amanas, Taif is last on high-risk ride coverage and third on overall inspection coverage. Jeddah runs 78% on rides after its 2025 drive; Riyadh 71%; Qassim 64%. The gap is not resourcing — Taif has more inspectors per licensed facility than Jeddah — it is that seasonal rides were never in the high-risk list.',
      blocks: [{ type: 'chart', title: 'High-risk ride inspection coverage · 2026', unit: '%', bars: [ ['Jeddah', 78], ['Riyadh', 71], ['Eastern', 69], ['Qassim', 64], ['Taif', 41] ], color: 'var(--info)', max: 100, target: 90 }],
      follow: ['Why was Taif missed?', 'Show Jeddah\'s 2025 drive', 'Send this to the Taif mayor'],
      console: [['kpi.read', 'inspection_coverage · scope=high_risk_rides · amanas=5', 210], ['chart.render', 'bars · target=90', 40]] },
    { match: /\b(signal|signals|related|separate|report|reports|trending)\b/i,
      text: 'They are one event seen four times. The 09:14 X post, the two 09:30 TikTok reposts and the 10:02 Snap story all resolve to the same ride — BaladyLens matched the ride\'s frame geometry to the licence H-48221 footprint. The only separate report today is a facade fall in Jeddah, which I have kept on the signals shelf.',
      blocks: [{ type: 'signals', ids: ['taif', 'jeddah'] }], follow: ['Open the Jeddah facade case', 'How was the location verified?', 'Mute reposts of the same clip'],
      console: [['signals.dedupe', 'window=24h · matched=4 → 1', 180], ['lens.verify', 'BaladyLens · H-48221', 128]] },
    { match: /\b(who|owner|inspect|team|licens|licence)\b/i,
      text: 'Inspection of the resort sits with the Taif Amana inspection teams; the licence H-48221 was renewed on 3 March 2026 by Licensing & Safety without an engineering certificate, because seasonal rides were not on the high-risk list at the time. The last recorded inspection is 214 days old — overdue by 34.',
      follow: ['Show the inspection record', 'Add seasonal rides to the high-risk list', 'Who signed the renewal?'],
      console: [['registry.read', 'licence H-48221 · history', 140], ['inspections.last', 'facility=al-jabal-al-akhdar', 90]] },
  ];
  const fallback = {
    text: 'I read that against the Taif case and the Kingdom register. The short answer: the ride is still shut, the restart decision is due at 12:50, and the slice that allowed this — high-risk mechanical rides — is at 41% inspection coverage against a 90% target. Tell me which of these you want opened and I will put it beside the thread.',
    follow: ['Show the street capture', 'Open the global KPIs', 'What should we do about it?'],
    console: [['context.read', 'chat + signals + register', 160], ['answer.compose', 'grounded · 3 sources', 420]],
  };

  const welcome = {
    title: 'What do you want to know?',
    hint: 'Ask about a signal, a place, a number — or start from one of these.',
    suggestions: [
      { text: 'What happened at Al Jabal Al Akhdar this morning?', icon: 'lightning' },
      { text: 'Show me Olaya Street in 3D', icon: 'cube' },
      { text: 'Which amanas are below target on inspections?', icon: 'chart-bar' },
      { text: 'Schedule a weekly readiness report for the Asian Cup', icon: 'clock-countdown' },
    ],
  };

  /* ---- the Library sheet ------------------------------------------------------------------ */
  const columns = [
    { key: 'id', label: 'id', w: 112, icon: 'hash', type: 'id' },
    { key: 'track_id', label: 'track_id', w: 230, icon: 'hash', type: 'mono' },
    { key: 'user_id', label: 'user_id', w: 116, icon: 'hash', type: 'num' },
    { key: 'organization_id', label: 'organization_id', w: 122, icon: 'hash', type: 'num' },
    { key: 'recorded_at', label: 'recorded_at', w: 156, icon: 'calendar-blank', type: 'text' },
    { key: 'created_at', label: 'created_at', w: 156, icon: 'calendar-blank', type: 'text' },
    { key: 'lat', label: 'lat', w: 88, icon: 'map-pin-simple-area', type: 'num' },
    { key: 'lon', label: 'lon', w: 88, icon: 'map-pin-simple-area', type: 'num' },
    { key: 'altitude', label: 'altitude', w: 116, icon: 'map-pin-simple-area', type: 'num' },
    { key: 'h3_index_res9', label: 'h3_index_res9', w: 128, icon: 'hash', type: 'text' },
    { key: 'h3_index_res12', label: 'h3_index_res12', w: 128, icon: 'hash', type: 'text' },
    { key: 'is_uploaded', label: 'is_uploaded', w: 128, icon: 'flag', type: 'bool' },
    { key: 'azimuth', label: 'azimuth', w: 128, icon: 'hash', type: 'num' },
    { key: 'azimuth_accuracy', label: 'azimuth_accuracy', w: 136, icon: 'hash', type: 'num' },
    { key: 'speed_ms', label: 'speed_ms', w: 128, icon: 'hash', type: 'num' },
    { key: 'speed_accuracy', label: 'speed_accuracy', w: 128, icon: 'hash', type: 'num' },
    { key: 'lat_long_accuracy', label: 'lat_long_accuracy', w: 137, icon: 'hash', type: 'num' },
    { key: 'altitude_accuracy', label: 'altitude_accuracy', w: 128, icon: 'hash', type: 'num' },
    { key: 'source_lat', label: 'source_lat', w: 128, icon: 'map-pin-simple-area', type: 'num' },
    { key: 'source_lon', label: 'source_lon', w: 128, icon: 'map-pin-simple-area', type: 'num' },
    { key: 'is_map_matched', label: 'is_map_matched', w: 128, icon: 'flag', type: 'bool' },
    { key: 'source_version', label: 'source_version', w: 128, icon: 'tag-simple', type: 'badge-info' },
    { key: 'tags', label: 'tags', w: 128, icon: 'tag-simple', type: 'tags' },
    { key: 'detector_ids', label: 'detector_ids', w: 128, icon: 'hash', type: 'text' },
    { key: 'detection_classes', label: 'detection_classes', w: 136, icon: 'tag-simple', type: 'text' },
    { key: 'detection_classes_2', label: 'detection_classes', w: 136, icon: 'tag-simple', type: 'text' },
    { key: 'detection_bbox_tags', label: 'detection_bbox_tags', w: 153, icon: 'tag-simple', type: 'text' },
    { key: 'detection_bbox_tags_2', label: 'detection_bbox_tags', w: 153, icon: 'tag-simple', type: 'text' },
    { key: 'detection_aggregated_at', label: 'detection_aggregated_at', w: 176, icon: 'calendar-blank', type: 'text' },
    { key: 'outside_territory', label: 'outside_territory', w: 128, icon: 'flag', type: 'bool' },
    { key: 'capture_issue', label: 'capture_issue', w: 114, icon: 'flag', type: 'badge-warning' },
    { key: 'is_duplicate', label: 'is_duplicate', w: 103, icon: 'flag', type: 'bool' },
    { key: 'duplicate_of_frame_id', label: 'duplicate_of_frame_id', w: 158, icon: 'hash', type: 'num' },
    { key: 'duplicate_of_track_id', label: 'duplicate_of_track_id', w: 155, icon: 'hash', type: 'mono' },
  ];

  /* a deterministic generator, so the sheet is the same on every load */
  const lcg = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const pad = (n, w) => String(n).padStart(w, '0');
  const tracks = ['019fc4e1-245a-77ee-86e6-1a49b2d3e4f5', '019f26b2-3dbf-7f53-be83-bbb54dd71b18', '019fa07c-88e1-7c21-9d4a-2f6e0c1b7a90', '019fb3d5-1c02-7e88-a5b1-7d9e4f2c8b31'];
  const issues = ['Unspecified', 'Unspecified', 'Unspecified', 'Blurred', 'Unspecified', 'Occluded', 'Unspecified', 'Night'];
  const zones = ['Low Risk', 'Low Risk', 'High Risk', 'Medium Risk'];
  const companies = ['Someone and someone else', 'Al Yamama Co.', 'Nesma & Partners', 'Someone and someone else'];
  const total = 2147;
  function rows(page = 1, per = 20) {
    const rand = lcg(97 + page * 7919 + per);
    const out = [];
    for (let i = 0; i < per; i++) {
      const n = (page - 1) * per + i;
      if (n >= total) break;
      const r = rand();
      const min = 48 - Math.floor(n * 0.7) % 60;
      const issue = issues[Math.floor(rand() * issues.length)];
      const uploaded = rand() > 0.12;
      out.push({
        id: 2147506013 - n,
        track_id: tracks[n % tracks.length],
        user_id: 2 + (n % 3 === 0 ? 1 : 0),
        organization_id: 1,
        recorded_at: `2 Aug 2026, ${pad(23 - Math.floor(n / 25), 2)}:${pad((min + 60) % 60, 2)}`,
        created_at: `2 Aug 2026, ${pad(23 - Math.floor(n / 25), 2)}:${pad((min + 62) % 60, 2)}`,
        lat: (24.7137 + (r - .5) * .006).toFixed(6),
        lon: (46.6759 + (rand() - .5) * .006).toFixed(6),
        altitude: 0,
        h3_index_res9: '618461231495774200',
        h3_index_res12: '631972030377632300',
        is_uploaded: uploaded,
        azimuth: Math.round(90 + (rand() - .5) * 40),
        azimuth_accuracy: 0,
        speed_ms: 0,
        speed_accuracy: 0,
        lat_long_accuracy: 5,
        altitude_accuracy: 0,
        source_lat: (24.7136 + (r - .5) * .006).toFixed(4).replace('.', ','),
        source_lon: (46.6759 + (rand() - .5) * .006).toFixed(4).replace('.', ','),
        is_map_matched: rand() > 0.2,
        source_version: 'AxionV1',
        tags: ['amana_or_contractor:contractor', 'priority_zone:' + zones[Math.floor(rand() * zones.length)], 'contractor_company:' + companies[Math.floor(rand() * companies.length)]],
        detector_ids: '', detection_classes: '', detection_classes_2: '', detection_bbox_tags: '', detection_bbox_tags_2: '',
        detection_aggregated_at: '1 Jan 1970, 00:00',
        outside_territory: rand() > 0.94,
        capture_issue: issue,
        is_duplicate: rand() > 0.9,
        duplicate_of_frame_id: 0,
        duplicate_of_track_id: '00000000-0000-0000-0000-000000000000',
      });
    }
    return out;
  }
  const detail = {
    title: 'Frame #2147506013', photo: 'assets/figma/lib-frame-photo.jpg',
    tags: ['amana_or_contractor:contractor', 'priority_zone:High Risk', 'contractor_company:Someone and someone else'],
    data: [
      ['Capture Issue', 'Unspecified', 'badge-warning'], ['Duplicate Of Track Id', '00000000-0000-0000-0000-000000000000'],
      ['Source Version', 'AxionV1', 'badge-info'], ['Track Id', '019f26b2-3dbf-7f53-be83-bbb54dd71b18', 'mono'],
      ['Created At', 'Jul 3, 2026, 1:54 PM'], ['Detection Aggregated At', 'Jul 21, 2026, 5:13 PM'], ['Recorded At', 'Jul 3, 2026, 9:37 AM'],
      ['Is Duplicate', 'FALSE', 'bool'], ['Is Map Matched', 'TRUE', 'bool'], ['Is Uploaded', 'TRUE', 'bool'], ['Outside The Territory', 'FALSE', 'bool'],
      ['Duplicate Of Frame Id', '0'], ['H3 Index Res12', '631,693,701,427,693,600'], ['H3 Index Res9', '618,182,902,545,645,600'],
      ['Organization Id', '8'], ['User Id', '36,186'], ['Altitude', '-4.8'], ['Altitude Accuracy', '54.702'], ['Azimuth', '17'],
      ['Azimuth Accuracy', '180'], ['Lat Long Accuracy', '12'], ['Speed Accuracy', '0.663'], ['Speed Ms', '4.559'],
    ],
  };
  const library = { name: 'axion_sense.frames', columns, rows, total, detail, datasets: ['axion_sense.frames', 'axion_sense.tracks', 'axion_sense.detections', 'momah.licences', 'momah.inspections', 'signals.social'] };

  /* ---- scheduled runs, project files, people, dashboards ------------------------------------ */
  const scheduled = [
    { name: 'Asian Cup readiness digest', cadence: 'Weekly · Mon 07:00', last: 'Mon 07:00', next: 'Mon 07:00', status: 'ok', project: 'KSA insights', model: 'GPT-5.6 Luna' },
    { name: 'High-risk ride inspections · overdue', cadence: 'Daily · 06:30', last: 'Today 06:30', next: 'Tomorrow 06:30', status: 'attention', project: 'KSA insights', model: 'Axi Reason 2' },
    { name: 'Social-listening sweep · amanas', cadence: 'Every 15 min', last: '3 min ago', next: 'in 12 min', status: 'running', project: 'KSA insights', model: 'GPT-5.6 Luna' },
    { name: 'Flood-print recount after rain', cadence: 'On trigger · rain > 20 mm', last: '14 Aug', next: '—', status: 'idle', project: 'KSA insights', model: 'Claude Fable 5.1' },
    { name: 'Cityview KPI snapshot', cadence: 'Monthly · 1st 08:00', last: '1 Sep 08:00', next: '1 Oct 08:00', status: 'ok', project: 'Cityview', model: 'GPT-5.6 Luna' },
    { name: 'Street capture QA · new frames', cadence: 'Hourly', last: '41 min ago', next: 'in 19 min', status: 'ok', project: 'Cityview', model: 'Gemini 3.5 Pro' },
  ];
  const files = [
    { name: 'H-48221 licence.pdf', kind: 'pdf', size: '1.2 MB', when: 'Today' },
    { name: 'ride-clip-0914.mp4', kind: 'video', size: '18 MB', when: 'Today' },
    { name: 'inspection-record-2026.xlsx', kind: 'sheet', size: '640 KB', when: 'Mar 2026' },
    { name: 'olaya-street.sog', kind: 'scene', size: '36 MB', when: 'Jul 2026' },
    { name: 'amana-kpi-targets.csv', kind: 'sheet', size: '12 KB', when: 'Jan 2026' },
  ];
  const people = [
    { name: 'Aleksand Shcheblykin', role: 'Product design · Axion', initials: 'AS', on: true },
    { name: 'Fahad Al Otaibi', role: 'Inspection lead · Taif Amana', initials: 'FA', on: true },
    { name: 'Noura Al Qahtani', role: 'Licensing & Safety', initials: 'NQ', on: false },
    { name: 'Omar Haddad', role: 'Data engineering · Axion', initials: 'OH', on: true },
    { name: 'Sara Al Harbi', role: 'Cityview analyst', initials: 'SH', on: false },
    { name: 'Yousef Karim', role: 'Operations · social listening', initials: 'YK', on: true },
  ];
  const dashboards = [
    { name: 'Inspection coverage · Kingdom', note: '5 amanas · updated 4 min ago', icon: 'gauge' },
    { name: 'Asian Cup 2027 readiness', note: '11 fan zones · 3 stadiums', icon: 'flag' },
    { name: 'Street captures · QA', note: '2,147 frames · 108 tracks', icon: 'video-camera' },
    { name: 'Flood prints · Riyadh', note: '3 basins · 40 mm scenario', icon: 'mountains' },
    { name: 'Retail licences · monthly', note: '412 in August', icon: 'chart-bar' },
    { name: 'Social signals · live', note: '4 open · 1 critical', icon: 'broadcast' },
  ];

  return { user, models, signals, timeline, widgets, chats, projects, replies, fallback, welcome, library, scheduled, files, people, dashboards, incident, actionPackage, forecastText };
})();
