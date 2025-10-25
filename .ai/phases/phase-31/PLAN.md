# Phase 31: Multi-Parent Support

**Project:** ADHDLearn.com
**Phase:** 31 of 36
**Last Updated:** October 22, 2025

---

 Multi-Parent Support

**Delivers:** Add another parent to family account
**Aurora gets:** Nothing
**You get:** 👫 **Invite partner to view Aurora's progress**
**Deployed:** Multiple parents supported

---

### What This Phase Delivers

Multi-parent features:
- Invite parent endpoint
- Email invitation with link
- Accept invitation flow
- Both parents see same data
- Role-based permissions

---

### Database Changes

Update users table to support multiple parents per family (already supported via family_id).

**New Table:** `family_invitations`
```sql
CREATE TABLE family_invitations (
    invitation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    
    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);
```

---

### Acceptance Criteria

- [ ] Parent can send invitation
- [ ] Email sent with invitation link
- [ ] Invited parent can accept
- [ ] Both parents see same dashboard
- [ ] Permissions work correctly

---

### Dependencies

- Phase 4: Parent Registration

---

