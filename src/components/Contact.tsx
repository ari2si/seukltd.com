import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Phone, Mail, MapPin, Send, Clock } from 'lucide-react';

const OFFICE_LOCATION = {
  lat: 51.638379,
  lon: -0.306742,
};

const COVERAGE_RADIUS_METRES = 25 * 1609.344;
const TILE_SIZE = 256;
const MIN_MAP_ZOOM = 8;
const MAX_MAP_ZOOM = 11;

type MapSize = {
  width: number;
  height: number;
};

const encodeFormData = (data: Record<string, string>) =>
  new URLSearchParams(data).toString();

const isLocalPreview = () =>
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) =>
  /^\d{11,}$/.test(phone);

const phoneErrorMessage = 'Please enter a phone number with at least 11 digits and no spaces.';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const projectToPixel = (lat: number, lon: number, zoom: number) => {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);

  return {
    x: ((lon + 180) / 360) * scale,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale,
  };
};

const getMetresPerPixel = (lat: number, zoom: number) =>
  (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * 6378137) /
  (TILE_SIZE * 2 ** zoom);

function CoverageMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(9);
  const [mapSize, setMapSize] = useState<MapSize>({ width: 1024, height: 500 });
  const centerPixel = projectToPixel(OFFICE_LOCATION.lat, OFFICE_LOCATION.lon, zoom);
  const tileCount = 2 ** zoom;
  const startTileX = Math.floor((centerPixel.x - mapSize.width / 2) / TILE_SIZE) - 1;
  const endTileX = Math.floor((centerPixel.x + mapSize.width / 2) / TILE_SIZE) + 1;
  const startTileY = Math.floor((centerPixel.y - mapSize.height / 2) / TILE_SIZE) - 1;
  const endTileY = Math.floor((centerPixel.y + mapSize.height / 2) / TILE_SIZE) + 1;
  const circleSize = Math.round(
    (COVERAGE_RADIUS_METRES / getMetresPerPixel(OFFICE_LOCATION.lat, zoom)) * 2
  );
  const tiles = [];

  useEffect(() => {
    if (!mapRef.current) return;

    const updateSize = () => {
      if (!mapRef.current) return;

      setMapSize({
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
      });
    };
    const resizeObserver = new ResizeObserver(updateSize);

    updateSize();
    resizeObserver.observe(mapRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
    for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
      if (tileY < 0 || tileY >= tileCount) continue;

      const wrappedTileX = ((tileX % tileCount) + tileCount) % tileCount;
      tiles.push({
        key: `${zoom}-${tileX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${tileY}.png`,
        x: tileX * TILE_SIZE - centerPixel.x + mapSize.width / 2,
        y: tileY * TILE_SIZE - centerPixel.y + mapSize.height / 2,
      });
    }
  }

  return (
    <div
      ref={mapRef}
      className="relative min-h-[360px] overflow-hidden bg-[#f3ead2] sm:min-h-[440px] lg:min-h-[500px]"
      aria-label="Map showing the Smart Environment Group office and 25 mile coverage area"
    >
      <div className="absolute inset-0">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            aria-hidden="true"
            className="absolute h-64 w-64 select-none"
            draggable={false}
            style={{ left: tile.x, top: tile.y }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[#f3ead2]/10" />

      <div
        data-testid="coverage-radius"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/15 shadow-[0_0_45px_rgba(239,68,68,0.3)]"
        style={{ width: circleSize, height: circleSize }}
      />
      <MapPin className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-full fill-gold-500 text-gold-200 drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)]" />

      <div className="absolute right-4 top-4 overflow-hidden rounded-lg border border-slate-300/50 bg-white shadow-lg">
        <button
          type="button"
          onClick={() => setZoom((current) => clamp(current + 1, MIN_MAP_ZOOM, MAX_MAP_ZOOM))}
          className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-xl font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          aria-label="Zoom map in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom((current) => clamp(current - 1, MIN_MAP_ZOOM, MAX_MAP_ZOOM))}
          className="flex h-10 w-10 items-center justify-center text-2xl font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          aria-label="Zoom map out"
        >
          -
        </button>
      </div>

      <div className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-lg border border-red-400/40 bg-[#f3ead2]/90 px-4 py-3 shadow-xl shadow-black/25 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 fill-gold-500 text-gold-200" />
          <p className="text-sm font-semibold text-white">
            Smart Environment Group
          </p>
        </div>
        <p className="mt-1 pl-6 text-xs text-slate-400">25 miles coverage radius</p>
      </div>

      <a
        href="https://www.openstreetmap.org/copyright"
        className="absolute bottom-1.5 right-2 text-[10px] text-slate-700/70 transition-colors hover:text-slate-900"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', botField: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSent(false);

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    if (!trimmedForm.name) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedForm.email) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(trimmedForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!trimmedForm.phone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!isValidPhone(trimmedForm.phone)) {
      setError(phoneErrorMessage);
      return;
    }

    if (trimmedForm.message.length < 50) {
      setError('Please tell us a little more about your project. Your message must be at least 50 characters.');
      return;
    }

    setSubmitting(true);

    if (form.botField) {
      setSubmitting(false);
      return;
    }

    const payload = {
      'form-name': 'get-in-touch',
      name: trimmedForm.name,
      email: trimmedForm.email,
      phone: trimmedForm.phone,
      message: trimmedForm.message,
      subject: 'New Smart Environment enquiry from %{formName} (%{submissionId})',
    };

    if (isLocalPreview()) {
      setError('Local preview cannot send emails. Please test the form on your Netlify live site or Deploy Preview.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(payload),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }
    } catch {
      setError('Sorry, we could not send your message just now. Please try again in a moment.');
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }

    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '', botField: '' });
  };

  return (
    <section id="contact" className="gold-section relative overflow-hidden bg-[#f3ead2] py-12">
      <div
        className="pointer-events-none absolute -left-28 top-20 hidden h-72 w-72 rounded-full border border-gold-500/10 md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 top-32 hidden h-48 w-48 rounded-full border border-white/[0.055] md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-28 hidden h-36 w-80 rotate-[-18deg] rounded-full border border-gold-500/12 lg:block"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left - Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
              <span className="text-gold-400 text-sm font-medium">Get in Touch</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Let's Build
              <span className="text-gold-500"> Together</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Whether you're planning a basement conversion, a listed building
              refurbishment, or a new build project, our team is ready to bring
              your vision to life. Contact us to discuss your requirements.
            </p>

            <div className="space-y-5">
              <a
                href="tel:+441727270713"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Call us</div>
                  <div className="text-white font-semibold text-lg group-hover:text-gold-400 transition-colors">
                    +44 (0) 172 7270 713
                  </div>
                </div>
              </a>

              <a
                href="mailto:info@seukltd.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Mail className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Email us</div>
                  <div className="text-white font-semibold text-lg group-hover:text-gold-400 transition-colors">
                    info@seukltd.com
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Visit us</div>
                  <div className="text-white font-semibold">
                    720 Centennial Court, Centennial Park
                    <br />
                    Elstree, Herts WD6 3SY UK
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Working hours</div>
                  <div className="text-white font-semibold">
                    Mon - Fri: 8:00 AM - 6:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div id="contact-form" className="scroll-mt-24 bg-[#f3ead2]/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            {sent ? (
              <div className="flex min-h-[520px] flex-col justify-center text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="mt-6 text-3xl font-bold text-green-700">Thank you</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-green-800">
                  Your enquiry has been received. A member of the Smart Environment Group
                  team will review your message and respond within 1 business day.
                </p>
                <div className="mt-8 rounded-lg border border-green-300 bg-green-50 px-4 py-4 text-left">
                  <p className="text-sm font-semibold text-green-900">What happens next</p>
                  <ul className="mt-3 space-y-2 text-sm text-green-800">
                    <li>We review your project brief and contact details.</li>
                    <li>We may ask for drawings, photos or a site address.</li>
                    <li>We agree the most useful next step for your project.</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-gold-500 hover:text-gold-300"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
                <form
                  name="get-in-touch"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  noValidate
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
              <input type="hidden" name="form-name" value="get-in-touch" />
              <input
                type="hidden"
                name="subject"
                data-remove-prefix
                value="New Smart Environment enquiry from %{formName} (%{submissionId})"
              />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human:
                  <input
                    name="bot-field"
                    value={form.botField}
                    onChange={(e) => setForm({ ...form, botField: e.target.value })}
                  />
                </label>
              </p>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  aria-required="true"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  placeholder="John Smith"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    aria-required="true"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    aria-required="true"
                    inputMode="numeric"
                    pattern="[0-9]{11,}"
                    value={form.phone}
                    onBlur={() => {
                      if (form.phone && !isValidPhone(form.phone)) {
                        setError(phoneErrorMessage);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key.length === 1 &&
                        !/^\d$/.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const phone = e.target.value.replace(/\D/g, '');
                      setForm({ ...form, phone });
                      if (phone.length >= 11 && error === phoneErrorMessage) {
                        setError('');
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="07473......"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  aria-required="true"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                formNoValidate
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-gold-500/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {submitting ? 'Sending...' : 'Send Message'}
                <Send className="w-5 h-5" />
              </button>
              {error && <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
                </form>
              </>
            )}
          </div>
        </div>

        <div
          className="relative mt-12 overflow-hidden rounded-2xl border border-slate-700/50 bg-[#f3ead2]/50 shadow-2xl shadow-black/20"
          aria-label="Map showing the Smart Environment Group office in Elstree and a 25 mile coverage area"
        >
          <div className="border-b border-slate-700/50 bg-[#f3ead2] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gold-500">London & Hertfordshire Coverage</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  Serving London, Hertfordshire and surrounding areas within approximately
                  25 miles of our Elstree office.
                </p>
              </div>
              <p className="text-sm font-semibold text-gold-500">25 mile radius</p>
            </div>
          </div>
          <CoverageMap />
        </div>
      </div>
    </section>
  );
}
