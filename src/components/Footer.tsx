import { useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const whyChooseUsItems = [
  'End-to-End Turnkey Project Delivery',
  'Integrated MEP & Smart Systems',
  'High-Spec Residential & Commercial Expertise',
  'Fast Turnaround & Execution',
  'London & Hertfordshire Coverage',
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Insured Works',
    text: 'Project delivery supported by appropriate contractor insurance.',
  },
  {
    icon: HardHat,
    title: 'Site Safety',
    text: 'Health and safety planning built into every active site.',
  },
  {
    icon: FileCheck2,
    title: 'Building Control',
    text: 'Coordination with consultants, inspectors and statutory approvals.',
  },
  {
    icon: ClipboardCheck,
    title: 'Managed Delivery',
    text: 'Clear scope, programme control and responsible project management.',
  },
];

const footerPolicies = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    text:
      'We only use enquiry details to respond to project requests and manage client communication. Form submissions may include your name, email, phone number and project message. We do not sell personal information.',
  },
  {
    id: 'terms',
    title: 'Terms of Use',
    text:
      'Website content is provided for general information and does not form a contract or quotation. Project scope, price, programme and warranties are confirmed in writing before works proceed.',
  },
  {
    id: 'cookies',
    title: 'Cookie Notice',
    text:
      'This website may use essential cookies for basic functionality and analytics or preference cookies where enabled. You can manage cookies through your browser settings.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    text:
      'We aim to keep the website clear, readable and usable across modern devices. If you have difficulty accessing content, contact us and we will provide the information in another reasonable format.',
  },
  {
    id: 'complaints',
    title: 'Complaints & Feedback',
    text:
      'If something is not right, please contact us with the project details and your concern. We will review the matter, respond promptly and work toward a practical resolution.',
  },
  {
    id: 'company-info',
    title: 'Company & Insurance Information',
    text:
      'As a fully registered company, we maintain comprehensive insurance cover appropriate to the nature of our work. We are committed to meeting all relevant legal and regulatory requirements, ensuring our clients can engage with confidence.',
  },
  {
    id: 'accreditations',
    title: 'Accreditations & Memberships',
    text:
      'Our team consists of highly experienced professionals with relevant industry qualifications, supported by a strong commitment to continuous professional development. By staying aligned with current standards, best practices, and industry advancements, we ensure consistent quality, reliability, and informed decision-making across all our services.',
  },
  {
    id: 'disclaimer',
    title: 'Website Disclaimer',
    text:
      'Images, case studies and service descriptions are provided to illustrate our capabilities. Availability, scope, specification and suitability are assessed individually for each project.',
  },
];

export default function Footer() {
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);
  const selectedPolicy = footerPolicies.find((policy) => policy.id === openPolicy);

  return (
    <footer className="gold-section relative overflow-hidden bg-[#f3ead2] border-t border-slate-800">
      {selectedPolicy && (
        <div
          className="fixed inset-0 z-[90] flex items-end bg-[#f3ead2]/70 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center"
          onClick={() => setOpenPolicy(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-slate-700 bg-[#f3ead2] p-5 shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-gold-500">{selectedPolicy.title}</h3>
              <button
                type="button"
                onClick={() => setOpenPolicy(null)}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label={`Close ${selectedPolicy.title}`}
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {selectedPolicy.text}
            </p>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute right-8 top-8 hidden h-28 w-56 rotate-12 rounded-full border border-white/[0.055] lg:block" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 top-24 hidden h-40 w-40 rounded-full bg-gold-500/[0.035] lg:block" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="logo-contrast-lockup mb-5">
              <img
                src="/branding/cropped-final-logo-golden-400.png"
                alt=""
                aria-hidden="true"
                className="h-16 w-16 flex-shrink-0 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]"
              />
              <span className="flex -translate-y-0.5 flex-col justify-center gap-1 leading-[0.86]">
                <span className="text-[0.8rem] font-bold uppercase tracking-[0.26em] text-gold-500">
                  Smart
                </span>
                <span className="text-[0.8rem] font-bold uppercase tracking-[0.13em] text-gold-500">
                  Environment
                </span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Smart Environment Group is an integrated building systems and engineering
              contractor serving Greater London and surrounding areas.
            </p>
          </div>

          <div>
            <h4 className="text-gold-500 font-semibold mb-4">Why Choose Us</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {whyChooseUsItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-500 font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                +44 (0) 172 7270 713
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

        <div className="mt-10 border-t border-slate-800 pt-8">
          <h4 className="mb-5 text-gold-500 font-semibold">Professional Standards</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-lg border border-slate-800 bg-[#f3ead2]/40 p-4"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
                  <Icon className="h-5 w-5 text-gold-500" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
            {footerPolicies.map((policy) => (
              <button
                key={policy.id}
                type="button"
                onClick={() => setOpenPolicy(policy.id)}
                className="transition-colors hover:text-gold-500"
              >
                {policy.title}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-900 pt-3">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-slate-600 sm:flex-row sm:gap-10 sm:px-8">
              <p>
                &copy; {new Date().getFullYear()} Smart Environment Group. All rights reserved.
              </p>
              <p>Company registered in England & Wales.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
