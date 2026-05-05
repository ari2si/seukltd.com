import { useState } from 'react';
import {
  ArrowDownToLine,
  Building2,
  Compass,
  MoveVertical,
  Landmark,
  LayoutGrid,
  Home,
  PaintBucket,
  GraduationCap,
  X,
  ArrowRight,
} from 'lucide-react';
import { services } from '../lib/services';

const iconMap: Record<string, React.ElementType> = {
  ArrowDownToLine,
  Building2,
  Compass,
  MoveVertical,
  Landmark,
  LayoutGrid,
  Home,
  PaintBucket,
  GraduationCap,
};

export default function Services() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selected);

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <span className="text-gold-700 text-sm font-medium">What We Do</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Explore Our Range of
            <span className="text-gold-500"> Services</span>
          </h2>
          <p className="text-slate-600 text-lg">
            From basement construction to listed building refurbishment, we deliver
            exceptional results across every sector of the construction industry.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Building2;
            return (
              <button
                key={service.id}
                onClick={() => setSelected(service.id)}
                className="group text-left p-8 bg-white rounded-2xl border border-slate-100 hover:border-gold-200 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gold-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-gold-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-gold-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service detail modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl animate-scale-in"
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
