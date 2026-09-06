/* =============================================================================
   focus.js — the screen's behaviour.

   Everything the panels show comes from one subject record built in model.js
   out of the source document, so choosing a signal turns the whole stack over
   rather than leaving half of it stale. The lens under the stage, the listening
   mode, the two arrangements and the thread are state on <div class="app">,
   which the CSS reads.
   ============================================================================= */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const SUBJECTS = (window.FocusModel && window.FocusModel.subjects()) || [];
  const LENSES = [
    { id: 'location', label: 'Location' },
    { id: 'media',    label: 'Media' },
    { id: 'scene',    label: 'Scene' },
    { id: 'objects',  label: 'Objects' },
  ];

  const app      = $('#app');
  const work     = $('#work');
  const colLeft  = $('#colLeft');
  const colRight = $('#colRight');
  const thread   = $('#thread');
  const shelf    = $('#signals');
  const tabsBox  = $('#lensTabs');
  /* the two plates at the foot of the work area, measured as one */
  const dock     = $('#dock');
  const stageFree = $('#stageFree');

  const state = {
    /* nothing is in hand until something is picked */
    i: 0, lens: 'location', layout: 'columns', pick: null,
    /* which of the four faces the work area shows where there is only room for
       one of them. Read by nothing above the phone's breakpoint. */
    pane: 'reading',
    /* whether the street reading is open because the camera went down to it,
       rather than because the reading was asked for */
    zoomedIn: false,
    listening: false, assistant: true, rail: true, voice: 'idle',
    /* whether a question asked out loud is answered out loud */
    speak: true,
  };
  const subject = () => SUBJECTS[state.i];
  /* the readings this case actually carries, in the order the tabs stand in —
     which is the order the arrows walk and the numbers count */
  const lensesHere = () => LENSES.filter(l => subject().lenses.includes(l.id)).map(l => l.id);

  /* the button that asks the agent about one reading, and the question it asks */
  const askMark = (key, q) =>
    `<button class="ask" type="button" data-ask="${esc(q)}" data-key="${key}"
             aria-label="Ask the agent about this">
       <img src="assets/focus/img/sparkle.svg" alt="" width="16" height="16"></button>`;
  /* one thread per case, so an answer can never be filed against another */
  /* Committing a measure is the hinge between the two halves: a decision taken
     in the right-hand column becomes a line in the left-hand journal. Kept
     here rather than on the subject, because the subject is re-read from the
     document whenever the timeline handle moves. */
  const commits = Object.create(null);
  const filed = (id) => commits[id] || (commits[id] = []);
  /* Which controls have been pressed, beside the lines they filed. The pressed
     state used to live only on the button — textContent, data-done, disabled —
     and the right-hand column is written whole again on every move of the
     time handle, every branch button and every step of a scrub. So a measure
     committed at NOW read "Commit" again a moment later, and pressing it a
     second time filed the same line into the journal twice. The record is the
     record; the button is put back from it. */
  const pressed = Object.create(null);
  const pressedHere = (id) => pressed[id] || (pressed[id] = new Set());

  const threads = Object.create(null);
  const history = () => (threads[subject().id] || (threads[subject().id] = []));
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

  /* Whether this machine has a voice to read a reply with, settled once the
     browser has handed its list over — declared here because the thread is
     written out of agentMsg, which stands well above the voice section and
     may not reach forward into it. */
  let canSpeak = false, speakBlocked = false, spokenAt = 0, spokenNode = null;
  function speakTitle() {
    if (speakBlocked) return 'This browser will not speak until the page is pressed';
    const v = window.Speak && Speak.info();
    return 'Read aloud by ' + (v ? v.name : 'the browser’s own voice') + ' · on this device';
  }

  /* ═══ the panels ════════════════════════════════════════════════════════ */

  const summaryHTML = (s) => `
    <div class="summary-wrap pickable" id="summary" data-pick="summary" tabindex="0" role="button"
         aria-label="The subject — pick to ask about it">
      <section class="summary">
        <div class="summary-contents">
          <div class="summary-body">${s.summary.map(p => `<p>${esc(p)}</p>`).join('')}</div>
          <p class="summary-meta">${esc(s.meta.head)}${s.meta.links.map(l =>
            l.href ? `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.text)}</a>`
                   : `<a href="#" data-noop>${esc(l.text)}</a>`).join(' · ')}</p>
        </div>
      </section>
      ${askMark('summary', 'What does this case mean for ' + s.owner + '?')}
    </div>`;

  function renderLeft() {
    const s = subject();

    const timeline = `
      <section class="panel card card--timeline pickable" data-pick="timeline" tabindex="0" role="button"
               aria-label="Timeline and current situation — pick to ask about it">
        ${askMark('timeline', 'Where has the handling of this got to, and what is still to be done?')}
        <div class="card-label">Timeline &amp; current situation</div>
        <div class="card-body timeline">
          ${s.timeline.concat(filed(s.id)).map(r => `
            <div class="tl${r.st === 'now' ? ' is-now' : r.st === 'wait' ? ' is-wait' : ''}">
              <span class="tl-t">${esc(r.t)}</span>
              ${r.st === 'wait' || r.st === 'now'
                ? `<div class="tl-stack"><span class="tl-x">${esc(r.x)}</span>
                     <span class="flag${r.st === 'now' ? ' flag--now' : ''}">${r.st === 'now' ? 'In progress' : 'Decision needed'}<i class="dot" style="--dot:currentColor"></i></span></div>`
                : `<span class="tl-x">${esc(r.x)}</span>`}
            </div>`).join('')}
        </div>
      </section>`;

    const record = s.record ? `
      <section class="panel card pickable" data-pick="record" tabindex="0" role="button"
               aria-label="Inspection record — pick to ask about it">
        ${askMark('record', 'What does the inspection record say about this?')}
        <div class="card-label">Inspection record</div>
        <div class="card-body record">
          ${s.record.map(([k, v, tall]) => `
            <div class="rec"><span class="rec-k${tall ? ' tall' : ''}">${esc(k)}</span><span class="rec-v">${esc(v)}</span></div>`).join('')}
        </div>
      </section>` : '';

    const actions = s.actions.length ? `
      <section class="panel card pickable" data-pick="actions" tabindex="0" role="button"
               aria-label="Action taken — pick to ask about it">
        ${askMark('actions', 'What action has already been taken?')}
        <div class="card-label">Action taken</div>
        <div class="card-body record">
          ${s.actions.map(a => `
            <div class="rec"><span class="rec-k">${esc(a.when)}</span><span class="rec-v">${esc(a.what)}<br><span class="rec-by">${esc(a.by)}</span></span></div>`).join('')}
        </div>
      </section>` : '';

    colLeft.innerHTML = (state.layout === 'columns' ? summaryHTML(s) : '') + timeline + record + actions;
    /* The stage arrangement keeps exactly one card, moved rather than copied.
       The floating one is by construction a DIRECT child of the work area, so
       that is what the lookup has to say: `work.querySelector('#summary')`
       returns the first match in DOCUMENT order, and the line above has just
       put one at the top of the left column, which precedes it. Coming back
       from the stage the test `stray.parentElement === work` was therefore
       asked of the column's copy, came out false, and the floating card was
       left behind — two subject cards, one duplicated id, and the orphan still
       seated over the dock where it ate the ribbon's clicks. */
    const floating = work.querySelector(':scope > #summary');
    if (state.layout === 'stage') {
      if (floating) floating.outerHTML = summaryHTML(s);
      else work.insertAdjacentHTML('beforeend', summaryHTML(s));
    } else if (floating) {
      floating.remove();
    }
  }

  const metricHTML = (m, withLabel) => {
    const over = m.down && m.fill > m.mark;
    const bar = over
      ? `<i style="--c:${esc(m.colour)};width:${m.mark}%"></i>` +
        `<s style="--c:${esc(m.colour)};left:${m.mark}%;width:${Math.min(100 - m.mark, m.fill - m.mark)}%"></s>`
      : `<i style="--c:${esc(m.colour)};width:${Math.min(m.fill, 100)}%"></i>`;
    return `
    <div class="metric">
      ${withLabel ? `<p class="metric-k">${esc(m.k)}</p>` : ''}
      <div class="metric-row">
        <span class="metric-v" style="--c:${esc(m.colour)}">${esc(m.value)}</span>
        <span class="metric-t">${esc(m.target)}${m.down ? ' max' : ''}</span>
      </div>
      ${m.proj ? `<p class="metric-when is-proj">Projected · ${esc(m.proj)}</p>`
        : m.held ? `<p class="metric-when">${esc(m.held)} — the engine projects only its own nine</p>`
        : m.at   ? `<p class="metric-when">Read at ${esc(m.at)}</p>` : ''}
      <div class="bar" role="img" aria-label="${esc(m.value)} against ${esc(m.target)}${m.down ? ', where lower is better' : ''}">${bar}<u style="left:${m.mark}%"></u></div>
    </div>`;
  };

  /* ── the other half of the argument ──────────────────────────────────────
     The left column is what happened: the facts, where, who is connected. This
     column is what to do about it, and what the record does next either way —
     the gap that allowed the event, the measures that close it, and the twelve
     months after this one with and without them. */
  function renderRight() {
    const s = subject();
    const o = s.outlook;

    const prevention = s.prevention.length ? `
      <section class="panel card card--pad8 pickable" data-pick="prevention" tabindex="0" role="button"
               aria-label="What to do — pick to ask about it">
        ${askMark('prevention', 'What stops this happening again, and what does each measure change?')}
        <div class="card-label card-label--bare">What to do</div>
        <p class="cap pad8">Measures that close the gap which allowed the event — not the event itself.</p>
        <div class="card-body g8">
          ${s.prevention.map(p => `
            <div class="panel subcard measure">
              <div class="card-body g16">
                <div class="g4">
                  <p class="cap">${esc(p.what)}</p>
                  ${p.scope ? `<span class="chip${p.sc === 'ksa' ? ' chip--wide' : ''}">${esc(p.scope)}</span>` : ''}
                  <p class="mono-note">${[p.due, p.by].filter(Boolean).map(esc).join(' · ')}</p>
                  ${p.effect ? `<p class="effect">${esc(p.effect)}</p>` : ''}
                </div>
                <div class="acts"><button class="btn btn-grey" type="button"
                        data-ckey="measure-${p.n}"
                        data-commit="Committed" data-measure="${p.n}">Commit</button></div>
              </div>
            </div>`).join('')}
        </div>
      </section>` : '';

    /* the forecast. Both branches, named, with the method under them — and if
       the record's own trend carries no risk, it says that instead. */
    const outlook = o ? `
      <section class="panel card pickable" data-pick="outlook" tabindex="0" role="button"
               aria-label="What happens next — pick to ask about it">
        ${askMark('outlook', 'What happens to ' + o.name + ' over the next year with and without the measures?')}
        <div class="card-label">If we do this</div>
        <div class="card-body g16">
          <p class="cap" style="font-weight:500">${esc(o.headline)}</p>
          <p class="cap dim">${esc(o.standing)}</p>
          <div class="outlook">
            ${o.rows.map((r, i) => `
              <div class="ol-row${i === 2 ? ' ol-row--act' : ''}">
                <span class="ol-k">${esc(r.label)}</span>
                <span class="ol-v" style="--c:${esc(r.colour)}">${esc(r.value)}</span>
                <span class="ol-b">${esc(r.band)}</span>
              </div>`).join('')}
            <div class="ol-row ol-row--gap">
              <span class="ol-k">Gap to target</span>
              <span class="ol-v">${esc(o.gap.base)}</span>
              <span class="ol-b">→ ${esc(o.gap.act)}</span>
            </div>
          </div>
          <p class="cap dim">The package is worth <b>${esc(o.delta)}</b> by ${esc(o.horizon)}.</p>
          <div class="acts acts--split">
            <button class="btn btn-glass" type="button" data-branch="base">No action</button>
            <button class="btn btn-light" type="button" data-branch="act">With the package</button>
          </div>
          <p class="method">${esc(o.note)}</p>
          ${o.drivers.length ? `
          <details class="why">
            <summary>Why that number — what the gap is made of</summary>
            ${o.drivers.map(d => `
              <div class="driver">
                <p class="cap">${esc(d.what)} <b>${d.share}%</b> of the gap</p>
                <p class="cap dim">${esc(d.evidence)}</p>
                <p class="mono-note">${esc(d.owner)}</p>
                ${d.act ? `<p class="effect">${esc(d.act)} — closes ${d.closes}% of the gap</p>` : ''}
              </div>`).join('')}
          </details>` : ''}
        </div>
      </section>` : '';

    colRight.innerHTML = `
      ${s.concern ? `
      <section class="panel card pickable" data-pick="concern" tabindex="0" role="button"
               aria-label="What this event concerns — pick to ask about it">
        ${askMark('concern', 'Why did this happen — what is the slice that allowed it?')}
        <div class="card-label">This event concerns</div>
        <div class="card-body g16">
          ${s.concern.name ? `<p class="cap" style="font-weight:500">${esc(s.concern.name)}</p>` : ''}
          <p class="cap">${esc(s.concern.caption)}</p>
          ${s.concern.pending ? `<p class="cap">${esc(s.concern.pending)}</p>` : metricHTML(s.concern, false)}
        </div>
      </section>` : ''}

      ${s.note ? `
      <section class="panel card pickable" data-pick="note" tabindex="0" role="button"
               aria-label="The register's reading — pick to ask about it">
        ${askMark('note', 'Should I commit to this reading? What does it turn on?')}
        <div class="card-body g16">
          <p class="cap">${esc(s.note)}</p>
          <div class="acts">
            <button class="btn btn-light" type="button" data-ckey="note-commit" data-commit="Committed">Commit</button>
            <button class="btn btn-glass" type="button" data-ckey="note-reject" data-commit="Rejected">Reject</button>
          </div>
        </div>
      </section>` : ''}

      ${prevention}
      ${outlook}

      ${s.kpis.length ? `
      <section class="panel card pickable" data-pick="kpis" tabindex="0" role="button"
               aria-label="Area KPIs — pick to ask about them">
        ${askMark('kpis', 'How do the KPIs for this scope look against their targets?')}
        <div class="card-label">Area KPIs related to this event</div>
        <div class="card-body g24">${s.kpis.map(k => metricHTML(k, true)).join('')}</div>
      </section>` : ''}

      <section class="panel card card--pad8" data-pick="escalate">
        <div class="card-label card-label--bare">Hand it over</div>
        <div class="card-body g8">
          ${[['Move to crisis management', 'Opens an operations room and requires a report every 6 hours'],
             ['Move to social media management', 'Activates the official response and tracks the conversation on platforms']]
            .map(([t, d], n) => `
            <div class="panel subcard">
              <div class="card-body g16">
                <div class="g4"><p class="cap">${esc(t)}</p><p class="cap dim">${esc(d)}</p></div>
                <div class="acts"><button class="btn btn-glass" type="button"
                        data-ckey="escalate-${n}"
                        data-commit="Handed over" data-esc="1">Escalate</button></div>
              </div>
            </div>`).join('')}
        </div>
      </section>`;
    markCommits();
  }

  /* the column has just been written again; put back what was already pressed */
  function markCommits() {
    const done = pressedHere(subject().id);
    if (!done.size) return;
    for (const b of $$('[data-ckey]', colRight)) {
      if (!done.has(b.dataset.ckey)) continue;
      b.textContent = b.dataset.commit; b.dataset.done = '1'; b.disabled = true;
    }
  }

  /* ═══ the shelf: built once, then only its marks change ═════════════════ */

  function buildShelf() {
    shelf.innerHTML = SUBJECTS.map((s, i) => `
      <button class="sig${s.thumb ? '' : ' sig--bare'}" type="button" role="option"
              id="sig-${i}" tabindex="-1" data-i="${i}" aria-selected="false">
        ${s.thumb ? `<span class="sig-thumb"><img class="${esc(s.thumb.fit || '')}" src="${esc(s.thumb.src || window.FocusModel.asset(s.thumb.key) || 'assets/focus/img/sig-radar.png')}" alt="" decoding="async"></span>` : ''}
        <span class="sig-text">
          <span class="sig-title">${esc(s.title)}</span>
          <span class="sig-meta"><b>${esc(s.owner)}</b><i class="dot" style="--dot:${esc(s.band)}"></i></span>
        </span>
      </button>`).join('');
  }

  function markPick() {
    for (const el of $$('[data-pick]')) {
      el.classList.toggle('is-picked', el.dataset.pick === state.pick);
    }
  }

  /* which way the ribbon can still be scrolled — the plate's edges fade
     towards whichever end holds more cards */
  function markEnds() {
    const more = shelf.scrollWidth - shelf.clientWidth;
    shelf.classList.toggle('can-back', shelf.scrollLeft > 2);
    shelf.classList.toggle('can-on', more > 2 && shelf.scrollLeft < more - 2);
  }

  function markShelf() {
    for (const el of shelf.children) {
      const on = +el.dataset.i === state.i;
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-selected', String(on));
    }
    /* The shelf is a listbox, so the box holds the tab stop and says which
       option is current; the options are reached with the arrows rather than
       by tabbing through all six of them. Without this the container AND every
       option were separate tab stops, and the arrows did nothing on any of
       them — the global handler stands aside inside a scroller, and nothing
       took its place. */
    shelf.setAttribute('aria-activedescendant', 'sig-' + state.i);
    markEnds();
  }

  /* the arrows the shelf declined to leave to anyone else */
  shelf.addEventListener('keydown', (e) => {
    const n = SUBJECTS.length;
    let to = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (state.i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (state.i + n - 1) % n;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = n - 1;
    if (to === null) return;
    e.preventDefault();
    open(to);
  });

  function buildTabs() {
    tabsBox.innerHTML = LENSES.map(l =>
      `<button class="seg-btn" type="button" data-lens="${l.id}" aria-pressed="false">${l.label}</button>`).join('');
  }
  /* marks only — replacing these buttons would throw the keyboard back to <body>.
     A reading the case cannot carry leaves the strip altogether: a greyed tab
     is a promise the document never makes good on. */
  function renderTabs() {
    const has = lensesHere();
    for (const b of tabsBox.children) {
      const at = has.indexOf(b.dataset.lens);
      const on = b.dataset.lens === state.lens;
      b.hidden = at < 0;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
      /* The number is the tab's place on the strip, so it follows the hiding —
         and it is only written where there is a key to press. A screen with no
         keyboard must not be told to hold Alt: this page does not advertise
         what the device has not got, which is the same rule the scene caption
         and the wave's own line are written under. */
      b.title = at < 0 || COARSE.matches ? '' : b.textContent + ' · Alt+' + (at + 1);
    }
  }

  /* ═══ the four faces ════════════════════════════════════════════════════
     A phone shows one of them at a time. The strip that chooses is built the
     same way the readings' strip is — plain buttons in a .seg-slide, marked
     rather than replaced, so seg.js carries its chip and every loop that walks
     a seg group still sees buttons and only buttons.

     Three of the four labels are the regions' own accessible names, read off
     the DOM rather than restated here, so the strip and the landmark cannot
     drift apart. The fourth is the right-hand column, whose name — "The slice
     that allowed it" — is 147px and cannot have a quarter of a 390px strip;
     what stands in its place is that column's own first card label, which is
     the word the README uses for the half of the screen it opens. */
  const PANES = [
    { id: 'reading', label: 'Reading' },
    { id: 'what',    label: '#colLeft' },
    { id: 'slice',   label: 'What to do' },
    { id: 'agent',   label: '#assistant' },
  ];
  const paneBox = $('#paneTabs');

  function buildPanes() {
    if (!paneBox) return;
    paneBox.innerHTML = PANES.map(p => {
      const el = p.label.charAt(0) === '#' ? $(p.label) : null;
      const label = el ? el.getAttribute('aria-label') : p.label;
      return `<button class="seg-btn" type="button" data-pane="${p.id}"
                      aria-pressed="false">${esc(label)}</button>`;
    }).join('');
  }
  function renderPanes() {
    if (!paneBox) return;
    for (const b of paneBox.children) {
      const on = b.dataset.pane === state.pane;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    }
  }
  /* The thread being a face rather than a column means entering and leaving it
     IS the assistant's open/closed state — the same flag the frame's own
     toggle flips, so Escape, the toggle and this strip all move one thing. */
  function setPane(id) {
    if (!PANES.some(p => p.id === id)) return;
    state.pane = id;
    if (PHONE.matches) state.assistant = id === 'agent';
    renderPanes(); apply(); seat(); seatAskBar(); markEnds();
  }

  /* ═══ the stage ═════════════════════════════════════════════════════════ */

  function renderStage() {
    const s = subject();
    const host = $('#media');
    const M = window.FocusModel;
    if (host) {
      const src = s.clip ? M.asset(s.clip.key) : null;
      const poster = s.clip && s.clip.posterKey ? M.asset(s.clip.posterKey) : null;
      if (s.clip && s.clip.kind === 'video' && src) {
        host.innerHTML =
          `<video playsinline preload="metadata"${poster ? ` poster="${esc(poster)}"` : ''}><source src="${esc(src)}" type="video/mp4"></video>
           <button class="media-play" type="button" aria-label="Play the clip"><svg class="ic play"><use href="#i-play"/></svg></button>
           <p class="media-cap">${esc(s.clip.caption)}</p>`;
      } else if (s.clip && src) {
        host.innerHTML = `<img src="${esc(src)}" alt=""><p class="media-cap">${esc(s.clip.caption)}</p>`;
      } else {
        host.innerHTML = s.clip
          ? `<p class="media-cap" style="position:static;padding:24px;text-align:center;background:none">Loading the clip the document ships…</p>`
          : '';
      }
    }
    renderWhere();
    renderObjects();

    renderSceneNote();
  }

  /* ── what the street reading actually is ────────────────────────────────
     The other readings are drawn out of the document, so their caption only
     has to name them. This one is a measurement taken somewhere, on a day,
     and a measurement taken somewhere else is the one thing it must never be
     allowed to pass for. So the caption says where the capture is, and — since
     there is exactly one capture and six cases — how far that is from the case
     being read. Under 25 km it is the case's own city; past that it is stated
     as the stand-in it is. The distance is computed, not written down.

     Where the machine cannot draw splats at all the photograph is shown
     instead, and the old wording is the honest one again. */
  /* The capture's own coordinate used to be written here, next to the caption
     that reads it, and away from the place name in scene3d.js it has to agree
     with. It now sits in the scene register beside both the name and the
     footprint the map draws — one record, so the sentence, the mark on the map
     and the file on disk cannot come apart. */
  /* whatever the renderer last said about itself; null until it has spoken */
  let sceneStat = null;

  /* the two ways this machine can fail to draw a capture, each said as itself */
  const NO_GL = {
    'no-webgl2': 'Illustrative frame — this machine has no WebGL2',
    'software-gl': 'Illustrative frame — no hardware WebGL here to draw the capture on',
  };

  function sceneProvenance(s) {
    const S = window.FocusScene3D, st = sceneStat;
    if (!S || !st || st.ok == null) return 'Illustrative frame';
    if (st.ok === false) return NO_GL[st.phase] || 'Illustrative frame — the capture cannot be drawn here';
    const c = S.credit;
    if (st.phase !== 'ready') {
      const pct = st.total ? Math.round(100 * st.loaded / st.total) : 0;
      return '3D capture · ' + c.place + ' · loading ' + pct + '%';
    }
    let rel = '';
    const near = s.ll && window.SceneReg ? SceneReg.nearest(s.ll) : null;
    if (near) {
      rel = near.km < 25 ? ' · in this case’s own city'
                         : ' · ' + Math.round(near.km) + ' km from this case, and standing in for it';
    }
    return '3D capture · ' + c.place + ' · ' + c.when + rel;
  }

  /* the caption under the street reading, which also says how it was reached */
  function renderSceneNote() {
    const note = $('#sceneNote'), s = subject();
    if (!note) return;
    if (!s.scene) { note.textContent = 'No street reading is recorded for this case.'; return; }
    const n = s.scene.readings.length;
    const st = sceneStat, live = !!st && st.ok === true && st.phase === 'ready';
    note.textContent = (state.zoomedIn ? 'Street level · ' : '') +
      sceneProvenance(s) + ' · ' + s.scene.readings.map(r => r.caption).join(' · ') +
      (n > 1 ? ' — ' + n + ' readings recorded' : '') +
      (live ? ' · drag to look' + (state.zoomedIn ? ', back out to return to the map' : '')
            : state.zoomedIn ? ' · wheel out to return to the map' : '');
  }

  /* the clip is captioned with where it was taken, on the map behind it —
     kept out of renderStage so switching readings does not rebuild a video
     that may be playing */
  function renderWhere() {
    const where = $('#where'), s = subject();
    if (!where) return;
    const on = state.lens === 'media' && !!s.ll;
    where.hidden = !on;
    if (on) {
      where.innerHTML = '<i class="dot"></i><b>' + esc(s.owner) + '</b> · ' +
        esc(s.ll[0].toFixed(4) + ', ' + s.ll[1].toFixed(4));
    }
  }

  /* ── the objects, read through the lens ────────────────────────────────
     A case is not only a paragraph: it is a set of things standing in a
     district, each with a class, a street, a count of recorded cases and a
     last-seen. The register holds all of that. It does not hold a captured
     frame, an object id or a wall-clock timestamp, so none is drawn — and the
     card says as much rather than leaving a reader to assume otherwise.

     The reading of the KPI each object bears on is taken at wherever the
     timeline handle is standing, so scrubbing the strip moves these cards too.
     That is the state change over time the register can honestly show. */
  function objectKpi(o) {
    const CV = window.CV;
    if (!CV || !CV.K[o.kpi]) return null;
    const uid = subject().uid, v = window.FM && window.FM.ti > window.FM.NOW
      ? window.FM.val(uid, o.kpi) : CV.at(uid, o.kpi);
    return { name: CV.nm(CV.K[o.kpi]), value: CV.fmtV(o.kpi, v),
             colour: window.FocusModel.BAND[CV.band(o.kpi, v)] };
  }

  function renderObjects() {
    const host = $('#objects');
    if (!host) return;
    const s = subject(), list = s.objects || [];
    if (state.lens !== 'objects' || !list.length) { host.innerHTML = ''; return; }
    host.innerHTML = list.map((o, i) => {
      const k = objectKpi(o);
      return `
      <article class="obj pickable" data-pick="object-${i}" tabindex="0" role="button"
               aria-label="${esc(o.what)} on ${esc(o.street || 'an unnamed street')}">
        ${askMark('object-' + i, 'What is the ' + o.what.toLowerCase() + ' on ' + (o.street || 'this street') + ', and what should be done about it?')}
        <header class="obj-head">
          <span class="obj-ic" aria-hidden="true">${esc(o.icon)}</span>
          <span class="obj-what">${esc(o.what)}</span>
          <i class="dot" style="--dot:${esc(o.colour)}"></i>
        </header>
        <p class="obj-where">${esc([o.street, o.district].filter(Boolean).join(' · '))}</p>
        <dl class="obj-counts">
          <div><dt>Recorded cases</dt><dd>${o.cases}</dd></div>
          <div><dt>Open</dt><dd>${o.open}</dd></div>
          <div><dt>Repeat reports</dt><dd>${o.repeat}</dd></div>
          <div><dt>Impact radius</dt><dd>${o.radius} m</dd></div>
        </dl>
        <p class="obj-last">Last detected <b>${o.lastDays === 0 ? 'today' : o.lastDays + (o.lastDays === 1 ? ' day' : ' days') + ' ago'}</b></p>
        ${k ? `<p class="obj-kpi">${esc(k.name)} <b style="color:${esc(k.colour)}">${esc(k.value)}</b>
                 <span>${esc(window.FM && window.FM.ti > window.FM.NOW ? FocusTime.branchLabel() : window.FM ? window.FM.monthLabel(window.FM.ti) : '')}</span></p>` : ''}
        ${o.evidence.length ? `<ul class="obj-ev">${o.evidence.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${o.action ? `<p class="effect">${esc(o.action)}</p>` : ''}
      </article>`;
    }).join('') +
      `<p class="obj-note">${list.length} objects in the districts under ${esc(s.owner)}. The register
        records what was detected, where and how long ago; it carries no captured frame, object id or
        wall-clock time, so none is shown.</p>`;
  }

  /* ═══ seating what is on the stage ══════════════════════════════════════
     The frame draws the clip 483×826, its top edge 5.8% down the clear area
     and centred on 48.1% of its width, and the subject card at 21.2% / 63.8%
     of it. Read as ratios, every size keeps the relationship.
     The planet has its own seat — assets/focus/globe/aperture.js. ═══════════ */
  const SEAT = {
    media: { w: 483 / 832, top: 62 / 1064, cx: 400.5 / 832, ratio: 483 / 826 },
    card:  { cx: 176 / 832, cy: 679 / 1064 },
  };

  function seat() {
    /* the shelf is measured, not assumed, so a column's last card always
       clears it whatever the shelf grew to */
    /* the dock is measured, not assumed, so a column's last card always clears
       both plates whatever they grew to */
    if (dock) document.documentElement.style.setProperty('--shelf-clear', (dock.offsetHeight + 18) + 'px');
    if (!stageFree) return;
    const fw = stageFree.clientWidth, fh = stageFree.clientHeight;
    if (!fw || !fh) return;

    const m = $('.media');
    if (m) {
      /* The stage runs the whole height of the work area, the dock included:
         a clip seated against all of it puts its own caption behind the
         plates. So the clip is seated in the air that stays clear — under the
         label that names the place, above the dock — and keeps the drawn
         aspect inside it. */
      const clear = Math.max(160, fh - (dock ? dock.offsetHeight + 8 : 0));
      const top = SEAT.media.top * fh;
      const room = Math.max(120, clear - top);
      const w = Math.min(SEAT.media.w * fw, room * SEAT.media.ratio);
      const h = w / SEAT.media.ratio;
      const x = Math.max(0, SEAT.media.cx * fw - w / 2), y = top + (room - h) / 2;
      m.style.width = w + 'px'; m.style.height = h + 'px';
      m.style.left = x + 'px'; m.style.top = y + 'px';
      const where = $('#where');
      if (where && !where.hidden) {
        where.style.left = x + 'px';
        where.style.top = Math.max(4, y - 34) + 'px';
      }
    }

    if (state.layout === 'stage') {
      const card = $('#summary', work);
      if (card) {
        const w = Math.min(384, fw - 32);
        card.style.width = w + 'px';
        const h = card.offsetHeight || 350;
        const shelfTop = fh - (dock ? dock.offsetHeight : 252) - 8;
        card.style.left = (stageFree.offsetLeft + Math.min(Math.max(16, SEAT.card.cx * fw), fw - w - 16)) + 'px';
        card.style.top = Math.max(8, Math.min(SEAT.card.cy * fh - h / 2, shelfTop - h)) + 'px';
      }
    }
    fadeEnds();
  }

  /* ── the dissolve at a column's ends ────────────────────────────────────
     A reading passing under the header or over the dock dissolves rather than
     being cut at a hard edge. That used to be one gradient mask on the column,
     and it cost the readings their glass: a mask makes its element a BACKDROP
     ROOT, and a backdrop root is where backdrop-filter stops looking, so every
     card inside a masked column rendered flat however much blur it declared.

     A mask on the reading ITSELF has no such cost — an element's own mask does
     not touch its own backdrop-filter, only its children's. So the dissolve is
     handed to the readings, and this measures, for each one, where the column's
     two fade zones fall inside it. The zones are the ones the column's mask
     used: clear at the very top, solid by the first card's resting line, and
     the mirror of that above the dock.

     A reading standing clear of both zones carries no mask at all, so nothing
     clips the button hanging off its corner or the ambient shadow of the one
     in hand. */
  const FADE_RUN = 56;                 /* how long the dissolve takes to happen */
  /* Every measurement first, every write after it. Interleaving them — read a
     card's offsetTop, set its mask, read the next one's — makes the browser
     flush layout again for each read after a write, and this runs on every
     frame of a scroll: measured on the objects grid at 1920×1080, the 95th
     percentile frame was 98.7ms with the two passes interleaved. The reads
     below touch nothing, the writes below read nothing, so layout is computed
     once per column instead of once per card. */
  const fadePlan = [];
  function fadeEnds() {
    fadePlan.length = 0;
    for (const col of document.querySelectorAll('.col, .objects')) {
      const h = col.clientHeight;
      if (!h) continue;
      const cs = getComputedStyle(col);
      const z1 = Math.max(parseFloat(cs.paddingTop) || 0, 10);      /* solid from here */
      const z0 = Math.max(0, z1 - FADE_RUN);                        /* clear until here */
      const w1 = h - Math.max(parseFloat(cs.paddingBottom) || 0, 10) - 20;
      const w0 = w1 + 34;
      const scrolled = col.scrollTop;
      for (const kid of col.children) {
        /* the subject card wears the material, its wrapper only holds the
           button — so the mask belongs to the card */
        const el = kid.querySelector(':scope > .summary') || kid;
        const top = kid.offsetTop - scrolled, H = kid.offsetHeight;
        fadePlan.push(el, top < z1 || top + H > w1, z0 - top, z1 - top, w1 - top, w0 - top);
      }
    }
    for (let i = 0; i < fadePlan.length; i += 6) {
      const el = fadePlan[i], on = fadePlan[i + 1];
      el.classList.toggle('is-fading', on);
      if (!on) continue;
      el.style.setProperty('--fade-a', fadePlan[i + 2] + 'px');
      el.style.setProperty('--fade-b', fadePlan[i + 3] + 'px');
      el.style.setProperty('--fade-c', fadePlan[i + 4] + 'px');
      el.style.setProperty('--fade-d', fadePlan[i + 5] + 'px');
    }
    fadePlan.length = 0;
  }

  /* ═══ the thread ════════════════════════════════════════════════════════ */

  const AXSI = 'assets/focus/img/axsi.svg';

  const agentMsg = (t) => `
    <div class="msg msg-agent">
      <div class="agent-name"><img src="${AXSI}" alt="" width="16" height="16"><span>Axsi</span>${t.tag ? `<span class="msg-tag">· ${esc(t.tag)}</span>` : ''}</div>
      <p>${esc(t.content)}</p>
      <div class="agent-acts">
        ${canSpeak ? `<button class="btn-ghost btn28 speak" type="button" aria-label="Read this answer aloud"
             aria-pressed="false" title="${esc(speakTitle())}"><svg class="ic ic16"><use href="#i-speaker"/></svg></button>` : ''}
        <button class="btn-ghost btn28" type="button" aria-label="Good answer" aria-pressed="false"><svg class="ic ic16"><use href="#i-thumb-up"/></svg></button>
        <button class="btn-ghost btn28" type="button" aria-label="Bad answer" aria-pressed="false"><svg class="ic ic16"><use href="#i-thumb-down"/></svg></button>
      </div>
    </div>`;

  function renderThread() {
    thread.innerHTML = history().map(t => t.role === 'user'
        ? `<div class="msg msg-user"><p>${esc(t.content)}</p>${t.tag ? `<span class="msg-tag">${esc(t.tag)}</span>` : ''}</div>`
        : agentMsg(t)).join('') +
      `<div class="msg msg-live"><p class="heard" id="heard" aria-live="polite"></p></div>`;
    /* a subject changed mid-sentence rewrites the thread under the line: what
       is being said now is put straight back into the new one */
    const el = $('#heard');
    if (el) el.textContent = heardNow;
  }

  function bubble(who, text, opts) {
    const live = $('.msg-live', thread);
    const html = who === 'user'
      ? `<div class="msg msg-user"><p></p>${opts && opts.tag ? `<span class="msg-tag">${esc(opts.tag)}</span>` : ''}</div>`
      : agentMsg({ content: '', tag: opts && opts.tag });
    live.insertAdjacentHTML('beforebegin', html);
    const node = live.previousElementSibling;
    if (who === 'user') node.querySelector('p').textContent = text;
    node.scrollIntoView({ block: 'end', behavior: REDUCED.matches ? 'auto' : 'smooth' });
    return node;
  }

  let askTurn = 0;

  /* ═══ the sparkle, opened ═══════════════════════════════════════════════
     Pressing the sparkle used to fire a question the screen had written in
     advance. It is a place to put one instead: the chip stays where it is, a
     field grows out of it, and the reader types the question or speaks it.
     Sending it marks the reading the question was asked of — that card wears
     the brand ring until the answer lands, and the chip turns.

     One bar for the whole screen, seated against whichever sparkle was
     pressed: the columns and the objects grid are written again on every
     change of subject or month, and a field inside a card would lose what was
     half typed into it. */
  const askBar   = $('#askBar');
  const askInput = $('#askInput');
  let askHost = null;                 /* the reading the bar is open on */
  let askedAt = null;                 /* and the one an answer is being made for */

  function seatAskBar() {
    if (!askHost || askBar.hidden) return;
    const spark = askHost.querySelector('.ask');
    if (!spark || !askHost.isConnected) { closeAsk(); return; }
    const a = spark.getBoundingClientRect(), w = work.getBoundingClientRect();
    if (!a.width) { closeAsk(); return; }
    /* A reading scrolled out from under the bar takes the bar with it — and
       the box it has to leave is the column's, not the work area's: a column
       is as tall as the work area, so a card scrolled off the top of one is
       still inside the other, and the field would have been left floating over
       nothing. */
    const clip = askHost.closest('.col, .objects');
    const cb = clip ? clip.getBoundingClientRect() : w;
    if (a.bottom < cb.top + 2 || a.top > cb.bottom - 2) { closeAsk(); return; }
    /* which way the field opens is which edge the sparkle hangs off */
    const h = askHost.getBoundingClientRect();
    const hostW = Math.max(184, h.width);
    /* against the reading's own middle, not its edge: the sparkle overhangs by
       eleven and is twenty across, so an edge test turns on a single pixel */
    const left = a.left + a.width / 2 < h.left + h.width / 2;
    askBar.classList.toggle('askbar--left', left);
    askBar.style.top = (a.top - w.top) + 'px';
    if (left) {
      askBar.style.left = (a.left - w.left) + 'px';
      askBar.style.right = 'auto';
      askBar.style.width = Math.min(320, hostW, w.right - a.left - 8) + 'px';
    } else {
      askBar.style.right = (w.right - a.right) + 'px';
      askBar.style.left = 'auto';
      askBar.style.width = Math.min(320, hostW, a.right - w.left - 8) + 'px';
    }
  }

  /* The question the screen would have asked is offered as the placeholder
     rather than fired: send it as it stands, or type over it. That is what
     data-ask on each sparkle is for now. */
  function openAsk(host, suggested) {
    if (!canAssist()) return;                  /* nowhere to show the answer */
    if (askHost === host && !askBar.hidden) { askInput.focus(); return; }
    closeAsk(true);
    askHost = host;
    host.classList.add('is-asking-open');
    askBar.hidden = false;
    askInput.value = '';
    askInput.placeholder = suggested || 'Ask about this reading';
    seatAskBar();
    askInput.focus();
  }

  function closeAsk(quiet) {
    if (askHost) askHost.classList.remove('is-asking-open');
    askHost = null;
    askBar.hidden = true;
    askBar.style.width = '';
    if (!quiet && state.listening) stopVoice(null, true);
  }

  /* the ring stays on the reading the question was asked of, whatever the
     reader picks up next while the answer is being made */
  function markAsked(host) {
    if (askedAt && askedAt !== host) askedAt.classList.remove('is-asking');
    askedAt = host || null;
    if (askedAt) askedAt.classList.add('is-asking');
  }

  function sendAsk(opts) {
    const q = askInput.value.trim() || askInput.placeholder;
    if (!q || !askHost) return;
    const host = askHost;
    /* The field folds back into the chip it grew out of, and the reading it
       was asked of keeps the ring and the turning sparkle until the answer
       lands — so the screen says which reading is being worked on rather than
       leaving an empty field open over it. */
    closeAsk(true);
    markAsked(host);
    state.pick = host.dataset.pick || state.pick; markPick();
    ask(q, null, opts).then(() => { if (askedAt === host) markAsked(null); });
  }

  async function ask(question, tag, opts) {
    if (!question) return;
    if (!canAssist()) return;                        /* nowhere to show the answer */
    /* Where the thread is a face rather than a column standing beside the
       reading, asking is what brings it up — an answer written into a face
       nobody is on is an answer the reader would have to go and find. The ring
       and the turning sparkle stay on the reading it was asked of, so they are
       still there on the way back; the strip is what says which face that was.
       That the two cannot be seen at once is what a 390px screen costs, and it
       is the one thing here the frame's arrangement does better. */
    if (PHONE.matches && state.pane !== 'agent') setPane('agent');
    const at = state.i, said = history(), turn = ++askTurn;
    /* the turn that owns the line owns the sound with it: whatever the last
       answer was still reading out, this question ends it */
    stopSpeech();
    bubble('user', question, { tag });
    const node = bubble('agent', '', { tag });
    const p = node.querySelector('p');
    p.innerHTML = '<span class="thinking"><i></i><i></i><i></i></span>';
    app.dataset.thinking = 'on';
    /* the readout belongs to whoever is speaking: if a new question is
       already being heard, the answer to the last one waits its turn quietly */
    if (!state.listening) { say('Axi is thinking…'); setVoice('thinking'); }

    /* a question asked out loud is answered out loud, and only that one: a
       question typed into the bar is answered where it was asked */
    const aloud = !!(opts && opts.spoken) && state.speak && canSpeak;
    let sg = aloud ? Speak.start(SPOKEN) : 0;
    if (sg) { spokenAt = sg; spokenNode = node; markSaid(); }

    let first = true, acc = '', quoted = false;
    const text = await window.Agent.ask(question, said.map(t => ({ role: t.role, content: t.content })), subject(), {
      delta(t) {
        if (at !== state.i) return;                  /* the case moved on under us */
        if (first) { p.textContent = ''; first = false; }
        acc += t; p.textContent = acc;
        /* read at the beat it is written: every sentence that closes goes */
        if (sg) Speak.push(sg, t);
        node.scrollIntoView({ block: 'end' });
      },
      /* the live stream failed part way: begin the answer again, from the record */
      reset() {
        acc = ''; first = true; quoted = true;
        if (at === state.i) p.textContent = '';
        /* and the half sentence already spoken is not part of the answer that
           follows — the reading starts again with it, under the other mark */
        if (sg) { Speak.stop(); sg = aloud ? Speak.start(SPOKEN) : 0; spokenAt = sg; markSaid(true); }
      },
    });
    if (at !== state.i) { app.dataset.thinking = ''; stopSpeech(); return; }   /* filed nowhere */

    const final = acc || text || '';
    if (first) p.textContent = final || '—';
    const fromRecord = quoted || !window.Agent.isLive();
    if (fromRecord) {
      const name = node.querySelector('.agent-name');
      if (name && !name.querySelector('.msg-tag')) {
        name.insertAdjacentHTML('beforeend', '<span class="msg-tag">· from the record</span>');
      }
    }
    if (sg) {
      if (fromRecord) markSaid(true);
      if (first) Speak.push(sg, final);   /* an answer that arrived whole, without deltas */
      Speak.end(sg);                      /* and the tail leaves through here, nowhere else */
    }
    said.push({ role: 'user', content: question, tag });
    if (final) said.push({ role: 'assistant', content: final, tag: fromRecord ? 'from the record' : null });
    markAgent();
    app.dataset.thinking = '';
    /* and it is put down only by the turn that picked it up: a question asked
       while this one was still thinking owns the line now */
    if (turn === askTurn && state.voice === 'thinking') { say(''); setVoice('idle'); }
  }

  /* The dot beside the thread's name is the only thing on screen that says
     where an answer came from. Give it words too: which model is answering,
     and on which of the proxy's two credentials. */
  function markAgent() {
    const live = !!(window.Agent && window.Agent.isLive());
    const at = live && window.Agent.standing();
    document.documentElement.dataset.agent = live ? 'live' : 'record';
    $('#threadTitle').title = at
      ? 'Answering live · ' + (at.model || 'Claude') +
        (at.engine === 'cli' ? ' · through the claude command on this machine' : '')
      : 'Answering from the record';
  }

  /* ═══ the transcript line ═══════════════════════════════════════════════
     Everything that is heard or read aloud goes through here, and it is
     written at the foot of the thread rather than into the bar: the bar is
     where a question is put, and words nobody typed have no business standing
     in a field. The line is the conversation's own last line — it wraps, it is
     centred with the rest, and when nothing is being said there is nothing
     there. renderThread owns the element, so it is looked up rather than held:
     a change of subject writes a new one. ═══════════════════════════════════ */

  let heardNow = '';
  function say(text) {
    heardNow = text;
    const el = $('#heard');
    if (el) el.textContent = text;
    /* a question spoken while a reading's field is open is written there, so
       the words land where the reader is looking */
    if (askHost && state.listening) askInput.value = text;
  }

  /* ═══ the waveform, on the voice itself ═════════════════════════════════
     The bars are the design's own silhouette, bar for bar; what the microphone
     hears is what scales them. One reading of the level per frame goes in at
     the right — the end the newest sound belongs to, and the end the row is
     aligned to — and everything shifts one place left, so the wave travels
     under the words the way a recording does.

     Where there is no microphone to open, or the answer to the ask is no, the
     row moves on its own at a speaking rhythm and the transcript says so. A
     wave that stands still while somebody is talking would be the one lie this
     screen tells. ══════════════════════════════════════════════════════════ */

  const BARS = 'p12,p15,p18,p18,p18,83,33,p18,p18,p18,83,p18,p18,p18,p18,p18,p18,p18,83,33,p10,p10,p18,p10,p10,p18,p18,p18,p18,p18,83,p18,p18,84,33,33,83,83,83,83,32,32,32,32,83,83,83,83,p10,p20,p24,34';
  const INK = { p: 'var(--fg-primary)', 8: 'var(--light-800)', 3: 'var(--light-300)' };
  const FLOOR = 0.006;    /* under the room's own hiss                        */
  const GAIN  = 7;        /* and enough of it that a speaking voice fills the row */
  let waveTimer = null, waveRaf = null, micIn = null, waveGen = 0;

  function renderWave() {
    $('#wave').innerHTML = BARS.split(',').map(b =>
      `<i style="height:${b.slice(1)}px;background:${INK[b[0]]}"></i>`).join('');
  }

  const paint = (bars, hist) => {
    for (let i = 0; i < bars.length; i++) bars[i].style.transform = `scaleY(${(0.14 + hist[i] * 1.5).toFixed(3)})`;
  };

  /* the level, straight off the input — the loudness of the last few
     milliseconds, not the spectrum: the design's bars are a silhouette, and
     what they are being asked to carry is how loud the room is right now */
  async function openMic(gen, bars) {
    const md = navigator.mediaDevices;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!md || !md.getUserMedia || !Ctx) return false;
    let stream;
    try { stream = await md.getUserMedia({ audio: true }); } catch (e) { return false; }
    /* the ask outlived the listening it was made for */
    if (gen !== waveGen) { stream.getTracks().forEach(t => t.stop()); return false; }

    const ctx = new Ctx();
    const an = ctx.createAnalyser();
    an.fftSize = 512;
    an.smoothingTimeConstant = .55;
    ctx.createMediaStreamSource(stream).connect(an);
    micIn = { stream, ctx };

    const buf = new Uint8Array(an.fftSize);
    const hist = new Float32Array(bars.length);
    const tick = () => {
      if (gen !== waveGen) return;
      an.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) { const x = (buf[i] - 128) / 128; sum += x * x; }
      const rms = Math.sqrt(sum / buf.length);
      hist.copyWithin(0, 1);
      hist[hist.length - 1] = Math.max(0, Math.min(1, (rms - FLOOR) * GAIN));
      paint(bars, hist);
      waveRaf = requestAnimationFrame(tick);
    };
    tick();
    return true;
  }

  function closeMic() {
    if (waveRaf) cancelAnimationFrame(waveRaf);
    waveRaf = null;
    if (!micIn) return;
    try { micIn.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { micIn.ctx.close(); } catch (e) {}
    micIn = null;
  }

  function runWave(on) {
    clearInterval(waveTimer);
    waveTimer = null;
    waveGen++;
    closeMic();
    const bars = $$('#wave i');
    if (!on || REDUCED.matches) {
      bars.forEach(b => b.style.transform = '');
      app.dataset.mic = '';
      return;
    }
    const gen = waveGen;
    app.dataset.mic = '';
    /* the row moves from the first frame: opening a microphone takes a moment,
       and asking for one takes as long as the answer does */
    waveTimer = setInterval(() => {
      for (const b of bars) b.style.transform = `scaleY(${0.5 + Math.random() * 1.0})`;
    }, 170);
    openMic(gen, bars).then(open => {
      if (gen !== waveGen || !open) return;
      clearInterval(waveTimer);
      waveTimer = null;
      app.dataset.mic = 'live';       /* the voice has it from here */
    });
  }

  /* ═══ the reply, read out ═══════════════════════════════════════════════
     A question asked out loud is answered out loud. speak.js owns the voice,
     the cutting and the queue; what is owned here is everything the screen
     says while it reads — the state on .app, the line under the row, the row
     itself, and the mark on the reply being read.

     The row is the microphone's row. It is the same bars, the same paint and
     the same counter, so starting to listen evicts the agent's own wave
     without a line of code between the two: runWave is still the only thing
     that increments waveGen, and this takes a generation the way openMic
     does. app.dataset.mic is never 'live' here — no microphone is open, and
     that attribute is what tells the transcript which of the two it is.

     There is no level to read. speechSynthesis hands back no audio, so what
     scales the bars is the word the engine reports speaking; where it reports
     none, the words' own weight, and the line says the row is timed. A wave
     that stood still while somebody was talking would be the one lie this
     screen tells, and one that ran on a timer while claiming to be a reading
     would be the other. ══════════════════════════════════════════════════ */

  let speakWaveGen = 0;
  function speakWave(on) {
    /* and it gives the row up only if it still holds it: a microphone opened
       since is the one thing that may blank these bars */
    if (!on) { if (speakWaveGen === waveGen) runWave(false); return; }
    clearInterval(waveTimer);
    waveTimer = null;
    waveGen++;
    closeMic();
    const gen = speakWaveGen = waveGen;
    const bars = $$('#wave i');
    app.dataset.mic = '';
    if (REDUCED.matches) { bars.forEach(b => b.style.transform = ''); return; }
    const hist = new Float32Array(bars.length);
    const tick = () => {
      if (gen !== waveGen) return;
      hist.copyWithin(0, 1);
      hist[hist.length - 1] = Speak.level();
      paint(bars, hist);
      waveRaf = requestAnimationFrame(tick);
    };
    tick();
  }

  /* one door for every cancel — and there are a dozen of them */
  function stopSpeech() { if (window.Speak) Speak.stop(); }

  /* whose words are being read. Two truths and two marks, the way the
     microphone's two are told apart: the words are the model's or the
     document's, and the voice is this machine's either way. */
  function markSaid(record) {
    app.dataset.said = record || !window.Agent.isLive() ? 'record' : 'claude';
  }

  const SPOKEN = {
    speak(g) {
      if (g !== spokenAt) return;
      /* the thinking line has been answered: it comes down as the reading
         starts, and nothing takes its place — the answer is above */
      say('');
      setVoice('speaking'); speakWave(true); markSpeaker(spokenNode);
    },
    /* the sentence being read is not written anywhere: it is already on
       screen, in the reply above. Repeating it under the bar would put the
       agent's own words where the room's words go, and say them twice. */
    words(g, live) { if (g !== spokenAt) return; app.dataset.words = live ? 'on' : ''; },
    done(g, why) {
      if (g !== spokenAt) return;
      speakWave(false);
      markSpeaker(null);
      spokenNode = null;
      /* and only if nothing has taken the line since — the same guard the
         thinking state is put down under */
      if (state.voice === 'speaking') { say(''); setVoice('idle'); }
      if (why === 'blocked') { speakBlocked = true; setSpeak(false); }
      /* an engine that has stopped answering at all cannot be offered: a
         greyed speaker is a promise the browser never makes good on */
      if (why === 'wedged') { canSpeak = false; renderThread(); }
    },
  };

  /* marks only — the buttons themselves stand, because replacing the one a
     finger is on would throw the keyboard back to <body> */
  function markSpeaker(node) {
    for (const b of $$('.agent-acts .speak', thread)) {
      const on = !!node && b.closest('.msg-agent') === node;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-on', on);
      const use = b.querySelector('use');
      if (use) use.setAttribute('href', state.speak ? '#i-speaker' : '#i-speaker-off');
      b.title = speakTitle();
    }
  }

  const SPEAK_KEY = 'focus.speak';
  function setSpeak(on) {
    state.speak = !!on;
    /* a private window throws on write, and hands back nothing on read */
    try { localStorage.setItem(SPEAK_KEY, on ? 'on' : 'off'); } catch (e) {}
    apply();
    markSpeaker(state.voice === 'speaking' ? spokenNode : null);
  }

  /* a reply already on screen, read from the top */
  function readOut(node) {
    if (!node || !canSpeak) return;
    const p = node.querySelector('p');
    const g = Speak.start(SPOKEN);
    if (!g) return;
    spokenAt = g; spokenNode = node;
    app.dataset.said = node.querySelector('.agent-name .msg-tag') ? 'record' : 'claude';
    Speak.push(g, (p && p.textContent) || '');
    Speak.end(g);
  }

  /* ═══ voice ═════════════════════════════════════════════════════════════
     The scenario the frame's note describes: the agent transcribes while you
     speak; when you stop, what was heard becomes the message; then the agent
     answers it. Real recognition where the browser has it, and where it does
     not, the same shape driven by a question about the case in view — marked
     on screen as a demo, because a prototype should not pretend to have heard
     something nobody said. ═══════════════════════════════════════════════ */

  const ASK_LABEL = 'Ask Axi';
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, heardText = '', demoTimer = null, watchdog = null,
      sendTimer = null, beatTimer = null, hushTimer = null, demoRunning = false, pending = null;
  /* how long a silence has to run before it is the end of the question rather
     than a pause for breath. Long enough to think mid-sentence, short enough
     that nobody is left holding a finished sentence waiting for the screen. */
  const HUSH = 1500;

  const setVoice = (v) => { state.voice = v; app.dataset.voice = v; };
  /* The thread has two homes and a width between them where it has none.

     Above 1289 it is the 350px column the frame draws. Below 600 — or in
     landscape on a phone — it is a face of the work area, laid over the same
     room the readings stand in. Between the two there is neither: the dock
     still needs 848px of a work area the column would take 350 out of, which
     is the measurement the CSS comment beside @media (max-width:1289px)
     records, and it is a dock constraint rather than an assistant one.

     Each of these mirrors a query in focus.css and MUST move with it. With
     only the CSS moved the panel is hidden while this still says there is
     room, and the Ask sparkles and the microphone stay live writing answers
     into a thread nobody can see; with only these moved the answers go into a
     panel that is display:none. Both are listened to rather than polled,
     because a phone changes size without a resize the page can trust — a URL
     bar retracting, an orientationchange whose metrics settle a frame late. */
  const ASSISTANT_MIN = matchMedia('(min-width:1290px)');
  const PHONE = matchMedia('(max-width:600px),(max-width:1000px) and (max-height:500px)');
  /* whether a finger is what is pointing at this screen — asked separately
     from how wide it is, because they are different questions: one decides how
     big a target has to be, the other decides what the layout can be */
  const COARSE = matchMedia('(pointer:coarse)');
  /* The gate keeps its two halves meaning different things — "is there
     somewhere to write an answer" and "is that somewhere open" — because on a
     phone only the first is a precondition. Asking is what opens the face, so
     a sparkle tapped while a reading is up is not asking for an answer with
     nowhere to go; it is asking for the face. */
  const hasThread = () => ASSISTANT_MIN.matches || PHONE.matches;
  const canAssist = () => hasThread() && (PHONE.matches || state.assistant);

  /* every timer this scenario can start, dropped in one place */
  function clearVoiceTimers() {
    clearTimeout(watchdog); clearInterval(demoTimer);
    clearTimeout(sendTimer); clearTimeout(beatTimer); clearTimeout(hushTimer);
    watchdog = demoTimer = sendTimer = beatTimer = hushTimer = null;
    pending = null;
  }
  function dropRecogniser() {
    if (!rec) return;
    rec.onresult = rec.onerror = rec.onend = rec.onstart = rec.onaudiostart = rec.onspeechstart = null;
    try { rec.abort(); } catch (e) { try { rec.stop(); } catch (e2) {} }
    rec = null;
  }

  function demoQuestions() {
    const s = subject();
    const q = ['Walk me through this one — what actually happened?'];
    if (s.concern) q.push('Why did this happen? What is the slice that allowed it?');
    if (s.prevention.length) q.push('What stops it happening again?');
    if (s.kpis.length) q.push('How do the numbers for this scope look?');
    return q;
  }
  let demoAt = 0;

  function startVoice() {
    if (!canAssist()) return;                 /* the answer would have nowhere to go */
    /* before anything opens a microphone: a recogniser started while the agent
       is still talking transcribes the agent, and sends it back as a question */
    stopSpeech();
    if (window.Speak) Speak.prime();          /* spent inside the press, for iOS */
    handOver();                               /* the last question goes before this one starts */
    clearVoiceTimers();
    dropRecogniser();
    demoRunning = false;
    app.dataset.demo = '';
    state.listening = true;
    setVoice('listening');
    runWave(true);
    $('#mic').setAttribute('aria-pressed', 'true');
    $('#askMic').setAttribute('aria-pressed', 'true');
    $('#listen').setAttribute('aria-pressed', 'true');
    $('#listenLabel').textContent = 'Listening…';
    heardText = '';
    say('');

    if (SR) {
      try {
        rec = new SR();
        rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true;
        rec.onresult = (e) => {
          clearTimeout(watchdog);
          /* an event re-states the results it touches rather than handing back
             what is new: an interim phrase comes again and again, each time
             closer to what was said, and the final result replaces the interim
             it grew out of. So the line is rebuilt from the whole set, never
             appended to — appending stacks every draft of a phrase on top of
             the last one, and "hey what's up" arrives as
             "heyheyhey what shey what's uphey what's up". */
          let t = '';
          for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
          heardText = t.slice(-220);
          say(heardText);
          setVoice(heardText.trim() ? 'hearing' : 'listening');
          /* and stopping is what ends the question: a sentence spoken out loud
             is finished by silence, not by reaching back for the microphone.
             The clock is reset by every word, so it only ever runs out on a
             room that has gone quiet — and only once something was said. */
          clearTimeout(hushTimer); hushTimer = null;
          if (heardText.trim()) {
            hushTimer = setTimeout(() => { if (state.listening) stopVoice(); }, HUSH);
          }
        };
        /* the moment a live recogniser proves it is alive, the demo is off the
           table — otherwise a pause for breath would replace what was said */
        const alive = () => { clearTimeout(watchdog); watchdog = null; };
        rec.onstart = alive; rec.onaudiostart = alive; rec.onspeechstart = alive;
        rec.onerror = () => { if (state.listening) runDemo(); };
        rec.onend = () => { if (state.listening && !demoRunning) stopVoice(); };
        rec.start();
        /* a browser can hand back a recogniser that never starts at all — no
           microphone, no permission, no network. If it has not said a word for
           itself in a second and a half, run the scenario on a question about
           the case instead, and say on screen that that is what happened. */
        watchdog = setTimeout(() => { if (state.listening && !heardText) runDemo(); }, 1500);
        return;
      } catch (e) { /* fall through to the demo */ }
    }
    runDemo();
  }

  /* the same choreography with a question taken from the case, typed at
     speaking speed, so the scenario can be shown without a microphone */
  function runDemo() {
    if (!state.listening) return;
    clearVoiceTimers();
    dropRecogniser();
    demoRunning = true;
    app.dataset.demo = 'on';                  /* the chip beside the transcript */
    const qs = demoQuestions();
    const q = qs[demoAt++ % qs.length];
    heardText = '';
    if (REDUCED.matches) {                    /* no typing animation */
      heardText = q; say(q); setVoice('hearing');
      sendTimer = setTimeout(() => stopVoice('demo'), 700);
      return;
    }
    let i = 0;
    demoTimer = setInterval(() => {
      heardText = q.slice(0, ++i);
      say(heardText);
      if (state.voice !== 'hearing') setVoice('hearing');
      if (i >= q.length) {
        clearInterval(demoTimer); demoTimer = null;
        sendTimer = setTimeout(() => stopVoice('demo'), 520);
      }
    }, 34);
  }

  /* `drop` is the finger leaving the microphone for the field: listening ends
     and what was heard is not turned into a question. One press, one question. */
  function stopVoice(tag, drop) {
    const wasDemo = demoRunning, mid = demoRunning && !tag;
    state.listening = false;
    /* in the body, not in the beat that follows it: clearVoiceTimers drops the
       question waiting there without running it, from three different places */
    stopSpeech();
    clearVoiceTimers();
    dropRecogniser();
    demoRunning = false;
    app.dataset.demo = '';
    runWave(false);
    $('#mic').setAttribute('aria-pressed', 'false');
    $('#askMic').setAttribute('aria-pressed', 'false');
    $('#listen').setAttribute('aria-pressed', 'false');
    $('#listenLabel').textContent = ASK_LABEL;

    const said = heardText.trim();
    heardText = '';
    /* a demo interrupted half-way said nothing; sending the fragment as if the
       user had spoken it would be a lie */
    if (!said || mid || drop) { say(''); setVoice('idle'); return; }
    setVoice('heard');
    say(said);
    const label = tag || (wasDemo ? 'demo' : null);
    /* the beat before the question goes is a pause for the eye, not a chance to
       withdraw it: whatever interrupts it hands the question over first */
    pending = () => {
      say(''); setVoice('idle');
      /* it was asked out loud, and both doors carry that through to the answer */
      if (askHost) { askInput.value = said; sendAsk({ spoken: true }); return; }
      ask(said, label, { spoken: true });
    };
    beatTimer = setTimeout(handOver, REDUCED.matches ? 0 : 420);
  }

  function handOver() {
    const go = pending;
    clearTimeout(beatTimer); beatTimer = null; pending = null;
    if (go) go();
  }

  const toggleVoice = () => (state.listening ? stopVoice() : startVoice());

  /* ═══ state ═════════════════════════════════════════════════════════════ */

  function apply() {
    const s = subject();
    app.dataset.lens = state.lens;
    app.dataset.layout = state.layout;
    /* the environment reading is the one that covers the planet outright */
    if (window.FocusGlobe && FocusGlobe.seen) FocusGlobe.seen(state.lens !== 'scene');
    /* and it is the only one that costs a frame to draw, so it draws only
       while it is the reading on screen */
    if (window.FocusScene3D) FocusScene3D.show(state.lens === 'scene');
    app.dataset.assistant = state.assistant ? 'on' : 'off';
    app.dataset.speak = speakBlocked ? 'blocked' : state.speak ? 'on' : 'off';
    /* the rail is not on the phone at all, so its state is derived at that
       width rather than remembered — the same thing setLayout already does to
       the floating card, and for the same reason: a switch with nothing to
       switch is a switch that lies about where you are */
    app.dataset.rail = state.rail && !PHONE.matches ? 'on' : 'off';
    /* the face, and only where there is one. Written unconditionally so the
       attribute is never stale on the way back up to the frame's width, and
       read only inside focus.css's own phone query. */
    app.dataset.pane = PHONE.matches ? state.pane : 'columns';
    renderPanes();

    $('#titleName').textContent = s.owner;
    $('#titleSub').textContent = s.category;
    $('#titleName').title = s.owner;
    $('#titleSub').title = s.category;

    const railOff = !state.rail;
    $('#railPeek').hidden = !railOff;
    $('#railToggle').setAttribute('aria-label', railOff ? 'Show the rail' : 'Hide the rail');

    const room = hasThread();
    const t = $('#toggleAssistant');
    t.setAttribute('aria-pressed', String(state.assistant && room));
    t.setAttribute('aria-label', state.assistant ? 'Hide the assistant' : 'Show the assistant');
    t.disabled = !room;
    t.classList.toggle('seg-dim', !(state.assistant && room));
    /* nothing may ask for an answer that has nowhere to appear */
    const live = canAssist();
    $('#listen').disabled = !live;
    $('#listen').setAttribute('aria-disabled', String(!live));
    $$('.ask').forEach(b => { b.disabled = !live; });
    if (!live && state.listening) stopVoice();
    /* and nothing may go on reading out an answer the screen has no room for */
    if (!live) stopSpeech();
  }
  /* The link says which subject, which reading and which arrangement — three
     things a window resize cannot change. It used to be written from apply(),
     which the resize listener calls, so dragging a window edge put a
     history.replaceState on every one of the hundreds of events that produces.
     Written where the three can actually change instead. */
  function syncUrl() {
    const url = new URL(location.href);
    url.searchParams.set('subject', subject().id);
    url.searchParams.set('lens', state.lens);
    if (state.layout === 'stage') url.searchParams.set('layout', 'stage'); else url.searchParams.delete('layout');
    try { window.history.replaceState(null, '', url); } catch (e) {}
  }

  function setLens(id, viaZoom) {
    if (!subject().lenses.includes(id)) return;
    /* the two readings that stand on a file fetched after paint ask for it
       here, so opening one is what pays for it */
    const A = window.FocusAssets;
    if (A) { if (id === 'scene') A.scene(); else if (id === 'media') A.media(); }
    /* A reading is not allowed to open in front of nothing. Pausing the street
       keeps your place in it on purpose — tabbing to the media and back should
       not walk you home — but backing out through the edge of the capture is
       not a place, it is the absence of one: the handback closes the reading
       and leaves the camera parked outside the splats. Every way back in ran
       into that, and what it showed was the sky and nothing else. So the
       reading asks, on the way in, whether there is anything in front of the
       camera, and puts it back at the capture's opening pose when there is
       not. Inside the capture nothing is touched. */
    const S = window.FocusScene3D;
    if (id === 'scene' && S && S.strayed && S.strayed()) S.recentre();
    state.zoomedIn = !!viaZoom && id === 'scene';
    state.lens = id;
    renderTabs();
    renderWhere();
    renderSceneNote();
    recount(renderObjects);
    apply();
    if (id === 'location' && window.FocusGlobe && FocusGlobe.ready) FocusGlobe.invalidate();
    seat();
    closeAsk(); markAsked(null);
    syncUrl();
  }

  /* the KPI the strip reads for this case: the slice it turns on where the
     engine holds it, otherwise the first of its area KPIs that the engine
     does hold. The readout names it either way, so there is no ambiguity. */
  function stripKpi(s) {
    const CV = window.CV, rec = CV && CV.MONBY && CV.MONBY[s.id];
    if (!CV) return null;
    if (s.kpi && CV.K[s.kpi]) return s.kpi;
    for (const r of (rec && rec.kpis) || []) if (CV.K[r.k]) return r.k;
    return null;
  }

  /* ── writing the panels where a figure can be seen to change ────────────
     The right-hand column and the objects are the two places on this screen
     that carry a reading rather than a sentence, and both are written whole.
     Handing the writing to live.js lets every figure and every bar in them be
     put back where it was and walked to the new reading, so choosing another
     signal reads as a recount rather than a cut.

     `quiet` is for the changes that are already a movement of their own: the
     first paint, and the handle being dragged along the time scale, where a
     figure counting behind the finger would only lag it. */
  const recount = (write, quiet) => {
    const L = window.FocusLive;
    if (!L || quiet) { write(); return; }
    L.over([colRight, $('#objects')], write);
  };

  /* Moving the handle moves the document, not the labels: past of NOW the
     engine's period moved, so every figure is re-read at that month. */
  function onTime(dragging) {
    if (window.FocusModel.refresh) window.FocusModel.refresh();
    recount(() => { renderLeft(); renderRight(); renderObjects(); }, dragging);
    markPick(); seat(); markTime();
    if (window.FocusGlobe && FocusGlobe.ready) FocusGlobe.invalidate();
  }

  function markTime() {
    const FM = window.FM, chip = $('#timeChip');
    if (!FM || !chip) return;
    const now = FM.ti === FM.NOW;
    chip.hidden = now;
    if (!now) {
      chip.textContent = FM.monthLabel(FM.ti) +
        (FM.ti > FM.NOW ? ' · ' + (FM.branch === 'act' ? 'with action' : 'no action') : ' · on the record');
      chip.dataset.when = FM.ti > FM.NOW ? 'fwd' : 'back';
    }
  }

  function open(i, quiet) {
    state.i = (i + SUBJECTS.length) % SUBJECTS.length;
    if (!subject().lenses.includes(state.lens)) state.lens = subject().lenses[0];
    markShelf(); renderTabs();
    recount(() => { renderLeft(); renderRight(); renderStage(); }, quiet);
    renderThread();
    markPick(); apply(); seat(); markTime();
    if (window.FocusTime) FocusTime.setSubject(subject().uid, stripKpi(subject()));
    if (window.FocusGlobe && FocusGlobe.ready) {
      FocusGlobe.focus(state.i, (quiet || REDUCED.matches) ? 0 : 900);
    }
    const on = $('.sig.is-on', shelf);
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    closeAsk(); markAsked(null);
    /* an answer already delivered and still being read has no turn in flight
       to be caught by, and it is about a case nobody is looking at now */
    stopSpeech();
    syncUrl();
  }

  /* One column and a stage is not room for a floating card. The second pair of
     numbers this file has to keep in step with focus.css — the query below is
     @media (max-width:860px) there — and unlike the assistant's pair it was
     never written down. Held as a media query object rather than being asked
     for a fresh one on every call, so it can be listened to. */
  const ONE_COLUMN = matchMedia('(max-width:860px)');
  function setLayout(l, quiet) {
    state.layout = ONE_COLUMN.matches ? 'columns' : l;
    renderLeft(); markPick(); apply(); seat();
    /* the link says which arrangement, and a window being resized past a line
       is not the reader choosing one */
    if (!quiet) syncUrl();
  }

  /* ═══ wiring: delegated, so nothing is bound twice and nothing goes stale */

  document.addEventListener('click', (e) => {
    const t = e.target;

    const sig = t.closest && t.closest('.sig');
    if (sig && shelf.contains(sig)) { open(+sig.dataset.i); return; }

    const tab = t.closest && t.closest('#lensTabs .seg-btn');
    if (tab && !tab.hidden) { setLens(tab.dataset.lens); return; }

    const face = t.closest && t.closest('#paneTabs .seg-btn');
    if (face) { setPane(face.dataset.pane); return; }

    const commit = t.closest && t.closest('[data-commit]');
    if (commit) {
      const s = subject();
      const done = pressedHere(s.id);
      /* the guard is the record's, not the button's — the button is rewritten
         whenever the time handle moves, and a rewritten one used to be pressable
         again and filed its line a second time */
      if (commit.dataset.done || done.has(commit.dataset.ckey)) return;
      done.add(commit.dataset.ckey);
      commit.textContent = commit.dataset.commit; commit.dataset.done = '1'; commit.disabled = true;
      const line = commit.dataset.measure != null
        ? 'Preventive action committed — ' + s.prevention[+commit.dataset.measure].what
        : commit.dataset.esc ? 'Event handed to the responsible unit'
        : commit.dataset.commit + ' — ' + (s.note || 'the register\u2019s reading');
      filed(s.id).push({ t: 'Now', x: line, st: 'now' });
      renderLeft(); markPick(); seat();
      const card = $('.card--timeline', colLeft);
      if (card) { card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash'); }
      return;
    }

    /* the forecast card and the strip are the same reading: pressing one of
       these walks the handle to the end of the horizon on that branch */
    const br = t.closest && t.closest('.acts [data-branch]');
    if (br && window.FocusTime && window.FM) {
      window.FM.setTime(window.FM.SPAN - 1, br.dataset.branch);
      FocusTime.draw(); onTime();
      $('#tlTrack').focus({ preventScroll: true });
      return;
    }

    /* above the votes, and taken out of them: the speaker stands in the same
       row and is not one of the two */
    const sp = t.closest && t.closest('.agent-acts .speak');
    if (sp) {
      if (window.Speak) Speak.prime();        /* inside the press, for iOS */
      /* pressing the one that is reading means stop talking, not stop this
         reply: the sound goes off and stays off until it is asked for again */
      if (sp.getAttribute('aria-pressed') === 'true') { stopSpeech(); setSpeak(false); }
      else { setSpeak(true); readOut(sp.closest('.msg-agent')); }
      return;
    }

    const vote = t.closest && t.closest('.agent-acts .btn-ghost:not(.speak)');
    if (vote) {
      const on = vote.getAttribute('aria-pressed') === 'true';
      for (const b of vote.parentElement.children) {
        if (b.classList.contains('speak')) continue;
        b.setAttribute('aria-pressed', String(!on && b === vote));
        b.classList.toggle('is-on', !on && b === vote);
      }
      return;
    }

    /* the chip at the end of the open bar is the send key */
    if (t.closest && t.closest('#askSpark')) { sendAsk(); return; }

    const askBtn = t.closest && t.closest('.ask');
    if (askBtn) {
      const host = askBtn.closest('.pickable[data-pick]');
      state.pick = askBtn.dataset.key || state.pick; markPick();
      if (host) openAsk(host, askBtn.dataset.ask);
      return;
    }

    const pick = t.closest && t.closest('.pickable[data-pick]');
    if (pick && !t.closest('button,a,input')) {
      /* clicking the reading already in hand puts it down again */
      state.pick = pick.dataset.pick === state.pick ? null : pick.dataset.pick;
      markPick();
      return;
    }

    const play = t.closest && t.closest('.media-play');
    if (play) {
      const box = play.closest('.media');
      const v = box.querySelector('video');
      box.classList.add('is-playing');
      if (v) { v.controls = true; v.play().catch(() => {}); }
      return;
    }

    if (t.closest && t.closest('[data-noop]')) e.preventDefault();
  });

  /* Every reading is a <section> wearing role="button" and tabindex="0" — it
     takes focus, and the delegate above answers a click. But only a real
     <button> turns Enter and Space into one; a sectioning element does not, so
     ten cards could be reached from the keyboard and none of them picked up.
     The two keys are bridged onto the same click rather than given an
     activation path of their own, so `state.pick` still has exactly one owner.
     A button fires on Enter down and on Space UP, and Space must never scroll
     the column underneath while it is held. */
  document.addEventListener('keydown', (e) => {
    const el = e.target;
    if (!el || !el.matches || !el.matches('.pickable[data-pick]')) return;
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); return; }
    if (e.key !== 'Enter' || e.repeat) return;
    e.preventDefault();
    el.click();
  });
  document.addEventListener('keyup', (e) => {
    const el = e.target;
    if (!el || !el.matches || !el.matches('.pickable[data-pick]')) return;
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    e.preventDefault();
    el.click();
  });

  /* the field's own keys, and the microphone beside it */
  askInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sendAsk(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeAsk(); }
    e.stopPropagation();          /* the screen's shortcuts are not typing */
  });
  $('#askMic').addEventListener('click', toggleVoice);
  /* a press anywhere that is not the bar or a sparkle puts it away */
  document.addEventListener('pointerdown', (e) => {
    if (askBar.hidden) return;
    const t = e.target;
    if (t.closest && (t.closest('#askBar') || t.closest('.ask'))) return;
    closeAsk();
  }, true);
  /* and so does the reading moving out from under it */
  for (const col of document.querySelectorAll('.col, .objects'))
    col.addEventListener('scroll', seatAskBar, { passive: true });

  $('#listen').addEventListener('click', toggleVoice);
  $('#mic').addEventListener('click', toggleVoice);

  $('#closeAssistant').addEventListener('click', () => {
    state.assistant = false; stopSpeech(); apply(); seat(); $('#toggleAssistant').focus();
  });
  $('#toggleAssistant').addEventListener('click', (e) => {
    state.assistant = !state.assistant; stopSpeech(); apply(); seat();
    if (state.assistant) $('#closeAssistant').focus(); else e.currentTarget.focus();
  });
  /* the tab put behind another, or left altogether: a page nobody is looking
     at goes on talking otherwise, and comes back talking after a navigation */
  addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });
  addEventListener('pagehide', stopSpeech);
  $('#threadTitle').addEventListener('click', (e) => {
    const b = e.currentTarget, on = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!on));
  });

  $('#railToggle').addEventListener('click', () => { state.rail = false; apply(); seat(); $('#railPeek').focus(); });
  $('#railPeek').addEventListener('click', () => { state.rail = true; apply(); seat(); $('#railToggle').focus(); });

  $('#prevSubject').addEventListener('click', () => open(state.i - 1));
  $('#nextSubject').addEventListener('click', () => open(state.i + 1));

  const send = () => {
    const f = $('#askField'), text = f.value.trim();
    if (!text) return;
    if (state.listening) stopVoice(null, true);   /* one question at a time */
    f.value = '';
    ask(text);
  };
  $('#send').addEventListener('click', send);
  $('#askField').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  /* a wheel notch is not always a pixel */
  shelf.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * shelf.clientWidth : e.deltaY;
    const before = shelf.scrollLeft;
    shelf.scrollLeft += px;
    if (shelf.scrollLeft !== before) e.preventDefault();
  }, { passive: false });
  shelf.addEventListener('scroll', markEnds, { passive: true });

  addEventListener('keydown', (e) => {
    /* the readings by number. Alt is read first and everywhere — it reaches
       the reading from inside a scroller or a field, where the bare digit is
       the user typing. The key is read off the physical code, because on a Mac
       Alt+1 arrives as '¡'; the layouts that do hand back a digit are taken too. */
    if (e.altKey && !e.metaKey && !e.ctrlKey) {
      const hit = /^(?:Digit|Numpad)([1-9])$/.exec(e.code);
      const n = hit ? hit[1] : (/^[1-9]$/.test(e.key) ? e.key : '');
      if (n) {
        const id = lensesHere()[+n - 1];
        if (id) { setLens(id); e.preventDefault(); }
      }
      return;
    }
    if (e.metaKey || e.ctrlKey) return;
    const el = document.activeElement;
    if (el && el.matches('input,textarea')) { if (e.key === 'Escape') el.blur(); return; }
    /* leave the arrows to whatever the user is standing in — a scroller, or
       the time scale, which reads them itself */
    const inScroller = el && el.closest && el.closest('.col,.assistant-body,.signals,.objects,#tlTrack');
    const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key);
    if (arrows && inScroller) return;

    const has = lensesHere(), at = has.indexOf(state.lens);
    if (e.key === 'ArrowRight') { setLens(has[(at + 1) % has.length]); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { setLens(has[(at + has.length - 1) % has.length]); e.preventDefault(); }
    if (e.key === 'ArrowDown')  { open(state.i + 1); e.preventDefault(); }
    if (e.key === 'ArrowUp')    { open(state.i - 1); e.preventDefault(); }
    /* the bare digits count the same tabs, so 2 is whatever stands second */
    if (/^[1-9]$/.test(e.key) && has[+e.key - 1]) { setLens(has[+e.key - 1]); e.preventDefault(); }
    if (e.key === 's' || e.key === 'S') setLayout(state.layout === 'stage' ? 'columns' : 'stage');
    /* the second zoom is on the brackets: the record on one side of NOW,
       the forecast on the other */
    if (window.FM && window.FocusTime) {
      if (e.key === '[') { window.FM.setTime(window.FM.ti - 1); FocusTime.draw(); onTime(); }
      if (e.key === ']') { window.FM.setTime(window.FM.ti + 1); FocusTime.draw(); onTime(); }
      if (e.key === '0') { window.FM.setTime(window.FM.NOW, 'base'); FocusTime.draw(); onTime(); }
    }
    if (e.key === 'v' || e.key === 'V') toggleVoice();
    /* the sound, on the same terms as the speaker: quiet what is reading, or
       read the last answer back */
    if (e.key === 'm' || e.key === 'M') {
      if (window.Speak && Speak.speaking()) { stopSpeech(); setSpeak(false); }
      else { setSpeak(true); readOut($$('.msg-agent', thread).pop()); }
    }
    if (e.key === 'Escape') {
      state.assistant = !state.assistant; stopSpeech(); apply(); seat();
      (state.assistant ? $('#closeAssistant') : $('#toggleAssistant')).focus();
    }
  });

  /* ── the other end of the first zoom ────────────────────────────────────
     The wheel runs from the planet down through the amanas, the cities and the
     districts to the streets themselves, and the street is where the map stops
     being the best picture of the place. So the camera hands over: at street
     level the reading becomes the street, and wheeling back out hands it back.
     The map keeps painting underneath, which is what lets the gesture reverse.

     Street level is necessary and it is not sufficient. It used to be both,
     and the result was that wheeling into any street in the Kingdom opened
     Olaya Street — the capture stood in for the ground under the camera
     wherever that ground was, and the caption admitted it in the same breath
     ("745 km from this case, and standing in for it"). There is exactly one
     capture in this repository and it covers one rectangle of Riyadh, so the
     second condition is that the camera is inside it. Everywhere else the
     wheel now runs to the bottom of the map and stops there, on a street grid
     that says what it is, which is the truthful end of that gesture. Getting
     to the capture from another case is a journey across the map, and the map
     draws the destination from a little above the district rung down — about
     fifty metres to the pixel, three levels short of the street. */
  if (window.FM && window.FM.on) window.FM.on('zoom', () => {
    if (!window.MapView || !MapView.isStreetLevel) return;
    const street = FM.view === 'map' && MapView.isStreetLevel();
    const here = street && MapView.sceneUnderCamera ? MapView.sceneUnderCamera() : null;
    /* The capture is 36 MB and a WebGL2 context, and the rule this file states
       where it is fetched is that it is paid for by OPENING it and by nothing
       else. A mouse wheel carried far enough down onto the footprint is a
       reader arriving somewhere on purpose; a pinch is not. Two fingers
       closing is how a phone reads a map at all, and it would have committed
       the download with nothing pressed — so on a coarse pointer the ladder
       runs to the bottom of the map and stops there, on the street grid, and
       the Scene tab is the door. Coming back OUT is left alone: that path
       spends nothing and only closes a reading already open. */
    if (here && state.lens !== 'scene' && subject().lenses.includes('scene')) {
      if (!COARSE.matches) openScene(true);
    } else if (!here && state.lens === 'scene' && state.zoomedIn) {
      setLens('location');
    }
  });

  /* Clicking the footprint is the other way in, and the one the map advertises:
     the card under the cursor says the reading opens, so it has to open. The
     camera is taken to the capture first — a click from the city rung would
     otherwise drop the reading over a map still showing a neighbourhood, and
     backing out of the capture would land somewhere that is not where it was
     entered from. */
  if (window.FM && window.FM.on) window.FM.on('scene:open', (s) => {
    if (!subject().lenses.includes('scene')) return;
    if (window.MapView && MapView.centreOn && s && s.anchor) {
      MapView.centreOn(s.anchor[0], s.anchor[1]);
      if (MapView.zoom && MapView.setZoom && MapView.zoomBounds &&
          MapView.zoom() < MapView.zoomBounds().street) {
        MapView.setZoom(MapView.zoomBounds().street + .4, 520);
      }
    }
    openScene(true);
  });

  function openScene(viaZoom) { setLens('scene', !!viaZoom); }

  /* The dissolve is redrawn as the column moves under it, once per frame at
     most. The latch is a variable rather than a data- attribute: writing an
     attribute from a scroll handler dirties style on the very element whose
     layout the next frame is about to measure. */
  let fadeQueued = false;
  const queueFade = () => {
    if (fadeQueued) return;
    fadeQueued = true;
    requestAnimationFrame(() => { fadeQueued = false; fadeEnds(); });
  };
  for (const col of document.querySelectorAll('.col, .objects'))
    col.addEventListener('scroll', queueFade, { passive: true });

  /* A resize drag is hundreds of events and at most sixty frames — and the
     observer on the stage box fires on the same resize the listener already
     saw, so seat() and the dissolve it ends in were running twice per step.
     One latch for both, and the full pass only for the one that needs it. */
  let sizing = 0, resized = false;
  function onSize(full) {
    if (full) resized = true;
    if (sizing) return;
    sizing = requestAnimationFrame(() => {
      sizing = 0;
      if (resized) { resized = false; apply(); markEnds(); }
      seat(); seatAskBar();
    });
  }
  addEventListener('resize', () => onSize(true));
  /* A resize is not the only way a phone changes shape, and it is not always
     the first thing to arrive: a URL bar retracting and an orientationchange
     whose metrics settle a frame late both cross these lines. Listened to
     rather than polled, so the state on this side cannot drift away from the
     rules on the CSS side between two resize events. crossing() does the work
     apply() cannot: the column layouts are written into the DOM, so moving
     between the frame's arrangement and the phone's has to re-write them. */
  function crossing() {
    setLayout(state.layout, true);    /* re-derives it, renders, applies, seats */
    onSize(true);
  }
  for (const mq of [PHONE, ASSISTANT_MIN, ONE_COLUMN]) {
    if (mq.addEventListener) mq.addEventListener('change', crossing);
    else if (mq.addListener) mq.addListener(crossing);   /* Safari before 14 */
  }
  if (window.ResizeObserver && stageFree) new ResizeObserver(() => onSize(false)).observe(stageFree);

  /* ═══ open on what the link asks for ════════════════════════════════════ */
  const q = new URLSearchParams(location.search);
  const wanted = SUBJECTS.findIndex(s => s.id === q.get('subject'));
  if (wanted >= 0) state.i = wanted;
  /* through the same guard the `s` key and a resize go through. Asked for
     directly it bypassed setLayout entirely: at 390×844 ?layout=stage parented
     the subject card to .work and seated it with an inline left/top/width, and
     the only thing keeping it in the flow was an !important in focus.css. */
  if (q.get('layout') === 'stage' && !ONE_COLUMN.matches) state.layout = 'stage';
  if (LENSES.some(l => l.id === q.get('lens'))) state.lens = q.get('lens');
  /* the reader's switch, remembered per browser — and pinned for one load by
     ?speak= without being written down, the way ?agent=off pins the agent */
  try { if (localStorage.getItem(SPEAK_KEY) === 'off') state.speak = false; } catch (e) {}
  if (q.get('speak') === 'off') state.speak = false;
  if (q.get('speak') === 'on') state.speak = true;
  app.dataset.said = '';
  app.dataset.words = '';
  /* the list arrives over an inter-process hop in one browser and is already
     there in another; the thread is written again once it has settled, which
     is long before there is a reply in it to carry a speaker */
  if (window.Speak) Speak.ready().then(ok => { canSpeak = ok; if (ok) renderThread(); });

  renderWave();
  buildTabs();
  buildPanes();
  buildShelf();
  if (window.FocusTime) FocusTime.mount({ onChange: onTime });
  if (window.FocusGlobe && FocusGlobe.ready) {
    FocusGlobe.setSubjects(SUBJECTS, i => open(i));
  }
  open(state.i, true);

  /* ═══ what the first frame does not need ════════════════════════════════
     Two files carry most of the screen's weight and neither is wanted before
     it is drawn: cv-media.js is 918 KB of base64 footage that only the clip
     and the shelf thumbnails quote, and the environment photograph is 1.4 MB
     that only the scene reading ever shows. Both used to be fetched with the
     document. They are fetched once the screen is up instead — the moment the
     reading that needs one is opened, or on the first idle after paint,
     whichever comes first — and what quoted them is drawn again when they
     land. Nothing waits on either to be usable. ═══════════════════════════ */
  const soon = (fn) => (window.requestIdleCallback
    ? requestIdleCallback(fn, { timeout: 1500 })
    : setTimeout(fn, 240));

  let mediaAsked = false;
  function loadMedia() {
    if (mediaAsked) return; mediaAsked = true;
    if (window.FocusModel.hasMedia()) return;         /* already in the page */
    const el = document.createElement('script');
    el.src = 'assets/js/data/cv-media.js';
    /* a classic script, so `const ASSET` still lands in the same global
       lexical scope model.js reads it from */
    el.onload = () => {
      if (!window.FocusModel.hasMedia()) return;
      renderStage(); buildShelf(); markShelf(); seat();
    };
    document.head.appendChild(el);
  }

  /* ── the street reading ─────────────────────────────────────────────────
     The capture is drawn by a module, and a module runs after every deferred
     classic script on the page — so by the time it exists this file has long
     since finished. It cannot be called into; it calls in. The hook below is
     what it looks for, and until it arrives the caption says only what it can
     honestly say.

     The photograph is not fetched at all unless it is needed: on a machine
     without WebGL2 the renderer says so, and that is the moment it is asked
     for. */
  const sceneStill = $('#sceneStill');
  function keepPhotograph() {
    const cv = $('#scene3d');
    if (cv) cv.hidden = true;
    if (!sceneStill) return;
    if (sceneStill.dataset.src) {
      sceneStill.src = sceneStill.dataset.src;
      delete sceneStill.dataset.src;
    }
    sceneStill.hidden = false;
  }

  function wireScene() {
    const S = window.FocusScene3D;
    if (!S) return;
    S.onChange((st) => {
      sceneStat = st;
      if (st.ok === false) keepPhotograph();
      renderSceneNote();
    });
    /* the other end of the first zoom, from inside the street: back out of the
       capture altogether and the planet is the better picture again */
    S.onHandback(() => { if (state.lens === 'scene') setLens('location'); });
    S.show(state.lens === 'scene');
  }
  window.FocusScene3DReady = wireScene;

  function loadScene() {
    const S = window.FocusScene3D;
    if (S) S.show(true);
  }
  /* whichever reading the link opened on is wanted now, not on idle */
  if (state.lens === 'media' || state.lens === 'objects') loadMedia();
  if (state.lens === 'scene') loadScene();
  /* The clip is worth fetching on idle: it is under a megabyte and the reading
     is one keystroke away. The capture is not — it is 36 MB and a WebGL
     context, and prefetching it would charge every visit for a reading most
     visits never open. It is paid for by opening it, and by nothing else. */
  addEventListener('load', () => soon(() => { loadMedia(); }), { once: true });

  if (window.Agent) window.Agent.probe().then(markAgent);
  document.body.classList.add('ready');

  /* the screen's own hooks, for the readings that arrive on demand */
  window.FocusAssets = { media: loadMedia, scene: loadScene };
})();
