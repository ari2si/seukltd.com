// The site has exactly one place that accepts a POST: the contact form
// endpoint, which form-gate.js guards. A POST to any other address is a bot
// probing for a form, so it is refused here before Netlify Forms sees it.
import { json } from "../edge-lib/guard.js";

export default async () => json(403, { ok: false, error: "post_not_allowed" });

export const config = { path: "/*", excludedPath: ["/__forms.html"], method: "POST" };
