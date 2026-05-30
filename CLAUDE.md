# Mobile Art Services — Claude Context
**Last updated:** May 2026
**Version:** 1.0.0

## What This Is
A professional website for Mobile Art Services — a gallery wall curation and art hanging business based in Port Chester, NY serving Westchester County and Greenwich, CT. Built in React/Vite, deployed to GitHub Pages. All content managed via JSON data files — no backend, no CMS. Updates made by Claude Code reading and writing data files, then deploying.

## Current Status
- **Live:** mysterwolf.github.io/mobile-art-services/
- **Custom domain:** mobileartservices.com (currently down, CNAME pending)
- **Deployed from:** gh-pages branch
- **Maintainer:** mysterwolf studios (ProcessMind LLC engagement — September 2026)

## Tech Stack
| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React/Vite | Single page app |
| Hosting | GitHub Pages | gh-pages branch |
| Styling | CSS variables in :root | Full palette swap by updating variables only |
| Data | JSON files in public/data/ | All content lives here |
| Images | public/images/ | 35 images currently |
| Forms | mailto: | No backend — opens email client |

## Brand Palette (CSS Variables)
```css
--mas-bg:       #F4F2EE   /* warm off-white */
--mas-dark:     #1A2744   /* deep navy */
--mas-gold:     #C8960A   /* warm gold */
--mas-ink:      #0F1A2E   /* primary text */
--mas-border:   #D4D0C8   /* borders */
```
To retheme: update only the :root block in MobileArtServices.jsx. Do not change values elsewhere.

## Directory Structure
```
public/
  data/
    gallery.json        6 items currently displayed (of 35 images available)
    services.json       6 services
    info.json           contact details
    testimonials.json   empty — wired but no UI yet
  images/               35 images total (29 orphaned — not in gallery.json)
  inventory/            [TO BE CREATED] artwork inventory
    staging/            [TO BE CREATED] new items drop here
src/
  MobileArtServices.jsx main component
```

## Key Files
| File | Purpose |
|------|---------|
| src/MobileArtServices.jsx | Main component. Fetches from /data/ files. CSS variables at top of style tag. |
| public/data/gallery.json | Portfolio items shown on site. 6 items. Needs ID field added. |
| public/data/inventory.csv | [TO BE CREATED] Human-editable inventory. Source of truth for artwork. |
| public/data/inventory.json | [TO BE CREATED] Machine-readable inventory. Generated from CSV. |
| scripts/csv-to-json.js | [TO BE CREATED] Converts inventory.csv to inventory.json |
| vite.config.js | base must stay as '/mobile-art-services/' for GitHub Pages |

## Architecture Decisions
- **JSON data files are the only content layer** — no CMS, no database, no backend
- **CSV is the human interface, JSON is the machine interface** — client edits CSV, Claude Code converts and deploys
- **Inventory system pending** — 29 images orphaned in /images/ not yet in gallery.json
- **gallery.json needs ID field** — filename is current implicit key, fragile
- **Testimonials wired but no UI** — low priority until client provides reviews
- **Forms use mailto** — acceptable for current client volume, upgrade if needed
- **CSS variables** — entire palette in one :root block, never hardcoded elsewhere

## Inventory System (In Design)
CSV schema (fixed columns, do not add columns without updating csv-to-json.js):
```
id, filename, title, medium, dimensions, price, status, category, caption
```
Status values: `available`, `sold`, `reserved`, `auction`, `hidden`
Category values: `painting`, `print`, `photograph`, `drawing`, `mixed`

Workflow:
1. Client edits inventory.csv in Excel or Google Sheets
2. Claude Code reads CSV, runs csv-to-json.js, updates gallery.json
3. npm run deploy pushes live

## Invariants — Never Change These
- **vite.config.js base must be '/mobile-art-services/'** — changing this breaks the live site
- **CSS variables live only in the :root block** — never hardcode colors in JSX
- **All content changes go through data files** — never hardcode content in JSX
- **Forms submit to info@mobileartservices.com via mailto** — do not add a backend without explicit instruction
- **Images stay in public/images/** — do not reorganize without updating all references

## Pending Work (Priority Order)
1. Add ID field to gallery.json entries
2. Create inventory.csv with all 35 images (6 active + 29 hidden)
3. Create scripts/csv-to-json.js converter
4. Create inventory page with carousel or masonry grid
5. Update gallery captions from Facebook ID filenames to real descriptions
6. Add CNAME for mobileartservices.com when domain is ready
7. Testimonials UI when client provides reviews
8. Collector portal (private, password-gated) — September 2026 engagement

## Client Info
- **Business:** Mobile Art Services
- **Contact:** 203-224-8524 / info@mobileartservices.com
- **Service area:** Port Chester NY, Westchester County, Greenwich CT
- **Key credential:** 20+ years experience, former frame designer at AI Friedman
- **ProcessMind engagement:** September 2026 (after sister's residency ends)

## Claude Code Session Starter
"I'm working on the Mobile Art Services website at github.com/MysterWolf/mobile-art-services. Pull the repo and read CLAUDE.md before making any changes. All content goes through data files in public/data/ — never hardcode content in JSX. CSS variables live only in the :root block. The vite.config.js base must stay as '/mobile-art-services/'. Confirm you understand before I give you the next task."

## Changelog
### May 2026
- Initial site built and deployed to GitHub Pages
- 35 images loaded to public/images/
- 4 JSON data files created: gallery, services, info, testimonials
- 6 gallery items active (29 images orphaned — pending inventory system)
- Auction buyer CTA section included
- AI Friedman credential added to About section
- mailto booking form wired to info@mobileartservices.com

## Available Skills
Skills live at github.com/MysterWolf/skills. Pull that repo and read README.md
to see all available skills before starting work.

Relevant skills for this repo:
- edit-component — safe editing protocol for component changes
- update-context — update this CLAUDE.md after session, commit and push
- audit-repo — read-only snapshot, flags orphaned images and broken refs
- spinup-site — reference for site architecture patterns
- update-portfolio — if adding MAS to mysterwolf.studio portfolio

## Updated Claude Code Session Starter
"I'm working on the Mobile Art Services website at github.com/MysterWolf/mobile-art-services.
First pull github.com/MysterWolf/skills and read README.md so you know what skills are available.
Then pull this repo and read CLAUDE.md in full. All content goes through data files in public/data/
— never hardcode content in JSX. CSS variables live only in the :root block. The vite.config.js
base must stay as '/mobile-art-services/'. Confirm you understand before I give you the next task."
