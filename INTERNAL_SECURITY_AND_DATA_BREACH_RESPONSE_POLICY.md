# FinLingo: Internal Security & Data Breach Response Policy
**Confidential – For Internal Project Owners, DevOps, and Platform Administrators Only**

- **Document Version:** 1.0 (DPDPA 2023 & CERT-In Aligned)
- **Applicable Frameworks:**
  - Digital Personal Data Protection Act, 2023 (Section 8(5) & 8(6))
  - Digital Personal Data Protection Rules, 2025 (Staged Implementation)
  - Information Technology Act, 2000 (Section 43A, 70B, 72A)
  - Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data) Rules, 2011 (Rule 8)
  - CERT-In Cyber Security Directions (2022) under Section 70B(6) of IT Act, 2000
- **Jurisdiction:** Republic of India
- **Designated Incident Commander:** [INCIDENT COMMANDER / CTO NAME: To be appointed]
- **Designated Grievance & Privacy Officer:** [GRIEVANCE OFFICER NAME: e.g., Mr. Rohan Sharma (grievance@finlingo.app)]

---

## 1. Scope and Objective

This operational document establishes mandatory security protocols, credential controls, disaster recovery baselines, and an immediate incident response playbook for the administrators of FinLingo. Its objective is to ensure that student personal data is shielded against unauthorized access, destruction, alteration, or exfiltration, and to enforce statutory reporting compliance within legally mandated timelines in India.

---

## 2. Access Control and Least Privilege

1. **Administrative Access Minimisation:**
   - Only authorized engineering administrators shall hold write/deploy access to the production Google Cloud Platform (GCP) project, Firebase Console, and DNS registrar.
   - Access rights must follow the principle of least privilege (PoLP) and role-based access control (RBAC).

2. **Mandatory Multi-Factor Authentication (MFA):**
   - MFA is non-negotiable for all administrator accounts. Time-based One-Time Password (TOTP) hardware security keys or authenticator apps (e.g., Google Authenticator, YubiKey) are required. SMS-based 2FA is prohibited for root/administrator roles due to SIM-swapping risks.

3. **Credential & Secret Key Governance:**
   - **Never in Frontend Code:** GCP Service Account private keys (`serviceAccountKey.json`), administrative database secrets, or master tokens must NEVER be committed to version control (`git`) or bundled in client-side bundles.
   - All frontend Firebase configurations must be restricted using Google Cloud API Key Restrictions (HTTP referrer restrictions locked to the authorized domain, and API restrictions locked strictly to Firebase Authentication, Cloud Firestore, and Firebase Storage).
   - Backend secrets must be injected strictly via environment variables or GCP Secret Manager.

4. **Personnel Offboarding:**
   - When an administrator, contractor, or developer separates from the project, their IAM access, SSH keys, repository collaborator access, and tokens must be revoked within two (2) hours of departure.

---

## 3. Backups, Recovery, and Storage Security

1. **Database Backups:**
   - Automated daily snapshots of Cloud Firestore collections (`users`, `learning_tracks`, `quiz_results`, `spaced_repetition_queue`, `leaderboards`) must be maintained with a minimum 30-day retention window in a dedicated, isolated backup bucket.
   - Point-in-time recovery (PITR) must be activated for Firestore to enable restoration down to specific minute intervals in the event of accidental corruption or malicious manipulation.

2. **Storage Object Hygiene:**
   - Profile avatar uploads to Firebase Storage (`/users/{userId}/avatar/*`) are capped at 5 MB and strictly limited to sanitized image types (`image/jpeg`, `image/png`, `image/webp`).
   - Binary magic-byte inspection and canvas re-encoding are executed client-side to strip all EXIF metadata (GPS coordinates, camera serials, timestamps) prior to upload.
   - Automated lifecycle deletion rules must be configured to purge orphaned avatar files within 30 days following an account deletion.

3. **Software & Dependency Updates:**
   - Automated dependency scanning (e.g., Dependabot or `npm audit`) must run on every pull request.
   - High or Critical severity CVEs in runtime packages must be patched within 48 hours.

---

## 4. Monitoring, Audit Logging, and Anomaly Detection

1. **Audit Logs:**
   - GCP Cloud Audit Logs (Admin Activity & System Event) must remain permanently enabled and archived in immutable storage for a minimum of 180 days in compliance with Indian cyber norms.
   - Failed authentication spikes, administrative role changes, and bulk database export activities must trigger real-time alert notifications to the engineering team.

2. **Client-Side Fair Play Monitoring:**
   - Rate limiting must be enforced on quiz submission endpoints to mitigate automated bots or scripted XP inflation.
   - The platform does NOT engage in invasive keystroke logging, screen recording, or behavioral profiling of students.

---

## 5. Security Incident Classification Matrix

| Severity Level | Definition | Response Window | Escalation Target |
| :--- | :--- | :--- | :--- |
| **P1 - Critical** | Confirmed data exfiltration, database dump, unauthorized administrative access, active ransomware, or credential leak involving student emails. | **Immediate (< 1 Hour)** | Incident Commander, Legal Counsel, Executive Leadership |
| **P2 - Major** | Service outage, denial-of-service attack, unauthorized leaderboard tampering, or suspicious elevated failure rates without confirmed data breach. | **Within 4 Hours** | Lead DevOps / Backend Engineer |
| **P3 - Minor** | Localized UI bug, isolated client-side storage reset error, or low-risk vulnerability reported via responsible disclosure. | **Within 24 Hours** | Duty Engineer |

---

## 6. Incident Response Playbook: 5-Phase Protocol

### Phase 1: Identification & Escalation
- **Triage:** The on-call engineer verifies the authenticity of the alert or vulnerability report.
- **Declare:** For P1/P2 incidents, an incident channel is opened and the Incident Commander assumes authority.
- **Preserve:** Before taking systems offline, volatile logs, system memory snapshots, and Cloud Audit trails must be captured for forensic integrity. Do not overwrite or reboot without preserving logs.

### Phase 2: Containment & Isolation
- **Credential Invalidation:** Immediately revoke compromised API keys, rotate service account credentials, and invalidate active Firebase user session tokens.
- **Network Containment:** If necessary, temporarily activate Cloud Armor / CDN rate-limiting or switch Firestore security rules to emergency read-only mode (`allow write: if false;`).
- **Isolate Resources:** Quarantine compromised compute instances or cloud functions immediately.

### Phase 3: Eradication & Remediation
- **Root Cause Elimination:** Identify the precise vulnerability (e.g., misconfigured security rule, exposed environment key, outdated dependency) and deploy a verified code or configuration fix.
- **Integrity Verification:** Audit database records for malicious insertions or unauthorized alterations before re-enabling write access.

### Phase 4: Recovery & Restoration
- **Service Resumption:** Gradually restore full read/write operations under enhanced monitoring.
- **Validation:** Test authentication flows, profile updates, and quiz submissions to confirm normal platform functionality.

### Phase 5: Post-Incident Review & Root Cause Analysis (RCA)
- Within seven (7) business days of incident closure, the Incident Commander must produce a formal Post-Mortem RCA documenting:
  1. Timeline of events (detection to recovery).
  2. Root vulnerability and attack vector.
  3. Scope of impacted records (number of accounts, data fields).
  4. Immediate and long-term preventive actions taken.

---

## 7. Mandatory Statutory Notifications (India)

### A. CERT-In Mandatory 6-Hour Reporting
Under the Cyber Security Directions issued by the Indian Computer Emergency Response Team (CERT-In) under Section 70B(6) of the Information Technology Act, 2000, designated cyber security incidents **must be reported to CERT-In within six (6) hours** of noticing or being brought to notice:
- **Applicable Incidents:**
  - Targeted scanning/probing of critical systems.
  - Unauthorized access of IT systems/data.
  - Defacement of website or intrusion into website.
  - Malicious code attacks (ransomware/trojans).
  - Data breach / data leak or identity theft.
- **Reporting Channels:**
  - Email: `incident@cert-in.org.in`
  - Help Desk: `1800-11-4949`
  - Online Form: `https://www.cert-in.org.in`
- **Format:** Use CERT-In's official incident reporting format containing incident type, date/time, affected system IPs, impact assessment, and remedial actions initiated.

### B. Data Protection Board of India (DPBI) Notification
Under Section 8(6) of the Digital Personal Data Protection Act, 2023 and the DPDP Rules 2025:
- In the event of a verified **personal data breach**, the Data Fiduciary must give intimation of the breach to:
  1. The **Data Protection Board of India (DPBI)** in such form and manner as prescribed by the Central Government.
  2. Each **affected Data Principal (Student/User)** without unreasonable delay.
- **Notice to Affected Users Must Include:**
  - Nature and circumstances of the personal data breach.
  - Categories of personal data affected (e.g., display name, email).
  - Likely consequences and risks to the user.
  - Immediate mitigating steps undertaken by FinLingo.
  - Recommended protective measures the user should take (e.g., updating credentials).
  - Contact details of the Grievance Officer for questions and support.

---

## 8. Annual Review and Audit Readiness

This policy must be reviewed annually or following any material amendment to the DPDP Rules or CERT-In directives. Project administrators must maintain documentary evidence of security audits, vulnerability assessments, and training logs for presentation to regulatory authorities upon lawful demand.
