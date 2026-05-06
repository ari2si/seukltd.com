import { useEffect, useState, useRef } from 'react';
import { ArrowDown, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Media } from '../lib/types';

const defaultImages = [
  'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
  'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
  'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
];

export default function Hero() {
  const [heroMedia, setHeroMedia] = useState<Media[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchHeroMedia = async () => {
      const { data } = await supabase
        .from('media')
        .select('*')
        .eq('section', 'hero')
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) setHeroMedia(data);
    };
    fetchHeroMedia();
  }, []);

  const slides = heroMedia.length > 0
    ? heroMedia.map((m) => m.url)
    : defaultImages;

  const goTo = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const isVideo = heroMedia.length > 0 && heroMedia[current]?.type === 'video';

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background slides */}
      {slides.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {heroMedia.length > 0 && heroMedia[i]?.type === 'video' ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              <span className="text-gold-400 text-sm font-medium tracking-wide">
                Over 10 Years of Excellence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up">
              Build to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                Perfection
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed animate-fade-in-up-delay">
              As a leading main contractor in central London and its surroundings,
              we deliver construction excellence with professionalism, care and
              dedication.
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
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 border border-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-8 bg-gold-500'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-white/50 text-xs tracking-widest uppercase rotate-90 origin-center translate-y-6">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 text-gold-500 mt-6" />
      </div>
    </section>
  );
}
