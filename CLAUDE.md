# seukltd.com: notes for whoever works on this site next

## How the site is put together
- Netlify publishes the `dist/` folder as it is. There is no framework build. The files at the repository root (index.html, assets/, images/ and so on) are old copies and are not published.
- The home page is a pre-built React app. Its script is the minified file `dist/assets/index-SEUK-<date>.js`. Changes are made by exact string replacement in that file, checked with `node --check`.
- When an asset in `dist/assets/` changes, give it a new dated name and update `dist/index.html`. Assets are cached for 30 days.
- `dist/index.html` carries a stored copy of the rendered page inside `<div id="root">` so crawlers that do not run scripts can read it. After any change to the page script or styles, re-create it: `node scripts/build.mjs`, `node scripts/dev-server.mjs`, then `node scripts/prerender.js`.
- The owner wants the visual design left alone unless she asks for a change.
- Home page styles are `dist/assets/seuk-modern-<date>.css`. `dist/assets/seuk-polish-<date>.js` adds the scroll-in motion and, on the division pages, the slimmer header.

## Division pages
- `/property-development/`, `/construction/` and `/property-services/` are plain HTML written by `node scripts/make-division-pages.mjs`. The wording lives in that script; the questions and answers are in `scripts/division-data.json`. Run the script after any change and commit the result.
- They share `dist/assets/seuk-pages-<date>.css`. Each has its own enquiry form, which sends a `division` value so the email subject names the division.
- Wording rules agreed with the owner: the housing association repairs are described as done by "our team" through the Smart Environment Construction Ltd account on Plentific, never as contracts of Smart Environment Property Developments Ltd. No job values. No street address for the Acton scheme. Do not name anyone as a client or referee beyond the names already on the pages without asking her.

## Publishing costs credits
- Every production deploy (a push to `main`) uses Netlify credits from a limited monthly allowance. If the allowance runs out, the site goes offline until the next billing cycle.
- Batch changes into one push to `main`. Test on a pull request first: deploy previews are free and run the real form guard and Netlify Forms.

## Contact form and bot protection
- The form posts only to `/__forms.html`. `netlify/edge-functions/form-gate.js` checks every submission before Netlify Forms sees it: signed token tied to time and IP (`form-token.js`), proof of work tied to the message, honeypot, human question, field checks, spam content rules, rate limit. `post-block.js` refuses a POST to any other address.
- The signing secret is generated on each deploy by `scripts/build.mjs` into `netlify/edge-lib/secret.js` and is never committed.
- Do not put a static `<form data-netlify>` back into any page other than `dist/__forms.html`, and do not restore a catch-all rewrite to index.html. Both were how spam bots got in.
- The browser side is `dist/assets/seuk-form-<date>.js`.
- Cloudflare Turnstile replaces the sum on the form when two Netlify environment variables are set: `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. `scripts/build.mjs` reads them on each deploy, gives the secret to the guard and fills the `<!--SEUK_FORM_CONFIG-->` marker in the head of the home page and the three division pages. Keep that marker in those files. Without the keys the live site keeps the sum; deploy previews use Cloudflare's test keys so the check can be tried. Changing the keys needs a new deploy.
- To try Turnstile locally: `TURNSTILE=test node scripts/build.mjs`, then restart `node scripts/dev-server.mjs`.
