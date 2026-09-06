# Axion Gen · Future vision — build spec

Source of truth for everyone working on this repo. Figma file `XDOceRokvyikE1cuk6HO9S`,
section **Axion Talks** (`5414:188133`, titled "Axion Gen · Future vision"). Reference
implementation of the same design system: `/Users/alexander/Documents/DEV/lens-vision/focus.html`
+ `assets/focus/focus.css` (a copy of that page lives in `./lens/`). Screenshots of the
four Figma frames at 1:1 are in `docs/figma/` — compare against them, not against memory.

Stack: plain HTML + CSS + vanilla JS, no build step, no framework, no network calls at
runtime (fonts are `local()`). Serve with `node tools/serve.mjs 5320`. Design size is
**1920×1080**; every number below is a pixel read off the frame at that size. The layout
must still be a layout (flex/absolute), never a scaled picture.

## 0. The four frames

| Frame | Node | What it is |
|---|---|---|
| Home | `5405:87767` | Agent chat inside a project, widgets the agent opened on the right, Axi orb (voice) floating |
| Home · fullscreen | `5414:184216` | One widget (Riyadh scene) expanded to cover the chat + widgets area |
| Library | `5414:185044` | Data table `axion_sense.frames`, a row's detail panel, Axi orb over the table |
| Home · agent‑centric concept | `5414:188163` | No Gen Sidebar rail; the left sidebar carries the AXION word‑mark, Home/Library/Dashboards/Users and the profile |

Designer's notes on the frames (translated from the Russian guides):
1. Axi (the agent) can be summoned over any screen; you can talk to it by voice while typing in another chat.
2. The agentic scenario is the main one. The user lands on the Axi page and works inside projects and chats. Inside a chat the agent manipulates interactive widgets, composes dashboards from them, all pokeable in the chat; on the right the agent opens widgets — full scenes, signals — the feed scrolls; every widget the agent opens lands in the workspace, no need to go to a separate dashboard.
3. Fullscreen mode — later lets most Axion scenarios be done without leaving the chat.
4. Voice mode is available everywhere. The agent sees context; ask it anything complex, e.g. about the data in Library.
5. "What if all of Axion were an agent‑centric platform? Just a concept."

## 1. Tokens (dark mode values, from Figma variables + focus.css)

```
bg (frame)                 #262626
surface                    rgba(0,0,0,.8)        — the base every material stands on
on-surface-primary         rgba(255,255,255,.05)
Axion material/Primary     linear-gradient(0deg, rgba(255,255,255,.05) 0 100%), surface     → --mat-05
Axion material/Secondary   linear-gradient(0deg, rgba(255,255,255,.12) 0 100%), surface     → --mat-12
Axion material/On Primary  linear-gradient(0deg, rgba(0,0,0,.05) 0 100%), surface           → --mat-b05
user bubble material       linear-gradient(0deg, rgba(255,255,255,.10) 0 100%), surface     → --mat-10
base/fg/primary            #fdfdfd
control/fg/subtle/default  #dcdcdc
control/fg/subtle/active   #f9f9f9
control/fg/subtle/ghost    #b5b5b5   (section titles "KSA insights", "Cityview")
base/fg/tertiary           #9e9e9e   (carets, "5 min ago", plus icons, table labels)
base/fg/inverse/tertiary   #797979   (placeholders, model name, table id column)
control/fg/subtle/inverse  #262626   (text on light buttons)
control/bg/secondary-inverse #f4f4f4 (avatar, "Ask Axsi" button)
control/bg/transparent/hover   rgba(253,253,253,.05)
control/bg/transparent/pressed rgba(253,253,253,.10)
control/bg/tretiary        #3c3c3c
border/primary             rgba(253,253,253,.10)
border/ghost               rgba(253,253,253,.05)
brand                      #7d7bff
info                       #4cb4ff     positive #3bc77d     warning #ffcd29     negative #ff7871
flag red (timeline "Decision needed", signal dots)  #ff5050
forecast: no action #e5ab3c (yellow dotted) · with package #00d39b (green dotted) · target line #00d39b
project icon green (α)     #10b981
```

Effects (CSS = half of Figma's radius for blur):
```
--umbra-lit: 0 .5px .75px 0 rgba(255,255,255,.25) inset, 0 -.5px .75px 0 rgba(255,255,255,.25) inset
--umbra:     var(--umbra-lit), 0 0 0 .5px var(--surface)            (Shadow/Axion umbra)
--spectrum:  0 0 .5px .5px var(--border-primary)                      (Shadow/Axion spectrum) + backdrop blur 256px
--modal-2:   0 0 1px rgba(0,0,0,.8), 0 18px 54px rgba(0,0,0,.3)       (Modal/Secondary) + backdrop blur 8px
--shadow-medium: 0 10px 32px rgba(0,0,0,.16)
Blur/Window = 18px · blur/s = 32px · blur/l = 64px · header/panel = 128px · spectrum = 256px
orb glow: 0 4px 128px 27px rgba(76,180,255,.25)
```

Type: family **"ABC Diatype"** (local trial: `ABC Diatype Trial Regular/Medium/Bold`), fallback
`-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`. Mono for ids:
`ui-monospace, "SF Mono", Menlo, "IBM Plex Mono", monospace`. Letter‑spacing 0 everywhere.
Text scale actually used:
- control_L 16/24 medium (nav items, header title, widget titles, input text)
- control_M 14 medium (chat items, buttons, "Ask Axsi")
- control_S 12 (table cells, tabs) · caption_S 10 (tags)
- body_M 16/24 regular (messages) · body_S 14/20 (timeline month, "Signals", panel rows)
- caption_L 14/16 regular (section titles) · caption_M 12/14 (month labels, "5 min ago")
Figma control text uses line‑height 10 with pt 6 / pb 8 inside a 24 box → the glyphs sit
**1px above** the box centre. Emulate with normal line‑height and `padding-bottom:2px` or
`transform:translateY(-1px)` on control labels; do not fight it with magic numbers elsewhere.

Radii: 16 panels/widgets/input/bubbles · 12 timeline & minimap & active rail button · 10 nav
buttons (48px) · 8 buttons (36px), chat items, seg tracks · 6 seg chips, 28px buttons · 4 thumbs
· 2 table badges · 100/1000 round.

Icons: **Phosphor regular** (`assets/icons/*.svg`, 256 viewBox, `fill:currentColor`). Sizes:
24 in the rail and the sidebar nav and the input's Plus/Mic; 20 in 36px buttons and chat items;
16 in 28px buttons and table headers. Custom glyphs in `assets/figma/`: `logo-axion-future.svg`
(44×44 rail mark), `logo-axion-wordmark.svg` (114.5×18 "AXION"), `icon-sidebar-group.svg`
(green α, 18.6×14.9, the project icon), `orb-favicon-dark.svg` (orb eyes), `sparkle.svg`, `axsi.svg`.

## 2. Shell geometry (Home, 1920×1080)

```
frame            bg #262626
Gen Sidebar      x8 y8 w60 h1064   radius16  --mat-05 (NO backdrop blur)  --umbra
                 padding 0 4 4, gap 4, column, centred
                   logo button: 52×52 (padding 4) with 44×44 logo-axion-future.svg
                   Nav (flex 1): five 48×48 buttons (padding 12, icon 24), each -4px bottom margin (44 pitch)
                     1 Axi    — custom glyph: 20px ring stroke 1.6 + small white oval inside (see crop); ACTIVE: bg hover, radius 12
                     2 HouseSimple   3 BookOpen   4 Cards   5 User          radius 10 when hovered
                   SidebarSimple 48×48 button (collapse rail)
                   Profile: border-top 1px ghost, padding 8 → avatar 36×36 radius 8 bg #f4f4f4 "AS" 14 bold #262626
Assistant panel  x76 y8 w1836 h1064  radius16  --mat-05 + backdrop-blur 128px  --umbra  overflow hidden
  Contents       x0 w350 full height, border-right 1px ghost, padding 3 8 16, gap 4, scrolls (scrollbar hidden)
    top-right    two 36×36 ghost buttons at (270,7): MagnifyingGlass, SidebarSimple (icon 20)
    nav group    New (Plus) · Library (Books) · Scheduled (ClockCountdown) · More (DotsThreeOutline)
                 each 48 tall, padding 12 0 12 12, gap 8, icon 24, label 16 medium #dcdcdc, -4 bottom margin
    section      padding 16 8 4 8: title 14/16 regular #b5b5b5 flex-1 + Plus 16px glyph in a 24 box (#9e9e9e)
    chat item    36 tall, padding 8 0 8 12, gap 4, radius 8, items-end; icon 20 = Phosphor dot-outline in the
                 signal colour; label 14 medium #dcdcdc; hover bg hover; active bg pressed
  Header         x350 y0 w1006 h52 (ends where the widgets column begins minus 10), padding 8, backdrop-blur 18px,
                 sits OVER the thread (thread scrolls underneath), transparent background
                   [36 button: green α icon] [flex-1: "KSA insights" 16 medium #fdfdfd, gap 8, CaretDown 16 #9e9e9e]
                   [right: 4 × 36 buttons: Terminal · Cards · FolderSimple · DotsThree]
  Chat column    x478 w768 (128 from the sidebar edge; 120 to the widgets column), scrolls; padding-top 52+16, bottom 96
    user bubble  right aligned, max-w 461, padding 8 12, radius 16, --mat-10, --spectrum + blur 256, text 16/24 #dcdcdc
    agent text   16/24 #dcdcdc, width ≤ 753
    rhythm       user→agent 32 · agent text→widget 24 · widget→actions 8 · actions→next user 32 · agent→timeline 24
    actions row  28 tall: button_group (4 × 28 buttons, 16 icons: ThumbsUp ThumbsDown Copy ArrowsCounterClockwise, gap 2)
                 + "5 min ago" 12/14 #9e9e9e at x130. The LAST message's row is drawn at opacity .2 until hovered.
  Input          x478 y992 w768 h48, radius 16, --mat-12, --umbra (24px below it to the panel edge)
                   [48×48 Plus (icon 24)] [field flex-1 padding 0 8: 16 regular, placeholder #797979 "Ask anything..."]
                   [button 36, min-w 72, padding 8 12, margin-right -8: "GPT-5.6 Luna" 14 medium #797979 + CaretDown 20]
                   [48×48 Microphone (icon 24)]
  Glow           `glow-vector-2842480.svg` box at (351,959) 927×328 inside the panel, img inset -39.02% -13.81%,
                 pointer-events none, behind the chat (a soft #7d7bff bloom under the input)
  Widgets column x1366 w462, from y8, gap 8, padding-bottom 8, scrolls vertically (feed), scrollbar hidden
    widget       radius 16, padding 16, gap 12, overflow hidden, ring 0 0 0 1px surface, --umbra-lit inset;
                 title 16 medium #fdfdfd at (16,16); buttons at right 4 top 4: ArrowSquareUpRight · ArrowsOutSimple · X (36, icon 20)
    Riyadh scene 462×436, --mat-05 + blur 32 behind a live iframe (see §5); image masked with a vertical gradient
                 (transparent at -43% → opaque at 45%) so the top fades into the title
    Global KPIs  462×604, bg #000; space photo `kpi-bg.jpg` at (-1,48) 573×475; live globe iframe (fallback `globe.png`
                 654×654 at (-116,66), round, inset white glow); Zoom tool at right 8, vertically centred: two 36×36
                 (Plus / Minus, bg rgba(255,255,255,.05), radii 8 top / 8 bottom, blur 256);
                 MiniMap at (7, bottom 8) w447: padding 8, gap 8, radius 12, --mat-12, --spectrum, blur 256:
                   row 1: signal cards (see §4 signals) in a horizontal strip; row 2 (28 tall, pl 8): "Signals" 14 medium
                   + seg tabs Location · Media · Scene (12px, 6/4 padding, chip --mat-12)
  Orb            frame-level, 128×128 at (368,528): white circle, `orb-image.png` cover anchored right (210×128 at right -2),
                 `orb-favicon-dark.svg` 125×125 at (3,1.5), glow shadow. Buttons (36 round, --mat-12, blur 32, umbra-lit):
                 Microphone at (0,124) · X at (46,139) · SpeakerHigh at (92,124). Draggable; remembers position.
```

Fullscreen (frame 2): the expanded widget becomes `x358 y8 w1470 h1048` inside the panel (covers header,
chat and widgets; the sidebar stays). Buttons: ArrowSquareUpRight · ArrowsInSimple · X. Orb moves to (410,851).

Agent‑centric (frame 4, `data-concept="agent"`): rail hidden; panel `x8 w1904`; header `x350 w1074`;
chat `x515`; widgets `x1434`. Contents gets a 44‑tall logo row (padding 0 4; wordmark box padding 8 13,
wordmark 114.5×18 `logo-axion-wordmark.svg`), nav New · Home · Library · Dashboards · Users (Plus,
HouseSimple, Books, Cards, User), and a Profile footer (absolute bottom, w350, padding 12 16, border-top
ghost, blur 256): avatar 36 "AS" + "Aleksand Shcheblykin" 14/20 medium + "a.shcheblykin@axionx.ai" 12 #9e9e9e.

## 3. Library (frame 3)

```
Main section  x76 y8 w1836 h1064  radius 16, --mat-05, --umbra (same panel as Home)
Gen Header    h52, padding 8, border-bottom 1px border-primary, blur 18
   left:  CaretLeft · CaretRight (28 buttons, 16 icons) · title "axion_sense.frames" 16 medium (an inline input, radius 6)
   right: seg [Table ✓ | MapTrifold] (20 icons, chip --mat-12, track --mat-b05) · SlidersHorizontal · FunnelSimple ·
          Columns (36 buttons) · "Ask Axsi" button (36, min-w 72, padding 8 12, bg #f4f4f4, text 14 medium #262626,
          + 20px circle-half glyph) · DotsThree (36)
Table         padding 8; header row h32 at y8: cells padding 8, gap 6, icon 16 + label 12 medium #dcdcdc;
              1px dividers (rgba(253,253,253,.05)) between cells and rows; rows h72 (cell content 40 tall, 12px text);
              13 rows visible; horizontal scroll (the sheet is 4569 wide); numbers right‑aligned; hovered/selected row bg --mat-12
   columns (width · icon · align): id 112 Hash · track_id 230 Hash mono · user_id 116 Hash R · organization_id 122 Hash R ·
   recorded_at 156 CalendarBlank · created_at 156 CalendarBlank · lat 88 MapPinSimpleArea R · lon 88 R · altitude 116 R ·
   h3_index_res9 128 Hash · h3_index_res12 128 · is_uploaded 128 Flag (badge) · azimuth 128 R · azimuth_accuracy 136 R ·
   speed_ms 128 R · speed_accuracy 128 R · lat_long_accuracy 137 R · altitude_accuracy 128 R · source_lat 128 R ·
   source_lon 128 R · is_map_matched 128 (badge) · source_version 128 (badge info) · tags 128 TagSimple (3 stacked 10px chips) ·
   detector_ids 128 · detection_classes 136 · detection_classes 136 · detection_bbox_tags 153 · detection_bbox_tags 153 ·
   detection_aggregated_at 176 CalendarBlank · outside_territory 128 (badge) · capture_issue 114 (badge warning) ·
   is_duplicate 103 (badge) · duplicate_of_frame_id 158 R · duplicate_of_track_id 155 mono
   badges: h16, padding 2 4, radius 2, 12 medium. TRUE = positive on rgba(59,199,125,.16); FALSE = #b5b5b5 on rgba(253,253,253,.08);
   info (AxionV1, tags) = #4cb4ff on rgba(76,180,255,.16); warning (Unspecified) = #ffcd29 on rgba(255,205,41,.16)
Footer "rows" h52 at the panel bottom: padding 8 8 8 16, --mat-05, --spectrum; "Rows per page" 14 #b5b5b5 +
   field 36 (--mat-b05, radius 8, padding 4): "20" 14 + CaretDown 28 button; right: CaretLeft · CaretRight 36 buttons
Detail panel  "Frame #2147506013" 351×523 at (1478,429) inside Main: --mat-12, radius 16, --modal-2;
   widget_header h48 padding 6 12 6 16: title 16/20 medium + X (24 box, 16 icon);
   Contents padding 0 16 24, gap 8: photo aspect 1044/548 radius 4 (`lib-frame-photo.jpg`); "Tags" 14 medium (pt 8);
   tag chips wrap gap 4; "Data" 14 medium; rows: label 14/20 #9e9e9e left, value 14/20 #fdfdfd right (mono for ids),
   1px ghost dividers between rows (padding 4 0)
Orb           at (512,448)
```

## 4. Content (all of it lives in `assets/js/data.js`)

Projects → chats (sidebar). Signal‑dot colours per chat item are in the order below.
```
KSA insights:  Population density by districts (info) · Traffic heat map (ghost) · 5G coverage area analysis (ghost) ·
  Clusters of sales points (info) · Population migration Q3 (ghost) · Delivery zones for couriers (ghost) ·
  Isochrones 15 min from the metro (ghost) · Accident distribution for August (ghost) · Competitors' trading zones (positive) ·
  Coverage of mobile towers (warning) · Commuter migration flows (info) · POI density by categories (ghost) ·
  Flooding forecast zones (negative) · Pedestrian accessibility index (warning) · Logistics routes KSA (ghost) · Road network load (ghost)
Cityview:      Population density by districts (info) · Traffic heat map (ghost) · 5G coverage area analysis (info) · Clusters of sales points (info) · … same list
```
"ghost" dot = #797979.

The open conversation (KSA insights · "Flooding forecast zones" is NOT it — the open chat is the Taif ride incident, title
"Parts fell from a ride at Al Jabal Al Akhdar resort"):
1. user: "So the ride was shut down by 10:26, that's good, but walk me through these signals — are these all related events or separate reports?"
2. agent: "The incident was recorded at 09:14 via social monitoring: video showing detached metal parts of the attraction."
   + widget group: card **Timeline & current situation** (376×290, --mat-12 + blur 32, radius 16, padding 16 16 20, label 14 medium
   with a .5px border-primary underline, rows gap 20: time 12 medium 40% opacity in a 64 column + text 14 regular):
   09:14 Trending content detected by social listening · 09:44 Location and establishment verified via BaladyLens ·
   10:26 Ride shut down and perimeter fenced · 11:50 Engineering check of similar rides on site · 12:50 Final safety report
   and restart decision → "Decision needed" 14 medium #ff5050 + 6px dot; a red blurred ellipse (`ellipse-2450-glow.svg`)
   bleeds from the card's bottom-left.
   Beside it the photo `ride-photo.jpg` 169.6×290 radius 16, and the meta line (12px, w176):
   "Taif Amana · Recreational facility safety · Al Jabal Al Akhdar resort — rides area · [Licence no. H-48221](#) · [Post on X ↗](#)" (links #4cb4ff)
   + actions row "5 min ago"
3. user: "What will happen if nothing is done?"
4. agent: "If delayed detection and shutdowns continue, the compliance score below 70% will worsen through Q4 2026 and into 2027. Structural failures without preventive inspections may lead to regulatory action from Taif Amana, risking licence suspension for facility H-48221. Each incident damages reputation, eroding visitor trust and reducing attendance by 12–18%. By mid-2027, the resort may fall below operational viability, making recovery costly."
   + **timeline widget** (768×135, padding 8, radius 12, --mat-12, --spectrum, blur 256): head row (pl 8, h28): "August 2026" 14/20 medium ·
   seg [No action ✓ | With action package]; plot box h87 (--mat-05, radius 4 4 10 10, padding 0 8 8): chart 57 tall with
   1px ghost bottom border; past ground --mat-b05 from the left edge to x419 (NOW); "Target 70%" 10px #00d39b at y27;
   dashed target line at y43 (#00d39b .8px dashed); white record polyline (2,57)→(94,43)→(206,39)→(419,25) with diamond
   marks at x183 (y40), 301 (y34), 421 (y25); NOW handle = white 2px line at x456 full height; green forecast diamond‑topped
   line at x498; forecasts: green dotted rising (421→705, y 25→2) and yellow dotted flat (422→747 at y25);
   months row 12/14 justify‑between: Mar 2025 · Jun 2025 · Sep 2025 · Dec 2025 · Mar 2026 · Jun 2026 · Sep 2026 · Dec 2026 · Mar 2027 · Jun 2027 · Sep 2027
   + actions row "1 min ago" at opacity .2

Signals (KPI minimap strip, and the Signals page): 
- Parts fell from a ride at Al Jabal Al Akhdar resort · Taif Amana · red · thumb `sig-thumb-1.jpg`
- AFC Asian Cup 2027 — readiness of the zones around the stadiums · Riyadh · Jeddah · Eastern Region · #e5ab3c · thumb = globe crop
- Rising platform trend on street cleanliness — south Riyadh · Qassim Amana · red · thumb `sig-thumb-3.jpg`
- Facade sections fell from an existing building · Jeddah Amana · red · no thumb (bare card 193.8 wide, padding 8 16)
- AFC Asian Cup 2027 … (repeat) · Riyadh · Jeddah · Eastern Region · #e5ab3c · globe crop
Card geometry (from focus.css `.sig`): 295.816 wide, padding 8, gap 8, radius 8, 1px ghost border; selected = 247.816 wide,
--mat-05, no border; thumb 64×64 radius 4; title 14 medium 2 lines (line-height 17.2); meta 12 medium 40% + 6px dot.

Table rows: id 2147506013 · track_id `019fc4e1-245a-77ee-86e6-1a49…` · user_id 2 · organization_id 1 · recorded_at
"2 Aug 2026, 23:48" · created_at "2 Aug 2026, 23:50" · lat 24.713700 · lon 46.675900 · altitude 0 · h3 618461231495774200 /
631972030377632300 · is_uploaded TRUE · azimuth 90 · … · source_version AxionV1 · tags amana_or_contractor:contractor,
priority_zone:Low Risk, contractor_company:Someone and someone else · detection_aggregated_at "1 Jan 1970, 00:00" ·
outside_territory FALSE · capture_issue Unspecified · is_duplicate FALSE · duplicate ids 0 / 0000…
Generate 20 rows per page from this template with plausible variation (ids incrementing, times a few minutes apart,
lat/lon jitter around Riyadh 24.71/46.67, some TRUE/FALSE flips, a few "High Risk"/"Blurred" capture issues) — 
total 2,147 frames, page 1 of 108.

Detail panel data: Capture Issue Unspecified · Duplicate Of Track Id 00000000-0000-0000-0000-000000000000 · Source Version AxionV1 ·
Track Id 019f26b2-3dbf-7f53-be83-bbb54dd71b18 · Created At Jul 3, 2026, 1:54 PM · Detection Aggregated At Jul 21, 2026, 5:13 PM ·
Recorded At Jul 3, 2026, 9:37 AM · Is Duplicate FALSE · Is Map Matched TRUE · Is Uploaded TRUE · Outside The Territory FALSE ·
Duplicate Of Frame Id 0 · H3 Index Res12 631,693,701,427,693,600 · H3 Index Res9 618,182,902,545,645,600 · Organization Id 8 ·
User Id 36,186 · Altitude -4.8 · Altitude Accuracy 54.702 · Azimuth 17 · Azimuth Accuracy 180 · Lat Long Accuracy 12 ·
Speed Accuracy 0.663 · Speed Ms 4.559. Tags: amana_or_contractor:contractor · priority_zone:High Risk · contractor_company:Someone and someone else.

## 5. Live pieces (what makes it feel real)

- `lens/focus.html` is the real Lens page (planet renderer + 3D Gaussian‑splat street capture). Widgets embed it in a
  same‑origin `<iframe>`: scene = `lens/focus.html?subject=taif&lens=scene&speak=off`, globe = `lens/focus.html?subject=taif&lens=location&speak=off`.
  On `load`, inject a `<style>` into the iframe document that hides `.rail,.assistant,.col,.dock,.headers,.askbar,.scale-bar,#railPeek,.scene-note`
  and sets `.stage-free{left:0!important;right:0!important}` `.shell{inset:0}` `body{background:transparent}` so only the
  reading fills the frame. If the iframe fails (file missing, no WebGL) fall back to `scene-riyadh.jpg` / `globe.png`.
  Never load more than two iframes at once; pause/unmount hidden ones.
- Speech: `speechSynthesis` for the orb reading answers (mirror `lens/assets/focus/speak.js` voice choice), `SpeechRecognition`
  when available, otherwise a scripted transcript typed word‑by‑word. Never block on it.
- Streaming: agent replies appear word‑by‑word (~18ms/word) after a 600–900ms "thinking" dots state; widgets slide in after.

## 6. Scenarios the demo must support (all clickable)

Home / chat
- Sidebar: project sections collapse; clicking a chat switches the thread (each chat has 1–2 seeded exchanges and one widget);
  "New" opens an empty thread with a welcome state + 4 suggestion chips; "Scheduled" opens the Scheduled page (list of agent
  runs: name, cadence, last run, next run, status); "More" opens a menu (Signals page, Settings, Agent‑centric layout toggle,
  Keyboard shortcuts). Search button opens a command palette (⌘K) that filters chats/projects/pages.
- Header: project switcher dropdown (KSA insights ✓, Cityview, + New project); Terminal = agent console drawer (tool calls
  log with timings: `search_signals`, `open_scene`, `forecast.run` …, live‑appending while a reply streams); Cards toggles the
  widgets column; FolderSimple = project files popover; DotsThree = chat menu (Rename, Share, Export, Archive).
- Composer: Enter sends; Shift+Enter newline; Plus opens "Plus options" chips (Attach file, Add scene, Add signal, Add dashboard,
  /command); model menu (GPT‑5.6 Luna ✓, Axi Reason 2, Claude Fable 5.1, Gemini 3.5 Pro); Mic opens the orb in listening mode.
- Scripted replies keyed by intent words in the question (scene/street/3d → opens the Riyadh scene widget and answers;
  kpi/global/map → opens Global KPIs; forecast/happen/nothing → the forecast paragraph + timeline widget; action/do/measures →
  an "Action package" card with three measures and Commit/Reject buttons; compare/jeddah → a small bar chart widget in chat;
  anything else → a grounded generic answer that cites the signal + offers 3 follow‑ups). Every reply gets the actions row;
  thumbs toggle; copy copies; regenerate re‑streams a variant.
- Widgets column: agent‑opened widgets append at the bottom and the column scrolls to them; each has open‑in‑new
  (navigates to Library or a Dashboards page), expand (fullscreen frame), close (with an "Undo" toast). Empty state text when none.
- Timeline widget: seg switches which forecast is highlighted; hovering a month point shows a tooltip with the reading;
  dragging the handle scrubs the month label and readings.
- Orb: appears from the mic button or "Ask Axi"; states idle → listening (glow pulses, waveform in the composer) → hearing
  (transcript appears in the composer) → thinking → speaking (answer streams into the thread and is spoken; Speaker toggles mute);
  X closes. Draggable anywhere on the screen; persists across pages; on Library it can answer "how many frames have capture issues?"
  by highlighting rows and opening the detail panel.

Library
- Sortable columns (click header), column resizing not required; row hover; row click opens the detail panel (slides in) with
  the row's data; X closes; ⌘/ctrl‑click multi‑select; pagination (prev/next, rows per page 20/50/100); Table/Map seg — Map shows
  the globe iframe with the frames as pins (or a static fallback); Filters opens a popover (capture_issue, is_uploaded, date range) that
  filters the rows for real; Columns opens a checklist that hides/shows columns; "Ask Axsi" opens the orb.

Global
- Hash router: `#/chat/<id>`, `#/new`, `#/library`, `#/scheduled`, `#/signals`, `#/dashboards`, `#/users`; rail + sidebar reflect the route.
- `data-concept="agent"` on `<html>` toggles the agent‑centric layout (persisted in localStorage; `?concept=agent` also works).
- Keyboard: ⌘K palette · ⌘J agent console · Esc closes overlays/fullscreen · `/` focuses the composer.
- Toasts bottom‑centre (mat‑12, radius 8) for undoable actions.

## 7. Module contracts (read `assets/js/app.js` — it is the shell)

`window.App` (app.js) is booted on DOMContentLoaded AFTER every module script has run, and calls
`Timeline.init()`, `Widgets.init()`, `Chat.init()`, `Library.init()`, `Pages.init()`, `Orb.init()` in that order
(each optional). Modules are plain globals defined by their file. Helpers on `App`:

- `App.h(tag, attrs, ...kids)` hyperscript (`class`, `style{}`, `dataset{}`, `html`, `onClick`‑style handlers, boolean attrs);
  `App.icon(name, size=20, cls)` → `<svg class="ic ic20"><use href="assets/icons/sprite.svg#i-name">`; `App.btn(icon, label, {size:28|36|48, onclick, class, attrs})`.
- `App.on(event, fn)` / `App.emit(event, detail)` — the bus. Events in use:
  `route {name,param,isNew}` · `state {key,value}` · `esc` · `orb:open {listen?, text?}` · `orb:ask {text, page}` · `console:toggle` ·
  `console:log {tool, args, ms}` · `widget:open {id, source}` · `widget:close {id}` · `signal:open id` · `chat:reply {chatId, message}` · `boot`.
- `App.state` {page, chatId, projectId, concept, widgets, rail, sidebar, full, orb, console, model} and `App.set(key, value)`
  (mirrors to `<html data-*>` and persists concept/model). `App.go('#/chat/<id>')`, `App.registerPage(name, {show(param, r), hide()})`.
  Pages: `chat` (Chat registers), `library` (Library registers), `focus` (app.js), and the simple ones `scheduled|signals|dashboards|users|settings`
  (Pages registers all five and renders into `#pageSimple`).
- `App.menu(anchor, items, {side:'bottom'|'top', align:'left'|'right', width})` items `{label, icon, kbd, small, checked, switch, danger, sep, title, onSelect, keep, active}`;
  `App.popover(anchor, {title, body, foot, width, align, side, onClose})`; `App.closeMenu()`; `App.toast(text, {action, onAction, duration})`;
  `App.palette()`; `App.shortcuts()`.
- `App.lens.url(params)`, `App.lens.embed(iframe, {subject, lens}, {onReady(doc), onFail(why), timeout})`, `App.lens.setLens(iframe, 'scene'|'location'|'media'|'objects')`.
- `App.sleep(ms)`, `App.escapeHtml`, `App.clamp`, `App.ago(ts)`, `App.project(id?)`, `App.chat(id?)`, `App.dotColor(name)`, `App.store.get/set`.

Module APIs the others rely on:
- **Timeline** (`timeline.js`): `Timeline.mount(el, data = DATA.timeline, {onScrub, branch})` → `{el, setBranch(id), destroy}`. Renders the
  768×135 widget exactly as §4 describes (SVG inside the plot; `.tl-*` classes in `timeline.css`). Used by Chat inside a message.
- **Widgets** (`widgets.js`): `Widgets.open(id | descriptor, {focus:true, source})`, `Widgets.close(id)`, `Widgets.expand(id)`, `Widgets.collapse()`,
  `Widgets.setFor(chatId, ids[])` (re‑renders the column for a chat), `Widgets.has(id)`. Descriptor kinds: `scene`, `kpis`, `signals`, `chart`, `actions`
  (DATA.widgets). Emits `widget:open`/`widget:close`. Owns `#widgets` and `#fullscreen` and `App.state.full`.
- **Chat** (`chat.js`): registers page `chat`; `Chat.open(chatId | null)`, `Chat.ask(text, {voice})` → returns a promise resolving to the reply
  message object once streamed (used by the orb); `Chat.renderBlock(block)` (used by Widgets for `actions`/`chart`/`signals` bodies if it wants);
  `Chat.suggest(texts[])`. Owns `#thread`, `#composer`, the chat header buttons, plus/model menus, project switcher, files popover, chat menu.
  Streams replies and logs `console:log` events while it thinks.
- **Library** (`library.js`): registers page `library`; `Library.show(dataset)`, `Library.highlight(predicate|{capture_issue:'…'})` → count,
  `Library.openRow(id)`, `Library.clearHighlight()`. Owns `#pageLibrary` internals (`#libBody`, `#libRows`, `#libPanel`, the header buttons).
- **Pages** (`pages.js`): scheduled / signals / dashboards / users / settings into `#pageSimple` (own header markup, same `.gen-header`).
- **Orb** (`orb.js`): `Orb.open({listen, text})`, `Orb.close()`, `Orb.say(text)`; the console drawer `#console` (`Orb.console.toggle()`, listens to
  `console:log`); the mic button in the composer and "Ask Axsi" in Library call `App.emit('orb:open', {listen:true})`.

Rules for every module: no framework, no globals other than the module's own, CSS in the module's sheet only (never edit app.css/tokens.css —
ask for a token if one is missing), `App.h` for markup, keyboard‑reachable controls with aria labels, and the §2 numbers are law at 1920×1080.
