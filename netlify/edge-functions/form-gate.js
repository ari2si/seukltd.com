// Contact form guard. Every POST to the form endpoint passes through here
// before Netlify Forms sees it. Anything that is not a genuine submission from
// the contact form is refused, so it is never stored or emailed. POSTs to any
// other address are refused by post-block.js.
import {
  checkPow,
  checkToken,
  FORM_NAME,
  FORM_PATH,
  json,
  MAX_BODY,
  spamReason,
  validateFields,
} from "../edge-lib/guard.js";

const HUMAN_ANSWERS = new Set(["7", "seven", "build"]);

export default async (request, context) => {
  const url = new URL(request.url);

  // The form has one endpoint. A POST anywhere else is not from this site.
  if (url.pathname !== FORM_PATH) return json(403, { ok: false, error: "post_not_allowed" });

  // Must come from a page on this site, sent by the site's own script.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === url.host;
    } catch {
      sameSite = false;
    }
    if (!sameSite) return json(403, { ok: false, error: "origin" });
  }
  if (request.headers.get("x-seuk-form") !== "1") return json(403, { ok: false, error: "client" });
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/x-www-form-urlencoded")) {
    return json(415, { ok: false, error: "content_type" });
  }
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY) return json(413, { ok: false, error: "too_large" });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: "too_large" });
  const params = new URLSearchParams(raw);
  if (params.get("form-name") !== FORM_NAME) return json(400, { ok: false, error: "form" });

  // Hidden field that people never see. A bot that fills it gets a fake
  // success and nothing is sent.
  if ((params.get("bot-field") || "").trim()) return json(200, { ok: true });

  const token = request.headers.get("x-form-token") || "";
  const verdict = await checkToken(token);
  if (!verdict.ok) {
    return json(verdict.reason === "early" ? 425 : 403, { ok: false, error: verdict.reason, wait: verdict.wait });
  }

  const fields = {
    name: (params.get("name") || "").trim(),
    email: (params.get("email") || "").trim(),
    phone: (params.get("phone") || "").trim(),
    message: (params.get("message") || "").trim(),
  };
  const invalid = validateFields(fields);
  if (invalid) return json(422, { ok: false, error: "invalid", field: invalid });

  const human = (params.get("human-check") || "").trim().toLowerCase();
  if (!HUMAN_ANSWERS.has(human)) return json(422, { ok: false, error: "human" });

  if (!(await checkPow(token, fields.email, fields.message, request.headers.get("x-form-nonce") || ""))) {
    return json(403, { ok: false, error: "pow" });
  }

  const spam = spamReason(fields);
  if (spam) {
    console.log(`form-gate: blocked as spam (${spam})`);
    return json(422, { ok: false, error: "content" });
  }

  // Genuine submission: hand a clean copy to Netlify Forms.
  const clean = new URLSearchParams();
  clean.set("form-name", FORM_NAME);
  clean.set("bot-field", "");
  clean.set("name", fields.name);
  clean.set("email", fields.email);
  clean.set("phone", fields.phone);
  clean.set("message", fields.message);
  clean.set("human-check", "passed");
  // Subject line of the notification email.
  clean.set("subject", `Website enquiry from ${fields.name}`);

  const headers = new Headers(request.headers);
  for (const h of ["content-length", "x-form-token", "x-form-nonce", "x-seuk-form"]) headers.delete(h);

  const upstream = await context.next(new Request(request, { headers, body: clean.toString() }));
  if (upstream.ok || (upstream.status >= 300 && upstream.status < 400)) return json(200, { ok: true });
  console.log(`form-gate: Netlify Forms answered ${upstream.status}`);
  return json(502, { ok: false, error: "upstream", status: upstream.status });
};

// One visitor may make six attempts a minute; after that Netlify answers 429.
export const config = {
  path: "/__forms.html",
  method: "POST",
  rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
