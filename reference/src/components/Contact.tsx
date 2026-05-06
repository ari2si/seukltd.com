import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@seukltd.com?subject=Enquiry from ${form.name}&body=Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0A%0A${form.message}`;
    window.open(mailto, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
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
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Whether you're planning a basement conversion, a listed building
              refurbishment, or a new build project, our team is ready to bring
              your vision to life. Contact us to discuss your requirements.
            </p>

            <div className="space-y-6">
              <a
                href="tel:+442084585652"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Call us</div>
                  <div className="text-white font-semibold text-lg group-hover:text-gold-400 transition-colors">
                    +44 (0) 208 4585 652
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">Request a Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
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
                    type="email"
                    required
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
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="+44 7700 000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
              >
                {sent ? 'Message Sent!' : 'Send Message'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
