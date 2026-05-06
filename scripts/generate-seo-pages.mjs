import fs from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://seukltd.com';
const today = new Date().toISOString().slice(0, 10);

const services = [
  {
    slug: 'basement-construction-london',
    title: 'Basement Construction London & Hertfordshire',
    h1: 'Basement Construction in London & Hertfordshire',
    description: 'Smart Environment delivers basement construction, excavation, structural works, waterproofing, drainage and fit-out across Greater London and Hertfordshire.',
    keywords: ['basement construction London', 'basement contractors London', 'basement excavation', 'basement waterproofing', 'London basement builders'],
    bullets: ['Excavation, underpinning and temporary works', 'Retaining walls, concrete works and structural slabs', 'Waterproofing, drainage and sump systems', 'Internal fit-out, MEP, finishes and handover'],
  },
  {
    slug: 'house-extensions-loft-conversions-london',
    title: 'House Extensions & Loft Conversions London',
    h1: 'House Extensions, Vertical Extensions & Loft Conversions',
    description: 'Design and construction of house extensions, loft conversions, vertical extensions, dormers, roof works and internal refurbishment in Greater London and Hertfordshire.',
    keywords: ['house extensions London', 'loft conversions London', 'vertical extensions London', 'roof extensions London', 'extension builders Hertfordshire'],
    bullets: ['Single and double storey extensions', 'Loft conversions, dormers and roof works', 'Structural alterations, glazing and envelope works', 'Kitchens, bathrooms, flooring, joinery and decoration'],
  },
  {
    slug: 'commercial-refurbishment-london',
    title: 'Commercial Refurbishment London',
    h1: 'Commercial Refurbishment & Fit-Out in London',
    description: 'Commercial refurbishment contractor for offices, retail, hospitality, leisure and mixed commercial buildings across London and Hertfordshire.',
    keywords: ['commercial refurbishment London', 'office refurbishment London', 'commercial fit out London', 'retail refurbishment', 'hospitality refurbishment'],
    bullets: ['Office, retail, leisure and hospitality refurbishment', 'Strip-out, partitions, ceilings, flooring and finishes', 'Structural alterations and compliance works', 'MEP, data, lighting, commissioning and handover'],
  },
  {
    slug: 'design-build-contractor-london',
    title: 'Design & Build Contractor London',
    h1: 'Design & Build Contractor for London Projects',
    description: 'Managed design and build delivery from feasibility and consultant coordination through pricing, procurement, construction, finishes and handover.',
    keywords: ['design and build London', 'design build contractor London', 'construction project management London', 'turnkey construction London'],
    bullets: ['Feasibility, brief development and consultant coordination', 'Budgeting, procurement and programme control', 'Construction delivery under one managed route', 'Final finishes, commissioning and handover'],
  },
  {
    slug: 'mep-electrical-hvac-contractor-london',
    title: 'MEP, Electrical & HVAC Contractor London',
    h1: 'MEP, Electrical, HVAC & Plumbing Services',
    description: 'Integrated MEP contractor for mechanical, electrical, HVAC, plumbing, fire, security, data and smart building systems across Greater London and Hertfordshire.',
    keywords: ['MEP contractor London', 'electrical contractor London', 'HVAC contractor London', 'plumbing contractor London', 'smart building systems London'],
    bullets: ['Mechanical, electrical, plumbing and HVAC coordination', 'Lighting, power, containment, data and fibre routes', 'Fire alarms, access control, CCTV and ELV systems', 'Smart building automation, testing and commissioning'],
  },
  {
    slug: 'listed-building-refurbishment-london',
    title: 'Listed Building Refurbishment London',
    h1: 'Listed Building Refurbishment & Sensitive Works',
    description: 'Careful refurbishment and alteration of listed and sensitive buildings, coordinating protection, sequencing, structural works, services upgrades and finishes.',
    keywords: ['listed building refurbishment London', 'heritage building contractor', 'sensitive building refurbishment', 'listed building alterations'],
    bullets: ['Protection, sequencing and heritage-conscious delivery', 'Structural repairs, alterations and specialist finishes', 'Services upgrades with careful routing and coordination', 'Consultant, approval and compliance coordination'],
  },
];

const locations = [
  { slug: 'construction-company-london', title: 'Construction Company London', h1: 'Construction Company in Greater London', location: 'Greater London' },
  { slug: 'construction-company-hertfordshire', title: 'Construction Company Hertfordshire', h1: 'Construction Company in Hertfordshire', location: 'Hertfordshire' },
  { slug: 'construction-company-elstree', title: 'Construction Company Elstree', h1: 'Construction Company in Elstree', location: 'Elstree' },
  { slug: 'construction-company-st-albans', title: 'Construction Company St Albans', h1: 'Construction Company in St Albans', location: 'St Albans' },
];

function escapeHtml(value) {
  return value.replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function layout({ title, description, canonical, h1, intro, keywords, bullets, schema, relatedLinks }) {
  const keywordText = keywords?.length ? `<p class="eyebrow">${keywords.map(escapeHtml).join(' | ')}</p>` : '';
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | Smart Environment</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/branding/cropped-final-logo-golden-400.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Smart Environment" />
  <meta property="og:title" content="${escapeHtml(title)} | Smart Environment" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}/branding/final-logo-golden-wide-transparent.png" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    body{margin:0;font-family:Inter,Arial,sans-serif;background:#f7f7fa;color:#071024;line-height:1.6}main{max-width:980px;margin:0 auto;padding:48px 24px}header{background:#020426;color:white;padding:18px 24px}a{color:#8a6508}.brand{font-weight:800;letter-spacing:.12em;text-transform:uppercase}.eyebrow{color:#d4a017;font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:.78rem}h1{font-size:clamp(2.4rem,5vw,4.8rem);line-height:1.02;margin:24px 0 20px}.lead{font-size:1.15rem;max-width:780px}.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin:32px 0}.card{background:#f3ead2;border:1px solid #ded2b9;border-radius:10px;padding:20px}.cta{display:inline-block;background:#d4a017;color:#071024;text-decoration:none;font-weight:800;padding:14px 20px;border-radius:10px}.links{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.links a{background:white;border:1px solid #ded2b9;border-radius:999px;padding:8px 12px;text-decoration:none}footer{border-top:1px solid #ded2b9;margin-top:48px;padding-top:20px;color:#283142;font-size:.9rem}
  </style>
</head>
<body>
  <header><div class="brand">Smart Environment Group</div></header>
  <main>
    ${keywordText}
    <h1>${escapeHtml(h1)}</h1>
    <p class="lead">${escapeHtml(intro)}</p>
    <div class="grid">${bullets.map((item) => `<div class="card">${escapeHtml(item)}</div>`).join('')}</div>
    <a class="cta" href="/#contact-form">Request a construction quote</a>
    <div class="links">${relatedLinks.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join('')}</div>
    <footer>Smart Environment Group, also searched as Smart Environment and SEUK Ltd. 720 Centennial Court, Centennial Park, Elstree, Herts WD6 3SY. Call +44 (0) 172 7270 713.</footer>
  </main>
</body>
</html>`;
}

async function writePage(filePath, html) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html);
}

const serviceLinks = services.map((service) => ({ href: `/services/${service.slug}/`, label: service.title }));
const locationLinks = locations.map((location) => ({ href: `/locations/${location.slug}/`, label: location.title }));
const urls = [`${siteUrl}/`];

for (const service of services) {
  const canonical = `${siteUrl}/services/${service.slug}/`;
  urls.push(canonical);
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${canonical}#service`, name: service.title,
    description: service.description, provider: { '@id': `${siteUrl}/#business` }, areaServed: ['Greater London', 'Hertfordshire'], serviceType: service.title,
  };
  await writePage(`public/services/${service.slug}/index.html`, layout({
    title: service.title, description: service.description, canonical, h1: service.h1,
    intro: `${service.description} Smart Environment Group provides coordinated construction delivery for residential, commercial and specialist projects.`,
    keywords: service.keywords, bullets: service.bullets, schema, relatedLinks: [...serviceLinks.filter((link) => !link.href.includes(service.slug)).slice(0, 4), ...locationLinks.slice(0, 2)],
  }));
}

for (const location of locations) {
  const canonical = `${siteUrl}/locations/${location.slug}/`;
  urls.push(canonical);
  const description = `Smart Environment Group is a construction company serving ${location.location}, delivering basements, extensions, refurbishments, design and build, MEP, electrical, HVAC, security, data and smart building works.`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${canonical}#local-business`, name: `Smart Environment ${location.location}`,
    description, parentOrganization: { '@id': `${siteUrl}/#business` }, areaServed: location.location, url: canonical,
  };
  await writePage(`public/locations/${location.slug}/index.html`, layout({
    title: location.title, description, canonical, h1: location.h1,
    intro: description,
    keywords: [`construction company ${location.location}`, `builders ${location.location}`, `refurbishment contractor ${location.location}`, `design and build ${location.location}`],
    bullets: ['Basement construction, extensions and loft conversions', 'Commercial refurbishment and fit-out', 'Groundworks, structural works and building works', 'MEP, electrical, HVAC, plumbing, security, data and smart systems'],
    schema, relatedLinks: [...serviceLinks.slice(0, 5), ...locationLinks.filter((link) => !link.href.includes(location.slug)).slice(0, 2)],
  }));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${url === `${siteUrl}/` ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${url === `${siteUrl}/` ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile('public/sitemap.xml', sitemap);
