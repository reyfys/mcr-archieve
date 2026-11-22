# Deploy MCR Archive publicly on Vercel

This is a static website. It does not need a database, environment variables, a build command, or a server.

## Option A — GitHub import (recommended)

1. Sign in to GitHub and create a new repository named `mcr-archive`.
2. Set repository visibility to **Public** (this makes the source code public too) or **Private** (the deployed website can still be public).
3. Upload the *contents* of this project folder to the repository root. `index.html` should be at the root, not inside another `mcr-archive` folder.
4. Sign in to Vercel with the same GitHub account.
5. Choose **Add New → Project**, then import `mcr-archive`.
6. Use these settings:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: leave empty
   - Output Directory: leave empty / default
   - Install Command: leave empty / default
7. Click **Deploy**. Vercel will provide a public `*.vercel.app` URL.

## Option B — Vercel CLI

Install Node.js, then run these commands from this folder:

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and choose the project settings above. To deploy production:

```bash
vercel --prod
```

## Public access and privacy

The deployed site is intentionally public: anyone with its URL can open it. There is no login or private access gate in this version. Do not add private/personal information.

The GitHub repository can remain private while the Vercel deployment is public. These are separate visibility settings.

## Offline behavior

Open the deployed site once while online. The service worker caches the site shell and catalogue. On a supported browser, use **Add to Home Screen** / **Install**. User-added lyric text and bookmarks are stored in that browser on that device only; they are not synchronized between devices and will be lost if browser site data is cleared.

## Lyrics and rights

No complete copyrighted lyrics are bundled. The song pages let visitors paste text they are entitled to use and save it locally. The external lyric search is a convenience link, not an endorsement or a guarantee of licensing.

## Checks

- `index.html` is at project root.
- `app.js` and `data.js` are loaded locally.
- `sw.js` and `manifest.webmanifest` are served over HTTPS after deployment.
- The project has no required environment variables.
