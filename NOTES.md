# React port — risk notes

This file tracks spots in the React port (branch `react-ver`) that involved a
judgment call or a deliberate departure from "obvious" React style, usually
because the original vanilla-JS/three.js code was imperative in a way that
doesn't map cleanly onto React state. Each entry has a matching code comment
tagged with the same id — search for `#%:{n}` to jump to it.

## #%:1 — Phone override communication (global → context, ref not state)

**Where:** `src/pages/about/PhoneOverrideContext.jsx`, `src/pages/about/PhoneStage.jsx`

The original site used a `window.setPhoneImageOverride(url)` global so that
hovering a feature card (in `about/index.html`'s inline scripts) or a
category-ring item (`categories.js`) could tell the 3D phone which screenshot
to show. The React port replaces the global with a `PhoneOverrideContext`,
but the value is carried in a `useRef`, not `useState`: `PhoneStage`'s render
loop polls it every `requestAnimationFrame` tick (60/sec), and routing that
through component state would mean re-rendering the whole About page tree at
60fps for a canvas React doesn't otherwise touch. The same file also ports
`_poseSettled` as `poseSettledRef`, which gates whether a hover can push an
override while the phone's scroll-driven animation is still mid-flight —
worth checking if you ever see the phone "jump" awkwardly on fast scroll +
hover combos.

## #%:2 — Stage-to-section lookup still uses getElementById, not refs

**Where:** `src/pages/about/PhoneStage.jsx` (`resolveStages`), `src/data/stages.js`

`data/stages.js` still maps each stage config to a page section purely by its
DOM `id` (`document.getElementById(stageConfig.section)`), exactly like the
original `phone.js`. This was a deliberate choice over threading a ref map
down through every section component: the section ids (`problem`, `solution`,
`identity`, `categories`, `moderation`, `value`, `independence`) are also used
for the nav anchor links (`#problem`, etc.) and must stay stable anyway, so
piggybacking the phone's lookup on the same ids avoids a second bookkeeping
mechanism. **If you rename a section's `id` in `About.jsx`, you must also
update the corresponding `section` value in `data/stages.js`,** or that
stage's animation quietly stops resolving (the phone will just not move for
that portion of the scroll).

## #%:3 — Categories ring orbit radius is still measured imperatively

**Where:** `src/pages/about/CategoriesRing.jsx`

The ring's `--orbit-radius` CSS custom property depends on the *rendered*
pixel size of the grid and of one category item, which isn't knowable from
layout/state alone (it depends on the clamp()'d responsive sizing in
`categories.css`). The port keeps a `ResizeObserver` + a direct
`style.setProperty` write on the grid DOM node, same as the original
`categories.js`, rather than trying to model it as React state. This is the
one place in the ring component that reaches past React's render cycle.

## Also worth knowing (not a numbered risk, just context)

- `useHeaderTheme` (`src/pages/about/useHeaderTheme.js`) reproduces the
  scroll-driven header light/dark switching from the inline script at the
  bottom of the old `about/index.html`. It still queries
  `document.querySelectorAll("section")` directly (rather than refs) for the
  same reason as #%:2 — the alternating light/dark assignment only cares
  about section *order*, not identity.
- Firebase auth pages (`reset_password`, `verify_email`) keep the Firebase
  Web SDK calls essentially as-is inside a `useEffect`, since that logic
  doesn't touch layout/animation and porting it "more idiomatically" would
  just be moving code around for no behavioral benefit.
