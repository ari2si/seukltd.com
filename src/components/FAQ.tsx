import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  HardHat,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const faqSections = [
  {
    category: 'Development',
    icon: Building2,
    intro: 'Property development guidance covering site appraisal, planning strategy, feasibility, investment-led schemes and delivery routes.',
    questions: [
      {
        question: 'Can you help assess a development opportunity?',
        answer:
          'Yes. We can review site constraints, planning potential, access, likely construction route, specification, programme pressure and broad viability so clients can make better early decisions.',
      },
      {
        question: 'Do you work on joint venture development projects?',
        answer:
          'Yes. We can support suitable joint venture opportunities where the site, planning strategy, funding route and delivery structure are aligned from the outset.',
      },
      {
        question: 'Can you manage development from concept to completion?',
        answer:
          'Yes. We can coordinate acquisition input, planning support, consultants, design development, construction delivery, handover and long-term property enhancement through one joined-up team.',
      },
      {
        question: 'What type of development schemes do you focus on?',
        answer:
          'We focus on residential, commercial and mixed-use opportunities, including apartments, urban housing, student accommodation, HMOs, refurbishment-led value creation and new-build schemes.',
      },
    ],
  },
  {
    category: 'Construction',
    icon: HardHat,
    intro: 'Construction delivery across new builds, refurbishments, basements, extensions, commercial works and complex conversions.',
    questions: [
      {
        question: 'What construction projects do you take on?',
        answer:
          'We deliver new builds, residential refurbishments, commercial refurbishments, basements, extensions, vertical extensions, loft conversions, mixed-use schemes, listed buildings and complex conversions.',
      },
      {
        question: 'Do you provide design and build services?',
        answer:
          'Yes. We can coordinate design, consultants, specification, pricing and construction delivery under one managed route, giving clients one accountable team.',
      },
      {
        question: 'Can you manage complex structural works?',
        answer:
          'Yes, where supported by suitable structural design. We coordinate temporary works, sequencing, specialist packages and practical site requirements.',
      },
      {
        question: 'Can you work with developers, lenders and professional teams?',
        answer:
          'Yes. We regularly work with developers, investors, asset managers, consultants, funders and private clients where programme control and delivery confidence matter.',
      },
    ],
  },
  {
    category: 'Property Services',
    icon: ClipboardCheck,
    intro: 'Lifecycle property services covering pre-construction, maintenance, compliance, MEP, smart systems, fit-out, aftercare and smaller works.',
    questions: [
      {
        question: 'What do your Property Services cover?',
        answer:
          'Property Services covers pre-construction support, groundworks, structural works, interiors, kitchen and bathroom fit-out, plumbing, HVAC, electrical, security, data, smart systems, landscaping, maintenance and aftercare.',
      },
      {
        question: 'Can you handle planned and reactive maintenance?',
        answer:
          'Yes. We can support planned preventative maintenance and reactive repair works for residential, commercial and mixed-use assets, helping properties remain compliant, safe and operational.',
      },
      {
        question: 'Do you provide smaller works as well as major projects?',
        answer:
          'Yes. Property Services can support smaller refurbishments, extensions, conversions, repair works, fit-out packages and upgrades where a specialist team is the right route.',
      },
      {
        question: 'Can you support smart building and technical systems?',
        answer:
          'Yes. We can coordinate smart building integration, electrical systems, security, access control, data, fibre, ICT infrastructure and ongoing technical aftercare.',
      },
    ],
  },
  {
    category: 'Project Delivery',
    icon: ClipboardCheck,
    intro: 'How we organise development, construction and property service work from first conversation through to completion.',
    questions: [
      {
        question: 'Do you provide design and build services?',
        answer:
          'Yes. We can coordinate design, consultants, specification, pricing and construction delivery under one managed route, giving clients one accountable team.',
      },
      {
        question: 'Can you manage the full property project process?',
        answer:
          'Yes. We can manage planning support, design coordination, site setup, programming, procurement, subcontractors, quality checks, client updates and handover documentation.',
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
          'We can coordinate with architects, engineers, planning consultants, building control and other appointed specialists so development, construction and inspection requirements are aligned.',
      },
      {
        question: 'Do you help before drawings are final?',
        answer:
          'Yes. Early input can help identify planning, buildability, sequencing, specification and cost pressures before work starts on site.',
      },
      {
        question: 'Who deals with structural details?',
        answer:
          'Structural design remains with the appointed engineer, while we coordinate the development route, construction sequence and practical site requirements around their information.',
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
    intro: 'Delivery for office, retail, mixed-use, commercial refurbishment and asset enhancement work.',
    questions: [
      {
        question: 'Do you handle commercial fit-out and refurbishment?',
        answer:
          'Yes. We deliver commercial refurbishment, fit-out, structural alterations, finishing packages, property services and maintenance-related works.',
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
    intro: 'High-spec homes, extensions, vertical extensions, loft conversions, basements, HMOs, residential development and portfolio enhancement.',
    questions: [
      {
        question: 'What residential projects do you take on?',
        answer:
          'We work across property development, basements, extensions, vertical extensions, loft conversions, refurbishments, new builds, HMO conversions, high-spec fit-outs and long-term property enhancement.',
      },
      {
        question: 'Can you work with private clients and developers?',
        answer:
          'Yes. We can support private homeowners, developers, investors, portfolio owners and professional teams where quality, programme and coordination matter.',
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
          'Our core coverage is London and the Home Counties, with each opportunity reviewed against scope, logistics and programme requirements.',
      },
      {
        question: 'Can you review projects beyond the core coverage area?',
        answer:
          'Sometimes. If the scope is a strong fit and the logistics make sense, we can review projects beyond the core London and Home Counties area.',
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
          'The earlier the better. Development and pre-construction input can reduce surprises around planning, cost, sequencing, access and specification.',
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

const localFaqFallback = (query: string) => {
  const topic = query.trim();
  const lower = topic.toLowerCase();

  if (lower.includes('hmo')) {
    return 'For HMO projects, Smart Environment Group can support conversion planning, layout efficiency, fire safety coordination, services, bathrooms, kitchen areas, refurbishment, compliance-led works and long-term property services. HMO requirements depend on the property and local authority, so the best next step is to send us the address, current layout and intended room numbers.';
  }

  if (lower.includes('maintenance') || lower.includes('repair')) {
    return 'For maintenance, Smart Environment Group can support planned preventative maintenance, reactive repairs, compliance-related works, plumbing, HVAC, electrical, security, access, data and general property service requirements. Share the property type, the issue and the urgency so our team can advise the right next step.';
  }

  if (lower.includes('planning') || lower.includes('development')) {
    return 'For development and planning-led projects, Smart Environment Group can help review site potential, feasibility, planning strategy, buildability, construction route, programme pressure and long-term value. Send the address, drawings or a short brief and we can guide you on the next stage.';
  }

  return `For ${topic || 'your project'}, Smart Environment Group can advise from a property development, construction and property services perspective. We can provide general guidance, identify likely project considerations, and help decide whether the next step should be a site visit, drawing review, budget discussion or formal proposal. Please contact us with the address, photos, drawings or a short brief.`;
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqSections[0].category);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [openMobileQuestion, setOpenMobileQuestion] = useState(mobileFaqItems[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileCategorySelected, setMobileCategorySelected] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiUsedFallback, setAiUsedFallback] = useState(false);
  const activeSection =
    faqSections.find((section) => section.category === activeCategory) ?? faqSections[0];
  const ActiveIcon = activeSection.icon;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const activeQuestions = useMemo(() => {
    if (!normalizedSearch) return activeSection.questions;

    return activeSection.questions.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(normalizedSearch)
    );
  }, [activeSection, normalizedSearch]);
  const filteredMobileItems = useMemo(() => {
    return mobileFaqItems.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, normalizedSearch]);
  const aiSuggestion = normalizedSearch
    ? `AI match found ${filteredMobileItems.length || activeQuestions.length} relevant answer${
        (filteredMobileItems.length || activeQuestions.length) === 1 ? '' : 's'
      } in ${activeCategory}.`
    : `Ask the AI guide about HMO, maintenance, planning, refurbishment or any project topic.`;

  const askAi = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      setAiError('Please enter a topic or question first.');
      setAiAnswer('');
      return;
    }

    setAiLoading(true);
    setAiError('');
    setAiAnswer('');
    setAiUsedFallback(false);

    try {
      const response = await fetch('/.netlify/functions/ai-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category: activeCategory }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'The AI guide could not answer that question.');
      }

      setAiAnswer(data.answer || '');
      setAiUsedFallback(Boolean(data.fallback));
    } catch {
      setAiAnswer(localFaqFallback(query));
      setAiUsedFallback(true);
    } finally {
      setAiLoading(false);
    }
  };

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
          <div className="space-y-3">
            <p className="text-base leading-relaxed text-slate-600 sm:text-slate-600 lg:text-lg">
              Select a category, search a project term, and scan guidance across
              development, construction and property services.
            </p>
            <div className="rounded-2xl border border-gold-600/30 bg-gold-500 p-3 text-slate-950 shadow-xl shadow-gold-500/25">
              <form onSubmit={askAi} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
                  <Search className="h-4 w-4 flex-shrink-0 text-slate-950" />
                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setOpenQuestion(0);
                      setOpenMobileQuestion('');
                      setMobileCategorySelected(Boolean(event.target.value.trim()));
                    }}
                    type="search"
                    placeholder="Ask about HMO, planning, maintenance..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
                >
                  <Sparkles className="h-4 w-4" />
                  {aiLoading ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>
              <div className="mt-2 flex items-start gap-2 text-xs font-medium leading-relaxed text-slate-950">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white" />
                <span>{aiSuggestion}</span>
              </div>
              {(aiAnswer || aiError) && (
                <div className={`mt-3 rounded-xl border p-3 text-sm leading-relaxed ${
                  aiError
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-white/50 bg-white text-slate-800'
                }`}>
                  {aiAnswer && (
                    <>
                      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        {aiUsedFallback ? 'Smart FAQ Guidance' : 'AI Project Guidance'}
                      </div>
                      <p>{aiAnswer}</p>
                    </>
                  )}
                  {aiError}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:hidden">
          {!mobileCategorySelected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-600">
                    FAQ Categories
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Tap a category to open its questions.
                  </p>
                </div>
                <span className="rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-bold text-gold-700">
                  {faqSections.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {faqSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeCategory === section.category;

                  return (
                    <button
                      key={section.category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(section.category);
                        setOpenMobileQuestion('');
                        setMobileCategorySelected(true);
                      }}
                      className={`flex min-h-[4.25rem] items-start gap-2 rounded-xl border p-2.5 text-left transition-all ${
                        isActive
                          ? 'border-gold-500 bg-gold-500 text-slate-950 shadow-lg shadow-gold-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                          isActive ? 'bg-white/25 text-slate-950' : 'bg-white text-gold-600'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.78rem] font-bold leading-tight">
                          {section.category}
                        </span>
                        <span className={`mt-1 block text-[0.66rem] leading-tight ${isActive ? 'text-slate-900/75' : 'text-slate-500'}`}>
                          {section.questions.length} answers
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gold-500/40 bg-gold-500 p-3 text-slate-950 shadow-lg shadow-gold-500/20">
              <button
                type="button"
                onClick={() => {
                  setMobileCategorySelected(false);
                  setOpenMobileQuestion('');
                }}
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-950"
              >
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                Back to FAQ categories
              </button>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/25">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-bold leading-tight">{activeCategory}</p>
                  <p className="text-xs font-medium text-slate-900/75">
                    {filteredMobileItems.length} relevant answers
                  </p>
                </div>
              </div>
            </div>
          )}

          {mobileCategorySelected && filteredMobileItems.map((item) => {
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
          {mobileCategorySelected && !filteredMobileItems.length && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-lg shadow-slate-900/5">
              No answers matched that search in {activeCategory}. Try a shorter term or another category.
            </div>
          )}
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-[#020426] shadow-xl shadow-black/20 sm:block sm:border-slate-200 sm:bg-white sm:shadow-slate-900/5">
          <div className="border-b border-white/10 bg-[#020426] p-3 sm:border-slate-200">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
                    className={`flex min-h-12 items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all sm:gap-3 sm:py-3 lg:min-h-20 lg:flex-col lg:items-start lg:justify-between lg:gap-0 ${
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

            <div className="grid gap-3 bg-[#020426] p-3 sm:gap-4 sm:bg-slate-50 sm:p-6 xl:grid-cols-2">
              {activeQuestions.map((item, index) => (
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
              {!activeQuestions.length && (
                <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600 xl:col-span-2">
                  No answers matched that search in {activeSection.category}. Try another category or a shorter keyword.
                </div>
              )}
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
