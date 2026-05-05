import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { featuredProjects, projectImages } from '../lib/siteData';

const projectDetails: Record<string, { scope: string; challenge: string; result: string }> = {
  '1': {
    scope: 'Basement construction, waterproofing and premium internal finishes.',
    challenge: 'Delivering specialist below-ground works while protecting structure, light and usable living space.',
    result: 'A dry, high-spec basement designed for cinema, gym, wine storage and family use.',
  },
  '2': {
    scope: 'Double-storey extension, structural alterations and full internal refurbishment.',
    challenge: 'Expanding the footprint while maintaining programme control and consistent finishes throughout.',
    result: 'A larger, brighter home with upgraded services, layout and specification.',
  },
  '3': {
    scope: 'Vertical extension and construction of four penthouse flats.',
    challenge: 'Working above an occupied historic building with careful logistics and tenant considerations.',
    result: 'Additional residential value delivered at roof level with controlled disruption.',
  },
  '4': {
    scope: 'Mixed-use construction including residential and commercial space.',
    challenge: 'Managing access, sequencing and site logistics in a busy East London location.',
    result: 'A mixed-use scheme delivered with practical coordination across multiple uses.',
  },
  '5': {
    scope: 'Commercial refurbishment, structural alteration and fit-out works.',
    challenge: 'Balancing commercial asset value, design intent and efficient delivery.',
    result: 'A refreshed commercial space with improved usability, finish quality and presentation.',
  },
  '6': {
    scope: 'Demolition, redevelopment and creation of high-spec apartments and townhouses.',
    challenge: 'Transforming a former utility site into a residential development with strong market appeal.',
    result: 'A collection of modern homes with upgraded site value and residential quality.',
  },
  '7': {
    scope: 'HMO conversion with en-suite rooms, kitchenettes and shared facilities.',
    challenge: 'Maximising layout efficiency while meeting HMO and building regulation requirements.',
    result: 'A compliant multi-occupancy residence with private suites and practical shared space.',
  },
  '8': {
    scope: 'Student accommodation upgrade and refurbishment works.',
    challenge: 'Delivering robust, comfortable spaces suited to repeated use and tight occupation cycles.',
    result: 'Improved accommodation with durable finishes and a stronger resident experience.',
  },
  '9': {
    scope: 'Residential redevelopment in a suburban and semi-rural setting.',
    challenge: 'Balancing modern residential standards with local context and site constraints.',
    result: 'A renewed residential asset with improved quality, functionality and long-term value.',
  },
};

function BeforeAfterSlider({
  reveal,
  onRevealChange,
  afterSrc,
  afterAlt,
  beforeSrc,
  beforeAlt,
  ariaLabel,
  className = '',
}: {
  reveal: number;
  onRevealChange: (value: number) => void;
  afterSrc: string;
  afterAlt: string;
  beforeSrc: string;
  beforeAlt: string;
  ariaLabel: string;
  className?: string;
}) {
  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * 100;
    onRevealChange(Math.max(0, Math.min(100, Math.round(value))));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Home') onRevealChange(0);
    if (event.key === 'End') onRevealChange(100);
    if (event.key === 'ArrowLeft') onRevealChange(Math.max(0, reveal - 5));
    if (event.key === 'ArrowRight') onRevealChange(Math.min(100, reveal + 5));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={reveal}
      className={`relative overflow-hidden bg-slate-100 select-none focus:outline-none focus:ring-2 focus:ring-gold-400 ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return;
        event.preventDefault();
        event.stopPropagation();
        updateFromPointer(event);
      }}
    >
      <img
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="slider-image-smooth pointer-events-none h-full w-full select-none object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          draggable={false}
          className="slider-image-smooth pointer-events-none h-full w-full select-none object-cover"
        />
      </div>
      <div
        className="absolute inset-y-0 z-20 w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.25)]"
        style={{ left: `${reveal}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg">
          <ChevronLeft className="h-4 w-4 -mr-1" strokeWidth={3} aria-hidden="true" />
          <ChevronRight className="h-4 w-4 -ml-1" strokeWidth={3} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [basementReveal, setBasementReveal] = useState(50);
  const [modalBasementReveal, setModalBasementReveal] = useState(50);
  const [romfordReveal, setRomfordReveal] = useState(50);
  const [modalRomfordReveal, setModalRomfordReveal] = useState(50);
  const [omanCourtReveal, setOmanCourtReveal] = useState(50);
  const [modalOmanCourtReveal, setModalOmanCourtReveal] = useState(50);
  const [officeReveal, setOfficeReveal] = useState(50);
  const [modalOfficeReveal, setModalOfficeReveal] = useState(50);
  const [mixedUseReveal, setMixedUseReveal] = useState(50);
  const [modalMixedUseReveal, setModalMixedUseReveal] = useState(50);
  const [prestigeHouseReveal, setPrestigeHouseReveal] = useState(50);
  const [modalPrestigeHouseReveal, setModalPrestigeHouseReveal] = useState(50);
  const [hmoReveal, setHmoReveal] = useState(50);
  const [modalHmoReveal, setModalHmoReveal] = useState(50);
  const [studentAccommodationReveal, setStudentAccommodationReveal] = useState(50);
  const [modalStudentAccommodationReveal, setModalStudentAccommodationReveal] = useState(50);
  const [suburbanRedevelopmentReveal, setSuburbanRedevelopmentReveal] = useState(50);
  const [modalSuburbanRedevelopmentReveal, setModalSuburbanRedevelopmentReveal] = useState(50);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const selectedProject = featuredProjects.find((project) => project.id === selected);

  const openProject = (projectId: string) => {
    if (projectId === '1') {
      setModalBasementReveal(50);
    }
    if (projectId === '2') {
      setModalRomfordReveal(50);
    }
    if (projectId === '3') {
      setModalOmanCourtReveal(50);
    }
    if (projectId === '4') {
      setModalMixedUseReveal(50);
    }
    if (projectId === '5') {
      setModalOfficeReveal(50);
    }
    if (projectId === '6') {
      setModalPrestigeHouseReveal(50);
    }
    if (projectId === '7') {
      setModalHmoReveal(50);
    }
    if (projectId === '8') {
      setModalStudentAccommodationReveal(50);
    }
    if (projectId === '9') {
      setModalSuburbanRedevelopmentReveal(50);
    }
    setSelected(projectId);
  };

  return (
    <section id="projects" className="relative overflow-hidden bg-white py-12">
      <div className="pointer-events-none absolute -left-24 top-10 hidden h-80 w-80 md:block" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-gold-500/12" />
        <div className="absolute inset-10 rounded-full border border-gold-500/18" />
        <div className="absolute inset-20 rounded-full border border-slate-900/10" />
        <div className="absolute inset-x-12 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/25 to-transparent" />
      </div>
      <div className="pointer-events-none absolute right-6 top-28 hidden h-28 w-44 rounded-full border border-slate-900/10 md:block" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Featured
            <span className="text-gold-500"> Projects</span>
          </h2>
          <p className="text-slate-600 text-lg">
            A selection of our recent construction and development projects across
            London and the South East.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => openProject(project.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openProject(project.id);
                }
              }}
              className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-gold-200 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:block ${
                !showAllProjects && index >= 3 ? 'hidden' : ''
              }`}
              aria-label={`Open ${project.title}`}
            >
              <div className="relative h-56 overflow-hidden">
                {project.id === '1' ? (
                  <BeforeAfterSlider
                    reveal={basementReveal}
                    onRevealChange={setBasementReveal}
                    afterSrc="/images/basement-after-card-smooth.jpeg"
                    afterAlt={`${project.title} completed basement`}
                    beforeSrc="/images/basement-before-card-smooth.jpeg"
                    beforeAlt={`${project.title} before construction`}
                    ariaLabel="Compare basement before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '2' ? (
                  <BeforeAfterSlider
                    reveal={romfordReveal}
                    onRevealChange={setRomfordReveal}
                    afterSrc="/images/romford-left-card-smooth.jpeg"
                    afterAlt={`${project.title} before extension works`}
                    beforeSrc="/images/romford-right-card-smooth.jpeg"
                    beforeAlt={`${project.title} completed extension`}
                    ariaLabel="Compare Romford extension before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '3' ? (
                  <BeforeAfterSlider
                    reveal={omanCourtReveal}
                    onRevealChange={setOmanCourtReveal}
                    afterSrc="/images/oman-court-after-card-smooth.jpeg"
                    afterAlt={`${project.title} completed exterior`}
                    beforeSrc="/images/oman-court-before-card-smooth.jpeg"
                    beforeAlt={`${project.title} before exterior works`}
                    ariaLabel="Compare Oman Court before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '4' ? (
                  <BeforeAfterSlider
                    reveal={mixedUseReveal}
                    onRevealChange={setMixedUseReveal}
                    afterSrc="/images/mixed-use-after-card-smooth.jpeg"
                    afterAlt={`${project.title} after development`}
                    beforeSrc="/images/mixed-use-before-card-smooth.jpeg"
                    beforeAlt={`${project.title} before development`}
                    ariaLabel="Compare mixed-use development before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '5' ? (
                  <BeforeAfterSlider
                    reveal={officeReveal}
                    onRevealChange={setOfficeReveal}
                    afterSrc="/images/office-before-card-smooth.jpeg"
                    afterAlt={`${project.title} completed office fit-out`}
                    beforeSrc="/images/office-after-card-smooth.jpeg"
                    beforeAlt={`${project.title} office before fit-out`}
                    ariaLabel="Compare office before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '6' ? (
                  <BeforeAfterSlider
                    reveal={prestigeHouseReveal}
                    onRevealChange={setPrestigeHouseReveal}
                    afterSrc="/images/prestige-house-after-card-smooth.jpeg"
                    afterAlt={`${project.title} completed residences`}
                    beforeSrc="/images/prestige-house-before-card-smooth.jpeg"
                    beforeAlt={`${project.title} before redevelopment`}
                    ariaLabel="Compare Prestige House before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '7' ? (
                  <BeforeAfterSlider
                    reveal={hmoReveal}
                    onRevealChange={setHmoReveal}
                    afterSrc="/images/hmo-conversion-after-hmo3-card-smooth.jpeg"
                    afterAlt={`${project.title} after conversion`}
                    beforeSrc="/images/hmo-conversion-before-hmo1-card-smooth.jpeg"
                    beforeAlt={`${project.title} before conversion`}
                    ariaLabel="Compare HMO Conversion before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '8' ? (
                  <BeforeAfterSlider
                    reveal={studentAccommodationReveal}
                    onRevealChange={setStudentAccommodationReveal}
                    afterSrc="/images/student-accommodation-after-crisp.jpeg"
                    afterAlt={`${project.title} after works`}
                    beforeSrc="/images/student-accommodation-before-crisp.jpeg"
                    beforeAlt={`${project.title} before works`}
                    ariaLabel="Compare Student Acommodation before and after"
                    className="h-full w-full"
                  />
                ) : project.id === '9' ? (
                  <BeforeAfterSlider
                    reveal={suburbanRedevelopmentReveal}
                    onRevealChange={setSuburbanRedevelopmentReveal}
                    afterSrc="/images/colney-2-after.jpg"
                    afterAlt={`${project.title} after redevelopment`}
                    beforeSrc="/images/colney-1-before.jpg"
                    beforeAlt={`${project.title} before redevelopment`}
                    ariaLabel="Compare Suburban redevelopment before and after"
                    className="h-full w-full"
                  />
                ) : (
                  <img
                    src={projectImages[project.id] || projectImages['1']}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-gold-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-snug text-slate-500">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-600" />
                  <span>{projectDetails[project.id]?.scope}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {featuredProjects.length > 3 && (
          <div className="mt-6 sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllProjects((value) => !value)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#020426] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15"
            >
              {showAllProjects ? 'Show fewer projects' : 'Show all sample projects'}
              <ArrowRight
                className={`h-4 w-4 text-gold-500 transition-transform ${
                  showAllProjects ? '-rotate-90' : 'rotate-90'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020426]/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[82vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-64 overflow-hidden rounded-t-2xl bg-slate-100">
              {selectedProject.id === '1' ? (
                <BeforeAfterSlider
                  reveal={modalBasementReveal}
                  onRevealChange={setModalBasementReveal}
                  afterSrc="/images/basement-after-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} completed basement`}
                  beforeSrc="/images/basement-before-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} before construction`}
                  ariaLabel="Compare basement before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '2' ? (
                <BeforeAfterSlider
                  reveal={modalRomfordReveal}
                  onRevealChange={setModalRomfordReveal}
                  afterSrc="/images/romford-left-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} before extension works`}
                  beforeSrc="/images/romford-right-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} completed extension`}
                  ariaLabel="Compare Romford extension before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '3' ? (
                <BeforeAfterSlider
                  reveal={modalOmanCourtReveal}
                  onRevealChange={setModalOmanCourtReveal}
                  afterSrc="/images/oman-court-after-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} completed exterior`}
                  beforeSrc="/images/oman-court-before-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} before exterior works`}
                  ariaLabel="Compare Oman Court before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '4' ? (
                <BeforeAfterSlider
                  reveal={modalMixedUseReveal}
                  onRevealChange={setModalMixedUseReveal}
                  afterSrc="/images/mixed-use-after-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} after development`}
                  beforeSrc="/images/mixed-use-before-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} before development`}
                  ariaLabel="Compare mixed-use development before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '5' ? (
                <BeforeAfterSlider
                  reveal={modalOfficeReveal}
                  onRevealChange={setModalOfficeReveal}
                  afterSrc="/images/office-before-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} completed office fit-out`}
                  beforeSrc="/images/office-after-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} office before fit-out`}
                  ariaLabel="Compare office before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '6' ? (
                <BeforeAfterSlider
                  reveal={modalPrestigeHouseReveal}
                  onRevealChange={setModalPrestigeHouseReveal}
                  afterSrc="/images/prestige-house-after-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} completed residences`}
                  beforeSrc="/images/prestige-house-before-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} before redevelopment`}
                  ariaLabel="Compare Prestige House before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '7' ? (
                <BeforeAfterSlider
                  reveal={modalHmoReveal}
                  onRevealChange={setModalHmoReveal}
                  afterSrc="/images/hmo-conversion-after-hmo3-modal-smooth.jpeg"
                  afterAlt={`${selectedProject.title} after conversion`}
                  beforeSrc="/images/hmo-conversion-before-hmo1-modal-smooth.jpeg"
                  beforeAlt={`${selectedProject.title} before conversion`}
                  ariaLabel="Compare HMO Conversion before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '8' ? (
                <BeforeAfterSlider
                  reveal={modalStudentAccommodationReveal}
                  onRevealChange={setModalStudentAccommodationReveal}
                  afterSrc="/images/student-accommodation-after-crisp.jpeg"
                  afterAlt={`${selectedProject.title} after works`}
                  beforeSrc="/images/student-accommodation-before-crisp.jpeg"
                  beforeAlt={`${selectedProject.title} before works`}
                  ariaLabel="Compare Student Acommodation before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : selectedProject.id === '9' ? (
                <BeforeAfterSlider
                  reveal={modalSuburbanRedevelopmentReveal}
                  onRevealChange={setModalSuburbanRedevelopmentReveal}
                  afterSrc="/images/colney-2-after.jpg"
                  afterAlt={`${selectedProject.title} after redevelopment`}
                  beforeSrc="/images/colney-1-before.jpg"
                  beforeAlt={`${selectedProject.title} before redevelopment`}
                  ariaLabel="Compare Suburban redevelopment before and after"
                  className="h-full w-full rounded-t-2xl"
                />
              ) : (
                <img
                  src={projectImages[selectedProject.id] || projectImages['1']}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-40 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-lg"
                aria-label="Close project details"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                {selectedProject.location}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {selectedProject.description}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ['Scope', projectDetails[selectedProject.id]?.scope],
                  ['Challenge', projectDetails[selectedProject.id]?.challenge],
                  ['Result', projectDetails[selectedProject.id]?.result],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <CheckCircle2 className="h-4 w-4 text-gold-600" />
                      {label}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    setSelected(null);
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-slate-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors"
                >
                  Enquire About This Project
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
