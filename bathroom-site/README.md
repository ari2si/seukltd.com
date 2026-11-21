# Smart Environment Bathrooms — standalone website

A fast, self-contained static website for the Smart Environment Bathrooms line of business,
built for strong local SEO across London, Hertfordshire and the Home Counties.

- **1** homepage (`index.html`)
- **6** service pages (`/services/`)
- **36** local landing pages (`/locations/bathroom-fitters-*`)
- Contact form, `sitemap.xml`, `robots.txt`, `llms.txt`, custom `404` and `/thanks/` pages
- No build step, no dependencies, no link to seukltd.com

## 1. Set your domain

After you buy your domain, run from inside this folder:

```bash
./set-domain.sh yourdomain.co.uk
```

This updates every canonical URL, Open Graph tag, schema ID and the sitemap.
The placeholder until you do this is `www.smartenvironmentbathrooms.co.uk`.

## 2. Deploy (pick one)

**Netlify (easiest — drag & drop)**
1. Go to https://app.netlify.com/drop
2. Drag this `bathroom-site` folder onto the page.
3. It goes live instantly on a `*.netlify.app` URL.
4. Site settings → Domain management → add your custom domain.

**Vercel / Cloudflare Pages**
- Point a new project at this folder (framework preset: "Other" / no build command, output dir `.`).

## 3. Make the contact form email you

The contact form uses **Netlify Forms** (works automatically on Netlify).
After the first deploy: Netlify → Forms → Form notifications → add an email
notification to **info@seukltd.com**. Submissions also appear in the Netlify dashboard.

If you host somewhere other than Netlify, swap the form for a service such as
Formspree (change the `<form>` `action` to your Formspree endpoint and remove the
Netlify attributes).

## Notes
- Phone, email and address are set to the Smart Environment NAP. Update them with a
  find-and-replace if the new business uses different contact details.
- The gallery uses styled panels (no photos). Drop real before/after photos in for
  the best results.
- Some stats (500+ installs, 4.9 rating) are placeholders — set them to real figures.
