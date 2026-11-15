// Passes every request through unchanged. It exists so that the contact form
// endpoint has a per-visitor rate limit: six requests a minute from one IP.
export default async () => {};

export const config = {
  path: "/__forms.html",
  rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
