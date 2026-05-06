import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { engineeringServices, services } from '../lib/services';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const serviceMenuItems = [...services, ...engineeringServices];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);
  const serviceDetailRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const selectedMenuService = serviceMenuItems.find((service) => service.slug === activeService);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && servicesMenuRef.current?.contains(target)) return;

      setServicesOpen(false);
      setActiveService(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [servicesOpen]);

  const handleClick = (href: string) => {
    setOpen(false);
    setServicesOpen(false);
    setActiveService(null);
    window.requestAnimationFrame(() => {
      const el = document.querySelector(href);
      if (!el) return;

      const headerOffset = window.innerWidth < 768 ? 92 : 88;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  const toggleService = (slug: string) => {
    setActiveService((current) => (current === slug ? null : slug));
  };

  useEffect(() => {
    if (!activeService) return;

    window.requestAnimationFrame(() => {
      const activeDetail = serviceDetailRefs.current[activeService];
      activeDetail?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    });
  }, [activeService]);

  const closeServicesMenu = () => {
    setServicesOpen(false);
    setActiveService(null);
  };

  const renderServiceDetails = () => {
    if (!selectedMenuService) return null;

    return (
      <div
        className="rounded-xl border border-white/10 bg-[#020426] p-5 shadow-2xl shadow-black/30"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">
              {selectedMenuService.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {selectedMenuService.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveService(null)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close service details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {selectedMenuService.subcategories?.length ? (
          <div className="max-h-80 overflow-y-auto pr-1">
            <div className="grid gap-4">
              {selectedMenuService.subcategories.map((subcategory) => (
                <div key={subcategory.name}>
                  <p className="font-medium text-slate-200">
                    {subcategory.name}
                  </p>
                  <ul className="mt-2 space-y-2 text-sm font-normal text-slate-400">
                    {subcategory.items.map((item) => (
                      <li key={item} className="flex gap-2 leading-snug">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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
                      setServicesOpen((current) => !current);
                      setActiveService(null);
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
                    className={`${servicesOpen ? 'visible opacity-100' : 'invisible opacity-0'} absolute left-1/2 top-full z-50 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2 pt-3 transition-all duration-200`}
                    onClick={() => setActiveService(null)}
                  >
                    <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#020426]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-md overscroll-contain">
                      <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-2">
                        {serviceMenuItems.map((service) => {
                          const isActive = activeService === service.slug;

                          return (
                            <div key={service.slug}>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleService(service.slug);
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-semibold transition-colors hover:border-gold-400/35 hover:bg-gold-500/14 hover:text-gold-50 ${
                                  isActive
                                    ? 'border-gold-400/40 bg-gold-500/18 text-gold-50'
                                    : 'border-transparent text-slate-200'
                                }`}
                                aria-expanded={isActive}
                              >
                                <span className="min-w-0 truncate">{service.title}</span>
                                <ChevronRight
                                  className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                                    isActive ? 'rotate-90 text-gold-400' : 'text-slate-500'
                                  }`}
                                />
                              </button>
                              {isActive && selectedMenuService && (
                                <div
                                  ref={(node) => {
                                    serviceDetailRefs.current[service.slug] = node;
                                  }}
                                  className="mt-2 scroll-mb-4"
                                >
                                  {renderServiceDetails()}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
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
		                  className="relative isolate px-3 py-2 text-sm font-medium text-slate-100 transition-colors duration-200 before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-7 before:-translate-y-1/2 before:rounded-full before:bg-gold-500/20 before:opacity-0 before:blur-md before:transition-opacity before:duration-200 hover:text-gold-50 hover:before:opacity-100"
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
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain bg-[#020426]/80 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.href === '#services' ? (
              <div key={link.href}>
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {link.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`${servicesOpen ? 'block' : 'hidden'} px-4 pb-3`}
                  onClick={() => setActiveService(null)}
                >
                  {serviceMenuItems.map((service) => {
                    const isActive = activeService === service.slug;

                    return (
                      <div key={service.slug}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleService(service.slug);
                          }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-white/10 hover:text-white ${
                            isActive ? 'bg-white/10 text-white' : 'text-slate-300'
                          }`}
                          aria-expanded={isActive}
                        >
                          <span>{service.title}</span>
                          <ChevronRight
                            className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-gold-400' : 'text-slate-500'}`}
                          />
                        </button>
                        {isActive && selectedMenuService && (
                          <div
                            ref={(node) => {
                              serviceDetailRefs.current[service.slug] = node;
                            }}
                            className="mt-2 mb-3 scroll-mb-6"
                          >
                            {renderServiceDetails()}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
