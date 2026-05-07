import type { Service } from './types';

export const constructionServices: Service[] = [
  {
    id: '1',
    title: 'Basement Construction',
    slug: 'basement-construction',
    description:
      'Design and construction of new basements, basement extensions and below-ground spaces, including excavation, structure, waterproofing, drainage, services and internal fit-out.',
    icon: 'ArrowDownToLine',
    subcategories: [
      {
        name: 'Excavation & Structure',
        items: [
          'Basement excavation and underpinning',
          'Temporary works and structural propping',
          'Retaining walls, concrete works and structural slabs',
          'Structural openings and steelwork',
        ],
      },
      {
        name: 'Waterproofing & Drainage',
        items: [
          'Waterproofing and tanking systems',
          'Cavity drain membranes',
          'Drainage and sump pump systems',
          'Below-ground services coordination',
        ],
      },
      {
        name: 'Fit-Out & Finishes',
        items: [
          'Light wells, access openings and ventilation',
          'MEP installation and internal fit-out',
          'Cinema rooms, gyms, kitchens, bathrooms and utility areas',
          'Decoration, flooring, joinery and final finishes',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Commercial Refurbishment',
    slug: 'commercial-refurbishment',
    description:
      'Refurbishment and fit-out of commercial buildings, including offices, retail, hospitality and leisure spaces, with structural works, services coordination, finishes and handover.',
    icon: 'Building2',
    subcategories: [
      {
        name: 'Commercial Fit-Out',
        items: [
          'Office, retail, hotel and leisure refurbishment',
          'CAT A and CAT B fit-out works',
          'Partitions, ceilings, flooring and finishes',
          'Reception, workspace and customer-facing areas',
        ],
      },
      {
        name: 'Building Works',
        items: [
          'Strip-out, enabling works and dilapidations',
          'Structural alterations and builders work',
          'Fire stopping and compliance works',
          'Phased works in occupied or live commercial premises',
        ],
      },
      {
        name: 'Services & Systems',
        items: [
          'Mechanical, electrical and data coordination',
          'Lighting, small power and distribution',
          'Access control and security interfaces',
          'Testing, commissioning and handover',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Design & Build',
    slug: 'design-build',
    description:
      'Design and construction delivery under one managed route, coordinating consultants, pricing, programme, procurement, construction, finishes and handover from concept to completion.',
    icon: 'Compass',
    subcategories: [
      {
        name: 'Design Coordination',
        items: [
          'Initial brief review and feasibility advice',
          'Design coordination with architects and consultants',
          'Planning and building control coordination',
          'Structural, MEP and specification coordination',
        ],
      },
      {
        name: 'Cost & Programme',
        items: [
          'Budget development and value engineering',
          'Programme planning and procurement',
          'Scope clarification and package planning',
          'Risk review and buildability advice',
        ],
      },
      {
        name: 'Construction Delivery',
        items: [
          'Main contractor project management',
          'Site setup and subcontractor coordination',
          'Construction, finishing and quality checks',
          'Handover documentation and aftercare',
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Extensions, Vertical Extensions & Loft Conversions',
    slug: 'extensions',
    description:
      'Construction of home extensions, vertical extensions and loft conversions, including structural alterations, roof works, dormers, glazing, services, insulation and internal finishes.',
    icon: 'MoveVertical',
    subcategories: [
      {
        name: 'Extensions',
        items: [
          'Single-storey and double-storey extensions',
          'Vertical extensions and additional floor construction',
          'Steelwork, structural openings and load-bearing alterations',
          'Windows, doors, glazing and external finishes',
        ],
      },
      {
        name: 'Loft Conversions',
        items: [
          'Loft conversions and roof space conversions',
          'Dormers, mansards, roof alterations and roof lights',
          'Staircase access, insulation and fire protection',
          'Roof structure alterations and strengthening',
        ],
      },
      {
        name: 'Internal Works',
        items: [
          'Electrical, plumbing, heating and internal fit-out works',
          'Bathrooms, bedrooms and storage areas',
          'Plastering, decorating, flooring and joinery',
          'Final finishes, snagging and handover',
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Listed Buildings',
    slug: 'listed-buildings',
    description:
      'Careful refurbishment and alteration of listed and sensitive buildings, coordinating protection, sequencing, structural works, services upgrades and heritage-conscious finishes.',
    icon: 'Landmark',
  },
  {
    id: '6',
    title: 'Mixed-Use Developments',
    slug: 'mixed-use',
    description:
      'Construction and coordination of mixed-use developments, combining residential, retail, leisure, commercial and community spaces within one managed building project.',
    icon: 'LayoutGrid',
    subcategories: [
      {
        name: 'Mixed-Use Shell & Core',
        items: [
          'Residential, retail, leisure and commercial building areas',
          'Structural frame, envelope and compartmentation works',
          'Shared cores, stairs, lifts and circulation spaces',
          'Fire strategy, access routes and compliance coordination',
        ],
      },
      {
        name: 'Services & Interfaces',
        items: [
          'Separate utilities, metering and landlord services',
          'MEP coordination across different occupancy types',
          'Plant rooms, risers, data routes and life safety systems',
          'Acoustic, ventilation and drainage interface management',
        ],
      },
      {
        name: 'Fit-Out & Handover',
        items: [
          'Commercial unit fit-out and residential internal finishes',
          'Public realm, entrances and communal amenity areas',
          'Phased access, logistics and neighbour coordination',
          'Testing, commissioning and staged handover packages',
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'New Design & Build',
    slug: 'new-build',
    description:
      'Construction of new homes, apartments and residential developments, including groundworks, structure, envelope, services, internal fit-out, commissioning and handover.',
    icon: 'Home',
    subcategories: [
      {
        name: 'Site & Groundworks',
        items: [
          'New build houses, apartments and small developments',
          'Site setup, enabling works and groundworks',
          'Foundations, drainage and utility connections',
          'External works and access routes',
        ],
      },
      {
        name: 'Superstructure',
        items: [
          'Structural frame, masonry and roof construction',
          'Windows, doors, external envelope and facades',
          'Insulation, weatherproofing and airtightness works',
          'Internal walls, stairs and structural elements',
        ],
      },
      {
        name: 'Completion',
        items: [
          'Mechanical, electrical and plumbing installation',
          'Internal partitions, plastering, flooring and finishes',
          'Final commissioning, snagging and handover',
          'Client walkthrough and aftercare support',
        ],
      },
    ],
  },
  {
    id: '8',
    title: 'Residential Refurbishment',
    slug: 'residential-refurbishment',
    description:
      'Refurbishment and renovation of residential properties, including layout changes, structural works, services upgrades, kitchens, bathrooms, flooring, joinery and final finishes.',
    icon: 'PaintBucket',
    subcategories: [
      {
        name: 'Structural & Layout Works',
        items: [
          'Full house refurbishment and renovation',
          'Structural alterations and layout reconfiguration',
          'Open-plan living conversions',
          'Wall removals, steelwork and builders work',
        ],
      },
      {
        name: 'Services Upgrades',
        items: [
          'Electrical rewiring and lighting upgrades',
          'Plumbing, heating and bathroom installation',
          'Insulation, windows, doors and energy upgrades',
          'Smart controls and data cabling coordination',
        ],
      },
      {
        name: 'Internal Finishes',
        items: [
          'Kitchen, bathroom and bedroom refurbishment',
          'Plastering, decorating, flooring and joinery',
          'High-end finishes, detailing and final snagging',
          'Fixtures, fittings and final presentation',
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'Student Accommodation',
    slug: 'student-accommodation',
    description:
      'Refurbishment, conversion and fit-out of student accommodation, including bedrooms, en-suites, shared kitchens, fire safety works, building services and handover-ready finishes.',
    icon: 'GraduationCap',
    subcategories: [
      {
        name: 'Accommodation Layouts',
        items: [
          'Student accommodation refurbishment and conversion',
          'Bedroom, en-suite and shared kitchen layouts',
          'Bathroom pods, sanitaryware and plumbing installation',
          'Communal areas, circulation spaces and laundry rooms',
        ],
      },
      {
        name: 'Safety & Services',
        items: [
          'Fire safety upgrades and compartmentation works',
          'Mechanical, electrical, data and access control systems',
          'Emergency lighting, alarms and compliance works',
          'Ventilation, heating and hot water systems',
        ],
      },
      {
        name: 'Fit-Out & Handover',
        items: [
          'Flooring, decoration, furniture coordination and finishes',
          'Programme-led delivery for occupation deadlines',
          'Snagging, cleaning and handover preparation',
          'Landlord and operator handover support',
        ],
      },
    ],
  },
];

export const propertyServices: Service[] = [
  {
    id: '1',
    title: 'Pre-Construction & Design',
    slug: 'pre-construction',
    description:
      'Feasibility, planning, compliance, budgeting and coordinated design services for construction, MEP and smart infrastructure projects.',
    icon: 'Compass',
    subcategories: [
      {
        name: 'Planning & Development',
        items: [
          'Site feasibility studies',
          'Planning application support',
          'Building regulation compliance',
          'Cost planning & budgeting',
        ],
      },
      {
        name: 'Design Services',
        items: [
          'Architectural design coordination',
          'MEP design',
          'Lighting design',
          'Technical drawings & CAD',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Groundworks & Civil Engineering',
    slug: 'groundworks-civil',
    description:
      'Site preparation, excavation, foundations, drainage and utility infrastructure for residential and commercial developments.',
    icon: 'HardHat',
    subcategories: [
      {
        name: 'Site Preparation',
        items: ['Site clearance', 'Excavation', 'Demolition', 'Earthworks'],
      },
      {
        name: 'Foundations',
        items: ['Strip foundations', 'Raft foundations', 'Pile foundations', 'Concrete slabs'],
      },
      {
        name: 'Drainage & Utilities',
        items: ['Underground drainage', 'Sewer connections', 'Utility ducting', 'Stormwater systems'],
      },
    ],
  },
  {
    id: '3',
    title: 'Structural & Building Works',
    slug: 'structural-building',
    description:
      'Structural construction, building envelope works, roofing, waterproofing and external fabric upgrades.',
    icon: 'Building2',
    subcategories: [
      {
        name: 'Structural Construction',
        items: [
          'Steel frame structures',
          'Reinforced concrete structures',
          'Load-bearing walls',
          'Structural alterations',
        ],
      },
      {
        name: 'Building Envelope',
        items: ['Brickwork', 'Blockwork', 'Cladding systems', 'External insulation systems'],
      },
      {
        name: 'Roofing',
        items: ['Flat roofing systems', 'Pitched roofs', 'Waterproofing', 'Roof insulation'],
      },
    ],
  },
  {
    id: '4',
    title: 'Interior Construction & Finishes',
    slug: 'interiors',
    description:
      'Interior partitions, plastering, ceilings, flooring, joinery, carpentry and decorative finishes.',
    icon: 'PaintBucket',
    subcategories: [
      {
        name: 'Partitions & Drywall',
        items: ['Stud partitions', 'Metal framing', 'Acoustic partitions', 'Fire-rated systems'],
      },
      {
        name: 'Plastering & Rendering',
        items: ['Skimming', 'Rendering', 'Decorative plaster', 'External render systems'],
      },
      {
        name: 'Ceilings',
        items: ['Suspended ceilings', 'MF ceilings', 'Acoustic ceilings', 'Feature ceilings'],
      },
      {
        name: 'Flooring Systems',
        items: ['Screeding', 'Tiling', 'Hardwood', 'Vinyl', 'Resin flooring'],
      },
      {
        name: 'Joinery & Carpentry',
        items: ['Doors & frames', 'Skirting & architraves', 'Custom joinery', 'Wardrobes & storage'],
      },
      {
        name: 'Decorations',
        items: ['Painting', 'Spray finishes', 'Wall coverings', 'Protective coatings'],
      },
    ],
  },
  {
    id: '5',
    title: 'Kitchen, Bathroom & Fit-Out',
    slug: 'fitout',
    description:
      'Kitchen installations, bathroom and wet room delivery, and residential, office, commercial and retail fit-out.',
    icon: 'Home',
    subcategories: [
      {
        name: 'Kitchens',
        items: ['Kitchen design & install', 'Cabinetry', 'Worktops', 'Appliance integration'],
      },
      {
        name: 'Bathrooms',
        items: ['Bathroom installation', 'Wet rooms', 'Shower systems', 'Sanitary installations'],
      },
      {
        name: 'Interior Fit-Out',
        items: ['Residential fit-out', 'Commercial fit-out', 'Office fit-out', 'Retail fit-out'],
      },
    ],
  },
  {
    id: '6',
    title: 'Plumbing, HVAC & Mechanical',
    slug: 'mep-mechanical',
    description:
      'Water systems, heating, ventilation, air conditioning, plant rooms and mechanical infrastructure.',
    icon: 'SlidersHorizontal',
    subcategories: [
      {
        name: 'Water Systems',
        items: ['Hot & cold water', 'Pressurised systems', 'Plant rooms', 'Water storage systems'],
      },
      {
        name: 'Heating',
        items: ['Boilers', 'Radiators', 'Underfloor heating', 'Heat pumps'],
      },
      {
        name: 'Ventilation & Air Conditioning',
        items: ['MVHR systems', 'Air conditioning', 'Ventilation systems', 'Ductwork installation'],
      },
    ],
  },
  {
    id: '7',
    title: 'Electrical Engineering',
    slug: 'electrical',
    description:
      'Complete electrical engineering covering power systems, lighting, EV charging, UPS, generators, testing and certification.',
    icon: 'Zap',
    subcategories: [
      {
        name: 'Power Systems',
        items: [
          'Full electrical systems',
          'Three-phase power',
          'Distribution boards',
          'Cable containment',
        ],
      },
      {
        name: 'Lighting',
        items: [
          'Architectural lighting',
          'Emergency lighting',
          'External lighting',
          'Lighting control systems',
        ],
      },
      {
        name: 'Special Systems',
        items: ['EV charging', 'UPS', 'Generators', 'Testing & certification'],
      },
    ],
  },
  {
    id: '8',
    title: 'Security, Safety & ELV Systems',
    slug: 'security-elv',
    description:
      'CCTV, access control, intruder alarms, fire systems, perimeter security, gates, barriers and intercom systems.',
    icon: 'ShieldCheck',
    subcategories: [
      {
        name: 'CCTV',
        items: ['IP CCTV', '4K systems', 'NVR systems', 'Surveillance networks'],
      },
      {
        name: 'Access Control',
        items: ['Door access', 'Biometric systems', 'Keycard systems', 'Cloud systems'],
      },
      {
        name: 'Intruder Alarms',
        items: ['Grade 2 systems', 'Grade 3 systems', 'Perimeter protection', 'Integrated alarms'],
      },
      {
        name: 'Fire Systems',
        items: ['Fire alarms', 'Detection systems', 'Evacuation systems', 'Fire compliance systems'],
      },
      {
        name: 'Perimeter Security',
        items: ['Automatic gates', 'Barriers', 'Turnstiles', 'Vehicle access systems'],
      },
      {
        name: 'Intercom',
        items: ['Audio systems', 'Video systems', 'IP intercom', 'Multi-unit systems'],
      },
    ],
  },
  {
    id: '9',
    title: 'Data, Fibre & ICT Infrastructure',
    slug: 'ict',
    description:
      'Structured cabling, fibre optics, server rooms, network racks, switching systems and integrated ICT networks.',
    icon: 'Network',
    subcategories: [
      {
        name: 'Structured Cabling',
        items: ['Cat6', 'Cat6A', 'Data outlets', 'Patch panels'],
      },
      {
        name: 'Fibre Optics',
        items: ['Fibre cabling', 'Splicing', 'Termination', 'Backbone networks'],
      },
      {
        name: 'IT Infrastructure',
        items: ['Server rooms', 'Network racks', 'Switching systems', 'Integrated networks'],
      },
    ],
  },
  {
    id: '10',
    title: 'Windows, Doors & Facades',
    slug: 'windows-doors-facades',
    description:
      'Supply and installation of windows, doors and facade systems for residential and commercial buildings.',
    icon: 'Building2',
    seo: {
      title: 'Windows, Doors & Facade Installation UK',
      description:
        'Supply and installation of windows, doors and facade systems for residential and commercial buildings.',
    },
    subcategories: [
      {
        name: 'Windows',
        items: ['uPVC windows', 'Aluminium windows', 'Timber windows', 'Double glazing', 'Triple glazing'],
      },
      {
        name: 'Doors',
        items: ['External doors', 'Internal doors', 'Sliding doors', 'Bi-fold doors', 'Fire doors'],
      },
      {
        name: 'Facade Systems',
        items: ['Curtain walling', 'Cladding systems', 'Glass facades', 'External envelope systems'],
      },
    ],
  },
  {
    id: '11',
    title: 'External Works & Landscaping',
    slug: 'external',
    description:
      'Hard landscaping, external structures, drainage, surface water works, ground levelling and foundations.',
    icon: 'LayoutGrid',
    subcategories: [
      {
        name: 'Hard Landscaping',
        items: ['Driveways', 'Paving', 'Patios', 'Retaining walls'],
      },
      {
        name: 'External Structures',
        items: ['Fencing', 'Decking', 'Pergolas', 'Outbuildings'],
      },
      {
        name: 'Drainage',
        items: ['Surface water drainage', 'Ground levelling', 'Excavation', 'Foundations'],
      },
    ],
  },
  {
    id: '12',
    title: 'Smart Building & Automation',
    slug: 'smart',
    description:
      'Smart lighting, climate control, central systems, scene automation, security integration, BMS and remote monitoring.',
    icon: 'SlidersHorizontal',
    subcategories: [
      {
        name: 'Automation Systems',
        items: ['Smart lighting', 'Climate control', 'Central systems', 'Scene automation'],
      },
      {
        name: 'Integration',
        items: ['Security integration', 'BMS', 'Remote monitoring'],
      },
    ],
  },
  {
    id: '13',
    title: 'Maintenance & Aftercare',
    slug: 'maintenance',
    description:
      'Planned maintenance, reactive maintenance, system servicing, diagnostics, upgrades, support and emergency callouts.',
    icon: 'Building2',
    subcategories: [
      {
        name: 'Planned Preventative Maintenance',
        description:
          'Proactive maintenance planning designed to preserve asset condition, minimise risk, and optimise operational efficiency.',
        items: ['Maintenance schedules', 'Condition-led planning', 'Servicing coordination', 'Risk reduction'],
      },
      {
        name: 'Reactive Maintenance',
        description:
          'Responsive repair and maintenance services supporting residential, commercial, and mixed-use assets.',
        items: ['Repair response coordination', 'Fault reporting', 'Contractor attendance', 'Issue close-out'],
      },
      {
        name: 'Building Maintenance',
        items: ['System servicing', 'Compliance checks', 'Condition monitoring', 'Asset care planning'],
      },
      {
        name: 'Support Services',
        items: ['Fault diagnostics', 'System upgrades', 'Technical support', 'Emergency callouts'],
      },
    ],
  },
];

const developmentSubcategories = [
  {
    name: 'Site Acquisition & Appraisal',
    description:
      'Identification, assessment, and acquisition of development opportunities with a focus on long-term value creation, planning potential, and investment viability.',
    items: [
      'Off-market and market-led opportunity review',
      'Planning potential and development-risk assessment',
      'Acquisition due diligence and value strategy',
      'Exit planning, yield review and long-term asset positioning',
    ],
  },
  {
    name: 'Planning Strategy & Development Feasibility',
    description:
      'Comprehensive planning support, feasibility analysis, development optimisation, and project viability assessments for residential and commercial schemes.',
    items: [
      'Planning route, consultant briefing and authority coordination',
      'Massing, layout, use-class and density appraisal',
      'Budget, programme and risk-led feasibility reporting',
      'Development optimisation before capital commitment',
    ],
  },
  {
    name: 'Joint Venture Development',
    description:
      'Strategic partnerships delivering development opportunities through collaborative investment structures, shared expertise, and aligned project execution.',
    items: [
      'Landowner, investor and private-client joint venture structures',
      'Aligned acquisition, planning and delivery strategy',
      'Transparent scope, cost and programme governance',
      'Partner-led reporting from feasibility to handover',
    ],
  },
  {
    name: 'Private Portfolio Development',
    description:
      'Development and enhancement of privately held property portfolios through refurbishment, repositioning, expansion, and long-term asset growth strategies.',
    items: [
      'Portfolio review and asset-by-asset development planning',
      'Refurbishment, repositioning and change-of-use strategy',
      'Phased works across occupied or operational assets',
      'Capital improvement planning for long-term value growth',
    ],
  },
  {
    name: 'Residential Development',
    description:
      'Design and delivery of high-quality residential developments including private homes, apartment schemes, luxury refurbishments, and multi-unit projects.',
    items: [
      'Private homes, apartment schemes and multi-unit delivery',
      'Premium refurbishment, extension and conversion projects',
      'Design coordination, specification and finishes management',
      'Turnkey delivery from planning through completion',
    ],
  },
  {
    name: 'Commercial & Mixed-Use Development',
    description:
      'Integrated commercial and mixed-use developments designed to maximise functionality, investment performance, and long-term occupier value.',
    items: [
      'Commercial, residential and mixed-use development strategy',
      'Shell, core, fit-out and occupier interface planning',
      'Services, access, compliance and operational coordination',
      'Value-led delivery for investor and end-user outcomes',
    ],
  },
  {
    name: 'Value-Add Refurbishment Projects',
    description:
      'Strategic refurbishment and redevelopment projects focused on unlocking property potential, increasing asset value, and improving operational performance.',
    items: [
      'Asset repositioning through targeted refurbishment works',
      'Layout improvement, specification upgrade and services renewal',
      'Costed improvement plans with clear value objectives',
      'Delivery sequencing for live, vacant or phased properties',
    ],
  },
  {
    name: 'Turnkey Development Delivery',
    description:
      'Complete end-to-end development delivery from acquisition and planning through to construction, fit-out, commissioning, and final handover.',
    items: [
      'Acquisition, feasibility, planning and consultant coordination',
      'Procurement, construction, fit-out and commissioning management',
      'Single accountable route from concept to completion',
      'Handover, aftercare and long-term asset enhancement planning',
    ],
  },
  {
    name: 'Investment-Led Property Development',
    description:
      'Development solutions tailored for investors, private clients, and strategic partnerships with a focus on sustainable growth and long-term returns.',
    items: [
      'Investor-focused project strategy and value planning',
      'Development risk, cost and programme governance',
      'Private client, portfolio and partnership-led delivery',
      'Long-term return, resilience and asset performance focus',
    ],
  },
];

const asCategorySubcategory = (service: Service) => ({
  name: service.title,
  description: service.description,
  items: service.subcategories?.length
    ? service.subcategories.map((subcategory) => subcategory.name)
    : [service.description],
});

export const engineeringServices = propertyServices;

export const services: Service[] = [
  {
    id: 'property-development',
    title: 'Property Development',
    slug: 'property-development',
    description:
      'End-to-end property development solutions spanning acquisition, planning, investment strategy, design coordination, construction delivery, and long-term asset enhancement across residential, commercial, and mixed-use developments.',
    icon: 'Compass',
    subcategories: developmentSubcategories,
  },
  {
    id: 'construction',
    title: 'Construction',
    slug: 'construction',
    description:
      'Integrated construction delivery covering design and build, commercial refurbishment, basements, extensions, listed buildings, mixed-use schemes, new builds and residential refurbishment.',
    icon: 'HardHat',
    subcategories: constructionServices.map(asCategorySubcategory),
  },
  {
    id: 'property-services',
    title: 'Property Services',
    slug: 'property-services',
    description:
      'Multidisciplinary property services covering pre-construction, groundworks, structural works, interiors, MEP, electrical, security, data, smart systems, external works and aftercare.',
    icon: 'Building2',
    subcategories: propertyServices.map(asCategorySubcategory),
  },
];

export const seoPages = [
  'cctv-installation-st-albans',
  'access-control-systems-st-albans',
  'fire-alarm-installation',
  'fibre-optic-installation',
  'kitchen-installation-st-albans',
  'bathroom-installation-st-albans',
  'house-extension-builders',
  'drywall-plastering-services',
  'electrical-contractors-st-albans',
  'gate-automation',
  'loft-conversion-st-albans',
  'home-renovation-st-albans',
];
