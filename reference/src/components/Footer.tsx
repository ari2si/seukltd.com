import { HardHat, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">SEUK</div>
                <div className="text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Construction
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Smart Environment Construction Ltd. A leading main contractor in
              central London, building to perfection for over 10 years.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Basement Construction</li>
              <li>Commercial Refurbishment</li>
              <li>Design & Build</li>
              <li>Extensions</li>
              <li>Listed Buildings</li>
            </ul>
          </div>

          {/* More Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">More Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Mixed-Use Developments</li>
              <li>New Build</li>
              <li>Residential Refurbishment</li>
              <li>Student Accommodation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                +44 (0) 208 4585 652
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                info@seukltd.com
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                720 Centennial Court, Centennial Park, Elstree, Herts WD6 3SY
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Smart Environment Construction Ltd. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Company registered in England & Wales
          </p>
        </div>
      </div>
    </footer>
  );
}
