# Haideri Combat Academy — Mobile-first basic website

A lightweight, responsive static website prepared for Railway.

## Current official links
- YouTube: https://www.youtube.com/@DilawarkhanHaideri
- Facebook: https://www.facebook.com/people/Haideri-Combat-Academy/61593426972187/
- TikTok: https://www.tiktok.com/@dilawar.pakido
- Google Maps: https://maps.app.goo.gl/15WhZjb2JGtqLUe88

## Railway deployment
1. Create a new Railway project.
2. Deploy this folder/repository.
3. Railway will build with the included Dockerfile and serve through Caddy.
4. In Railway > Service > Settings > Networking, generate a Railway domain.
5. When ready, add `haiderikombatacademy.com` as a custom domain and follow Railway's DNS instructions in Cloudflare.
6. For this very low-traffic site, enable Railway Serverless if available on the account.

## Content choices
- No fake student numbers, awards, testimonials, dates, event details or experience claims are included.
- YouTube is used for video delivery instead of storing large MP4 files on Railway.
- WhatsApp is intentionally not added until the confirmed academy number is supplied.
- The Google Maps button uses the exact map link supplied by the academy.

## Updating later
- Replace social URLs directly in `index.html` if accounts change.
- Add the confirmed WhatsApp number as `https://wa.me/COUNTRYCODEPHONENUMBER`.
- Add real event details only after confirmation.
