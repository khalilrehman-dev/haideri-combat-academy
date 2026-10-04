# Haideri Combat Academy - Premium website

An updated, multi-page version of the supplied Haideri website. The public site is plain HTML, CSS and JavaScript. It does not need npm, a frontend framework, a database or a paid API.

## Open the website

Extract the complete ZIP first. Open `public/index.html` in a modern browser for a quick local preview. Do not open the HTML from inside the ZIP viewer.

For the most reliable local preview, run `START_LOCAL.bat` on Windows, or `./start-local.sh` on macOS/Linux. These launch Python's local development server. Open `http://localhost:8000`; keep the terminal open while previewing. Python must already be installed. Alternatively, from the project folder run:

```sh
python -m http.server 8000 --directory public
```

The ready-built `public` folder can be used without running the content generator. The custom 404 page assumes deployment at a domain's root.

## Included pages and features

- Home: new editorial layout, the supplied coach photograph, training paths, real academy media links and enquiry calls to action.
- Academy: coach introduction, academy story, team image and FAQs.
- Training: filterable disciplines and separate Boxing, MMA, Kickboxing, Wrestling, Grappling and Conditioning pages.
- Photos: search, category/topic filters, sorting, full-size viewer, keyboard controls and touch-swipe navigation.
- Videos: official channel links, searchable/filterable collection, support for local video files and opt-in YouTube embeds. Individual videos will appear when real entries are added.
- Stances: orthodox/southpaw orientation comparison and six introductory stance terms, with striking/grappling filters.
- Topics: a filterable index and thirteen individual tag pages.
- Contact: academy phone, the original map link, FAQs and a form that opens a prefilled WhatsApp conversation.
- Privacy and a custom 404 page.

The original charcoal/red/white website palette is retained. The supplied gold/silver logo artwork is not redrawn or recolored. Website-size exports and icons are derived by cropping/resizing the original. The coach photo is cropped only for different website placements; the full original is included in `brand-assets`.

## WhatsApp

Every page includes a floating link to `https://wa.me/923045261579`.

Display number: **0304 5261579**. International number: **+92 304 5261579**.

The enquiry form prepares a message containing the visitor's name, training interest, experience and optional question. It then opens WhatsApp. The visitor must press Send there; the website does not send messages automatically, collect form submissions in a database, confirm appointments or take payments. The visitor's browser/device determines whether WhatsApp opens the app, WhatsApp Web or its connection page.

## Add the next photos and videos

See `CONTENT_GUIDE.md`. Add real files to `public/assets/images/` or `public/assets/videos/`, describe them in `content/media.json`, and run:

```sh
python tools/build.py
```

The generator requires **Python 3.12 or newer**, with no third-party Python packages. It regenerates all page HTML, sitemap and the JavaScript content snapshot. CSS and application JavaScript are maintained in `public/assets/css/site.css` and `public/assets/js/app.js`.

The current gallery intentionally contains only two real photographs: the new coach photo and the team photo from the original site. No individual video was supplied, so the curated video list is empty. There are no stock academy photos, made-up videos, fabricated awards, invented schedules or invented fees.

## Publish

### Ordinary static hosting

Upload the **contents of `public/`** to the hosting web root, so `index.html` is at the root. Preserve the `assets` subfolders. A separate ready-to-upload ZIP is also provided. Configure the host's error-page option to use `404.html` where available.

### Railway / Docker

The root includes `Dockerfile`, `Caddyfile` and `railway.toml` matching the original deployment approach. Put the whole project in the repository used by Railway, then redeploy. The container serves only `public/`; its port defaults to 3000 and reads `PORT` when provided. Healthcheck: `/index.html`. The platform should terminate HTTPS in front of this container.

The Docker/Railway configuration is supplied, not deployed or tested against your live account. Back up the current site before replacing files. Verify mobile navigation, the map link, WhatsApp handoff and domain/HTTPS once published.

## Settings and metadata

Edit `content/site.json` for the phone, links and canonical domain, then rebuild. The canonical domain was preserved from the original project as `https://haiderikombatacademy.com` (including its spelling); confirm it is your intended live domain before publishing. The site does not invent a street address; the existing Google Maps link is retained.

Google Fonts is requested remotely for Inter and Barlow Condensed. System-font fallbacks are supplied, and no font files are included. The privacy page describes this external request. There is no analytics package, advertising SDK, service worker cache or automatic third-party video embed.

## Project folders

| Folder | Purpose |
| --- | --- |
| `public/` | Ready-to-host website |
| `content/` | Editable site, media, training, stance and topic data |
| `tools/build.py` | Dependency-free static page generator |
| `brand-assets/` | Original supplied artwork/photo and derived logo/icon exports |
| `preview/` | Browser-rendered previews and QA results |

`DESIGN_NOTES.md` records the design references. `TEST_REPORT.md` explains the checks performed and what still needs a live-host verification.
