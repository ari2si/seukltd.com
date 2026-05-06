import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  HardHat,
  MapPinned,
  ShieldCheck,
} from 'lucide-react';

const faqSections = [
  {
    category: 'Project Delivery',
    icon: ClipboardCheck,
    intro: 'How we organise the work from first conversation through to completion.',
    questions: [
      {
        question: 'Do you provide design and build services?',
        answer:
          'Yes. We can coordinate design, consultants, specification, pricing and construction delivery under one managed route, giving clients one accountable team.',
      },
      {
        question: 'Can you manage the full construction process?',
        answer:
          'Yes. We can manage site setup, programming, procurement, subcontractors, quality checks, client updates and handover documentation.',
      },
      {
        question: 'How do you keep clients informed?',
        answer:
          'We agree the communication rhythm early, then provide clear updates around progress, decisions, risks, programme and next actions.',
      },
    ],
  },
  {
    category: 'Approvals',
    icon: FileText,
    intro: 'Support around consultants, control checks and technical coordination.',
    questions: [
      {
        question: 'Can you coordinate planning and building control?',
        answer:
          'We can coordinate with architects, engineers, building control and other appointed specialists so construction information and inspections are aligned.',
      },
      {
        question: 'Do you help before drawings are final?',
        answer:
          'Yes. Early contractor input can help identify buildability issues, sequencing risks and cost pressure before work starts on site.',
      },
      {
        question: 'Who deals with structural details?',
        answer:
          'Structural design remains with the appointed engineer, while we coordinate the construction sequence and practical site requirements around their information.',
      },
    ],
  },
  {
    category: 'Specialist Buildings',
    icon: ShieldCheck,
    intro: 'Careful planning for sensitive, occupied or technically demanding sites.',
    questions: [
      {
        question: 'Can you work on listed or sensitive buildings?',
        answer:
          'Yes. These projects need tighter control around existing fabric, approvals, sequencing, protection and specialist trades.',
      },
      {
        question: 'Can works be phased around occupied properties?',
        answer:
          'Where feasible, yes. We plan access, temporary protection, noisy works and service interruptions with the client and design team.',
      },
      {
        question: 'Do you handle complex structural alterations?',
        answer:
          'Yes, where supported by suitable structural design. We coordinate temporary works, sequencing and specialist packages as required.',
      },
    ],
  },
  {
    category: 'Commercial',
    icon: Building2,
    intro: 'Delivery for office, retail, mixed-use and commercial refurbishment work.',
    questions: [
      {
        question: 'Do you handle commercial fit-out and refurbishment?',
        answer:
          'Yes. We deliver commercial refurbishment, fit-out, structural alterations, finishing packages and maintenance-related works.',
      },
      {
        question: 'Can you reduce disruption to trading or tenants?',
        answer:
          'We can plan phasing, access, logistics and working hours to reduce disruption where the building remains live or partially occupied.',
      },
      {
        question: 'Do you deliver CAT A and CAT B style works?',
        answer:
          'Yes. We can support landlord-ready shell works and more detailed occupier fit-out scopes, depending on specification and drawings.',
      },
    ],
  },
  {
    category: 'Residential',
    icon: HardHat,
    intro: 'High-spec homes, extensions, vertical extensions, loft conversions, basements, HMOs and residential development.',
    questions: [
      {
        question: 'What residential projects do you take on?',
        answer:
          'We work across basements, extensions, vertical extensions, loft conversions, refurbishments, new builds, HMO conversions and high-spec fit-outs.',
      },
      {
        question: 'Can you work with private clients and developers?',
        answer:
          'Yes. We can support private homeowners, developers and professional teams where quality, programme and coordination matter.',
      },
      {
        question: 'Can you help improve layouts and finishes?',
        answer:
          'We can contribute practical buildability and finish sequencing advice alongside the architect, designer or client specification.',
      },
    ],
  },
  {
    category: 'Coverage',
    icon: MapPinned,
    intro: 'Where we work and how we assess whether a project is the right fit.',
    questions: [
      {
        question: 'What areas do you cover?',
        answer:
          'Our core coverage is London, Hertfordshire and surrounding areas within approximately 25 miles of our Elstree office.',
      },
      {
        question: 'Can you work outside the 25 mile radius?',
        answer:
          'Sometimes. If the scope is a strong fit and the logistics make sense, we can review projects just outside the core area.',
      },
      {
        question: 'Do you visit before pricing?',
        answer:
          'For most meaningful scopes, a site visit or detailed information review is needed before a reliable proposal can be prepared.',
      },
    ],
  },
  {
    category: 'Programme',
    icon: Clock3,
    intro: 'Timing, sequencing and how early contractor involvement helps.',
    questions: [
      {
        question: 'How early should we involve you?',
        answer:
          'The earlier the better. Pre-construction input can reduce surprises around cost, sequencing, access and specification.',
      },
      {
        question: 'How long will my project take?',
        answer:
          'Programme depends on scope, approvals, lead times, structural complexity and site constraints. We set out realistic timing during proposal stage.',
      },
      {
        question: 'Can you fast-track urgent works?',
        answer:
          'Where the scope and supply chain allow it, we can prioritise enabling works, phased procurement and focused delivery milestones.',
      },
    ],
  },
  {
    category: 'Commercial Terms',
    icon: FileText,
    intro: 'How proposals, pricing and written scope are approached.',
    questions: [
      {
        question: 'How do you price projects?',
        answer:
          'We review drawings, schedules, site constraints and specification details before preparing a written proposal or budget guidance.',
      },
      {
        question: 'Do you provide written quotations?',
        answer:
          'Yes. Project scope, exclusions, assumptions, price and programme are confirmed in writing before works proceed.',
      },
      {
        question: 'Can you work from a budget?',
        answer:
          'Yes. A realistic budget helps guide specification choices, phasing and value decisions before the project is fixed.',
      },
    ],
  },
];

const mobileFaqItems = faqSections.flatMap((section) =>
  section.questions.map((item) => ({
    ...item,
    id: `${section.category}-${item.question}`,
    category: section.category,
    icon: section.icon,
  }))
);

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqSections[0].category);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [openMobileQuestion, setOpenMobileQuestion] = useState(mobileFaqItems[0].id);
  const activeSection =
    faqSections.find((section) => section.category === activeCategory) ?? faqSections[0];
  const ActiveIcon = activeSection.icon;

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-10 sm:bg-slate-50 sm:py-12">
      <div
        className="pointer-events-none absolute -left-20 top-16 hidden h-56 w-72 rotate-[-12deg] rounded-full border border-gold-500/12 sm:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 bottom-20 hidden h-64 w-64 rounded-full bg-gold-500/[0.045] lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 top-20 hidden h-32 w-32 lg:block"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-4 h-px w-24 rotate-[-18deg] bg-gold-500/18" />
        <div className="absolute left-5 top-12 h-px w-20 rotate-[-18deg] bg-slate-900/10" />
        <div className="absolute left-10 top-20 h-px w-16 rotate-[-18deg] bg-gold-500/14" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 sm:text-sm sm:text-gold-600">
              Client Guidance
            </p>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl sm:text-slate-900">
              Project Questions,
              <span className="text-gold-500"> Answered</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-slate-600 sm:text-slate-600 lg:text-lg">
            Tap a question to open the answer. The key project details stay compact
            and easy to scan on mobile.
          </p>
        </div>

        <div className="space-y-3 sm:hidden">
          {mobileFaqItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openMobileQuestion === item.id;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/5"
              >
                <button
                  type="button"
                  onClick={() => setOpenMobileQuestion(isOpen ? '' : item.id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-500">
                      {item.category}
                    </span>
                    <span className="mt-1 block text-base font-bold leading-snug text-slate-900">
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`mt-1 h-5 w-5 flex-shrink-0 text-gold-600 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-slate-200 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-[#020426] shadow-xl shadow-black/20 sm:block sm:border-slate-200 sm:bg-white sm:shadow-slate-900/5">
          <div className="border-b border-white/10 bg-[#020426] p-3 sm:border-slate-200">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:overflow-x-auto lg:grid lg:grid-cols-8 lg:overflow-visible">
              {faqSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeCategory === section.category;

                return (
                  <button
                    key={section.category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(section.category);
                      setOpenQuestion(0);
                    }}
                    className={`flex min-h-12 items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all sm:min-w-[10.5rem] sm:gap-3 sm:py-3 lg:min-h-24 lg:min-w-0 lg:flex-col lg:items-start lg:justify-between lg:gap-0 ${
                      isActive
                        ? 'bg-gold-500 text-slate-950 shadow-lg shadow-gold-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                    <span className="text-xs font-bold leading-tight sm:text-sm">{section.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[21rem_minmax(0,1fr)]">
            <div className="bg-[#020426] px-4 py-4 text-white sm:px-6 lg:px-5 lg:py-6">
              <div className="flex items-start gap-3 lg:block">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500 text-slate-950 lg:h-12 lg:w-12">
                  <ActiveIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-400 lg:mt-6">
                    {activeSection.category}
                  </p>
                  <h3 className="mt-1 text-xl font-bold lg:mt-2 lg:text-2xl">What to know</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300 lg:mt-4">
                    {activeSection.intro}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 bg-[#020426] p-3 sm:gap-4 sm:bg-slate-50 sm:p-6 xl:grid-cols-3">
              {activeSection.questions.map((item, index) => (
                <article
                  key={item.question}
                  className="rounded-lg border border-white/10 bg-[#020426] p-4 shadow-sm transition-all hover:border-gold-500/40 sm:border-slate-200 sm:bg-white sm:p-5 sm:hover:-translate-y-0.5 sm:hover:shadow-lg sm:hover:shadow-gold-500/10"
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)}
                    className="flex w-full items-start gap-3 text-left sm:pointer-events-none"
                    aria-expanded={openQuestion === index}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-sm font-bold text-gold-500 sm:text-gold-700">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-base font-bold leading-snug text-white sm:text-lg sm:text-slate-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 flex-shrink-0 text-gold-500 transition-transform sm:hidden ${
                        openQuestion === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <p
                    className={`${
                      openQuestion === index ? 'block' : 'hidden'
                    } mt-3 text-sm leading-relaxed text-slate-300 sm:block sm:text-slate-600`}
                  >
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:grid-cols-[1fr_auto] sm:items-center sm:bg-white sm:p-5 sm:shadow-slate-900/5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 sm:text-slate-900">Need project-specific advice?</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-slate-600">
              Send the drawings, address or a short project brief and we can advise on the next step.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-gold-400"
          >
            Ask the Team
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
