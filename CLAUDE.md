# seukltd.com: notes for whoever works on this site next

## How the site is put together
- Netlify publishes the `dist/` folder as it is. There is no framework build. The files at the repository root (index.html, assets/, images/ and so on) are old copies and are not published.
- The home page is a pre-built React app. Its script is the minified file `dist/assets/index-SEUK-<date>.js`. Changes are made by exact string replacement in that file, checked with `node --check`.
- When an asset in `dist/assets/` changes, give it a new dated name and update `dist/index.html`. Assets are cached for 30 days.
- `dist/index.html` carries a stored copy of the rendered page inside `<div id="root">` so crawlers that do not run scripts can read it. After any change to the page script or styles, re-create it: `node scripts/build.mjs`, `node scripts/dev-server.mjs`, then `node scripts/prerender.js`.
- The owner wants the visual design left alone unless she asks for a change.

## Publishing costs credits
- Every production deploy (a push to `main`) uses Netlify credits from a limited monthly allowance. If the allowance runs out, the site goes offline until the next billing cycle.
- Batch changes into one push to `main`. Test on a pull request first: deploy previews are free and run the real form guard and Netlify Forms.

## Contact form and bot protection
- The form posts only to `/__forms.html`. `netlify/edge-functions/form-gate.js` checks every submission before Netlify Forms sees it: signed token tied to time and IP (`form-token.js`), proof of work tied to the message, honeypot, human question, field checks, spam content rules, rate limit. `post-block.js` refuses a POST to any other address.
- The signing secret is generated on each deploy by `scripts/build.mjs` into `netlify/edge-lib/secret.js` and is never committed.
- Do not put a static `<form data-netlify>` back into any page other than `dist/__forms.html`, and do not restore a catch-all rewrite to index.html. Both were how spam bots got in.
- The browser side is `dist/assets/seuk-form-<date>.js`.
