import { useEffect, useRef, useState, type WheelEvent } from 'react';
import { Award, Clock, Shield, Users } from 'lucide-react';

const stats = [
  { icon: Clock, value: 50, suffix: '+', label: 'More Than 50 Years Experience' },
  { icon: Award, value: 200, suffix: '+', label: 'Projects Completed' },
  { icon: Users, value: 60, suffix: '+', label: 'Expert Team Members' },
  { icon: Shield, value: 100, suffix: '%', label: 'Client Satisfaction' },
];

const aboutSections = [
  {
    title: 'Development',
    text:
      'Our development company delivers high specification residential schemes across London and the wider UK. We specialise in new build apartments and urban housing that combine strong architectural character with modern performance. Our projects range from contemporary, high technology apartments to urban style homes with a traditional aesthetic, incorporating energy efficient systems, solar integration, underfloor heating and sustainable construction methods. We also have strong expertise in student accommodation and HMO developments, where efficiency, compliance and long term performance are critical.',
  },
  {
    title: 'Construction',
    text:
      'Our construction company delivers both our own developments and projects for external clients, including developers, asset managers and property companies. We undertake new builds, refurbishments and complex conversions to a consistently high standard. Our clients include organisations such as English Rose Estates and MHA London, as well as private and institutional partners. We are also trusted by funding providers including Heritable Development Finance, Close Brothers and Assetz Capital.',
  },
  {
    title: 'Property Services',
    text:
      'Our Property Services company supports assets beyond construction, from block and estate management to reactive and planned maintenance. We manage a range of portfolios, ensuring properties remain compliant, well maintained and performing as intended. This division also delivers smaller scale works such as extensions, refurbishments and conversions, ensuring that no project is too small or too large, only that it is handled by the right specialist team.',
  },
  {
    title: 'Clients & Partners',
    text:
      'We have worked with established housing associations and organisations such as Genesis Housing Association and L&Q, alongside a broad network of private clients and commercial partners. Our involvement gives clients, partners and lenders confidence that projects will be delivered efficiently, professionally and to a high standard.',
  },
];

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutCopyRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [animatedValues, setAnimatedValues] = useState(() => stats.map(() => 0));

  const handleAboutWheel = (event: WheelEvent<HTMLElement>) => {
    const copy = aboutCopyRef.current;
    if (!copy || copy.scrollHeight <= copy.clientHeight + 1) return;

    const isScrollingDown = event.deltaY > 0;
    const atTop = copy.scrollTop <= 0;
    const atBottom = copy.scrollTop + copy.clientHeight >= copy.scrollHeight - 1;
    const canMoveCopy = (isScrollingDown && !atBottom) || (!isScrollingDown && !atTop);

    if (!canMoveCopy) return;

    event.preventDefault();
    copy.scrollTop += event.deltaY;
  };

  useEffect(() => {
    const target = statsRef.current;
    if (!target) return;

    const stopAnimation = () => {
      if (animationFrameRef.current === null) return;

      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };

    const startAnimation = () => {
      stopAnimation();
      setAnimatedValues(stats.map(() => 0));

      const duration = 1400;
      const start = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues(stats.map((stat) => Math.round(stat.value * eased)));

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          return;
        }

        stopAnimation();
        setAnimatedValues(stats.map(() => 0));
      },
      { threshold: 0.35 }
    );

    observer.observe(target);

    return () => {
      stopAnimation();
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" className="relative overflow-hidden bg-white py-12" onWheel={handleAboutWheel}>
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
                src="https://res.cloudinary.com/dvdqtewmz/image/upload/f_auto,q_auto:good/v1778087091/About_njqtjt.png"
                alt="Smart Environment Group construction and development site"
                className="h-[340px] w-full object-cover object-[center_88%] sm:h-[430px] lg:h-[460px]"
              />
            </div>

            <div className="absolute -bottom-8 right-3 rounded-3xl bg-gold-500 px-6 py-7 text-slate-900 shadow-2xl shadow-gold-500/25 sm:-right-5 sm:px-7 sm:py-8">
              <div className="text-sm font-bold uppercase leading-5 tracking-wide">More than</div>
              <div className="mt-1 text-4xl font-bold leading-none sm:text-5xl">50</div>
              <div className="mt-2 text-sm font-semibold leading-5 sm:text-[15px]">
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
              <span className="block text-gold-500">Group</span>
            </h2>

            <div ref={aboutCopyRef} className="mb-6 max-h-[245px] space-y-4 overflow-y-auto pr-3 [scrollbar-gutter:stable] lg:max-h-[300px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold-500/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gold-100/60">
              {aboutSections.map((section) => (
                <section
                  key={section.title}
                  className="max-w-2xl"
                >
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold-600">
                    {section.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-slate-600">
                    {section.text}
                  </p>
                </section>
              ))}
            </div>

            <div ref={statsRef} className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group flex aspect-square flex-col items-start justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 transition-colors duration-200 hover:bg-gold-50 sm:aspect-auto sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-4"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gold-100 transition-colors group-hover:bg-gold-200 sm:h-11 sm:w-11">
                    <stat.icon className="h-4 w-4 text-gold-600 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="text-[1.45rem] font-bold leading-none text-slate-900 sm:text-[1.75rem]">
                      {animatedValues[index]}{stat.suffix}
                    </div>
                    <div className="mt-1 text-[0.72rem] leading-snug text-slate-500 sm:text-sm">{stat.label}</div>
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
