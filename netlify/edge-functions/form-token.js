// Hands the page a signed, time-stamped token when a visitor starts using
// the contact form. The form guard only accepts a submission that carries a
// valid token which is at least a few seconds old.
import { issueToken, json, MIN_WAIT_MS, POW_BITS } from "../edge-lib/guard.js";

export default async () => json(200, { token: await issueToken(), bits: POW_BITS, wait: MIN_WAIT_MS });

export const config = {
  path: "/api/form-token",
  method: "GET",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
