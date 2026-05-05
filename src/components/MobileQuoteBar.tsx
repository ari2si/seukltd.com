import { MessageSquareText, Phone } from 'lucide-react';

export default function MobileQuoteBar() {
  return (
    <div className="gold-section fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f3ead2]/95 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href="tel:+441727270713"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4 text-gold-500" />
          Call
        </a>
        <a
          href="#contact"
          className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-lg bg-gold-500 text-sm font-bold text-slate-950"
        >
          <MessageSquareText className="h-4 w-4" />
          Get a Quote
        </a>
      </div>
    </div>
  );
}
