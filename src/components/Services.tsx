import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
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
              Construction services in Greater London & Hertfordshire
            </p>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.12] text-white sm:text-5xl">
              Practical expertise for complex
              <span className="site-palette-gold"> building projects</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              From basement construction and commercial refurbishment to listed building
              projects, smart building systems and turnkey developments, we coordinate
              specialist teams across Greater London, Hertfordshire and the Home Counties.
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
                className={`group relative overflow-hidden rounded-lg border border-slate-200 bg-[#f3ead2] p-6 text-left shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 hover:shadow-slate-500/10 sm:block ${
                  !showAllServices && index >= 4 ? 'hidden' : ''
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold-500 shadow-[0_0_18px_rgba(216,163,22,0.75)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-7 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-[#f3ead2] transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-[#f3ead2]">
                    <Icon className="h-6 w-6 text-gold-600 transition-colors duration-300 group-hover:text-gold-700" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold leading-snug text-white transition-colors group-hover:text-gold-400">
                  {service.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gold-500">
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
