import { Award, Clock, Shield, Users } from 'lucide-react';

const stats = [
  { icon: Clock, value: '15+', label: 'Years Experience' },
  { icon: Award, value: '200+', label: 'Projects Completed' },
  { icon: Users, value: '50+', label: 'Expert Team Members' },
  { icon: Shield, value: '100%', label: 'Client Satisfaction' },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-12">
      <div className="pointer-events-none absolute -right-20 top-20 hidden h-72 w-72 lg:block" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-gold-500/15" />
        <div className="absolute inset-8 rounded-full border border-slate-900/10" />
        <div className="absolute inset-16 rounded-full border border-gold-500/20" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* Left - Image */}
          <div className="relative lg:pr-6">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-3xl border border-gold-300/70 sm:h-28 sm:w-28" />
            <div className="absolute -bottom-10 left-8 hidden h-28 w-28 rounded-full border border-slate-900/10 sm:block" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[24px] shadow-2xl shadow-slate-900/10">
              <img
                src="/images/about-main.jpg"
                alt="Smart Environment construction and development site"
                className="h-[340px] w-full object-cover object-[center_88%] sm:h-[430px] lg:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020426]/18 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 right-3 rounded-3xl bg-gold-500 px-6 py-7 text-slate-900 shadow-2xl shadow-gold-500/25 sm:-right-5 sm:px-7 sm:py-8">
              <div className="text-4xl font-bold leading-none sm:text-5xl">15+</div>
              <div className="mt-3 text-sm font-semibold leading-6 sm:text-[15px]">
                Years of
                <br />
                Excellence
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="mb-5 text-4xl font-bold leading-[1.02] text-slate-900 sm:text-5xl md:text-6xl">
              Smart Environment
              <span className="block text-gold-500">Construction &amp; Development</span>
            </h2>

            <p className="mb-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-[19px] sm:leading-[1.75]">
              As a leading development and construction company in central London and its surroundings,
              we have one single aim: to <strong className="font-semibold text-slate-900">build to perfection</strong>.
              For over 10 years, we continue to achieve our aim with professionalism,
              care and dedication.
            </p>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-[19px] sm:leading-[1.75]">
              From basement construction and listed building refurbishment to
              mixed-use developments and new builds, our experienced team delivers
              exceptional results across every sector. We work with high-profile
              clients including The Crown Estate, The Grosvenor Estate, Cadogan
              Estates and The Howard de Walden Estate.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-4 rounded-3xl bg-slate-50 px-5 py-5 transition-colors duration-200 hover:bg-gold-50"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gold-100 transition-colors group-hover:bg-gold-200">
                    <stat.icon className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-[2rem] font-bold leading-none text-slate-900">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[15px] text-slate-500">{stat.label}</div>
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
