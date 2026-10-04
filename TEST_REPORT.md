# Website verification

Build checked: 4 October 2026.

## Passed checks

- 29 static HTML pages, each with a page title, description, language, one main heading and a floating WhatsApp link.
- 966 internal page/anchor references checked against generated files and IDs.
- 73 image references checked for real files and alt attributes.
- 139 WhatsApp links checked: all use the supplied recipient, `923045261579`.
- 145 responsive layout checks: all 29 pages at widths 320, 390, 768, 1024 and 1440 pixels. No document horizontal overflow or clipped heading/button text detected in the tested renderer.
- Training discipline filtering; photo search, tags, categories, reset, empty state and ordering; initial filter query parsing.
- Full-size photo viewer, previous/next controls, arrow keys, Escape and focus restoration.
- Mobile menu opening/dismissal, backdrop dismissal, keyboard focus containment, focus return and ARIA state.
- Orthodox/southpaw comparison and stance group filters; topic group filters.
- Required enquiry-form validation and correctly encoded WhatsApp recipient/message. The test captured the URL and did not send anything.
- Video-library empty state and preserved official channel links. No third-party iframe is loaded on initial page view.
- Native local-video playback using a disposable one-second WebM test fixture; native controls and cleanup on close. The fixture is not included in the website or galleries.
- YouTube consent screen, privacy-enhanced iframe URL construction and cleanup on close. Network requests were blocked for this test; actual remote YouTube playback was not tested.
- FAQ disclosure behavior, reduced-motion styling and readable/navigation content when JavaScript is disabled.
- No JavaScript runtime exceptions in the executed checks.
- Exact supplied original logo file preserved, verified by SHA-256. No font files included in the delivered project.

## Preview method and limitations

The installed Chromium browser restricts URL navigation. Screenshots and interaction tests therefore rendered the actual authored HTML/CSS/JavaScript in memory with the same local assets inlined for testing. The deliverable itself has normal external CSS/JS files and optimized image assets, not an inlined screenshot wrapper. The only interaction test alteration captured outgoing WhatsApp form URLs instead of navigating to them.

Google Fonts could not be fetched in the isolated renderer. Previews used the configured installed font fallback; the live site requests Inter and Barlow Condensed and retains system-font fallbacks. Final line wrapping can vary slightly with fonts, browsers and devices. The screenshots are browser-rendered previews of this website, not generated visual concepts.

These are local render/interaction checks, not a live production deployment, exhaustive accessibility certification or real-device test matrix. Docker/Caddy/Railway were not executed against a hosting account. External map/social links were preserved from the uploaded project; ownership, continued availability and mobile deep-link handoff were not independently verified. No WhatsApp message was sent and no account status was checked.

## Verify after publishing

Confirm the canonical domain, HTTPS and homepage, open each navigation page, test the gallery and a future real video, and check WhatsApp from an actual phone. Confirm the academy receives the message only after pressing Send. Review the retained map and social links. Confirm session descriptions, coach details and media permissions with the academy.

Machine-readable results are in `preview/qa-results.json` and `preview/media-qa-results.json`.
