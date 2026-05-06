import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroVideo = 'https://res.cloudinary.com/dvdqtewmz/video/upload/v1778086911/prestige-house-hero_lueszt.mp4';
  const heroPoster = '/images/prestige-house-after-card-smooth.jpeg';
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => undefined);
  }, []);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="hero-video h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020426]/64 via-[#020426]/30 to-[#020426]/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020426]/32 via-transparent to-[#020426]/14" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative max-w-3xl">
            <div className="pointer-events-none absolute -inset-x-5 -inset-y-7 -z-10 rounded-[2rem] bg-[#020426]/28 blur-2xl sm:-inset-x-8 sm:-inset-y-10" />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#020426]/30 border border-gold-500/35 rounded-full mb-8 animate-fade-in shadow-lg shadow-slate-950/20 backdrop-blur-[2px]">
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              <span className="text-gold-400 text-sm font-semibold tracking-wide drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
                More than 50 Years of Excellence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up drop-shadow-[0_4px_18px_rgba(0,0,0,0.72)]">
              Build to
              <span className="block text-gold-500 drop-shadow-[0_3px_14px_rgba(0,0,0,0.74)]">
                Perfection
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-100 max-w-xl mb-10 leading-relaxed animate-fade-in-up-delay drop-shadow-[0_2px_10px_rgba(0,0,0,0.84)]">
              Building, transforming, and delivering exceptional residential and
              commercial spaces across London &amp; the Home Counties. From
              construction and refurbishment to smart building systems and turnkey
              developments, every project is delivered with precision, quality,
              and attention to detail.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gold-500 text-slate-900 font-semibold rounded-xl hover:bg-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:-translate-y-0.5"
              >
                Our Services
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#020426]/25 text-white font-semibold rounded-xl border border-white/35 backdrop-blur-[2px] shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
