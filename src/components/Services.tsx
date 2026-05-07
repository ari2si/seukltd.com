import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  HardHat,
  Home,
  Landmark,
  LayoutGrid,
  MonitorPlay,
  MoveVertical,
  Network,
  PaintBucket,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Zap,
} from 'lucide-react';
import { services } from '../lib/services';

const iconMap: Record<string, React.ElementType> = {
  ArrowDownToLine,
  Building2,
  Compass,
  GraduationCap,
  HardHat,
  Home,
  Landmark,
  LayoutGrid,
  MonitorPlay,
  MoveVertical,
  Network,
  PaintBucket,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
};

export default function Services() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);

  const selectedService = services.find((s) => s.id === selected);

  return (
    <section id="services" className="gold-section relative overflow-hidden bg-[#f3ead2] pb-16 sm:pb-20">
      <div
        className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(148,163,184,0.18),rgba(15,23,42,0))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 -top-28 hidden h-72 w-72 rounded-full bg-[#f3ead2]/[0.045] md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-24 hidden h-56 w-56 rounded-full border border-gold-500/10 lg:block"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[21rem] sm:min-h-72">
          <div className="relative max-w-3xl px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] site-palette-gold">
              Property development, construction and property services
            </p>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.12] text-white sm:text-5xl">
              Complete expertise for complex
              <span className="site-palette-gold"> property projects</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              From acquisition, planning and development strategy to construction,
              refurbishment, smart building systems and long-term property services,
              we coordinate specialist teams across London and the Home Counties.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Building2;
            return (
              <button
                key={service.id}
                onClick={() => setSelected(service.id)}
                className={`group relative overflow-hidden rounded-lg border border-slate-200 bg-[#f3ead2] p-4 text-left shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 hover:shadow-slate-500/10 sm:block sm:p-6 ${
                  !showAllServices && index >= 4 ? 'hidden' : ''
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold-500 shadow-[0_0_18px_rgba(216,163,22,0.75)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-4 flex items-center sm:mb-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-[#f3ead2] transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-[#f3ead2] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-gold-600 transition-colors duration-300 group-hover:text-gold-700 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-gold-400 sm:mb-3 sm:text-xl">
                  {service.title}
                </h3>
                <p className="line-clamp-3 text-[0.82rem] leading-relaxed text-slate-400 sm:text-sm">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-500 sm:mt-6">
                  View scope
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        {services.length > 4 && (
          <div className="mt-6 sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllServices((value) => !value)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-gold-500/15"
            >
              {showAllServices ? 'Show fewer services' : 'Show all services'}
              <ArrowRight
                className={`h-4 w-4 transition-transform ${
                  showAllServices ? '-rotate-90' : 'rotate-90'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Service detail modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f3ead2]/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#f3ead2] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                  {(() => {
                    const Icon = iconMap[selectedService.icon] || Building2;
                    return <Icon className="w-6 h-6 text-gold-600" />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {selectedService.description}
            </p>
            {selectedService.subcategories?.length ? (
              <div className="mt-7 grid gap-4">
                {selectedService.subcategories.map((subcategory) => (
                  <div key={subcategory.name} className="rounded-xl border border-slate-100 bg-white/45 p-4">
                    <p className="font-semibold text-slate-900">{subcategory.name}</p>
                    {subcategory.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {subcategory.description}
                      </p>
                    )}
                    <ul className="mt-3 grid gap-2 text-sm text-slate-500">
                      {subcategory.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 leading-snug">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(null);
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-slate-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors"
              >
                Enquire About This Service
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
