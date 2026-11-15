// Build step for the static site. The pages in dist/ are already built.
// This only generates the signing secret used by the contact form guard
// (netlify/edge-functions). It is created fresh on every deploy and is
// never committed, so it does not appear in this public repository.
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("netlify/edge-lib", { recursive: true });
writeFileSync(
  "netlify/edge-lib/secret.js",
  `// generated at build time, do not commit\nexport const SECRET = "${randomBytes(32).toString("hex")}";\n`,
);
console.log("Form guard secret generated. Static site already built in dist.");
