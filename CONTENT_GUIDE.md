# Adding academy photos and videos

Content is controlled in `content/media.json`. It currently has two photographs and an empty `videos` array. The site uses this file during the Python build; there is no public upload panel or server database.

## 1. Add a photo

Place the full image and an optional smaller thumbnail in `public/assets/images/`. Prefer descriptive filenames without spaces. Then append an object like the following to the `photos` array. Replace the filenames, title, description, dimensions and alt text with details of the real photo:

```json
{
  "id": "boxing-training-01",
  "title": "Boxing practice at the academy",
  "description": "A real caption for this photograph.",
  "src": "assets/images/boxing-training-01.webp",
  "thumbnail": "assets/images/boxing-training-01-thumb.webp",
  "alt": "Describe the people and training shown in this actual photograph",
  "width": 1600,
  "height": 1067,
  "category": "boxing",
  "tags": ["boxing", "training"],
  "featured": false
}
```

Paths are relative to `public/`, not to this guide. `thumbnail` is optional; the full image is used when it is omitted. Optional `layout` values `portrait` and `panorama` control those gallery treatments. Use the true aspect ratio and alt text. Keep a backup of the original. Only publish photos you have permission to use.

## 2. Add a local video

Put an actual MP4 or WebM in `public/assets/videos/`. Use web-compatible encoding such as H.264/AAC in MP4 or VP8/VP9 with Opus in WebM. Large files are better served from a suitable HTTPS media host than a small application container.

Append this structure to the `videos` array, replacing all example values:

```json
{
  "id": "boxing-session-01",
  "title": "Boxing training session",
  "description": "Describe the real session shown.",
  "type": "file",
  "src": "assets/videos/boxing-session-01.mp4",
  "poster": "assets/images/boxing-session-01-poster.webp",
  "category": "boxing",
  "tags": ["boxing", "training"],
  "featured": true
}
```

`poster` is optional. The original academy logo is the fallback when no poster is supplied. An optional `duration` string is shown on the card; only add it after checking the actual duration.

For captions, add the optional fields:

```json
{
  "captions": "assets/videos/boxing-session-01-en.vtt",
  "captionLanguage": "en",
  "captionLabel": "English"
}
```

The VTT file must exist. Prefer same-origin caption files so browser cross-origin restrictions do not interfere. The native video player includes normal controls. Closing the viewer stops playback.

## 3. Add an individual YouTube video

Choose an actual academy video that allows embedding. Set `type` to `youtube` and `youtubeId` to the video's real 11-character ID. It is the part after `v=` in a watch URL or after `/shorts/` in a Shorts URL; do not enter the full URL, a channel handle or this guide's placeholder.

Example structure (replace `ACTUAL_VIDEO_ID` before building):

```json
{
  "id": "academy-video-01",
  "title": "The actual video title",
  "description": "A short description of the real video.",
  "type": "youtube",
  "youtubeId": "ACTUAL_VIDEO_ID",
  "category": "academy",
  "tags": ["academy", "training"],
  "featured": false
}
```

The visitor is asked before loading the YouTube player. YouTube is then opened through its privacy-enhanced embed host. A direct watch link is also available when embedding is restricted. No automatic channel scraping or YouTube API key is used.

## Categories and tags

Media categories: `academy`, `boxing`, `mma`, `kickboxing`, `wrestling`, `grappling`, `conditioning`.

Existing tags: `academy`, `coach`, `team`, `community`, `boxing`, `mma`, `kickboxing`, `wrestling`, `grappling`, `conditioning`, `fitness`, `footwork`, `training`.

Use the category and tags that actually describe each item. Tags connect media to the dedicated topic pages. Add new tag definitions to `content/tags.json` before using a new tag ID. For a new discipline, edit `content/disciplines.json`; the generator will create its detail page. Keep IDs lowercase and use hyphens instead of spaces.

Each media `id` must be unique across photos and videos. The builder checks required fields, known tags/categories, local file existence, safe paths and the structure of YouTube IDs. It does not verify copyright permission, actual YouTube availability or the content of a video.

## Publish the changes

Run `python tools/build.py` using Python 3.12+ from the project root. The build should finish without an error. Preview the gallery and filters, then redeploy the updated `public` folder or commit the changed project to your existing deployment repository.

The order in the JSON file is the editorial/featured order. Append new items at the end to have them appear first when the visitor chooses "Newly added". This sort uses entry order rather than inventing a capture date. "Featured" places entries marked `featured: true` first; title sorting is alphabetical.

Direct filtered links are supported, for example `photos.html?category=boxing`, `photos.html?tag=coach`, `videos.html?tag=training` and `stances.html?stance=southpaw`.

Do not paste secret credentials, private student information or payment details into these JSON files: generated website content is public.
