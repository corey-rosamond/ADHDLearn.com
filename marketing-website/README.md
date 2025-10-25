# ADHDLearn.com Marketing Website

Static HTML/CSS/JS marketing website for adhdlearn.com

## Technology Stack

- **Technology:** Static HTML/CSS/JS
- **Framework:** None (vanilla)
- **Deployment:** Apache (adhdlearn.com)

## Structure

```
marketing-website/
├── index.html      # Main landing page
├── styles.css      # Styles
├── script.js       # JavaScript
└── README.md       # This file
```

## Development

No build process required. Open `index.html` in a browser.

## Deployment

Files are served directly by Apache from `/var/www/adhdlearn.com/production/`

```bash
# Deploy to production
scp -r * corey@160.153.180.159:/var/www/adhdlearn.com/production/
```

## Status

- Phase 1: Placeholder created ✅
- Phase 21: Full marketing site (pending)
