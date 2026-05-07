import fs from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://seukltd.com';
const today = new Date().toISOString().slice(0, 10);

const servicePages = [
  {
    slug: 'property-development-london-home-counties',
    title: 'Property Development London & Home Counties',
    h1: 'Property Development in London & the Home Counties',
    category: 'Development',
    description:
      'Smart Environment Group delivers property development services across London and the Home Counties, including site acquisition, development appraisal, planning strategy, joint ventures, residential schemes, commercial and mixed-use development, value-add refurbishment and turnkey delivery.',
    keywords: ['property development London', 'property development Home Counties', 'residential development London', 'commercial development London', 'mixed-use development London'],
    bullets: [
      'Site acquisition, appraisal and development feasibility',
      'Planning strategy, consultant coordination and value optimisation',
      'Residential, commercial and mixed-use development delivery',
      'Joint venture, private portfolio and investment-led development',
    ],
  },
  {
    slug: 'residential-property-development-london',
    title: 'Residential Property Development London',
    h1: 'Residential Property Development',
    category: 'Development',
    description:
      'High-spec residential property development, apartment schemes, urban housing, private homes, refurbishments and multi-unit residential projects delivered with modern performance, sustainability and long-term value in mind.',
    keywords: ['residential development London', 'apartment development London', 'urban housing development', 'private residential development', 'multi-unit residential development'],
    bullets: [
      'New-build homes, apartments and urban residential schemes',
      'High-spec refurbishments, conversions and extensions',
      'Energy-efficient systems, underfloor heating and solar integration',
      'Turnkey delivery from feasibility through completion',
    ],
  },
  {
    slug: 'commercial-mixed-use-development-london',
    title: 'Commercial & Mixed-Use Development London',
    h1: 'Commercial & Mixed-Use Development',
    category: 'Development',
    description:
      'Integrated commercial and mixed-use development support for residential, retail, leisure, office and community spaces, coordinating planning, construction, services, occupier interfaces and long-term asset performance.',
    keywords: ['commercial development London', 'mixed-use development London', 'commercial property development', 'retail development London', 'office development London'],
    bullets: [
      'Commercial, residential and mixed-use project planning',
      'Shell, core, fit-out and occupier interface coordination',
      'Services, access, compliance and operational strategy',
      'Value-led delivery for investors, owners and end users',
    ],
  },
  {
    slug: 'investment-led-property-development',
    title: 'Investment-Led Property Development',
    h1: 'Investment-Led Property Development',
    category: 'Development',
    description:
      'Development solutions for investors, private clients, landowners and strategic partnerships, focused on sustainable growth, risk control, programme clarity and long-term property returns.',
    keywords: ['investment property development', 'joint venture development', 'private portfolio development', 'property development investors', 'value-add property refurbishment'],
    bullets: [
      'Investment strategy, value planning and development risk review',
      'Joint venture structures and private portfolio enhancement',
      'Cost, programme and delivery governance',
      'Long-term asset enhancement and return-focused delivery',
    ],
  },
  {
    slug: 'basement-construction-london',
    title: 'Basement Construction London & Home Counties',
    h1: 'Basement Construction in London & the Home Counties',
    category: 'Construction',
    description:
      'Smart Environment Group delivers basement construction, excavation, structural works, waterproofing, drainage, MEP coordination and high-spec fit-out across London and the Home Counties.',
    keywords: ['basement construction London', 'basement contractors London', 'basement excavation', 'basement waterproofing', 'London basement builders'],
    bullets: [
      'Excavation, underpinning and temporary works',
      'Retaining walls, concrete works and structural slabs',
      'Waterproofing, drainage and sump systems',
      'Internal fit-out, MEP, finishes and handover',
    ],
  },
  {
    slug: 'house-extensions-loft-conversions-london',
    title: 'House Extensions & Loft Conversions London',
    h1: 'House Extensions, Vertical Extensions & Loft Conversions',
    category: 'Construction',
    description:
      'Design and construction of house extensions, loft conversions, vertical extensions, dormers, roof works and internal refurbishment across London and the Home Counties.',
    keywords: ['house extensions London', 'loft conversions London', 'vertical extensions London', 'roof extensions London', 'extension builders Home Counties'],
    bullets: [
      'Single-storey, double-storey and vertical extensions',
      'Loft conversions, dormers and roof works',
      'Structural alterations, glazing and envelope works',
      'Kitchens, bathrooms, flooring, joinery and decoration',
    ],
  },
  {
    slug: 'commercial-refurbishment-london',
    title: 'Commercial Refurbishment London',
    h1: 'Commercial Refurbishment & Fit-Out',
    category: 'Construction',
    description:
      'Commercial refurbishment and fit-out for offices, retail, hospitality, leisure and mixed commercial buildings across London and the Home Counties.',
    keywords: ['commercial refurbishment London', 'office refurbishment London', 'commercial fit out London', 'retail refurbishment', 'hospitality refurbishment'],
    bullets: [
      'Office, retail, leisure and hospitality refurbishment',
      'Strip-out, partitions, ceilings, flooring and finishes',
      'Structural alterations and compliance works',
      'MEP, data, lighting, commissioning and handover',
    ],
  },
  {
    slug: 'design-build-contractor-london',
    title: 'Design & Build Contractor London',
    h1: 'Design & Build Contractor for London Projects',
    category: 'Construction',
    description:
      'Managed design and build delivery from feasibility and consultant coordination through pricing, procurement, construction, finishes and handover.',
    keywords: ['design and build London', 'design build contractor London', 'construction project management London', 'turnkey construction London'],
    bullets: [
      'Feasibility, brief development and consultant coordination',
      'Budgeting, procurement and programme control',
      'Construction delivery under one managed route',
      'Final finishes, commissioning and handover',
    ],
  },
  {
    slug: 'listed-building-refurbishment-london',
    title: 'Listed Building Refurbishment London',
    h1: 'Listed Building Refurbishment & Sensitive Works',
    category: 'Construction',
    description:
      'Careful refurbishment and alteration of listed and sensitive buildings, coordinating protection, sequencing, structural works, services upgrades and heritage-conscious finishes.',
    keywords: ['listed building refurbishment London', 'heritage building contractor', 'sensitive building refurbishment', 'listed building alterations'],
    bullets: [
      'Protection, sequencing and heritage-conscious delivery',
      'Structural repairs, alterations and specialist finishes',
      'Services upgrades with careful routing and coordination',
      'Consultant, approval and compliance coordination',
    ],
  },
  {
    slug: 'student-accommodation-hmo-conversion',
    title: 'Student Accommodation & HMO Conversion',
    h1: 'Student Accommodation & HMO Conversion',
    category: 'Construction',
    description:
      'Student accommodation refurbishment, HMO conversion and multi-occupancy fit-out, including compliance, fire safety upgrades, en-suites, shared kitchens, services and handover-ready finishes.',
    keywords: ['student accommodation contractor', 'HMO conversion contractor', 'student accommodation refurbishment', 'HMO refurbishment', 'multi-occupancy conversion'],
    bullets: [
      'Bedroom, en-suite and shared kitchen layouts',
      'Fire safety, compartmentation and compliance coordination',
      'Mechanical, electrical, data and access systems',
      'Programme-led handover for landlords and operators',
    ],
  },
  {
    slug: 'property-services-london-home-counties',
    title: 'Property Services London & Home Counties',
    h1: 'Property Services in London & the Home Counties',
    category: 'Property Services',
    description:
      'Multidisciplinary property services covering pre-construction, groundworks, structural works, interiors, MEP, electrical, security, data, smart systems, external works, maintenance and aftercare.',
    keywords: ['property services London', 'property services Home Counties', 'building services London', 'property maintenance London', 'asset services London'],
    bullets: [
      'Pre-construction, design coordination and feasibility support',
      'Groundworks, structural works, interiors and fit-out',
      'MEP, electrical, HVAC, plumbing, security and data',
      'Smart building systems, maintenance and aftercare',
    ],
  },
  {
    slug: 'mep-electrical-hvac-contractor-london',
    title: 'MEP, Electrical & HVAC Contractor London',
    h1: 'MEP, Electrical, HVAC & Plumbing Services',
    category: 'Property Services',
    description:
      'Integrated property services for mechanical, electrical, HVAC, plumbing, fire, security, data and smart building systems across London and the Home Counties.',
    keywords: ['MEP contractor London', 'electrical contractor London', 'HVAC contractor London', 'plumbing contractor London', 'smart building systems London'],
    bullets: [
      'Mechanical, electrical, plumbing and HVAC coordination',
      'Lighting, power, containment, data and fibre routes',
      'Fire alarms, access control, CCTV and ELV systems',
      'Smart building automation, testing and commissioning',
    ],
  },
  {
    slug: 'planned-reactive-maintenance',
    title: 'Planned & Reactive Maintenance',
    h1: 'Planned Preventative & Reactive Maintenance',
    category: 'Property Services',
    description:
      'Planned preventative maintenance, reactive maintenance, system servicing, diagnostics, upgrades, technical support and emergency callout coordination for residential, commercial and mixed-use assets.',
    keywords: ['planned preventative maintenance', 'reactive maintenance London', 'property maintenance Home Counties', 'building maintenance London', 'aftercare property services'],
    bullets: [
      'Maintenance schedules and condition-led planning',
      'Responsive repair coordination and issue close-out',
      'System servicing, compliance checks and asset care',
      'Fault diagnostics, upgrades and technical support',
    ],
  },
  {
    slug: 'smart-building-automation-london',
    title: 'Smart Building Automation London',
    h1: 'Smart Building & Automation Systems',
    category: 'Property Services',
    description:
      'Smart lighting, climate control, scene automation, BMS, security integration, remote monitoring, data infrastructure and connected building systems for modern residential and commercial assets.',
    keywords: ['smart building automation London', 'BMS contractor London', 'smart home installation London', 'building automation systems', 'smart controls contractor'],
    bullets: [
      'Smart lighting, climate and scene automation',
      'BMS, remote monitoring and central control systems',
      'Security, access, data and fibre integration',
      'Testing, commissioning and aftercare support',
    ],
  },
];

const locationPages = [
  { slug: 'construction-company-london', title: 'Development, Construction & Property Services London', h1: 'Development, Construction & Property Services in London', location: 'London' },
  { slug: 'construction-company-home-counties', title: 'Development, Construction & Property Services Home Counties', h1: 'Development, Construction & Property Services in the Home Counties', location: 'the Home Counties' },
  { slug: 'property-services-elstree', title: 'Development, Construction & Property Services Elstree', h1: 'Development, Construction & Property Services in Elstree', location: 'Elstree' },
  { slug: 'property-services-st-albans', title: 'Development, Construction & Property Services St Albans', h1: 'Development, Construction & Property Services in St Albans', location: 'St Albans' },
];

function escapeHtml(value) {
  return value.replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function layout({ title, description, canonical, h1, category, intro, keywords, bullets, schema, relatedLinks }) {
  const keywordText = keywords?.length ? `<p class="keywords">${keywords.map(escapeHtml).join(' | ')}</p>` : '';
  const relatedJson = relatedLinks.map((link, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: { '@id': `${siteUrl}${link.href}`, name: link.label },
  }));
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      schema,
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: `${title} | Smart Environment Group`,
        description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${canonical}#service` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/branding/final-logo-golden-wide-transparent.png`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: category || 'Services', item: canonical },
        ],
      },
      relatedJson.length
        ? {
            '@type': 'ItemList',
            '@id': `${canonical}#related-services`,
            name: 'Related Smart Environment services',
            itemListElement: relatedJson,
          }
        : undefined,
    ].filter(Boolean),
  };

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | Smart Environment Group</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/branding/cropped-final-logo-golden-400.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Smart Environment Group" />
  <meta property="og:title" content="${escapeHtml(title)} | Smart Environment Group" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}/branding/final-logo-golden-wide-transparent.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)} | Smart Environment Group" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${siteUrl}/branding/final-logo-golden-wide-transparent.png" />
  <script type="application/ld+json">${JSON.stringify(pageSchema)}</script>
  <style>
    body{margin:0;font-family:Inter,Arial,sans-serif;background:#f8fafc;color:#071024;line-height:1.65}header{background:#020426;color:white;padding:18px 24px}.brand{font-weight:800;letter-spacing:.12em;text-transform:uppercase}main{max-width:1040px;margin:0 auto;padding:48px 24px}.eyebrow,.keywords{color:#b88400;font-weight:800;text-transform:uppercase;letter-spacing:.16em;font-size:.78rem}.keywords{font-size:.72rem;line-height:1.8}h1{font-size:clamp(2.25rem,5vw,4.6rem);line-height:1.02;margin:18px 0 20px}.lead{font-size:1.16rem;max-width:820px;color:#31415d}.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin:32px 0}.card{background:#f3ead2;border:1px solid #ded2b9;border-radius:10px;padding:20px;color:#172033}.cta{display:inline-block;background:#d4a017;color:#071024;text-decoration:none;font-weight:800;padding:14px 20px;border-radius:10px}.links{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.links a{background:white;border:1px solid #ded2b9;border-radius:999px;padding:8px 12px;text-decoration:none;color:#7a5805}footer{border-top:1px solid #ded2b9;margin-top:48px;padding-top:20px;color:#46556e;font-size:.9rem}
  </style>
</head>
<body>
  <header><div class="brand">Smart Environment Group</div></header>
  <main>
    <p class="eyebrow">${escapeHtml(category || 'Smart Environment')}</p>
    <h1>${escapeHtml(h1)}</h1>
    <p class="lead">${escapeHtml(intro)}</p>
    ${keywordText}
    <div class="grid">${bullets.map((item) => `<div class="card">${escapeHtml(item)}</div>`).join('')}</div>
    <a class="cta" href="/#contact-form">Discuss your property project</a>
    <div class="links">${relatedLinks.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join('')}</div>
    <footer>Smart Environment Group, also searched as Smart Environment and SEUK Ltd. 720 Centennial Court, Centennial Park, Elstree WD6 3SY. Call +44 (0) 172 7270 713.</footer>
  </main>
</body>
</html>`;
}

async function writePage(filePath, html) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html);
}

const serviceLinks = servicePages.map((service) => ({ href: `/services/${service.slug}/`, label: service.title }));
const locationLinks = locationPages.map((location) => ({ href: `/locations/${location.slug}/`, label: location.title }));
const urls = [`${siteUrl}/`];

for (const service of servicePages) {
  const canonical = `${siteUrl}/services/${service.slug}/`;
  urls.push(canonical);
  const schema = {
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: service.title,
    serviceType: service.category,
    description: service.description,
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: ['London', 'Home Counties'],
    audience: [
      { '@type': 'Audience', audienceType: 'Private clients' },
      { '@type': 'Audience', audienceType: 'Developers' },
      { '@type': 'Audience', audienceType: 'Investors' },
      { '@type': 'Audience', audienceType: 'Property companies' },
    ],
  };
  await writePage(`public/services/${service.slug}/index.html`, layout({
    title: service.title,
    description: service.description,
    canonical,
    h1: service.h1,
    category: service.category,
    intro: `${service.description} Smart Environment Group brings Development, Construction and Property Services together so clients have one joined-up team from concept through delivery and long-term property support.`,
    keywords: service.keywords,
    bullets: service.bullets,
    schema,
    relatedLinks: [
      ...serviceLinks.filter((link) => !link.href.includes(service.slug)).slice(0, 5),
      ...locationLinks.slice(0, 2),
    ],
  }));
}

for (const location of locationPages) {
  const canonical = `${siteUrl}/locations/${location.slug}/`;
  urls.push(canonical);
  const description = `Smart Environment Group provides Development, Construction and Property Services across ${location.location}, delivering residential and commercial property development, refurbishments, design and build, MEP, security, data and smart building works.`;
  const schema = {
    '@type': 'LocalBusiness',
    '@id': `${canonical}#local-business`,
    name: `Smart Environment Group ${location.location}`,
    description,
    parentOrganization: { '@id': `${siteUrl}/#business` },
    areaServed: location.location,
    url: canonical,
    telephone: '+44 1727 270713',
    email: 'info@seukltd.com',
  };
  await writePage(`public/locations/${location.slug}/index.html`, layout({
    title: location.title,
    description,
    canonical,
    h1: location.h1,
    category: 'Coverage',
    intro: description,
    keywords: [
      `property development ${location.location}`,
      `construction services ${location.location}`,
      `property services ${location.location}`,
      `design and build ${location.location}`,
    ],
    bullets: [
      'Property development, planning strategy and feasibility support',
      'Construction, basements, extensions and residential refurbishment',
      'Commercial refurbishment, mixed-use projects and fit-out',
      'MEP, electrical, HVAC, security, data and smart building systems',
    ],
    schema,
    relatedLinks: [...serviceLinks.slice(0, 6), ...locationLinks.filter((link) => !link.href.includes(location.slug)).slice(0, 2)],
  }));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${url === `${siteUrl}/` ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${url === `${siteUrl}/` ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;
await fs.writeFile('public/sitemap.xml', sitemap);

await fs.writeFile(
  'public/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);
