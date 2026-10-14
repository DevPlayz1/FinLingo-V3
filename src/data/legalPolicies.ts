/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FinLingo Legal & Privacy Framework
 * Tailored for students, scholars, and educational users in India.
 * Aligned with:
 * - Digital Personal Data Protection Act, 2023 (DPDPA 2023)
 * - Digital Personal Data Protection Rules, 2025 (staged implementation / transition)
 * - Information Technology Act, 2000 & IT (Intermediary Guidelines) Rules, 2021
 * - IT (Reasonable Security Practices and Procedures and Sensitive Personal Data) Rules, 2011 (SPDI)
 * - CERT-In Cyber Security Directions (2022)
 * - SEBI (Investment Advisers & Research Analysts) Regulatory Guidelines (Non-advisory disclaimer)
 */

export interface LegalSection {
  id: string;
  heading: string;
  content: string[];
  subsections?: {
    subheading: string;
    paragraphs: string[];
  }[];
}

export interface LegalDocument {
  id: string;
  title: string;
  badge: string;
  lastUpdated: string;
  effectiveDate: string;
  jurisdiction: string;
  summary: string;
  sections: LegalSection[];
  lawyerReviewNotice: string;
  isInternal?: boolean;
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy & Data Notice',
    badge: 'DPDPA 2023 & IT Act Compliant',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Explains what personal data FinLingo processes from college students, the lawful basis of consent, cloud vs local browser persistence, third-party sub-processors, and your statutory rights under the Digital Personal Data Protection Act, 2023.',
    lawyerReviewNotice: 'Legal Disclaimer: This privacy policy has been tailored for the FinLingo educational platform in accordance with the Digital Personal Data Protection Act, 2023 (DPDPA 2023), the draft/notified DPDP Rules 2025, and the Information Technology Act, 2000. Because the DPDP Rules are undergoing staged commencement by the Ministry of Electronics and Information Technology (MeitY), site operators must have their final legal entity details, cloud hosting region, and operational parameters audited by an Advocate enrolled with the Bar Council of India prior to commercial deployment.',
    sections: [
      {
        id: 'operator-identity',
        heading: '1. Data Fiduciary & Platform Operator',
        content: [
          'FinLingo ("we", "our", "us", or "the Platform") is an interactive educational web application dedicated to commerce, accounting, economics, and finance education for higher-education and college students.',
          'Current Project Status: Prototype / Educational Demonstration. In its current phase, FinLingo operates as an educational study application.',
          'For the purposes of the Digital Personal Data Protection Act, 2023 (DPDPA), the entity determining the purpose and means of personal data processing is the Data Fiduciary:',
          '• Legal Entity / Operator: [LEGAL OPERATOR NAME: e.g., FinLingo Education Technologies Pvt. Ltd. - Subject to formal incorporation]',
          '• Operating Jurisdiction: Republic of India',
          '• Primary Privacy Contact: [PRIVACY CONTACT EMAIL: privacy@finlingo.app]',
          '• Designated Grievance Officer: [GRIEVANCE CONTACT AND PROCESS: grievance@finlingo.app]',
          '• Registered Office Address: [REGISTERED OR BUSINESS ADDRESS, IF APPLICABLE: e.g., Tech Incubator Campus, Mumbai / Bengaluru, India]'
        ]
      },
      {
        id: 'architecture-transparency',
        heading: '2. Architecture Transparency: Client-Side vs. Cloud Storage',
        content: [
          'To guarantee maximum transparency regarding where your data lives, please note our current operational mode:',
          '• Active Prototyping & Client-Side Mode: In the current version of FinLingo, your student profile, custom avatar images, quiz scores, spaced repetition deck, and study streaks are stored directly within your device’s local browser storage (HTML5 Web Storage). No telemetry, tracker cookies, or user dossiers are secretly transmitted to external ad networks or third-party data brokers.',
          '• Local Demonstration Architecture: FinLingo operates strictly in local demo mode without external cloud backend or third-party authentication services. Personal data and learning progress remain on your local device.'
        ]
      },
      {
        id: 'data-collected',
        heading: '3. Categories of Personal Data Collected',
        content: [
          'We adhere strictly to the principle of Data Minimisation (processing only what is strictly necessary for academic learning and gamification):'
        ],
        subsections: [
          {
            subheading: 'A. Academic & Profile Information (Provided by You)',
            paragraphs: [
              '• Profile Name / Display Name: Used to personalize your study dashboard and represent you on the community leaderboard.',
              '• Email Address: Used for authentication identifiers, in-app credentials, and local session management.',
              '• College / University Affiliation: (e.g., Delhi University, IIM, Mumbai University, Columbia) used to categorize student leaderboards and peer study leagues.',
              '• Academic Discipline & Graduation Year: (e.g., Commerce & Finance, Class of 2026) used to recommend relevant track modules.',
              '• Optional Profile Avatar / Photo: A custom image selected or captured by you. The image is cropped, compressed, and sanitized purely client-side before storage.'
            ]
          },
          {
            subheading: 'B. Educational Telemetry & Gamification Records',
            paragraphs: [
              '• Learning Progress: Lessons completed, bookmarked concepts, and curriculum module completion rates in Accounting, Economics, and Finance.',
              '• Quiz Records & XP: Total questions answered, correct answer rates, perfect quiz bonuses, XP points, current level title, and daily active study streaks.',
              '• Spaced Repetition Queue: Record of incorrectly answered questions scheduled for systematic re-testing based on the Ebbinghaus forgetting curve.',
              '• Badges & Achievements: Unlocked student milestone awards.'
            ]
          },
          {
            subheading: 'C. System & Device Telemetry',
            paragraphs: [
              '• Interface Preferences: Dark Mode vs. Light Mode selection, cached in browser localStorage.',
              '• Essential Technical Telemetry: Standard HTTP header data, device screen dimensions (for responsive layout rendering), and temporary session tokens.'
            ]
          }
        ]
      },
      {
        id: 'lawful-basis',
        heading: '4. Purpose & Lawful Grounds for Processing',
        content: [
          'Under Section 4 and Section 6 of the Digital Personal Data Protection Act, 2023, personal data may only be processed for a lawful purpose for which the Data Principal has given affirmative, informed consent, or for certain legitimate educational and operational uses.',
          'We process your data exclusively for the following specific purposes:',
          '• Educational Delivery: Rendering personalized lesson modules, calculating spaced repetition intervals, and providing immediate feedback on quiz answers.',
          '• Academic Motivation & Gamification: Awarding experience points (XP), maintaining study streaks, granting level titles, and displaying the student leaderboard.',
          '• Security & Account Integrity: Preventing automated scraping, denial-of-service, or unauthorized manipulation of quiz answers and XP records.',
          '• Non-Commercial Platform Improvement: Analyzing aggregate curriculum difficulty (e.g., identifying questions with low accuracy rates to refine explanations).'
        ]
      },
      {
        id: 'mandatory-vs-optional',
        heading: '5. Mandatory vs. Optional Information & Consequences of Refusal',
        content: [
          'We clearly separate required essentials from purely elective features:',
          '• Mandatory Information: Basic profile identifier (name and email) required to maintain an individual learning record. Refusal prevents account creation and streak tracking.',
          '• Optional Information: University name, academic discipline, and profile photograph. You may leave these empty or decline to upload an image without losing access to any curriculum tracks, quizzes, or flashcards.',
          '• Leaderboard Visibility: Participation in the public student leaderboard is optional. You may toggle "Anonymous Mode" or hide your avatar in Privacy Controls at any time without penalty.'
        ]
      },
      {
        id: 'third-parties',
        heading: '6. Third-Party Service Providers & Sub-Processors',
        content: [
          'FinLingo does NOT sell, rent, monetize, or trade student data with third-party advertising exchanges. We utilize only reputable infrastructure sub-processors essential to delivering the web application:',
          '• Local Browser Sandbox: All user session tokens and PBKDF2 credential hashes are managed locally without external third-party authentication services.',
          '• Content Delivery Network: Edge content delivery and application asset hosting.',
          '• Unsplash Photography: Serves initial default placeholder avatar imagery (no student identifiers transmitted).',
          'All third-party sub-processors are bound by data processing agreements ensuring security standards compliant with Section 8 of the DPDPA 2023.'
        ]
      },
      {
        id: 'public-display',
        heading: '7. Public Data Sharing & Leaderboard Visibility',
        content: [
          'The only community-facing element within FinLingo is the Student Leaderboard.',
          '• By default, your Display Name, University affiliation, Level Title, and XP score are ranked on the peer leaderboard.',
          '• Your private email address, password/auth tokens, and exact question mistake history are NEVER exposed to other students.',
          '• Opt-Out Control: You can turn off public leaderboard visibility in the "Privacy & Data Rights" tab. When disabled, your ranking is removed or anonymized.'
        ]
      },
      {
        id: 'minors-protection',
        heading: '8. Special Provisions for Minors (Under Age 18)',
        content: [
          'FinLingo is designed primarily for undergraduate, postgraduate, and professional commerce students (typically 18 years of age and older).',
          '• Section 9 of the DPDPA 2023 imposes specific obligations regarding children (individuals under 18 years of age).',
          '• If you are under 18 years of age, you must use FinLingo with the verifiable consent, guidance, and supervision of a parent or lawful guardian.',
          '• FinLingo DOES NOT engage in behavioral monitoring, psychological profiling, tracking of children, or targeted advertising directed at students of any age.'
        ]
      },
      {
        id: 'data-retention',
        heading: '9. Data Retention & Deletion Timeline',
        content: [
          '• LocalStorage Data: Retained on your browser until you clear browser cache or click "Reset All Data / Erase Profile" in the settings.',
          '• Cloud Account Records: Maintained while your student account is active. Criteria for retention: [RETENTION PERIODS TO BE CONFIRMED: e.g., Accounts inactive for 24 continuous months will be notified and scheduled for permanent deletion].',
          '• Erasure Requests: Upon receiving a verified account deletion request, personal identifiers are erased from production systems within thirty (30) calendar days, subject only to statutory retention required under applicable Indian laws (such as cybersecurity incident logging under CERT-In directions).'
        ]
      },
      {
        id: 'user-rights',
        heading: '10. Your Statutory Rights under Indian Law',
        content: [
          'Under the Digital Personal Data Protection Act, 2023, you as a Data Principal hold enforceable statutory rights:',
          '1. Right to Access Information (Section 11): You may request a summary of personal data processed by FinLingo, the processing activities undertaken, and the identities of data fiduciaries with whom data has been shared.',
          '2. Right to Correction and Erasure (Section 12): You may correct misleading or incomplete personal data and request erasure of data no longer necessary for educational purposes.',
          '3. Right of Grievance Redressal (Section 13): You have the right to a readily available means of grievance redressal provided by our designated Grievance Officer.',
          '4. Right to Nominate (Section 14): You may nominate any individual to exercise your data rights in the event of death or incapacity.',
          '5. Right to Withdraw Consent (Section 6(4)): You may withdraw previously granted consent at any time through our Privacy Controls without affecting the lawfulness of processing prior to withdrawal.'
        ]
      },
      {
        id: 'cross-border',
        heading: '11. Cross-Border Data Transfers',
        content: [
          'Section 16 of the DPDPA 2023 allows the transfer of personal data outside India, except to countries specifically restricted or blacklisted by the Central Government.',
          'FinLingo prioritizes Google Cloud data centers located in India (e.g., Mumbai, Delhi NCR). Where global edge nodes or Google Cloud services process data internationally for low-latency delivery, such transfers adhere strictly to standard contractual clauses and security safeguards.'
        ]
      },
      {
        id: 'security-measures',
        heading: '12. Security Safeguards & Breach Protocol',
        content: [
          'In compliance with Section 8(5) of the DPDPA 2023 and the Information Technology (Reasonable Security Practices and Procedures) Rules, 2011:',
          '• Technical Safeguards: Enforced HTTPS/TLS encryption in transit, strict client-side validation of image uploads, file extension and MIME type restrictions (max 5 MB), and sanitization of text inputs.',
          '• Breach Notification Protocol: In the unlikely event of a verified personal data breach impacting student records, FinLingo will notify the Data Protection Board of India and affected Data Principals in the form and manner stipulated by the DPDP Rules, as well as reporting eligible cyber incidents to CERT-In within 6 hours.'
        ]
      }
    ]
  },

  terms: {
    id: 'terms',
    title: 'Terms of Service (Terms of Use)',
    badge: 'Legally Binding Agreement',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Governs access to and use of FinLingo, establishing eligibility, fair play rules, intellectual property ownership, educational disclaimers, and dispute resolution under Indian law.',
    lawyerReviewNotice: 'Legal Notice: These Terms of Service constitute an electronic contract under the Information Technology Act, 2000. Operators should confirm dispute resolution forums and liability caps with an Indian corporate counsel before entering commercial campus licensing or paid subscription models.',
    sections: [
      {
        id: 'acceptance-terms',
        heading: '1. Acceptance of Terms',
        content: [
          'By accessing, browsing, or using FinLingo, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, our Privacy Policy, and Community Rules.',
          'If you do not agree to these terms, you must discontinue using the platform immediately.',
          'These terms apply to all visitors, registered college students, educators, and guest learners.'
        ]
      },
      {
        id: 'eligibility',
        heading: '2. User Eligibility & Student Representation',
        content: [
          '• Age Requirement: You must be at least 18 years of age or possess legal parental/guardian consent if accessing under 18 under the laws of India.',
          '• Academic Representation: You warrant that all information supplied in your student profile (including your name and university) is accurate and not intended to impersonate other scholars, faculty, or registered institutions.',
          '• Permitted Jurisdiction: Access is open worldwide, but these terms are governed specifically by the statutory framework of the Republic of India.'
        ]
      },
      {
        id: 'account-security',
        heading: '3. Account Security & User Responsibilities',
        content: [
          '• You are responsible for safeguarding your login credentials and maintaining the confidentiality of your account.',
          '• You must promptly notify FinLingo of any unauthorized access, security incident, or credential compromise.',
          '• You agree not to share your account or use automated scripts, bots, spiders, or crawlers to extract quiz questions, solutions, or leaderboards.'
        ]
      },
      {
        id: 'fair-play',
        heading: '4. Fair-Play Rules & Platform Integrity',
        content: [
          'FinLingo is designed as an interactive supplementary learning tool. To preserve an honest and motivating educational environment, you agree NOT to:',
          '• Manipulate or cheat quiz scoring mechanisms, streak counters, or XP algorithms through browser console scripts or unauthorized API calls.',
          '• Upload harmful, offensive, sexually explicit, defamatory, or infringing profile avatars or usernames.',
          '• Reverse engineer, decompile, or disassemble the client codebase, quiz algorithms, or proprietary question bank.',
          '• Use FinLingo content to construct a competing commercial test-prep product without explicit written permission.'
        ]
      },
      {
        id: 'intellectual-property',
        heading: '5. Intellectual Property Rights & Educational License',
        content: [
          '• Ownership: All curriculum text, accounting frameworks, economics scenarios, financial math formulas, software code, UI designs, illustrations, brand names, and logos are the proprietary intellectual property of FinLingo and its licensors, protected under the Copyright Act, 1957 and Trade Marks Act, 1999 of India.',
          '• Limited Personal License: FinLingo grants you a personal, non-exclusive, non-transferable, revocable license to view, practice, and read educational content solely for your personal, non-commercial college studies and exam preparation.',
          '• Restrictions: You may not reproduce, redistribute, broadcast, sell, or republish FinLingo lesson text or question banks in course packs, paid tutoring classes, or commercial software without prior written authorization.'
        ]
      },
      {
        id: 'user-content',
        heading: '6. User-Submitted Content & Image Uploads',
        content: [
          '• If you upload an avatar or provide feedback, you grant FinLingo a non-exclusive, royalty-free license to display that content within the application interface.',
          '• You represent that you own or have obtained the necessary rights to any profile photo you upload and that it does not infringe upon any third party’s copyright, trademark, or privacy rights under Indian law.'
        ]
      },
      {
        id: 'disclaimers-liability',
        heading: '7. Disclaimers & Limitation of Liability',
        content: [
          '• As-Is Basis: FinLingo is provided on an "as is" and "as available" basis without warranties of any kind, whether express, implied, or statutory.',
          '• Educational Aid Only: While lessons and answers are curated to reflect standard university commerce syllabi (e.g., IFRS, Indian Accounting Standards, Microeconomics, Corporate Finance), we do not warrant that all content is free from typographical or conceptual errors.',
          '• Limitation: Under no circumstances shall FinLingo, its directors, employees, or developers be liable for any indirect, incidental, special, consequential, or punitive damages arising from your reliance on quiz answers, exam performance, or platform downtime.'
        ]
      },
      {
        id: 'termination',
        heading: '8. Termination & Suspension of Access',
        content: [
          'We reserve the right to suspend, terminate, or restrict your access to FinLingo at any time, with or without notice, in the event of:',
          '• Repeated violations of these Terms of Service or academic honesty rules.',
          '• Suspected fraudulent activity or unauthorized attempts to alter database/leaderboard records.',
          '• Direct request by law enforcement or regulatory authorities in India.'
        ]
      },
      {
        id: 'governing-law',
        heading: '9. Governing Law & Dispute Resolution',
        content: [
          '• Governing Law: These Terms and your use of FinLingo are governed exclusively by and construed in accordance with the laws of the Republic of India, without regard to conflict of law principles.',
          '• Arbitration: In the event of any dispute, controversy, or claim arising out of or relating to these Terms, the parties shall first attempt to resolve it amicably through good-faith mutual negotiations for thirty (30) days.',
          '• Jurisdiction: Any formal legal proceedings shall be subject to the exclusive jurisdiction of the competent civil courts situated in [JURISDICTION CITY: e.g., Mumbai / Bengaluru / New Delhi], India.'
        ]
      }
    ]
  },

  security: {
    id: 'security',
    title: 'Data Protection & Security Notice',
    badge: 'ISO/IEC 27001 Aligned Practices',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Summarises the physical, technical, and managerial safeguards deployed to protect student data, access restriction policies, incident management protocols, and reporting avenues.',
    lawyerReviewNotice: 'Security Notice: Under Section 8(5) of the DPDPA 2023 and Rule 8 of the IT (SPDI) Rules 2011, Data Fiduciaries must implement reasonable security practices. We do not claim absolute, unbreakable security, but outline verified defenses and incident response.',
    sections: [
      {
        id: 'security-philosophy',
        heading: '1. Realistic Security Commitment',
        content: [
          'No digital platform or Internet transmission can ever guarantee 100% absolute invulnerability. FinLingo approaches data protection through layered defence-in-depth, least privilege, and strict data minimisation.',
          'We do not collect sensitive banking credentials, credit card details, government identification numbers (Aadhaar, PAN), or biometric information. By not collecting sensitive personal data, we drastically minimize risk to students.'
        ]
      },
      {
        id: 'technical-safeguards',
        heading: '2. Technical Safeguards & Controls',
        content: [
          '• Encryption in Transit: All communications between your web browser and FinLingo servers are strictly enforced over Transport Layer Security (TLS 1.3 / HTTPS). Plain HTTP requests are automatically upgraded.',
          '• Zero Plaintext Passwords: User authentication uses salted PBKDF2 cryptographic derivations. Plaintext passwords are never stored in localStorage, sessionStorage, or logs.',
          '• Image Sanitisation: Uploaded avatar images are inspected via binary magic bytes (verifying genuine JPEG, PNG, or WebP files) and re-encoded client-side through HTML5 Canvas, eliminating malicious metadata, EXIF geotags, and embedded executable scripts.',
          '• Role-Based Least-Privilege Rules: Admin screens and academic editing capabilities are strictly restricted to verified administrative roles.'
        ]
      },
      {
        id: 'access-restrictions',
        heading: '3. Administrative Access Restrictions',
        content: [
          '• Least Privilege: Only authorized system administrators with multi-factor authentication (MFA) enabled have access to cloud infrastructure consoles.',
          '• No Secret Keys in Frontend: Service-account private keys, administrative credentials, and cloud secrets are strictly forbidden from being embedded in client code.',
          '• Audit Logs: Administrative actions, database schema modifications, and deployment changes are recorded in immutable Cloud Audit Logs.'
        ]
      },
      {
        id: 'reporting-concerns',
        heading: '4. Reporting Security Vulnerabilities & Incidents',
        content: [
          'We invite ethical security researchers and scholars to responsibly report any potential vulnerabilities.',
          '• Dedicated Security Contact: [SECURITY / PRIVACY EMAIL: security@finlingo.app or privacy@finlingo.app]',
          '• Response Time: We acknowledge vulnerability reports within 24 hours and provide an initial assessment within 72 hours.',
          '• Safe Harbour: FinLingo will not initiate legal action against individuals who discover vulnerabilities through good-faith, non-destructive testing without accessing other users’ private data.'
        ]
      }
    ]
  },

  cookies: {
    id: 'cookies',
    title: 'Cookie & Local Storage Policy',
    badge: 'Transparent Web Storage',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Details how FinLingo utilizes browser local storage and temporary session tokens to deliver study progress, spaced repetition queues, and user preferences without behavioral ad tracking.',
    lawyerReviewNotice: 'Compliance Note: FinLingo currently uses client-side HTML5 Web Storage (`localStorage`) for functional persistence and zero third-party marketing cookies. If advertising or third-party analytic tags are added in the future, an active consent banner compliant with MeitY guidelines must be deployed.',
    sections: [
      {
        id: 'storage-overview',
        heading: '1. What Are Cookies and Local Storage?',
        content: [
          'Websites utilize client-side storage technologies to remember your preferences and deliver interactive experiences:',
          '• Cookies: Small data snippets stored by web browsers, typically used for session tokens and server-side state.',
          '• HTML5 Local Storage: High-capacity browser storage that saves data directly on your device. Unlike cookies, localStorage data is never automatically transmitted to servers with every single network request, enhancing both speed and privacy.'
        ]
      },
      {
        id: 'storage-manifest',
        heading: '2. Complete Manifest of FinLingo Storage Keys',
        content: [
          'FinLingo is engineered for complete transparency. Here is the comprehensive list of data keys stored on your browser:'
        ],
        subsections: [
          {
            subheading: '• finlingo_user_profile_v1 (Strictly Functional)',
            paragraphs: [
              'Stores your student display name, university, major, graduation year, current XP, earned level title, unlocked badges, privacy settings, and daily study streak. Essential for the gamification dashboard to work.'
            ]
          },
          {
            subheading: '• finlingo_spaced_rep_v1 (Strictly Functional)',
            paragraphs: [
              'Maintains your personal spaced repetition review deck. Stores questions you answered incorrectly, interval mastery levels, and upcoming review timestamps so you can study your weak areas.'
            ]
          },
          {
            subheading: '• finlingo_leaderboard_v1 (Functional / Community)',
            paragraphs: [
              'Caches community student rankings, peer scores, and university badges for fast rendering without constant network refetches.'
            ]
          },
          {
            subheading: '• finlingo_theme_mode (User Preference)',
            paragraphs: [
              'Remembers your visual interface choice: "light" (Warm Ivory & Deep Navy) or "dark" mode across browser refreshes.'
            ]
          }
        ]
      },
      {
        id: 'no-tracking',
        heading: '3. Zero Behavioral Tracking or Third-Party Ad Cookies',
        content: [
          'FinLingo has a strict anti-tracking commitment:',
          '• NO third-party advertising tracking cookies (e.g., Facebook Pixel, Criteo, TikTok).',
          '• NO cross-site behavioral tracking or fingerprinting techniques.',
          '• NO monetization or resale of your clickstream browsing data.'
        ]
      },
      {
        id: 'user-controls',
        heading: '4. How to Manage, Inspect, or Clear Your Storage',
        content: [
          'You hold 100% control over the data stored in your browser:',
          '• In-App Reset: You can clear all FinLingo data instantly by visiting your Profile page or the Privacy Controls tab and clicking "Reset All Data / Erase Profile".',
          '• Browser Developer Tools: You can inspect storage anytime in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari by pressing F12 -> Application / Storage -> Local Storage.',
          '• Browser Settings: You can set your browser to automatically clear cookies and site data whenever you close your browser window.'
        ]
      }
    ]
  },

  deletion: {
    id: 'deletion',
    title: 'Account & Data Deletion Policy',
    badge: 'DPDPA Section 12 Right to Erasure',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Explains how students can delete their accounts, avatar photos, and study history, detailing immediate client-side wipe, cloud erasure workflows, and statutory exceptions.',
    lawyerReviewNotice: 'Statutory Right: Section 12 of the Digital Personal Data Protection Act, 2023 grants Data Principals the right to erasure of personal data that is no longer necessary for the purpose for which it was processed.',
    sections: [
      {
        id: 'deletion-scope',
        heading: '1. What You Can Delete',
        content: [
          'FinLingo provides full self-service erasure tools. You have the right to request deletion of:',
          '• Your entire user account and profile record.',
          '• Uploaded avatar photographs and image metadata.',
          '• Quiz attempt history, XP milestones, and study streak counts.',
          '• Spaced repetition review queues and bookmarked lessons.',
          '• Your rank and entry on the community leaderboard.'
        ]
      },
      {
        id: 'deletion-workflow',
        heading: '2. How to Execute Deletion (Self-Service & Verification)',
        content: [
          'We implement real, automated deletion rather than a cosmetic button:',
          '• Immediate Local Wipe: In the "Profile" or "Privacy Controls" section, clicking "Reset All Data / Erase Profile" immediately clears all FinLingo data keys from your browser localStorage and resets the session to initial state.',
          '• Local Demo Account Erasure: Account reset immediately removes learning history, cached profiles, and local session tokens from browser storage.',
          '• Written Request Option: You may also email [PRIVACY CONTACT EMAIL: privacy@finlingo.app] with the subject "Data Erasure Request". We will process and confirm deletion within thirty (30) days.'
        ]
      },
      {
        id: 'retention-exceptions',
        heading: '3. Legitimate Exceptions to Immediate Erasure',
        content: [
          'Under Indian law (including CERT-In Directions 2022 and Section 8(7) of the DPDPA 2023), certain technical records may be retained temporarily:',
          '• Cybersecurity Logs: Web server access logs containing IP addresses and timestamped request records must be retained for mandatory security monitoring under CERT-In guidelines (typically for up to 180 days).',
          '• Dispute Handling: Records strictly necessary to defend legal claims, prevent fraud, or satisfy binding court orders under the Code of Civil Procedure, 1908 or Information Technology Act, 2000.',
          '• De-identified Aggregate Data: Anonymized curriculum statistics (e.g., aggregate percentage of students who answered a specific accounting question correctly) that contain no personal identifiers cannot be linked back to you and are retained for curriculum refinement.'
        ]
      }
    ]
  },

  community: {
    id: 'community',
    title: 'Community & Leaderboard Fair-Play Rules',
    badge: 'Code of Conduct & Score Integrity',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Sets out standards for respectful participation, permitted avatar imagery, cheating and exploit prevention, score integrity, and reporting mechanisms.',
    lawyerReviewNotice: 'Code of Conduct: Governs acceptable usage under Rule 3(1)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 regarding user-generated content and platform safety.',
    sections: [
      {
        id: 'permitted-content',
        heading: '1. Permitted Profile Photos & Display Names',
        content: [
          'FinLingo is an academic platform for college scholars. Profile photos and display names must reflect a respectful, scholarly environment:',
          '• Acceptable Images: Genuine student portraits, academic illustrations, professional headshots, or clean avatar icons.',
          '• Prohibited Images: Sexually explicit, violent, abusive, harassing, politically inflammatory, defamatory, or infringing third-party trademarks or copyrights.',
          '• Prohibited Names: Usernames that impersonate other students, professors, educational institutions, or contain vulgarity, slurs, or hate speech.'
        ]
      },
      {
        id: 'cheating-prevention',
        heading: '2. Cheating Prevention & Score Integrity',
        content: [
          'To ensure fair competition across college leagues, the following practices are strictly prohibited:',
          '• Scripting / Botting: Using browser extensions, scripts, automated bots, or macros to answer questions automatically.',
          '• Exploit Abuse: Exploiting client-side bugs or manipulating localStorage values to artificially inflate XP, answer counts, or streak lengths.',
          '• Collusion: Sharing accounts to artificially manipulate weekly league rankings.',
          'Consequences: Accounts identified as engaging in cheating or unauthorized manipulation will have their XP reset and may face permanent disqualification from public leaderboards.'
        ]
      },
      {
        id: 'reporting-content',
        heading: '3. Reporting Inappropriate Avatars or Cheating',
        content: [
          'If you encounter an abusive username, offensive profile picture, or suspect fraudulent leaderboard activity:',
          '• Email [GRIEVANCE CONTACT: grievance@finlingo.app or privacy@finlingo.app] with the student’s display name and a screenshot.',
          '• Takedown Timeline: In compliance with Rule 3(2) of the IT Intermediary Rules 2021, unlawful or infringing content will be reviewed and removed within 24 to 72 hours of verification.'
        ]
      }
    ]
  },

  disclaimer: {
    id: 'disclaimer',
    title: 'Academic & Financial Regulatory Disclaimer',
    badge: 'SEBI & ICAI Non-Advisory Notice',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Vital regulatory disclosure confirming that FinLingo is solely an academic learning aid and does NOT provide certified financial advice, investment recommendations, or statutory audit opinions.',
    lawyerReviewNotice: 'Statutory Notice: Indian law strictly regulates investment advice and statutory certifications. This disclosure is designed to ensure FinLingo does not violate SEBI regulations or ICAI Chartered Accountancy practice restrictions.',
    sections: [
      {
        id: 'not-financial-advice',
        heading: '1. No Investment Advice / No SEBI Registration',
        content: [
          '• Purely Educational Aid: FinLingo is an interactive gamified web application created solely for college students studying accounting, economics, corporate finance, and commerce principles.',
          '• NO SEBI Registration: FinLingo, its creators, authors, and operators are NOT registered as Investment Advisers under the Securities and Exchange Board of India (Investment Advisers) Regulations, 2013, nor as Research Analysts under the SEBI (Research Analysts) Regulations, 2014.',
          '• No Buy/Sell Recommendations: None of the terms, case studies, company scenarios (e.g., Apple, Tesla, Reliance, Tata), discount rate examples, stock valuation models, or option pricing questions constitute investment advice, financial planning, portfolio management, or a solicitation to purchase or sell securities.',
          '• Independent Diligence: Users should never base real-world capital allocation, stock trading, cryptocurrency investing, or corporate financial decisions on FinLingo lessons. Always consult a SEBI-registered Investment Adviser (RIA) for investment matters.'
        ]
      },
      {
        id: 'not-accounting-advice',
        heading: '2. No Statutory Audit, Legal, or Tax Certification',
        content: [
          '• No Chartered Accountancy Opinions: FinLingo lessons on debits, credits, balance sheets, cash flow statements, and depreciation methods are academic summaries. They do not constitute formal professional accounting, statutory audit, transfer pricing, or tax advisory under the Chartered Accountants Act, 1949 or Institute of Chartered Accountants of India (ICAI) rules.',
          '• Company Filings & Tax Compliance: For statutory corporate filings with the Ministry of Corporate Affairs (MCA), Goods and Services Tax (GST) returns, or Income Tax compliance in India, always engage a practicing Chartered Accountant (CA) or Company Secretary (CS).'
        ]
      },
      {
        id: 'exam-guarantee',
        heading: '3. Examination Performance & Academic Syllabus Disclaimers',
        content: [
          '• No Performance Guarantee: While curriculum questions are modeled after standard university syllabi (e.g., B.Com, BBA, MBA, CA Foundation, CMA, CS, CFA Level 1), FinLingo makes no guarantee that practicing on our platform will result in passing any specific university or professional licensure examination.',
          '• Syllabus Variations: Accounting standards (Ind AS, IFRS, US GAAP) and economic indicators evolve periodically. Students are encouraged to cross-reference FinLingo lessons with their official university syllabi and textbook publications.'
        ]
      }
    ]
  },

  grievance: {
    id: 'grievance',
    title: 'Grievance Redressal & Statutory Notice',
    badge: 'IT Rules 2021 & DPDPA Sec 13',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[POLICY EFFECTIVE DATE: Pending Formal Launch / October 2026]',
    jurisdiction: 'Republic of India',
    summary: 'Statutory grievance redressal mechanism designating our Grievance Officer, complaint procedures, and statutory resolution timelines under Indian cyber and data protection laws.',
    lawyerReviewNotice: 'Statutory Notice: Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 13 of the DPDPA 2023 require prominent publication of the Grievance Officer’s name and contact details. Operator must populate their confirmed officer details prior to public release.',
    sections: [
      {
        id: 'grievance-officer',
        heading: '1. Designated Grievance Officer Details',
        content: [
          'Pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 13 of the Digital Personal Data Protection Act, 2023, the details of the designated Grievance Officer are set forth below:',
          '• Officer Name: [DESIGNATED GRIEVANCE OFFICER NAME: e.g., Mr. Rohan Sharma]',
          '• Designation: Grievance & Data Protection Redressal Officer',
          '• Organization: [LEGAL OPERATOR NAME: FinLingo Education Technologies]',
          '• Dedicated Email: [GRIEVANCE CONTACT EMAIL: grievance@finlingo.app]',
          '• Secondary Privacy Inquiries: [PRIVACY CONTACT EMAIL: privacy@finlingo.app]',
          '• Postal Address: [GRIEVANCE OFFICE ADDRESS: e.g., Level 4, Tech Park, Outer Ring Road, Bengaluru, Karnataka - 560103, India]',
          '• Operational Hours: Monday to Friday, 10:00 AM to 6:00 PM IST (excluding national and public holidays)'
        ]
      },
      {
        id: 'resolution-timelines',
        heading: '2. Statutory Timelines & Procedure for Lodging Complaints',
        content: [
          'We adhere strictly to statutory response timelines mandated by Indian law:',
          '1. Acknowledgment: We shall acknowledge receipt of any consumer or data privacy grievance within forty-eight (48) hours of receipt.',
          '2. Investigation & Redressal: We will investigate and dispose of the grievance within fifteen (15) days of receipt as prescribed under the Information Technology (Intermediary Guidelines) Rules, 2021, and within the timeline prescribed under the DPDP Rules 2025 (typically within 30 days).',
          '3. What to Include in Your Complaint:',
          '   • Your full name and email address associated with your FinLingo account.',
          '   • A detailed description of the grievance, question prompt, privacy concern, or rights request.',
          '   • Any relevant screenshots or error logs.',
          '   • A statement confirming that the information provided in the complaint is accurate and in good faith.'
        ]
      },
      {
        id: 'escalation-dpbi',
        heading: '3. Escalation to the Data Protection Board of India (DPBI)',
        content: [
          'Under Section 13(3) of the Digital Personal Data Protection Act, 2023, if you have exhausted the grievance redressal mechanism of FinLingo and:',
          '• You do not receive a resolution within the statutory timeframe, or',
          '• You are dissatisfied with the response provided by our Grievance Officer,',
          'You have the legal right to escalate your grievance by making a formal complaint to the Data Protection Board of India (DPBI) in accordance with the rules established by the Central Government.'
        ]
      }
    ]
  },

  'internal-security': {
    id: 'internal-security',
    title: 'Internal Security & Data Breach Response Policy',
    badge: 'Internal Operational Manual (Admins)',
    lastUpdated: 'October 13, 2026',
    effectiveDate: '[INTERNAL EFFECTIVE DATE: October 2026]',
    jurisdiction: 'Republic of India',
    isInternal: true,
    summary: 'Operational manual for project owners, system administrators, and engineering leads covering least-privilege access, credential security, backups, CERT-In 6-hour incident escalation, and DPBI breach response.',
    lawyerReviewNotice: 'Internal Governance: Required under Rule 8 of the IT (SPDI) Rules 2011, Section 8(5) of the DPDPA 2023, and CERT-In Cyber Security Directions 2022. This document is maintained for operational administration and audit readiness.',
    sections: [
      {
        id: 'internal-access-control',
        heading: '1. Access Control & Credential Governance',
        content: [
          '• Principle of Least Privilege: Access to production servers, DNS records, and source repositories must be strictly limited to designated engineering administrators.',
          '• Mandatory MFA: Hardware keys or time-based one-time password (TOTP) authenticator apps must be enforced for all administrator accounts with write or deploy permissions. SMS 2FA is discouraged.',
          '• Zero Plaintext Secrets in Code: No server private keys, production API keys, or administrative tokens shall ever be committed to git repositories or client bundles. All keys must be stored in secure environment secrets managers.',
          '• Quarterly Access Reviews: Administrator privileges must be reviewed every 90 days. Access for offboarded contributors must be revoked immediately upon separation.'
        ]
      },
      {
        id: 'data-sanitization-backup',
        heading: '2. Backup, Recovery, and Storage Security',
        content: [
          '• Database Automated Backups: Regular automated backups must be configured with a 30-day retention window in an isolated storage facility.',
          '• Point-in-Time Recovery (PITR): PITR must be enabled for production databases to allow rollback in case of accidental corruption or data loss.',
          '• Storage Hygiene: Unused or orphaned avatar files must be cleaned via an automated lifecycle rule after 30 days of account deletion.',
          '• Client Data Sanitisation: The client application strictly validates file uploads (JPEG/PNG/WebP, max 5 MB) and strips EXIF metadata via canvas re-encoding before storage.'
        ]
      },
      {
        id: 'incident-classification',
        heading: '3. Incident Classification & Escalation Matrix',
        content: [
          'Incidents are classified into three severity levels:',
          '• P1 (Critical): Confirmed unauthorized access or exfiltration of user database records, widespread service compromise, or credential leakage. Escalation: Immediate (within 1 hour) to Incident Commander and Legal Counsel.',
          '• P2 (Major): Disruption of service, unauthorized alteration of leaderboard scores, or suspicious failed authentication surges. Escalation: Within 4 hours to Engineering Lead.',
          '• P3 (Minor): Individual localized bugs, isolated client-side errors with no data exposure. Escalation: Next business day.'
        ]
      },
      {
        id: 'statutory-notifications',
        heading: '4. Statutory Notifications & Timelines (CERT-In & DPBI)',
        content: [
          '1. CERT-In Mandatory 6-Hour Reporting: Under the Cyber Security Directions issued by the Indian Computer Emergency Response Team (CERT-In) under Section 70B(6) of the Information Technology Act, 2000, designated cyber security incidents (including data breach, identity theft, unauthorized access to systems/data) must be reported to CERT-In within six (6) hours of noticing or being brought to notice.',
          '• CERT-In Incident Reporting Portal: incident@cert-in.org.in or https://www.cert-in.org.in',
          '2. Data Protection Board of India (DPBI) Notification: In accordance with Section 8(6) of the DPDPA 2023 and the DPDP Rules 2025, upon determining that a personal data breach has occurred, the Data Fiduciary must give intimation of such breach to the Board and each affected Data Principal in such form and manner as prescribed.',
          '3. Contents of Notice: Brief description of breach, date/time discovered, categories and volume of personal data affected, potential consequences, mitigating steps taken, and contact details of the Grievance Officer.'
        ]
      },
      {
        id: 'containment-postmortem',
        heading: '5. Containment, Forensics, and Post-Mortem',
        content: [
          '• Immediate Containment: Revoke compromised API keys, rotate service tokens, invalidate affected session tokens, and deploy restrictive firewall rules if necessary.',
          '• Evidence Preservation: Preserve server logs, audit trails, and git commit history without modification for forensic analysis by cybersecurity professionals.',
          '• Root Cause Analysis (RCA): Within seven (7) business days of incident resolution, the engineering lead must author a comprehensive RCA detailing timeline, root cause, impact, corrective actions, and prevention roadmap.'
        ]
      }
    ]
  }
};
