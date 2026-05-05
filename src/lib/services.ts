import type { Service } from './types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Basement Construction',
    slug: 'basement-construction',
    description:
      'Converting or extending basements or building them from scratch is a specialist and unique form of construction. We have enormous experience from excavation and structural works to the final finishes. We build watertight, dry, warm, air and light-filled luxury basements with kitchens, pools, gyms or cinema rooms.',
    icon: 'ArrowDownToLine',
  },
  {
    id: '2',
    title: 'Commercial Refurbishment',
    slug: 'commercial-refurbishment',
    description:
      'As an experienced main contractor for commercial projects, our work includes retail, office fit-out, hotel and leisure refurbishment, construction and finishing works. Our dedicated commercial team provide structural works, CAT A and CAT B fit out, dilapidations works and light industrial projects.',
    icon: 'Building2',
  },
  {
    id: '3',
    title: 'Design & Build',
    slug: 'design-build',
    description:
      'Design & Build is an increasingly popular method of construction as it offers complete security on price and timeframe. Working with a client preferred Architect or one of our own, we offer a complete service where we as the principal contractor are the single point of responsibility from design to finish.',
    icon: 'Compass',
  },
  {
    id: '4',
    title: 'Extensions & Vertical Extensions',
    slug: 'extensions',
    description:
      'Extensions and vertical extensions breathe a new lease of life into buildings. As well as adding value and additional floor space, they give the opportunity to modernise the building and add new features.',
    icon: 'MoveVertical',
  },
  {
    id: '5',
    title: 'Listed Buildings',
    slug: 'listed-buildings',
    description:
      'Because of our considerable experience in renovating and refurbishing Grade I and Grade II Listed Buildings, we are regularly contracted to work on historic buildings.',
    icon: 'Landmark',
  },
  {
    id: '6',
    title: 'Mixed-Use Developments',
    slug: 'mixed-use',
    description:
      'As a prime main contractor in London, we construct many different types of mixed-use developments, delivering housing, retail, leisure and community facilities within one development.',
    icon: 'LayoutGrid',
  },
  {
    id: '7',
    title: 'New Design & Build',
    slug: 'new-build',
    description:
      'From single family homes to housing developments, we work on a wide range of new build projects for property developers and private clients.',
    icon: 'Home',
  },
  {
    id: '8',
    title: 'Residential Refurbishment',
    slug: 'residential-refurbishment',
    description:
      'We have extensive expertise in high-end house renovations and extensions, delivering complex structural works and premium finishes for prime residential properties.',
    icon: 'PaintBucket',
  },
  {
    id: '9',
    title: 'Student Accommodation',
    slug: 'student-accommodation',
    description:
      'We deliver high specification, high quality, comfortable and aesthetically pleasing purpose built student accommodation with a focus on safe, timely delivery.',
    icon: 'GraduationCap',
  },
];

export const engineeringServices: Service[] = [
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
        name: 'Building Maintenance',
        items: ['Planned maintenance', 'Reactive maintenance', 'System servicing', 'Compliance checks'],
      },
      {
        name: 'Support Services',
        items: ['Fault diagnostics', 'System upgrades', 'Technical support', 'Emergency callouts'],
      },
    ],
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
