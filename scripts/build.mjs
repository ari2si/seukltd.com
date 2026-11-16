// Build step for the static site. The pages in dist/ are already built.
// This step:
//  1. creates the signing secret used by the contact form guard
//     (netlify/edge-functions). It is new on every deploy and never committed.
//  2. switches Cloudflare Turnstile on when its two keys are set as Netlify
//     environment variables (TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY),
//     and tells the pages by filling in the <!--SEUK_FORM_CONFIG--> marker.
//     Without keys, the live site keeps the sum on the form. Previews use
//     Cloudflare's published test keys so the invisible check can be seen working.
// On Netlify the marker is filled in the published files. On your own machine
// the files in dist/ are left alone; scripts/dev-server.mjs fills the marker as
// it serves each page. Run with TURNSTILE=test to try the check locally.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const onNetlify = process.env.NETLIFY === "true";
const context = process.env.CONTEXT || "local";
let siteKey = (process.env.TURNSTILE_SITE_KEY || "").trim();
let secretKey = (process.env.TURNSTILE_SECRET_KEY || "").trim();
let mode = "live keys";
if (!(siteKey && secretKey)) {
  const useTestKeys = onNetlify ? context !== "production" : process.env.TURNSTILE === "test";
  if (!useTestKeys) {
    siteKey = "";
    secretKey = "";
    mode = "off";
  } else {
    // Cloudflare's documented dummy keys: always pass, nothing shown.
    siteKey = "1x00000000000000000000BB";
    secretKey = "1x0000000000000000000000000000000AA";
    mode = "test keys";
  }
}

mkdirSync("netlify/edge-lib", { recursive: true });
writeFileSync(
  "netlify/edge-lib/secret.js",
  `// generated at build time, do not commit\nexport const SECRET = "${randomBytes(32).toString("hex")}";\nexport const TURNSTILE_SECRET = ${JSON.stringify(secretKey)};\n`,
);

const marker = "<!--SEUK_FORM_CONFIG-->";
const config = siteKey
  ? `<script>window.SEUK_FORM={turnstile:${JSON.stringify(siteKey)}};document.documentElement.classList.add("seuk-ts")</script>`
  : "";
writeFileSync("netlify/edge-lib/page-config.html", config);
let filled = 0;
for (const file of onNetlify ?  ["dist/index.html", "dist/property-development/index.html", "dist/construction/index.html", "dist/property-services/index.html"] : []) {
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  if (!html.includes(marker)) continue;
  writeFileSync(file, html.split(marker).join(config));
  filled += 1;
}
console.log(`Form guard secret generated. Turnstile: ${mode} (${context}). Pages configured: ${filled}. Static site already built in dist.`);
