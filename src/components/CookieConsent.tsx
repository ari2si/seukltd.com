import { ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type OptionalCategory = 'functional' | 'analytics' | 'advertisement';

type ConsentPreferences = Record<OptionalCategory, boolean>;

type StoredConsent = ConsentPreferences & {
  necessary: true;
  consentedAt: string;
  version: number;
};

const CONSENT_VERSION = 1;
const STORAGE_KEY = 'seuk_cookie_consent';
const COOKIE_NAME = 'seuk_cookie_consent';

const defaultPreferences: ConsentPreferences = {
  functional: false,
  analytics: false,
  advertisement: false,
};

const categories: Array<{
  id: 'necessary' | OptionalCategory;
  title: string;
  description: string;
}> = [
  {
    id: 'necessary',
    title: 'Necessary',
    description:
      'Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.',
  },
  {
    id: 'functional',
    title: 'Functional',
    description:
      'Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description:
      'Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.',
  },
  {
    id: 'advertisement',
    title: 'Advertisement',
    description:
      'Advertisement cookies are used to provide visitors with customized advertisements based on the pages you visited previously and to analyse the effectiveness of ad campaigns.',
  },
];

const readStoredConsent = (): StoredConsent | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION || parsed.necessary !== true) return null;

    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      advertisement: Boolean(parsed.advertisement),
      consentedAt: parsed.consentedAt || new Date().toISOString(),
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
};

const writeConsentCookie = (consent: StoredConsent) => {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
};

const saveConsent = (preferences: ConsentPreferences): StoredConsent => {
  const consent: StoredConsent = {
    necessary: true,
    ...preferences,
    consentedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  writeConsentCookie(consent);
  window.dispatchEvent(new CustomEvent('seukCookieConsentChange', { detail: consent }));
  window.SEUKCookieConsent = {
    preferences: consent,
    hasConsent: (category: OptionalCategory) => Boolean(consent[category]),
  };

  return consent;
};

declare global {
  interface Window {
    SEUKCookieConsent?: {
      preferences: StoredConsent;
      hasConsent: (category: OptionalCategory) => boolean;
    };
  }
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        checked ? 'bg-gold-500' : 'bg-slate-600'
      }`}
    >
      <span
        className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = readStoredConsent();

    if (stored) {
      const next = {
        functional: stored.functional,
        analytics: stored.analytics,
        advertisement: stored.advertisement,
      };
      setPreferences(next);
      window.SEUKCookieConsent = {
        preferences: stored,
        hasConsent: (category: OptionalCategory) => Boolean(stored[category]),
      };
      return;
    }

    setVisible(true);
  }, []);

  const allAccepted = useMemo(
    () => ({
      functional: true,
      analytics: true,
      advertisement: true,
    }),
    [],
  );

  const handleSave = (nextPreferences = preferences) => {
    const consent = saveConsent(nextPreferences);
    setPreferences({
      functional: consent.functional,
      analytics: consent.analytics,
      advertisement: consent.advertisement,
    });
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleRejectAll = () => {
    handleSave(defaultPreferences);
  };

  const handleAcceptAll = () => {
    handleSave(allAccepted);
  };

  if (!visible && !settingsOpen) return null;

  return (
    <>
      {visible && !settingsOpen && (
        <section
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-gold-500/30 bg-[#020426]/95 px-4 py-5 text-white shadow-2xl backdrop-blur-md sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-100 sm:text-base">
              By clicking &ldquo;Accept all Cookies&rdquo;, you agree to the storing of cookies on your device to enhance
              site navigation, analyse site usage, and assist in our marketing efforts.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="px-1 py-2 text-sm font-medium text-white underline decoration-gold-400 underline-offset-8 transition-colors hover:text-gold-300"
              >
                Cookie Settings
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-6 py-3 text-sm font-semibold text-slate-950 transition-colors bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Accept all Cookies
              </button>
              <button
                type="button"
                aria-label="Close cookie banner and reject optional cookies"
                onClick={handleRejectAll}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:static"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#020426]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-gold-500/30 bg-[#020426] text-white shadow-2xl sm:rounded-lg"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 sm:px-6">
              <h2 id="cookie-settings-title" className="text-lg font-bold">
                Customize Consent Preferences
              </h2>
              <button
                type="button"
                aria-label="Close cookie settings"
                onClick={() => setSettingsOpen(false)}
                className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 sm:px-6">
              <p className="text-sm leading-relaxed text-slate-100">
                We use cookies to help you navigate efficiently and perform certain functions. You will find detailed
                information about all cookies under each consent category below.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-slate-100">
                The cookies that are categorized as &ldquo;Necessary&rdquo; are stored on your browser as they are essential
                for enabling the basic functionalities of the site.
              </p>

              <div className="mt-5 divide-y divide-white/15 border-y border-white/15">
                {categories.map((category) => {
                  const isNecessary = category.id === 'necessary';
                  const isExpanded = Boolean(expanded[category.id]);
                  const optionalCategory = category.id as OptionalCategory;

                  return (
                    <div key={category.id} className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((current) => ({
                              ...current,
                              [category.id]: !current[category.id],
                            }))
                          }
                          className="flex min-w-0 items-center gap-2 text-left"
                        >
                          <ChevronRight
                            className={`h-4 w-4 flex-shrink-0 text-gold-400 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                          <span className="font-semibold">{category.title}</span>
                        </button>
                        {isNecessary ? (
                          <span className="text-sm font-medium text-gold-300">Always Active</span>
                        ) : (
                          <Toggle
                            checked={preferences[optionalCategory]}
                            label={`${category.title} cookies`}
                            onChange={(checked) =>
                              setPreferences((current) => ({
                                ...current,
                                [optionalCategory]: checked,
                              }))
                            }
                          />
                        )}
                      </div>
                      {(isExpanded || isNecessary) && (
                        <p className="mt-3 pl-6 text-sm leading-relaxed text-slate-200">{category.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 border-t border-white/15 bg-[#020426] px-5 py-4 sm:grid-cols-3 sm:px-6">
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-5 py-3 text-sm font-semibold text-white transition-colors hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                Save My Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="bg-gold-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Accept all Cookies
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-5 py-3 text-sm font-semibold text-white transition-colors hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                Reject All
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
