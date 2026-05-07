import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { services } from '../lib/services';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const serviceMenuItems = services;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);
  const selectedMenuService = serviceMenuItems.find((service) => service.slug === activeService);
  const selectedSubcategory = selectedMenuService?.subcategories?.find(
    (subcategory) => subcategory.name === activeSubcategory
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    if (window.innerWidth < 768) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && servicesMenuRef.current?.contains(target)) return;

      closeServicesMenu();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [servicesOpen]);

  const handleClick = (href: string) => {
    setOpen(false);
    closeServicesMenu();
    window.requestAnimationFrame(() => {
      const el = document.querySelector(href);
      if (!el) return;

      const headerOffset = window.innerWidth < 768 ? 92 : 88;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  const activateService = (slug: string) => {
    setActiveService(slug);
    setActiveSubcategory(null);
  };

  const toggleServicesMenu = () => {
    setServicesOpen((current) => {
      const next = !current;

      if (!next) {
        setActiveService(null);
        setActiveSubcategory(null);
      }

      return next;
    });
  };

  function closeServicesMenu() {
    setServicesOpen(false);
    setActiveService(null);
    setActiveSubcategory(null);
  }

  const renderSubcategoryDetails = () => {
    if (!selectedMenuService || !selectedSubcategory) return null;

    return (
      <div
        className="relative max-w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white/80 p-3 shadow-lg shadow-slate-950/[0.06] sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gold-500" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">
              {selectedMenuService.title}
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-900">
              {selectedSubcategory.name}
            </h3>
            {selectedSubcategory.description && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {selectedSubcategory.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setActiveSubcategory(null)}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close service details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="space-y-2 text-sm font-normal text-slate-600">
          {selectedSubcategory.items.map((item) => (
            <li key={item} className="flex gap-2 leading-snug">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSubcategoryButtons = (compact = false) => {
    if (!selectedMenuService?.subcategories?.length) return null;

    return (
      <div className={compact ? 'mt-2 grid min-w-0 max-w-full gap-1.5 overflow-hidden' : 'grid gap-2'}>
        {selectedMenuService.subcategories.map((subcategory) => {
          const isActive = selectedSubcategory?.name === subcategory.name;

          return (
            <button
              key={subcategory.name}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveSubcategory(subcategory.name);
              }}
              className={`group flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-lg border text-left font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400/60 hover:bg-white hover:text-slate-900 hover:shadow-slate-950/[0.06] ${
                isActive
                  ? 'border-gold-400/80 bg-white text-slate-900 shadow-slate-950/[0.06]'
                  : 'border-slate-200/90 bg-slate-50/70 text-slate-600'
              } ${compact ? 'px-2.5 py-2 text-[0.78rem]' : 'px-3 py-2.5 text-sm'}`}
            >
              <span className={`min-w-0 ${compact ? 'whitespace-normal break-words leading-snug' : 'truncate'}`}>
                {subcategory.name}
              </span>
              <ChevronRight
                className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'rotate-90 text-gold-600' : 'text-slate-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {servicesOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 hidden cursor-default md:block"
          onClick={closeServicesMenu}
          aria-label="Close services menu"
        />
      )}
      <nav
        className={`${open ? 'sticky' : 'fixed'} top-0 left-0 right-0 z-50 transition-all duration-500 md:fixed ${
          scrolled
            ? 'bg-[#020426]/70 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-[#020426]/55 backdrop-blur-sm shadow-lg shadow-black/15'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleClick('#home');
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src="/branding/cropped-final-logo-golden-400.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 flex-shrink-0 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.03] sm:h-14 sm:w-14"
            />
            <span className="flex -translate-y-0.5 flex-col justify-center gap-1 leading-[0.86]">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:text-gold-100 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] sm:text-[0.8rem]">
                Smart
              </span>
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:text-gold-100 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] sm:text-[0.8rem]">
                Environment
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.href === '#services' ? (
                <div key={link.href} ref={servicesMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleServicesMenu();
                    }}
                    className={`relative isolate inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-7 before:-translate-y-1/2 before:rounded-full before:bg-gold-500/20 before:opacity-0 before:blur-md before:transition-opacity before:duration-200 ${
                      servicesOpen
                        ? 'text-gold-50 before:opacity-100'
                        : 'text-slate-100 hover:text-gold-50 hover:before:opacity-100'
                    }`}
                    aria-expanded={servicesOpen}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`${servicesOpen ? 'visible opacity-100' : 'invisible opacity-0'} absolute left-1/2 top-full z-50 ${selectedMenuService ? 'w-[min(calc(100vw-2rem),56rem)]' : 'w-[min(calc(100vw-2rem),32rem)]'} -translate-x-1/2 pt-3 transition-all duration-200`}
                  >
                    <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200/80 bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(226,232,240,0.94)_54%,rgba(241,245,249,0.97))] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-xl overscroll-contain before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent">
                      {!selectedMenuService ? (
                        <div className="relative">
                          <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 bg-gold-500/10 blur-3xl" />
                          <div className="mb-3 px-2 pt-1">
                            <div>
                              <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-gold-600">
                                Services
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                Choose a division.
                              </p>
                            </div>
                          </div>
                          <div className="grid gap-2.5">
                            {serviceMenuItems.map((service) => (
                              <button
                                key={service.slug}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  activateService(service.slug);
                                }}
                                className="group relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-lg border border-slate-200/90 bg-white/70 px-4 py-3.5 text-left shadow-sm shadow-slate-950/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-white hover:shadow-lg hover:shadow-slate-950/[0.08]"
                              >
                                <span className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-gold-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                <span className="min-w-0">
                                  <span className="block truncate text-[0.95rem] font-bold text-gold-700 transition-colors group-hover:text-gold-600">
                                    {service.title}
                                  </span>
                                  <span className="mt-1.5 block line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
                                    {service.description}
                                  </span>
                                </span>
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-gold-600" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`grid min-w-0 gap-3 ${selectedSubcategory ? 'lg:grid-cols-[0.8fr_1fr_1fr]' : 'lg:grid-cols-[0.85fr_1.35fr]'}`}>
                          <div className="relative overflow-hidden rounded-lg border border-slate-200/90 bg-white/75 p-4 shadow-sm shadow-slate-950/[0.04]">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gold-500" />
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveService(null);
                                setActiveSubcategory(null);
                              }}
                              className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-700 transition-colors hover:text-slate-900"
                            >
                              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                              All services
                            </button>
                            <p className="text-lg font-bold leading-tight text-slate-900">{selectedMenuService.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedMenuService.description}</p>
                          </div>

                          <div className="rounded-lg border border-slate-200/90 bg-white/70 p-4 shadow-sm shadow-slate-950/[0.04]">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">
                              Subcategories
                            </p>
                            {renderSubcategoryButtons()}
                          </div>

                          {renderSubcategoryDetails()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(link.href);
                  }}
                  className="relative isolate px-3 py-2 text-sm font-medium text-slate-100 transition-colors duration-200 before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-7 before:-translate-y-1/2 before:rounded-full before:bg-gold-500/20 before:opacity-0 before:blur-md before:transition-opacity before:duration-200 hover:text-[#2d240f] hover:before:opacity-100"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="#contact-form"
              onClick={(e) => {
                e.preventDefault();
                handleClick('#contact-form');
              }}
              className="ml-4 px-5 py-2.5 bg-gold-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/20"
            >
              Get a Quote
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden overscroll-contain border-t border-slate-200/70 bg-white px-3 py-4 shadow-2xl shadow-slate-950/15 space-y-1">
          {navLinks.map((link) =>
            link.href === '#services' ? (
              <div key={link.href} className="relative after:absolute after:bottom-0 after:left-4 after:h-px after:w-1/2 after:bg-gold-500/25">
                <button
                  type="button"
                  onClick={toggleServicesMenu}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-medium text-gold-700 transition-colors hover:bg-gold-500/18 hover:text-gold-800 focus-visible:bg-gold-500/20 focus-visible:text-gold-800"
                >
                  {link.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`${servicesOpen ? 'block' : 'hidden'} min-w-0 max-w-full overflow-hidden px-1 pb-3`}>
                  {!selectedMenuService ? (
                    <div className="grid gap-0 divide-y divide-gold-500/20 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xl shadow-slate-950/15">
                      <div className="px-1">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gold-700">
                          Services
                        </p>
                      </div>
                      {serviceMenuItems.map((service) => (
                        <button
                          key={service.slug}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            activateService(service.slug);
                          }}
                          className="group relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-none px-3 py-3.5 text-left transition-all first:rounded-t-lg last:rounded-b-lg hover:bg-gold-50/60"
                        >
                          <span className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-gold-500 opacity-0 transition-opacity group-hover:opacity-100" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-gold-500">{service.title}</span>
                            <span className="mt-1 block line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
                              {service.description}
                            </span>
                          </span>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 mb-3 grid min-w-0 max-w-full gap-2.5 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-xl shadow-slate-950/10">
                      {selectedSubcategory ? (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveSubcategory(null);
                            }}
                            className="flex min-w-0 items-center gap-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a6b00]"
                          >
                            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                            Back to subcategories
                          </button>
                          {renderSubcategoryDetails()}
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveService(null);
                              setActiveSubcategory(null);
                            }}
                            className="flex min-w-0 items-center gap-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a6b00]"
                          >
                            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                            All services
                          </button>
                          <p className="px-1 text-sm font-semibold text-[#2d240f]">{selectedMenuService.title}</p>
                          <p className="line-clamp-4 px-1 text-[0.72rem] leading-relaxed text-[#6f5f38]">
                            {selectedMenuService.description}
                          </p>
                          {renderSubcategoryButtons(true)}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(link.href);
                }}
                className="relative block rounded-lg px-4 py-3 font-medium text-gold-700 transition-colors after:absolute after:bottom-0 after:left-4 after:h-px after:w-1/2 after:bg-gold-500/25 hover:bg-gold-500/18 hover:text-gold-800 focus-visible:bg-gold-500/20 focus-visible:text-gold-800"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#contact-form"
            onClick={(e) => {
              e.preventDefault();
              handleClick('#contact-form');
            }}
            className="block mt-2 px-4 py-3 bg-gold-500 text-slate-900 font-semibold rounded-lg text-center hover:bg-gold-400 transition-colors"
          >
            Get a Quote
          </a>
        </div>
      </div>
      </nav>
    </>
  );
}
