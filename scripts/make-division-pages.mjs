// Writes the three division pages into dist/:
//   /property-development/   /construction/   /property-services/
// Run by hand after changing the wording below:  node scripts/make-division-pages.mjs
// The pages are plain HTML and are committed, like the rest of dist/.
// Shared styles: dist/assets/seuk-pages-<date>.css. The enquiry form on each page is
// handled by dist/assets/seuk-form-<date>.js and the guard in netlify/edge-functions.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://seukltd.com";
const CSS = "/assets/seuk-pages-20261120.css";
const FORM_JS = "/assets/seuk-form-20261120.js";
const POLISH_JS = "/assets/seuk-polish-20261120.js";
const data = JSON.parse(readFileSync(new URL("./division-data.json", import.meta.url), "utf8"));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// headings may mark the closing words for italics with *asterisks*
const head = (s) => esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
const plain = (s) => s.replace(/\*/g, "");

const NAV = [
  { href: "/", label: "Home" },
  { href: "/property-development/", label: "Development", slug: "property-development" },
  { href: "/construction/", label: "Construction", slug: "construction" },
  { href: "/property-services/", label: "Property Services", slug: "property-services" },
  { href: "/#projects", label: "Projects" },
];

const COMPANY = "Smart Environment Property Developments Ltd, registered in England and Wales, no. 10469032";
const OFFICE = "720 Centennial Court, Centennial Park, Elstree WD6 3SY";

const pages = [
  {
    slug: "property-development",
    name: "Property Development",
    title: "Property Development in London and the Home Counties | Smart Environment Group",
    description:
      "Smart Environment Group buys, plans and builds its own residential schemes in London and the Home Counties, and develops in joint venture with landowners and investors.",
    lead: "We buy, plan and build our own residential schemes in London and the Home Counties, and develop in joint venture with landowners and investors.",
    hero: {
      src: "/images/pages/development-prestige-house.webp",
      w: 1600,
      h: 860,
      alt: "Front of Prestige House in Catford, a brick apartment building with a zinc-clad top floor",
      caption: "Prestige House, Catford SE6",
    },
    buttons: [
      { href: "#enquiry", label: "Discuss a site" },
      { href: "#schemes", label: "See the schemes" },
    ],
    intro: {
      heading: "From the first appraisal to the *finished building*",
      paragraphs: [
        "We develop on our own account and with partners. We appraise the site, take it through planning and build it with our own construction team, so the people who priced the scheme are the people who deliver it.",
        "Recent schemes are new-build apartments and licensed HMOs. Each completed scheme was signed off by building control.",
      ],
    },
    services: [
      ["Site acquisition and appraisal", "Finding and assessing sites for planning potential, build cost and value."],
      ["Planning strategy and feasibility", "Planning route, massing, budget and programme tested before money is committed."],
      ["Joint venture development", "Partnerships with landowners, investors and private clients, with scope, cost and programme reported openly."],
      ["Private portfolio development", "Refurbishing, extending or repositioning buildings an owner already holds."],
      ["Residential development", "Apartment schemes, houses, HMOs and conversions, from planning to handover."],
      ["Commercial and mixed-use development", "Schemes that combine homes with commercial space."],
      ["Value-add refurbishment", "Targeted works that raise the value or performance of an existing building."],
      ["Turnkey development delivery", "One team from purchase to a completed, certified building."],
      ["Investment-led development", "Schemes shaped around yield, exit and long-term holding."],
    ],
    projectsId: "schemes",
    projectsHeading: "Our own *schemes*",
    projects: [
      {
        title: "Prestige House, Catford SE6",
        meta: "Nine new apartments, completed May 2022",
        text: "Nine apartments on the site of a former gas reduction facility. Part of the original building was demolished and part converted, and a new three-storey block on piled foundations was added around a shared garden.",
        facts: ["Five one-bedroom and four two-bedroom apartments", "Building control sign-off in May 2022", "10-year structural warranty"],
        link: { href: "/projects/prestige-house-catford/", label: "See all 30 photographs of Prestige House" },
        photos: [
          ["/images/pages/prestige-garden.webp", "Shared garden and rear of Prestige House"],
          ["/images/pages/prestige-living.webp", "Open-plan living room in a Prestige House apartment"],
        ],
      },
      {
        title: "Nine-bedroom HMO, Hampstead NW3",
        meta: "Conversion of a Victorian house, completed August 2024",
        text: "A Victorian house on Finchley Road converted into nine private suites, each with its own en-suite bathroom and kitchenette, with shared kitchens on the ground and top floors.",
        facts: ["Nine en-suite rooms with kitchenettes", "Two shared kitchens", "Building control final certificate, August 2024"],
        link: { href: "/projects/hmo-conversion-hampstead/", label: "See the Hampstead photographs" },
        photos: [
          ["/images/pages/hampstead-bedroom.webp", "Finished bedroom suite with its own shower room in the Hampstead HMO"],
          ["/images/pages/hampstead-rear.webp", "Rear of the converted Victorian house in Hampstead"],
        ],
      },
      {
        title: "Six-bedroom HMO, Acton W3",
        meta: "Conversion and refurbishment, March to October 2026",
        text: "A house converted and fully refurbished into a licensed six-bedroom HMO, with new fire doors, a designed and commissioned fire alarm with emergency lighting, and a new three-phase electrical supply.",
        facts: ["Licensed six-bedroom HMO", "FD30 fire doors, fire alarm and emergency lighting", "Building control final certificate, November 2026"],
        link: { href: "/projects/hmo-conversion-acton/", label: "See the Acton photographs" },
        photos: [
          ["/images/pages/acton-bedroom.webp", "Finished bedroom with doors to the garden in the Acton HMO"],
          ["/images/pages/acton-front-door.webp", "Restored front door with stained glass at the Acton HMO"],
        ],
      },
    ],
    projectsNote:
      'In pre-construction: a replacement four-bedroom house on a Green Belt site in St Albans. Planning permission was secured in April 2023 and design amendments were approved in December 2024. <a href="/#projects">All projects are on the home page</a>.',
    clients: {
      heading: "Who we *work with*",
      paragraphs: [
        "We work with landowners, investors and private clients in joint venture, and with owners who want a building they already hold refurbished, extended or repositioned.",
        "Scope, cost and programme are reported openly from feasibility to handover.",
      ],
    },
    standards: [
      ["Health and safety", "SSIP-recognised PQS Health and Safety Approved, valid to July 2027"],
      ["Building control", "Final certificate issued for each completed scheme on this page"],
      ["Warranty", "10-year structural warranty on Prestige House"],
      ["Electrical and gas", "NAPIT-registered electricians and Gas Safe registered engineers"],
      ["Insurance", "Certificates sent on request"],
      ["Company", COMPANY],
    ],
    faqHeading: "Development *questions*",
    enquiry: {
      heading: "Discuss a *site*",
      text: "Send the address, any drawings or planning history, and what you want to achieve. We reply within one business day.",
      formTitle: "Development enquiry",
      placeholder: "Site address, what is there now and what you have in mind",
    },
    related: [
      ["/services/property-development-london-home-counties/", "Property development in London and the Home Counties"],
      ["/services/residential-property-development-london/", "Residential property development"],
      ["/services/commercial-mixed-use-development-london/", "Commercial and mixed-use development"],
      ["/services/investment-led-property-development/", "Investment-led property development"],
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    title: "Construction Contractor in London and the Home Counties | Smart Environment Group",
    description:
      "Design and build, conversions, refurbishment, basements and rooftop extensions in London and the Home Counties, built by the team behind our own developments.",
    lead: "We build, convert and refurbish for developers, asset managers and private owners, using the same team that builds our own schemes.",
    hero: {
      src: "/images/pages/construction-metal-stud.webp",
      w: 1600,
      h: 900,
      alt: "Site team fixing metal stud partitions during the Mercia Lodge conversion in Coventry",
      caption: "Mercia Lodge, Coventry. Metal stud partitions going in.",
    },
    buttons: [
      { href: "#enquiry", label: "Send a project for pricing" },
      { href: "#projects", label: "See the projects" },
    ],
    intro: {
      heading: "New build, conversion and *refurbishment*",
      paragraphs: [
        "Much of our work is in buildings that are hard to work in: occupied blocks, tight sites, old structures and fixed deadlines. We coordinate design, structure, services and finishes, and see the job through to building control sign-off.",
        "We work under JCT contracts and design and build arrangements, as main contractor or principal contractor.",
      ],
    },
    services: [
      ["Basement construction", "Excavation, underpinning, waterproofing, drainage and fit-out."],
      ["Commercial refurbishment", "Offices, retail, hospitality and leisure, including structural alterations and fit-out."],
      ["Design and build", "Design, pricing, programme and construction under one managed route."],
      ["Extensions, vertical extensions and loft conversions", "New storeys and extensions, including work above occupied buildings."],
      ["Listed buildings", "Careful alteration and refurbishment of listed and sensitive buildings."],
      ["Mixed-use developments", "Homes and commercial space within one building project."],
      ["New build", "Houses and apartment blocks from groundworks to handover."],
      ["Residential refurbishment", "Layout changes, structural works, services, kitchens, bathrooms and finishes."],
      ["Student accommodation", "Conversion and fit-out of student rooms, with fire safety works and building services."],
    ],
    projectsId: "projects",
    projectsHeading: "Selected *projects*",
    projects: [
      {
        title: "Four rooftop penthouses, Cricklewood NW2",
        meta: "JCT contract, completed 2017",
        text: "Four new penthouse flats built on the roof of a 1930s mansion block of 24 flats, with every resident in occupation throughout. Two new lifts were installed in the altered original shafts and the staircases were extended to the new floor.",
        facts: [
          "Built above 24 occupied flats",
          "Two new lifts and extended staircases",
          "Communal areas, facade and electrics refurbished under a separate Section 20 programme",
        ],
        link: { href: "/projects/rooftop-penthouses-cricklewood/", label: "See the Cricklewood photographs" },
        photos: [
          ["/images/pages/cricklewood-exterior.webp", "Mansion block in Cricklewood with the new penthouse storey on the roof"],
          ["/images/pages/cricklewood-living.webp", "Kitchen and living room in a Cricklewood penthouse"],
        ],
      },
      {
        title: "Mercia Lodge student rooms, Coventry",
        meta: "Design and build, completed August 2016",
        text: "The unused second floor of a former hotel in Coventry city centre converted into 19 self-contained student rooms, taking the building to 169 rooms, to a fixed deadline for student arrivals.",
        facts: [
          "21 roof lights cut through the concrete roof on new steelwork",
          "New hot and cold water and drainage to every room",
          "Building control final certificate, August 2016",
        ],
        link: { href: "/projects/student-accommodation-coventry/", label: "See the Coventry photographs" },
        photos: [
          ["/images/pages/coventry-studio.webp", "Finished student room at Mercia Lodge"],
          ["/images/pages/coventry-corridor.webp", "New corridor at Mercia Lodge"],
        ],
      },
      {
        title: "Basement conversion, Kensington",
        meta: "Basement construction and fit-out",
        text: "A basement converted into a cinema room, gym and wine cellar, with full waterproofing and natural light brought below ground.",
        facts: ["Waterproofed below-ground structure", "Cinema room, gym and wine cellar"],
        link: { href: "/#projects", label: "See it with the other projects on the home page" },
        photos: [
          ["/images/basement-after-modal-smooth.jpeg", "Finished basement living space in Kensington"],
          ["/images/basement-before-modal-smooth.jpeg", "The Kensington basement during construction"],
        ],
      },
    ],
    projectsNote:
      'Also on the home page: a double storey extension in Elstree, a mixed-use building in Bow and a commercial conversion in Mayfair. <a href="/#projects">See all projects</a>.',
    clients: {
      heading: "Who we *build for*",
      paragraphs: [
        "Clients include General Projects and MHA London, along with developers, asset managers, managing agents and private owners.",
        "We also build every scheme for our own development division.",
      ],
    },
    quote: {
      text: "Our work is always relatively 'complex' in that we try to optimise the space available so we don't leave a lot of room for error. Some builders love to work with us because the results are always photogenic and they are proud of the product.",
      by: "Michael Brady Ltd, architecture partner",
    },
    standards: [
      ["Health and safety", "SSIP-recognised PQS Health and Safety Approved, valid to July 2027"],
      ["Contracts", "JCT contracts and design and build, as main contractor or principal contractor"],
      ["Building control", "Coordination with building control, engineers and the design team through to the final certificate"],
      ["Electrical and gas", "NAPIT-registered electricians and Gas Safe registered engineers"],
      ["Insurance", "Certificates sent on request"],
      ["Company", COMPANY],
    ],
    standardsNote: "Some of the projects shown were delivered by the current directors and site team through earlier Smart Environment companies.",
    faqHeading: "Construction *questions*",
    enquiry: {
      heading: "Send a project for *pricing*",
      text: "Tell us where the building is, what the works are and when you need them done. If you have drawings or a schedule of works, say so and we will ask for them. We reply within one business day.",
      formTitle: "Construction enquiry",
      placeholder: "Address, scope of works and target dates",
    },
    related: [
      ["/services/design-build-contractor-london/", "Design and build contractor"],
      ["/services/basement-construction-london/", "Basement construction"],
      ["/services/house-extensions-loft-conversions-london/", "Extensions, vertical extensions and loft conversions"],
      ["/services/commercial-refurbishment-london/", "Commercial refurbishment and fit-out"],
      ["/services/listed-building-refurbishment-london/", "Listed building refurbishment"],
      ["/services/student-accommodation-hmo-conversion/", "Student accommodation and HMO conversion"],
    ],
  },
  {
    slug: "property-services",
    name: "Property Services",
    plain: true,
    title: "Property Repairs and Maintenance for Landlords in London | Smart Environment Group",
    description:
      "Responsive repairs, small works and planned maintenance for housing associations, managing agents and landlords in London and the Home Counties. 463 repair jobs completed since 2023, rated 4.5 out of 5 by clients.",
    lead: "Responsive repairs, small works and planned maintenance for housing associations, managing agents and landlords in London and the Home Counties.",
    buttons: [
      { href: "#enquiry", label: "Request a quote" },
      { href: "tel:+442081634044", label: "Call 020 8163 4044" },
    ],
    record: {
      heading: "The record, 2023 to 2026",
      rows: [
        ["Repair jobs completed and paid", "463", "13 January 2023 to 17 September 2026"],
        ["Landlords", "7", "Housing associations and housing co-operatives"],
        ["Overall client rating", "4.5 / 5", "156 client reviews: 77 five-star, 75 four-star, 4 three-star, none lower"],
        ["Speed", "4.8 / 5", ""],
        ["Communication", "4.8 / 5", ""],
        ["Quality", "4.6 / 5", ""],
        ["Value for money", "4.5 / 5", ""],
      ],
      note: "Source: job and review records from the Plentific repairs platform. The jobs were carried out by our team through the Smart Environment Construction Ltd contractor account. Evidence can be provided to procurement teams on request.",
    },
    landlords: {
      heading: "Landlords we have worked for",
      names: ["Notting Hill Genesis", "L&Q", "Peabody", "CDS Co-operatives", "Sovereign Network Group", "Wandle", "Home Group"],
      note: "Repairs for these landlords were instructed through Plentific.",
    },
    trades: {
      heading: "What the repairs covered",
      items: [
        "UPVC and timber windows and doors",
        "Glazing",
        "Door hanging and locks",
        "Carpentry",
        "Plastering and plaster mouldings",
        "Decoration",
        "Floor and wall tiling",
        "Vinyl, laminate and floorboard repairs",
        "Plumbing and leak repairs",
        "Roofing repairs",
        "Fencing and gates",
        "Pathways",
        "Kitchens",
        "Shower enclosures",
        "Loft insulation",
        "Multi-trade disrepair jobs",
      ],
    },
    standardsHeading: "Compliance and documents",
    standards: [
      ["Health and safety accreditation", "SSIP-recognised PQS Health and Safety Approved, valid to July 2027"],
      ["Health and safety policy", "Available on request"],
      ["Training", "Asbestos awareness, working at height and manual handling certificates, 2026"],
      ["Electrical and gas work", "NAPIT-registered electricians and Gas Safe registered engineers"],
      ["Insurance", "Certificates sent on request with a quotation or tender return"],
      ["Quotations", "Scope, exclusions, assumptions, price and programme confirmed in writing before work starts"],
      ["Company", `${COMPANY}. Registered office: ${OFFICE}`],
    ],
    coverage: {
      heading: "Where we work",
      text: "London and the Home Counties, from our office in Elstree, Hertfordshire. Work outside that area is reviewed case by case.",
    },
    reviews: {
      heading: "What clients wrote",
      note: "Client reviews left on Plentific.",
      items: [
        ["Very good and reliable contractor that I have used on many occasions", "Notting Hill Genesis, May 2023"],
        ["Good communication, good workmanship and very accommodating", "Notting Hill Genesis, April 2023"],
        ["Smart Environment were efficient, easy to communicate and got the job done to a good standard.", "Notting Hill Genesis, November 2023"],
        ["Resident was happy with the repair", "L&Q, October 2023"],
      ],
    },
    faqHeading: "Questions",
    enquiry: {
      heading: "Request a quote",
      text: "Send the property address, a description of the repair or a schedule of works, and any access details. We reply within one business day.",
      formTitle: "Property services enquiry",
      placeholder: "Property address, what needs doing and access details",
    },
    related: [
      ["/services/planned-reactive-maintenance/", "Planned and reactive maintenance"],
      ["/services/property-services-london-home-counties/", "Property services in London and the Home Counties"],
      ["/construction/", "Larger works: Construction"],
    ],
  },
];

/* ---------- shared pieces ---------- */
const brand = `<a class="brand" href="/" aria-label="Smart Environment Group home"><img src="/branding/cropped-final-logo-golden-400.png" alt="" width="52" height="52"><span><b>Smart</b><b>Environment</b></span></a>`;

function header(p) {
  const links = NAV.map((n) => `<a href="${n.href}"${n.slug === p.slug ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="hd${p.plain ? " hd--solid" : ""}" data-hd>
  <div class="hd-in">
    ${brand}
    <nav class="nav" aria-label="Main">${links}<a class="nav-cta" href="#enquiry">Get in touch</a></nav>
    <details class="menu"><summary aria-label="Menu"><i></i><i></i><i></i></summary><nav class="menu-panel" aria-label="Main, small screens">${links}<a href="#enquiry">Get in touch</a></nav></details>
  </div>
</header>`;
}

function hero(p) {
  const crumb = `<p class="crumb rise"><a href="/">Smart Environment Group</a> / ${esc(p.name)}</p>`;
  const buttons = (a, b) =>
    `<div class="btns rise"><a class="btn ${a}" href="${p.buttons[0].href}">${esc(p.buttons[0].label)}</a><a class="btn ${b}" href="${p.buttons[1].href}">${esc(p.buttons[1].label)}</a></div>`;
  if (p.plain) {
    return `<section class="phead"><div class="wrap">${crumb}<h1 class="rise">${esc(p.name)}</h1><p class="lead rise">${esc(p.lead)}</p>${buttons("btn--ink", "btn--line")}</div></section>`;
  }
  return `<section class="hero"><img src="${p.hero.src}" alt="${esc(p.hero.alt)}" width="${p.hero.w}" height="${p.hero.h}" fetchpriority="high" decoding="async"><div class="wrap">${crumb}<h1 class="rise">${esc(p.name)}</h1><p class="lead rise">${esc(p.lead)}</p>${buttons("btn--solid", "btn--ghost")}</div><p class="hero-cap">${esc(p.hero.caption)}</p></section>`;
}

const dl = (rows) => `<dl class="dl">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;

function introSection(p) {
  return `<section class="sec sec--paper"><div class="wrap split">
  <div class="stick prose"><h2 data-reveal-me>${head(p.intro.heading)}</h2>${p.intro.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  <ul class="rule-list">${p.services.map(([n, d]) => `<li><b>${esc(n)}</b><span>${esc(d)}</span></li>`).join("")}</ul>
</div></section>`;
}

function projectsSection(p) {
  const items = p.projects
    .map(
      (j) => `<article class="proj">
    <div class="proj-ph">${j.photos.map(([src, alt]) => `<div class="ph" data-reveal-me><img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" width="800" height="600"></div>`).join("")}</div>
    <div><h3>${esc(j.title)}</h3><p class="meta">${esc(j.meta)}</p><p class="txt">${esc(j.text)}</p><ul class="facts">${j.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul><a class="more" href="${j.link.href}">${esc(j.link.label)}</a></div>
  </article>`,
    )
    .join("\n  ");
  return `<section class="sec" id="${p.projectsId}"><div class="wrap">
  <h2 data-reveal-me>${head(p.projectsHeading)}</h2>
  ${items}
  <p class="aside-note">${p.projectsNote}</p>
</div></section>`;
}

function clientsSection(p) {
  const quote = p.quote
    ? `<section class="sec sec--tight"><div class="wrap"><blockquote class="quote" data-reveal-me><p>&ldquo;${esc(p.quote.text)}&rdquo;</p><footer>${esc(p.quote.by)}</footer></blockquote></div></section>`
    : "";
  return `<section class="sec sec--paper"><div class="wrap split split--even">
  <div class="prose"><h2 data-reveal-me>${head(p.clients.heading)}</h2>${p.clients.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  <div><h2 data-reveal-me>${head("Standards and *documents*")}</h2><div style="height:1.75rem"></div>${dl(p.standards)}${p.standardsNote ? `<p class="note">${esc(p.standardsNote)}</p>` : ""}</div>
</div></section>${quote}`;
}

function serviceBody(p) {
  const r = p.record;
  return `<section class="sec" id="record"><div class="wrap split">
  <div class="stick prose"><h2>${esc(r.heading)}</h2><p class="note">${esc(r.note)}</p></div>
  <table class="record"><tbody>${r.rows.map(([k, v, d]) => `<tr><th scope="row">${esc(k)}</th><td class="v">${esc(v)}</td><td class="d">${esc(d)}</td></tr>`).join("")}</tbody></table>
</div></section>
<section class="sec sec--paper"><div class="wrap split">
  <div class="stick prose"><h2>${esc(p.landlords.heading)}</h2><p class="note">${esc(p.landlords.note)}</p></div>
  <ul class="cols cols--big">${p.landlords.names.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="stick prose"><h2>${esc(p.trades.heading)}</h2></div>
  <ul class="cols">${p.trades.items.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
</div></section>
<section class="sec sec--paper" id="compliance"><div class="wrap split">
  <div class="stick prose"><h2>${esc(p.standardsHeading)}</h2></div>
  <div>${dl(p.standards)}</div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="stick prose"><h2>${esc(p.reviews.heading)}</h2><p class="note">${esc(p.reviews.note)}</p></div>
  <ul class="quotes">${p.reviews.items.map(([q, by]) => `<li><q>${esc(q)}</q><cite>${esc(by)}</cite></li>`).join("")}</ul>
</div></section>
<section class="sec sec--paper sec--tight"><div class="wrap split">
  <div class="prose"><h2>${esc(p.coverage.heading)}</h2></div>
  <div class="prose"><p style="margin-top:0;max-width:40rem">${esc(p.coverage.text)}</p></div>
</div></section>`;
}

function faqSection(p) {
  const faqs = data.faqs[p.slug];
  return `<section class="sec" id="questions"><div class="wrap">
  <h2${p.plain ? "" : " data-reveal-me"}>${head(p.faqHeading)}</h2>
  <div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  <p class="note" style="margin-top:2rem">In more detail: ${p.related.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join(", ")}.</p>
</div></section>`;
}

function enquirySection(p) {
  const e = p.enquiry;
  return `<section class="sec sec--paper" id="enquiry"><div class="wrap enq">
  <div class="prose">
    <h2${p.plain ? "" : " data-reveal-me"}>${head(e.heading)}</h2>
    <p>${esc(e.text)}</p>
    <ul class="lines">
      <li><span>Call</span><a href="tel:+442081634044">020 8163 4044</a></li>
      <li><span>Email</span><a href="mailto:info@seukltd.com">info@seukltd.com</a></li>
      <li><span>Office</span><div>${esc(OFFICE)}</div></li>
      <li><span>Hours</span><div>Monday to Friday, 8:00 am to 6:00 pm</div></li>
    </ul>
  </div>
  <div id="contact-form" class="form-card">
    <h3>${esc(e.formTitle)}</h3>
    <form name="website-enquiry" method="post" action="/__forms.html" data-division="${p.slug}" novalidate>
      <p class="hp" aria-hidden="true"><label>Leave this field empty <input type="text" name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="f"><label for="f-name">Full name</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="Your name"></div>
      <div class="f2">
        <div class="f"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="Email address"></div>
        <div class="f"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Phone number"></div>
      </div>
      <div class="f"><label for="f-message">Message</label><textarea id="f-message" name="message" rows="5" placeholder="${esc(e.placeholder)}"></textarea></div>
      <div id="seuk-human"><label for="human-check">Quick anti-spam check: what is 4 + 3?</label><input id="human-check" name="human-check" type="text" inputmode="numeric" autocomplete="off" placeholder="Your answer"><small>This quick check helps stop automated spam.</small></div>
      <button type="submit">Send enquiry</button>
      <p class="privacy">We use these details only to reply to your enquiry.</p>
      <noscript><p class="privacy">This form needs JavaScript. You can call 020 8163 4044 or email info@seukltd.com instead.</p></noscript>
    </form>
  </div>
</div></section>`;
}

function footer() {
  return `<footer class="ft"><div class="wrap">
  <div class="ft-grid">
    <div>${brand}<p>Smart Environment Group develops, builds and maintains property across London and the Home Counties.</p></div>
    <div><h2>Divisions</h2><ul><li><a href="/property-development/">Property Development</a></li><li><a href="/construction/">Construction</a></li><li><a href="/property-services/">Property Services</a></li><li><a href="/#projects">Projects</a></li><li><a href="/site-map/">Site map</a></li></ul></div>
    <div><h2>Contact</h2><ul><li><a href="tel:+442081634044">020 8163 4044</a></li><li><a href="mailto:info@seukltd.com">info@seukltd.com</a></li><li>${esc(OFFICE)}</li></ul></div>
  </div>
  <p class="ft-legal">&copy; 2026 Smart Environment Group. Smart Environment Property Developments Ltd. Registered in England &amp; Wales, company no. 10469032. Registered office: ${esc(OFFICE)}.</p>
</div></footer>
<a class="wa" href="https://wa.me/447473504040?text=Hello%20Smart%20Environment%20Group%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" aria-label="Message Smart Environment Group on WhatsApp"><svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor"><path d="${data.whatsappIcon}"/></svg></a>
<div class="mbar"><a href="tel:+442081634044">Call</a><a href="#enquiry">Get in touch</a></div>`;
}

function jsonLd(p) {
  const url = `${SITE}/${p.slug}/`;
  const image = p.hero ? SITE + p.hero.src : `${SITE}/images/og-smart-environment-prestige-house.jpg`;
  const offered = p.plain ? p.trades.items : p.services.map(([n]) => n);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: p.title,
        description: p.description,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${url}#service` },
        primaryImageOfPage: { "@type": "ImageObject", url: image },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: p.name, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: p.name,
        serviceType: p.name,
        description: p.description,
        url,
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "London" },
          { "@type": "AdministrativeArea", name: "Home Counties" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${p.name} services`,
          itemListElement: offered.map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: data.faqs[p.slug].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

function page(p) {
  const url = `${SITE}/${p.slug}/`;
  const image = p.hero ? SITE + p.hero.src : `${SITE}/images/og-smart-environment-prestige-house.jpg`;
  const body = p.plain ? serviceBody(p) : `${introSection(p)}\n${projectsSection(p)}\n${clientsSection(p)}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<!--SEUK_FORM_CONFIG-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/branding/cropped-final-logo-golden-400.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Smart Environment Group"><meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(plain(p.title))}"><meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#15171b">
${p.hero ? `<link rel="preload" as="image" href="${p.hero.src}" fetchpriority="high">\n` : ""}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${CSS}">
<script type="application/ld+json">${JSON.stringify(jsonLd(p)).replace(/</g, "\\u003c")}</script>
<script defer src="${FORM_JS}"></script>
<script defer src="${POLISH_JS}"></script>
</head>
<body>
${header(p)}
<main id="main">
${hero(p)}
${body}
${faqSection(p)}
${enquirySection(p)}
</main>
${footer()}
</body>
</html>
`;
}

for (const p of pages) {
  mkdirSync(`dist/${p.slug}`, { recursive: true });
  const html = page(p);
  if (html.includes("\u2014")) throw new Error(`${p.slug}: remove the long dash`);
  writeFileSync(`dist/${p.slug}/index.html`, html);
  const words = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  console.log(`dist/${p.slug}/index.html  ${html.length} bytes, about ${words} words`);
}
