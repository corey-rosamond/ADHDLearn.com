# Phase 21: Marketing Website

**Project:** ADHDLearn.com
**Phase:** 21 of 36
**Last Updated:** October 22, 2025

---

 Marketing Website

**Delivers:** Public-facing website at adhdlearn.com
**Aurora gets:** Nothing
**You get:** Professional website to show others
**Deployed:** Static marketing site at root domain

---

### What This Phase Delivers

Marketing/landing page:
- Explains what ADHDLearn is
- Features and benefits
- Testimonials (you + Aurora)
- Pricing (free tier + premium)
- Link to parent.adhdlearn.com/register
- Screenshots of portals

---

### Frontend Changes

**New static site at `marketing/`:**
```
marketing/
├── index.html
├── css/
│   └── style.css
├── images/
│   ├── hero.png
│   ├── screenshot-child.png
│   └── screenshot-parent.png
└── js/
    └── main.js
```

**Apache configuration for adhdlearn.com:**
```apache
<VirtualHost *:443>
    ServerName adhdlearn.com
    DocumentRoot /var/www/adhdlearn/marketing
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/adhdlearn.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/adhdlearn.com/privkey.pem
</VirtualHost>
```

---

### Acceptance Criteria

- [ ] Marketing site accessible at adhdlearn.com
- [ ] Responsive design (mobile-friendly)
- [ ] Clear call-to-action (Register button)
- [ ] Screenshots of both portals
- [ ] Explains features for parents and children
- [ ] Links to parent.adhdlearn.com/register
- [ ] SSL certificate working

---

### Dependencies

- Phase 0: Server infrastructure (domain configured)

---

