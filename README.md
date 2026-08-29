# Pulse Network website — handoff notes

## What's here
4 static pages (Home, About Us, Opportunities, Connect With Us), one shared
stylesheet, one shared script. No build step — open `index.html` directly,
or deploy the whole folder as-is (same pattern as your portfolio site: push
to a repo, turn on GitHub Pages).

## 1. Contact form — finish the Formspree wiring
The form UI is built and validates client-side, but it won't actually send
anywhere until you connect a Formspree endpoint (you chose Formspree over
a plain mailto link):

1. Go to formspree.io → sign up free → **New Form**.
2. Copy the endpoint it gives you, e.g. `https://formspree.io/f/abcdwxyz`.
3. Open `assets/main.js`, find this line near the top of the form section:
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID';
   ```
   Replace the placeholder with your real endpoint. That's it — no other
   code changes needed.

Until you do this, submitting the form shows an honest inline message
("Form not connected yet") instead of silently failing.

## 2. Logo
`assets/pulsenet_logo.png` is extracted directly from your organization
profile PDF with the background removed — it's the real mark, just raster
instead of vector. It'll look sharp at the sizes used in this build (nav,
~34px tall). If you get the original vector/SVG file from whoever designed
it, drop it in as `assets/pulsenet_logo.png` (or update the `src` in the
four HTML files) for a version that scales cleanly to any size.

## 3. Team photos
The team section currently uses initials on a green tile as placeholders
(Agness Taji Liundi, Kelvin Majaliwa, Athumani Ramadhani, Brian Sisti, Fatma
Suleyman, Elisha Paul). Once you have headshots, replace each `.avatar` div
in `about.html` with an `<img>` tag — happy to wire that in once you send
the photos.

## 4. Domain / contact info used
Standardized on the values you confirmed: `www.pulsenettz.com` and
`pulsenettz@gmail.com`. The source PDF had two other variants
(`www.pulsnet.or.tz` / `info@pulsenet.or.tz` / `pulseneNz@gmail.com`) —
worth double-checking with the rest of the org that those aren't the
"real" ones before this goes live, since a .or.tz domain is more typical
for a registered Tanzanian NGO than a .com.

## 4b. Photos used on the Home page ("In the field" section)
Four images from the batch you sent went in — the forest/tree walkthrough and
the two outdoor Maasai community-circle discussions, plus the tree-planting
shot. They're captioned generically ("Community engagement and environmental
action across Tanzania") rather than tied to a specific named Pulse Network
program, since I couldn't confirm which initiative they're actually from.

**Not used, on purpose:** the two YouLead Summit photos (one shows a Naki
Group product table), the MIL4TEENZ workshop photos, the "Mwanaume ni Mtu"
branded-shirt photo, the two mangrove/coastal group photos, and the indoor
event photos of the two women presenting. These either carry another
organization's visible branding or I had no way to confirm they're Pulse
Network's own material — safer to leave them out than misattribute someone
else's event. If any of these *are* confirmed Pulse Network work, say so and
I'll add them back in with an accurate caption.

**Team photos are still placeholders.** None of the uploaded photos are
labeled with names, so I can't match any face to Agness, Kelvin, Athumani,
Brian, Fatma, or Elisha without guessing — send a name-to-file mapping and
I'll drop them into `about.html`.

## 5. Social links
Instagram / LinkedIn / Facebook / X / YouTube are placeholder `#` links on
the Connect page — send the actual handles/URLs and I'll wire them in.

## 6. A note on previewing this
If you preview these files with any tool built on an old WebKit engine
(older PDF-conversion tools, for instance), the grid-based sections may
render blank — those engines predate CSS Grid (2017) and flexbox `gap`
(2020). Any real browser from the last several years — Chrome, Safari,
Firefox, Edge, and every phone browser — renders this correctly. Open it
in an actual browser to see the real thing.
