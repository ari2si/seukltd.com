// Shared logic for the contact form guard.
// Runs at the edge, in front of Netlify Forms, so a request that fails
// these checks is never stored, never emailed and never counted.
import { SECRET } from "./secret.js";

export const FORM_PATH = "/__forms.html";
export const FORM_NAME = "website-enquiry";
export const POW_BITS = 16; // average 65,536 hashes per submission
export const MIN_WAIT_MS = 4000; // a person cannot fill the form faster than this
export const MAX_AGE_MS = 3 * 60 * 60 * 1000; // a token lasts three hours
export const MAX_BODY = 20000;

const enc = new TextEncoder();
let keyPromise;

function hmacKey() {
  keyPromise ??= crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return keyPromise;
}

function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data) {
  return b64url(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(data)));
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function issueToken(now = Date.now()) {
  const rand = b64url(crypto.getRandomValues(new Uint8Array(12)));
  const body = `${now.toString(36)}.${rand}`;
  return `${body}.${await sign(body)}`;
}

// Returns { ok } or { ok:false, reason, wait }.
export async function checkToken(token, now = Date.now()) {
  if (typeof token !== "string" || token.length > 200) return { ok: false, reason: "token" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "token" };
  const [ts, rand, sig] = parts;
  if (!/^[0-9a-z]{6,12}$/.test(ts) || !/^[\w-]{10,24}$/.test(rand)) return { ok: false, reason: "token" };
  if (!safeEqual(sig, await sign(`${ts}.${rand}`))) return { ok: false, reason: "token" };
  const issued = parseInt(ts, 36);
  const age = now - issued;
  if (age > MAX_AGE_MS || age < -60000) return { ok: false, reason: "expired" };
  if (age < MIN_WAIT_MS) return { ok: false, reason: "early", wait: MIN_WAIT_MS - age };
  return { ok: true };
}

export async function sha256Hex(text) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(text)));
  let hex = "";
  for (const b of digest) hex += b.toString(16).padStart(2, "0");
  return hex;
}

function leadingZeroBits(hex) {
  let bits = 0;
  for (const ch of hex) {
    const v = parseInt(ch, 16);
    if (v === 0) {
      bits += 4;
      continue;
    }
    bits += Math.clz32(v) - 28;
    break;
  }
  return bits;
}

// The work is tied to the token and to the exact email and message, so one
// solved puzzle cannot be reused to send different content.
export async function checkPow(token, email, message, nonce, bits = POW_BITS) {
  if (typeof nonce !== "string" || !/^[0-9a-z]{1,16}$/.test(nonce)) return false;
  const contentHash = await sha256Hex(`${email}\n${message}`);
  const digest = await sha256Hex(`${token}.${contentHash}.${nonce}`);
  return leadingZeroBits(digest) >= bits;
}

const EMAIL_RE = /^[^\s@<>()",;:]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const LINK_RE = /(?:https?:\/\/|https?\/\/|www\.)\S+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|info|biz|ru|cn|xyz|top|site|online|store|club|vip|link|click|icu|shop|live|world|today|io|co\.uk|tk|ml|ga|cf|gq)(?:\/\S*)?/gi;
const SHORT_LINK_RE = /\b(?:t\.me|bit\.ly|tinyurl\.com|goo\.gl|cutt\.ly|is\.gd|rb\.gy|wa\.me|telegra\.ph)\b/i;
// Words that mark a message as spam on their own.
const BAD_WORDS_RE = /\b(?:porn\w*|casino|1win|1xbet|viagra|cialis|onlyfans|milfs?|hentai|pussy|blowjob|deepthroat|gangbang|backlinks?|seo\s+services|guest\s+posts?|payday\s+loans?|promo\s?codes?)\b/i;
// Words that only count when the message also carries a web link.
const WEAK_WORDS_RE = /\b(?:xxx|sex|sexy|escorts?|dating|nudes?|webcams?|hookups?|bitcoin|crypto(?:currency)?|forex|jackpot|bonus(?:es)?)\b/i;

export function validateFields(f) {
  if (!f.name || f.name.length < 2 || f.name.length > 80) return "name";
  if (!EMAIL_RE.test(f.email) || f.email.length > 120) return "email";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || f.phone.length > 24) return "phone";
  if (f.message.length < 50 || f.message.length > 5000) return "message";
  return "";
}

// Returns a reason string when the content is spam, otherwise "".
export function spamReason(f) {
  LINK_RE.lastIndex = 0;
  if (LINK_RE.test(f.name) || /[<>]|https?:/i.test(f.name)) return "name_link";
  LINK_RE.lastIndex = 0;
  const links = f.message.match(LINK_RE) || [];
  if (links.length > 2) return "links";
  if (SHORT_LINK_RE.test(f.message)) return "short_link";
  if (BAD_WORDS_RE.test(f.message) || BAD_WORDS_RE.test(f.name)) return "words";
  if (links.length && WEAK_WORDS_RE.test(f.message)) return "words_link";
  const letters = f.message.match(/\p{L}/gu) || [];
  if (letters.length) {
    const foreign = f.message.match(/[\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}]/gu) || [];
    if (foreign.length / letters.length > 0.3) return "script";
  }
  if (/<a\s|\[url=|\[link=/i.test(f.message)) return "markup";
  if (/(.)\1{14,}/.test(f.message)) return "repeat";
  return "";
}

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
