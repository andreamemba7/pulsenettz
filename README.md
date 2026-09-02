# Pulse Network — pulsenettz.com

Static marketing site for Pulse Network, a Tanzanian non-profit working on
environmental sustainability, climate resilience and social equity.

Five pages, one stylesheet, one script, and a single serverless function that
handles the contact form. No build step, no framework, no dependencies.

---

## Stack

| | |
|---|---|
| Pages | Plain HTML — `index`, `about`, `opportunities`, `connect`, `team` |
| Styles | One file, `assets/styles.css`, cache-busted via `?v=N` |
| Script | One file, `assets/main.js` — nav toggle, scroll reveal, contact form |
| Backend | `api/contact.js` — Vercel serverless function, CommonJS |
| Email | [Resend](https://resend.com) |
| Hosting | Vercel |

---

## Structure

```
├── index.html            Home
├── about.html            About Us
├── opportunities.html    Opportunities
├── connect.html          Connect With Us (contact form)
├── team.html             Team
├── api/
│   └── contact.js        POST endpoint — validates, then calls Resend
├── assets/
│   ├── styles.css
│   ├── main.js
│   ├── pulsenet_logo.png
│   ├── fonts/
│   └── photos/
├── .env.example          Env var names (no secrets)
└── .gitignore
```

---

## Running it locally

Most of the site opens straight from the filesystem — double-click
`index.html`. The contact form is the exception: `file://` has no `/api`
route, so submissions will fail.

To run the form too:

```bash
npm i -g vercel
vercel dev
```

Create `.env.local` from `.env.example` first and fill in the real values.
`.env.local` is gitignored — keep it that way.

---

## Deploying

Vercel, connected to this GitHub repo. Push to `main` and it ships.

**Project settings:** framework preset *Other*, no build command, no output
directory. Vercel serves the repo root as static files and auto-detects
`api/` as serverless functions.

GitHub Pages is not an option any more. It can't run `api/contact.js`, so the
contact form would 404 with no visible error.

---

## Contact form

The form on `connect.html` posts JSON to `/api/contact`. That function
validates the input and calls Resend, which delivers to `TO_EMAIL`.

**The Resend API key is never in this repo.** It lives only in Vercel's
environment variables. If you ever find yourself pasting `re_...` into a file
here, stop — anyone can read it from the deployed site.

### Environment variables

Set all three in Vercel → Settings → Environment Variables, for Production,
Preview and Development.

| Variable | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | From resend.com/api-keys. Shown once only. |
| `TO_EMAIL` | `pulsenettz@gmail.com` | Where enquiries land. |
| `FROM_EMAIL` | `website@pulsenettz.com` | Domain must be verified in Resend. |

Environment variables are read at deploy time — after changing one, redeploy.

### Domain verification

Before anything sends from `@pulsenettz.com`, add the domain in
resend.com/domains and copy the DKIM and SPF records it returns into the DNS
zone for `pulsenettz.com`. This requires access to the domain's DNS. Until
Resend shows *Verified*, every send fails.

To test before DNS is sorted: if the Resend account was created with
`pulsenettz@gmail.com`, set `FROM_EMAIL=onboarding@resend.dev` and it sends
immediately with no DNS. That shared test address only delivers to the
account owner's inbox — which is where this form goes anyway. Switch to
`website@pulsenettz.com` once verified; shipping on `resend.dev` hurts
deliverability.

### What the endpoint does

- Requires name, email and message; validates email format
- Caps the message at 5000 characters
- Strips CR/LF from every field before it reaches a mail header
- HTML-escapes all input
- Ignores any "interest" value that isn't one of the seven checkboxes
- Hidden honeypot field (`website`) — bot submissions get a silent 200 and go nowhere
- Sets `reply_to` to the sender, so Reply in Gmail answers the visitor directly

Failures are logged to Vercel's function logs with the real reason. Visitors
only see plain language and the fallback email address.

---

## Editing content

Text is edited directly in the HTML. Repeated blocks (header nav, footer) are
duplicated across all five pages — change one, change all five. Grep for the
string you're replacing rather than editing page by page.

After changing `assets/styles.css`, bump the `?v=` number in every `<link>`
tag or returning visitors keep the cached stylesheet:

```bash
sed -i '' 's/styles.css?v=18/styles.css?v=19/' *.html   # macOS
sed -i    's/styles.css?v=18/styles.css?v=19/' *.html   # Linux
```

---

## Open items

Things that are deliberately unfinished, with what's needed to close them.

**Team photos.** `about.html` uses initials on a green tile as placeholders
for Agness Taji Liundi, Kelvin Majaliwa, Athumani Ramadhani, Brian Sisti,
Fatma Suleyman and Elisha Paul. Needs a name-to-file mapping — the uploaded
photos aren't labelled, and guessing which face belongs to which name isn't a
risk worth taking on a public site.

**Social links.** Instagram, LinkedIn, Facebook and X are `#` placeholders on
`connect.html` and in the footer. Needs the real handles.

**Which domain is real.** The site standardises on `www.pulsenettz.com` and
`pulsenettz@gmail.com`. The source organisation profile listed
`www.pulsnet.or.tz`, `info@pulsenet.or.tz` and `pulseneNz@gmail.com`. A
`.or.tz` domain is more typical for a registered Tanzanian NGO. Worth
confirming with the org before this is promoted anywhere — and it directly
affects Resend, since `FROM_EMAIL` has to sit on the verified domain.

**Logo is raster.** `assets/pulsenet_logo.png` was extracted from the
organisation profile PDF with the background removed. Sharp at nav size
(~34px), but it won't scale. Drop in the original vector if it ever surfaces.

**No rate limiting.** The honeypot stops naive bots. It won't stop someone
deliberately hammering `/api/contact` and burning Resend quota. If that
happens, enable Vercel's WAF rate-limiting on that path — dashboard toggle,
no code change.
