# WSH Website

Can be accessed at app.wshnetwork.com

## Stack

Static multi-page site built with Vite and React. Each route is its own
HTML entry point (see `vite.config.js`) rather than a single-page app with
client-side routing.

## Project structure

- `index.html`, `about/`, `docs/`, `download/`, `delete_account/`,
  `reset_password/`, `verify_email/`, `404.html` — source HTML entry points,
  one per route, living at their final URL path.
- `src/entries/` — the JS entry file for each HTML page (mounts the
  matching component from `src/pages/`).
- `src/pages/` — the React component for each page.
- `src/components/`, `src/data/`, `src/styles/` — shared UI, static data,
  and CSS.
- `static/` — passthrough files copied verbatim into the build: `CNAME`,
  `_config.yml`, `robots.txt`, `sitemap.xml`, images/fonts under `assets/`.
- `public/` — build output only. Do not hand-edit files here; they are
  regenerated (and wiped, via `emptyOutDir`) on every `npm run build`, and
  this is also what gets committed and deployed (see Deployment below).

## Development

```
npm install
npm run dev        # local dev server with hot reload
npm run build       # production build -> public/
npm run preview     # serve the built public/ folder locally
```

## Deployment

1. Run `npm run build`. Vite compiles all page entries and emits the static
   site into `public/` (source of truth is `vite.config.js`'s
   `build.outDir`), including hashed JS/CSS under `public/app-assets/`.
2. Commit the changed source files together with the regenerated `public/`
   output, and push to `main`. The built output is checked into the repo,
   so `public/` must be up to date in the commit that gets pushed.
3. Pushing to `main` triggers the GitHub Actions workflow in
   `.github/workflows/static.yml`, which uploads `public/` as a Pages
   artifact and deploys it to GitHub Pages. The custom domain is set via
   `static/CNAME`.

There is no separate staging environment — a push to `main` goes straight
to production.

## Firebase auth pages

`reset_password` and `verify_email` call the Firebase Web SDK directly
inside a `useEffect` in their page components (`src/pages/ResetPassword.jsx`,
`src/pages/VerifyEmail.jsx`), largely as a faithful port of the original
vanilla-JS versions rather than idiomatic React state. See `NOTES.md` for
other spots in the React port worth knowing about before changing page
layout or behavior.
