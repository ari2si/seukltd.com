import { Award, Clock, Shield, Users } from 'lucide-react';

const stats = [
  { icon: Clock, value: '10+', label: 'Years Experience' },
  { icon: Award, value: '200+', label: 'Projects Completed' },
  { icon: Users, value: '50+', label: 'Expert Team Members' },
  { icon: Shield, value: '100%', label: 'Client Satisfaction' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
              <img
                src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                alt="Construction site"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-gold-500 text-slate-900 rounded-2xl p-6 shadow-xl shadow-gold-500/20">
              <div className="text-4xl font-bold">10+</div>
              <div className="text-sm font-semibold mt-1">Years of</div>
              <div className="text-sm font-semibold">Excellence</div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-gold-500/30 rounded-2xl" />
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
              <span className="text-gold-700 text-sm font-medium">About Us</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Smart Environment
              <span className="block text-gold-500">Construction Ltd</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              As a leading main contractor in central London and its surroundings,
              we have one single aim: to <strong className="text-slate-900">build to perfection</strong>.
              For over 10 years, we continue to achieve our aim with professionalism,
              care and dedication.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              From basement construction and listed building refurbishment to
              mixed-use developments and new builds, our experienced team delivers
              exceptional results across every sector. We work with high-profile
              clients including The Crown Estate, The Grosvenor Estate, Cadogan
              Estates and The Howard de Walden Estate.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 hover:bg-gold-50 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-200 transition-colors">
                    <stat.icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
