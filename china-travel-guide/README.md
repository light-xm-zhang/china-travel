# Ultimate China Travel Guide 2026

A modern, responsive static website providing comprehensive travel guidance for international visitors to China. Updated with 2026 visa-free policies, essential app recommendations, and detailed city guides.

## Project Structure

```
china-travel-guide/
├── index.html             # Home page — hero banner, quick navigation cards
├── essentials.html        # Pre-trip prep — visa policies, payment, apps, checklist
├── cities.html            # City guides — overview grid + tabbed detail sections
├── css/
│   └── style.css          # Custom styles + Leaflet map containers + tab system
├── js/
│   ├── script.js          # Shared: mobile menu, smooth scroll, navbar effects
│   ├── cities-data.js     # City data layer: 8 featured + 28 regional cities
│   └── cities-render.js   # Render engine: detail sections, tabs, Leaflet maps
└── README.md

8 featured cities with full detail (attractions, food, interactive map, transport)
28 additional cities at-a-glance — total 36 destinations across all provinces

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **Tailwind CSS** — Loaded via CDN for rapid, responsive styling
- **Leaflet.js** — Open-source interactive maps with OpenStreetMap tiles (free, no API key)
- **Vanilla JavaScript** — Data-driven rendering, tab system, lazy map initialization
- **Zero build step** — Edit and deploy directly

## Local Development

1. **Start a local server** (required since Tailwind is loaded via CDN with absolute paths):

   ```bash
   # Python 3
   python -m http.server 8080

   # Node.js (with npx)
   npx serve .

   # VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

2. Open `http://localhost:8080` in your browser.

3. Edit any `.html`, `.css`, or `.js` file and refresh to see changes.

## Deployment

### Option 1: Vercel (Recommended — easiest)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → "New Project" → import your repo.
3. Vercel auto-detects the static site. No configuration needed.
4. Deploy. Your site is live in under a minute.

### Option 2: Netlify

1. Push this folder to a GitHub repository.
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project".
3. Connect your Git provider and select the repository.
4. Deploy. Default settings work out of the box.

### Option 3: Cloud Server (Nginx)

1. Upload all files to your server (e.g., `/var/www/china-travel-guide/`).
2. Install and configure Nginx:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/china-travel-guide;
       index index.html;
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

3. `sudo nginx -t && sudo systemctl reload nginx`

### Option 4: Any Static Host

This site is pure HTML/CSS/JS. It runs on any static file host: GitHub Pages, Cloudflare Pages, AWS S3, DigitalOcean App Platform, etc.

## Content Sources

All content is researched and compiled from publicly available travel resources, official Chinese government announcements, and first-hand traveler reports, current as of May 2026. Visa policies and local regulations may change — always verify with official sources before traveling.

