import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const heroVideo = 'https://res.cloudinary.com/dvdqtewmz/video/upload/v1778086911/prestige-house-hero_lueszt.mp4#t=0.001';
  const heroPoster = 'https://res.cloudinary.com/dvdqtewmz/video/upload/so_0,f_auto,q_auto/v1778086911/prestige-house-hero_lueszt.jpg';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resetToStart = () => {
      try {
        video.currentTime = 0;
      } catch {
        // Some browsers only allow seeking after enough video data is available.
      }
    };

    const startFromBeginning = () => {
      resetToStart();
      setVideoReady(true);
      video.play().catch(() => undefined);
    };

    video.addEventListener('loadedmetadata', resetToStart);
    video.addEventListener('canplay', startFromBeginning, { once: true });
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', resetToStart);
      video.removeEventListener('canplay', startFromBeginning);
    };
  }, []);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className={`hero-video h-full w-full object-cover object-center transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
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
          <div className="relative max-w-[20.5rem] sm:max-w-3xl">
            <div className="pointer-events-none absolute -inset-x-3 -inset-y-4 -z-10 rounded-[1.5rem] bg-[#020426]/24 blur-xl sm:-inset-x-8 sm:-inset-y-10 sm:rounded-[2rem] sm:blur-2xl" />
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-gold-500/35 bg-[#020426]/30 px-2.5 py-1 shadow-lg shadow-slate-950/20 backdrop-blur-[2px] animate-fade-in sm:mb-8 sm:gap-2 sm:px-4 sm:py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse sm:h-2 sm:w-2" />
              <span className="text-[10px] font-semibold tracking-wide text-gold-400 drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)] sm:text-sm">
                More than 50 Years of Excellence
              </span>
            </div>

            <h1 className="mb-4 text-[1.65rem] font-bold leading-[1.05] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.72)] animate-fade-in-up sm:mb-6 sm:text-4xl sm:leading-[1.08] lg:text-5xl">
              Creating Exceptional
              <span className="block text-gold-500 drop-shadow-[0_3px_14px_rgba(0,0,0,0.74)]">
                Environments
              </span>
            </h1>

            <p className="mb-4 max-w-[20rem] text-[0.82rem] leading-[1.42] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] animate-fade-in-up-delay sm:hidden">
              Smart Environment Group unites
              <strong className="text-gold-400"> Development</strong>,
              <strong className="text-gold-400"> Construction</strong> and
              <strong className="text-gold-400"> Property Services</strong>, delivering
              high-spec residential and commercial projects with lifecycle property
              support from concept to long-term management.
            </p>

            <p className="mb-10 hidden max-w-xl text-xl leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] animate-fade-in-up-delay sm:block">
              Smart Environment Group brings together three specialist companies
              under one umbrella: <strong className="text-gold-400">Development</strong>, <strong className="text-gold-400">Construction</strong>,
              and <strong className="text-gold-400">Property Services</strong>. We deliver high-spec, technology-driven residential projects across
              London and the wider UK from contemporary apartments to traditionally
              styled homes built with modern performance, sustainability, and
              efficiency in mind. Alongside our own developments, we act as a trusted
              construction partner and provide full lifecycle property services,
              giving our clients a complete, reliable solution from concept through
              to long-term management.
            </p>

            <div className="grid grid-cols-2 gap-2.5 animate-fade-in-up-delay-2 sm:flex sm:flex-wrap sm:gap-4">
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-xl bg-gold-500 px-3 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-gold-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-gold-500/40 sm:px-8 sm:py-4 sm:text-base"
              >
                Our Services
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-xl border border-white/35 bg-[#020426]/25 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-slate-950/20 backdrop-blur-[2px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:px-8 sm:py-4 sm:text-base"
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
