/* Smart Environment Group contact form.
   Checks the fields, proves to the server that a real browser took a
   realistic time over the form, then sends the enquiry. The server-side
   guard (netlify/edge-functions/form-gate.js) repeats every check. */
(function () {
  'use strict';

  var FORM_NAME = 'website-enquiry';
  var FORM_PATH = '/__forms.html';
  var TOKEN_PATH = '/api/form-token';
  var PHONE_HELP = 'Please enter a phone number with at least 11 digits and no spaces.';
  var FALLBACK = ' You can also call 020 8163 4044 or email info@seukltd.com.';

  var guard = { token: '', bits: 16, wait: 4000, at: 0, pending: null };

  function isContactForm(form) {
    return !!(form && form.elements && form.elements.name && form.elements.email &&
      form.elements.phone && form.elements.message);
  }

  function fetchToken(force) {
    if (guard.pending) return guard.pending;
    if (guard.token && !force) return Promise.resolve(guard);
    guard.pending = fetch(TOKEN_PATH, { cache: 'no-store', credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('token ' + r.status); return r.json(); })
      .then(function (d) {
        guard.token = d.token; guard.bits = d.bits || 16; guard.wait = d.wait || 4000;
        guard.at = Date.now(); guard.pending = null;
        return guard;
      })
      .catch(function (e) { guard.pending = null; throw e; });
    return guard.pending;
  }

  // Ask for the token as soon as someone starts using the form.
  document.addEventListener('focusin', function (event) {
    var form = event.target && event.target.closest ? event.target.closest('form') : null;
    if (isContactForm(form)) fetchToken(false).catch(function () {});
  }, true);

  /* ---- SHA-256 (synchronous, bytes in, hex out). Shared with the worker. ---- */
  function shaSource() {
    var K = [];
    var isPrime = function (n) { for (var f = 2; f * f <= n; f++) if (n % f === 0) return false; return true; };
    var frac = function (x) { return ((x - Math.floor(x)) * 4294967296) | 0; };
    for (var c = 2, n = 0; n < 64; c++) if (isPrime(c)) K[n++] = frac(Math.pow(c, 1 / 3));
    var H0 = [];
    for (var c2 = 2, m = 0; m < 8; c2++) if (isPrime(c2)) H0[m++] = frac(Math.pow(c2, 1 / 2));
    var W = new Int32Array(64);
    function sha256(bytes) {
      var len = bytes.length, total = ((len + 9 + 63) >> 6) << 6;
      var data = new Uint8Array(total);
      data.set(bytes); data[len] = 0x80;
      var bits = len * 8;
      data[total - 4] = bits >>> 24; data[total - 3] = bits >>> 16; data[total - 2] = bits >>> 8; data[total - 1] = bits;
      data[total - 5] = (len / 536870912) | 0;
      var h = H0.slice();
      for (var off = 0; off < total; off += 64) {
        for (var i = 0; i < 16; i++) {
          var j = off + i * 4;
          W[i] = (data[j] << 24) | (data[j + 1] << 16) | (data[j + 2] << 8) | data[j + 3];
        }
        for (i = 16; i < 64; i++) {
          var a15 = W[i - 15], a2 = W[i - 2];
          var s0 = ((a15 >>> 7) | (a15 << 25)) ^ ((a15 >>> 18) | (a15 << 14)) ^ (a15 >>> 3);
          var s1 = ((a2 >>> 17) | (a2 << 15)) ^ ((a2 >>> 19) | (a2 << 13)) ^ (a2 >>> 10);
          W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
        }
        var a = h[0], b = h[1], cc = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
        for (i = 0; i < 64; i++) {
          var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
          var ch = (e & f) ^ (~e & g);
          var t1 = (hh + S1 + ch + K[i] + W[i]) | 0;
          var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
          var maj = (a & b) ^ (a & cc) ^ (b & cc);
          var t2 = (S0 + maj) | 0;
          hh = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
        }
        h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + cc) | 0; h[3] = (h[3] + d) | 0;
        h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
      }
      return h;
    }
    function toHex(h) {
      var out = '';
      for (var i = 0; i < 8; i++) out += ('00000000' + (h[i] >>> 0).toString(16)).slice(-8);
      return out;
    }
    function utf8(text) {
      if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text);
      var s = unescape(encodeURIComponent(text)), out = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
      return out;
    }
    function leadingZeroBits(h) {
      var bits = 0;
      for (var i = 0; i < 8; i++) {
        var v = h[i] >>> 0;
        if (v === 0) { bits += 32; continue; }
        return bits + Math.clz32(v);
      }
      return bits;
    }
    // Tries nonces from `start` for at most `budget` attempts.
    function search(prefix, bits, start, budget) {
      for (var n = start; n < start + budget; n++) {
        var nonce = n.toString(36);
        if (leadingZeroBits(sha256(utf8(prefix + nonce))) >= bits) return nonce;
      }
      return null;
    }
    return { sha256: sha256, toHex: toHex, utf8: utf8, search: search };
  }

  var sha = shaSource();

  function solve(prefix, bits) {
    return new Promise(function (resolve) {
      var settled = false;
      function onMainThread() {
        var next = 0;
        (function step() {
          var found = sha.search(prefix, bits, next, 4000);
          if (found !== null) { settled = true; resolve(found); return; }
          next += 4000;
          setTimeout(step, 0);
        })();
      }
      try {
        var src = 'var sha=(' + shaSource.toString() + ')();onmessage=function(e){var n=0,f=null;' +
          'while(f===null){f=sha.search(e.data.prefix,e.data.bits,n,20000);n+=20000;}postMessage(f);};';
        var url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
        var worker = new Worker(url);
        worker.onmessage = function (e) { settled = true; worker.terminate(); URL.revokeObjectURL(url); resolve(e.data); };
        worker.onerror = function () { worker.terminate(); if (!settled) onMainThread(); };
        worker.postMessage({ prefix: prefix, bits: bits });
      } catch (err) {
        onMainThread();
      }
    });
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, Math.max(0, ms)); }); }

  /* ---- messages on the page ---- */
  function showSuccess() {
    var container = document.getElementById('contact-form');
    if (!container) return;
    container.innerHTML = '<div class="flex min-h-[520px] flex-col justify-center text-center">' +
      '<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">' +
      '<svg aria-hidden="true" viewBox="0 0 24 24" class="h-8 w-8 text-green-700" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>' +
      '</div>' +
      '<h3 class="mt-6 text-3xl font-bold text-green-700">Thank you</h3>' +
      '<p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-green-800">Your enquiry has been received. A member of our team will review your message and respond within 1 business day.</p>' +
      '<div class="mt-8 rounded-lg border border-green-300 bg-green-50 px-4 py-4 text-left">' +
      '<p class="text-sm font-semibold text-green-900">What happens next</p>' +
      '<ul class="mt-3 space-y-2 text-sm text-green-800"><li>We review your project brief and contact details.</li><li>We may ask for drawings, photos or a site address.</li><li>We agree the most useful next step for your project.</li></ul>' +
      '</div>' +
      '</div>';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showError(form, message) {
    var box = form.querySelector('[data-seuk-form-error]');
    if (!box) {
      box = document.createElement('p');
      box.setAttribute('data-seuk-form-error', 'true');
      box.setAttribute('role', 'alert');
      box.className = 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700';
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = message;
    if (box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearError(form) {
    var box = form.querySelector('[data-seuk-form-error]');
    if (box) box.remove();
  }

  function setBusy(form, busy) {
    form.dataset.seukSubmitting = busy ? 'true' : 'false';
    var button = form.querySelector('button[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    var label = button.firstChild;
    if (label && label.nodeType === 3) {
      if (busy) { button.dataset.seukLabel = label.data; label.data = 'Sending...'; }
      else if (button.dataset.seukLabel) label.data = button.dataset.seukLabel;
    }
  }

  function validate(v) {
    if (!v.name) return 'Please enter your full name.';
    if (!v.email) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) return 'Please enter a valid email address.';
    if (!v.phone) return 'Please enter your phone number.';
    if (v.phone.replace(/\D/g, '').length < 11) return PHONE_HELP;
    if (v.message.length < 50) return 'Please tell us a little more about your project. Your message must be at least 50 characters.';
    if (!v.human) return 'Please complete the quick anti-spam check.';
    return '';
  }

  var SERVER_MESSAGES = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address.',
    phone: PHONE_HELP,
    message: 'Please tell us a little more about your project. Your message must be between 50 and 5,000 characters.'
  };

  function send(form, v, attempt) {
    return fetchToken(attempt > 0)
      .then(function () { return sleep(guard.wait + 400 - (Date.now() - guard.at)); })
      .then(function () {
        var contentHash = sha.toHex(sha.sha256(sha.utf8(v.email + '\n' + v.message)));
        return solve(guard.token + '.' + contentHash + '.', guard.bits);
      })
      .then(function (nonce) {
        var body = new URLSearchParams();
        body.set('form-name', FORM_NAME);
        body.set('bot-field', v.bot);
        body.set('name', v.name);
        body.set('email', v.email);
        body.set('phone', v.phone);
        body.set('message', v.message);
        body.set('human-check', v.human);
        return fetch(FORM_PATH, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-SEUK-Form': '1',
            'X-Form-Token': guard.token,
            'X-Form-Nonce': nonce
          },
          body: body.toString()
        });
      })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (response.ok && data.ok) return { ok: true };
          var code = data.error || '';
          // A stale or too-new token is replaced and the send is retried once, unseen.
          if (attempt < 2 && (code === 'token' || code === 'expired' || code === 'early' || code === 'pow')) {
            return send(form, v, attempt + 1);
          }
          if (response.status === 422 && code === 'invalid') return { ok: false, message: SERVER_MESSAGES[data.field] || 'Please check the form and try again.' };
          if (response.status === 422 && code === 'human') return { ok: false, message: 'Please complete the quick anti-spam check.' };
          if (response.status === 422 && code === 'content') return { ok: false, message: 'Our spam filter stopped this message. Please remove any web links or unusual wording and try again.' + FALLBACK };
          if (response.status === 429) return { ok: false, message: 'Too many attempts. Please wait a minute and try again.' + FALLBACK };
          return { ok: false, message: 'Sorry, we could not send your message just now. Please try again in a moment.' + FALLBACK };
        });
      });
  }

  window.addEventListener('submit', function (event) {
    var form = event.target;
    if (!isContactForm(form)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.dataset.seukSubmitting === 'true') return;

    var el = form.elements;
    var v = {
      name: el.name.value.trim(),
      email: el.email.value.trim(),
      phone: el.phone.value.trim(),
      message: el.message.value.trim(),
      bot: el['bot-field'] ? el['bot-field'].value.trim() : '',
      human: el['human-check'] ? el['human-check'].value.trim().toLowerCase() : ''
    };

    var problem = validate(v);
    if (problem) { showError(form, problem); return; }

    clearError(form);
    setBusy(form, true);
    send(form, v, 0).then(function (result) {
      if (result.ok) { showSuccess(); return; }
      setBusy(form, false);
      showError(form, result.message);
    }).catch(function () {
      setBusy(form, false);
      showError(form, 'Sorry, we could not send your message just now. Please try again in a moment.' + FALLBACK);
    });
  }, true);
})();
