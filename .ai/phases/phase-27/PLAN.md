# Phase 27: Weekly Reports (Email)

**Project:** ADHDLearn.com
**Phase:** 27 of 36
**Last Updated:** October 22, 2025

---

 Weekly Reports (Email)

**Delivers:** Automated weekly progress emails
**Aurora gets:** Nothing
**You get:** 📧 **Weekly email summary of Aurora's progress**
**Deployed:** Emails sent every Sunday

---

### What This Phase Delivers

Email service:
- SendGrid/SES integration
- Weekly summary email generated
- Sent every Sunday morning
- Includes: games played, scores, time spent, badges earned, highlights

---

### Database Changes

None - uses existing tables.

---

### Backend Changes

**New dependency:** SendGrid or AWS SES
```bash
npm install @sendgrid/mail
```

**Cron job:** Weekly email generation
```javascript
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');

// Every Sunday at 8:00 AM
cron.schedule('0 8 * * 0', async () => {
  const families = await getAllFamilies();
  
  for (const family of families) {
    const report = await generateWeeklyReport(family.familyId);
    const email = await renderEmailTemplate(report);
    
    await sgMail.send({
      to: family.parentEmail,
      from: 'reports@adhdlearn.com',
      subject: `Aurora's Weekly Progress Report - ${new Date().toLocaleDateString()}`,
      html: email
    });
  }
});
```

---

### Acceptance Criteria

- [ ] Email service configured
- [ ] Weekly report generated
- [ ] Email sent every Sunday
- [ ] Report includes all key metrics
- [ ] Email template looks professional

---

### Dependencies

- Phase 4: Parent Registration (needs parent email)

---

