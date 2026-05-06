import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020426] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <img
          src="/branding/cropped-final-logo-golden-400.png"
          alt=""
          aria-hidden="true"
          className="mx-auto h-20 w-20 object-contain"
        />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-gold-500">
          Page Not Found
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-tight sm:text-6xl">
          This page is not part of the current site.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400">
          The link may be old, moved or typed incorrectly. You can return to the
          homepage or contact the team about a project.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-gold-400"
          >
            <Home className="h-4 w-4" />
            Back Home
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold-500 hover:text-gold-300"
          >
            Contact Us
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
}
