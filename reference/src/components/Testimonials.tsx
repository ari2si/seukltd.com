import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "Our work is always relatively 'complex' in that we try to optimise the space available so we don't leave a lot of room for error. Some builders love to work with us because the results are always photogenic and they are proud of the product.",
    author: 'Michael Brady Ltd',
    role: 'Architecture Partner',
  },
  {
    quote:
      'SECL delivered our basement conversion on time and to an exceptional standard. Their attention to detail and professionalism throughout the project was outstanding.',
    author: 'Private Client',
    role: 'Kensington Residence',
  },
  {
    quote:
      'Working on our Grade II listed building required specialist knowledge and care. The SECL team understood the heritage requirements perfectly while delivering modern living spaces.',
    author: 'Estate Client',
    role: 'Mayfair Project',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <span className="text-gold-400 text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            What Our Clients
            <span className="text-gold-500"> Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="w-10 h-10 text-gold-500/30 mb-4" />
              <p className="text-slate-300 leading-relaxed mb-6">{t.quote}</p>
              <div className="border-t border-slate-700/50 pt-4">
                <div className="font-semibold text-white">{t.author}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
