/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDocument } from '../data/legalPolicies';

/**
 * Handles printing and saving legal documents as PDF.
 * Works reliably across standard desktop browsers, mobile, and sandboxed iframes.
 */
export function printOrSaveLegalDocument(doc: LegalDocument | undefined): { success: boolean; message: string } {
  if (!doc) {
    return {
      success: false,
      message: 'Please select a legal policy tab to print or export.'
    };
  }

  // 1. Attempt native browser window.print()
  let nativePrintInvoked = false;
  try {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
      nativePrintInvoked = true;
    }
  } catch (err) {
    console.warn('Native window.print() was suppressed by iframe sandbox:', err);
  }

  // 2. Build a high-fidelity, printable HTML document with embedded CSS for direct PDF export
  try {
    const formattedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title} - FinLingo Statutory Legal Policy</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    @media print {
      body {
        padding: 0;
        background: #fff;
        color: #172b4d;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-after: always;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #263238;
      max-width: 840px;
      margin: 0 auto;
      padding: 36px 24px;
      background: #ffffff;
    }
    .header-bar {
      border-bottom: 3px solid #E96746;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #173B63;
      margin: 0 0 6px 0;
    }
    .doc-title {
      font-size: 20px;
      font-weight: 800;
      color: #263238;
      margin: 0 0 8px 0;
    }
    .meta-strip {
      font-size: 12px;
      color: #52647A;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
    .badge {
      display: inline-block;
      background: #FDECE7;
      color: #E96746;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      border: 1px solid rgba(233, 103, 70, 0.3);
    }
    .summary-card {
      background: #FFF8ED;
      border: 1px solid #EDE3D2;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      font-size: 13.5px;
      color: #263238;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #173B63;
      margin-top: 28px;
      margin-bottom: 10px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #263238;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    p {
      margin: 8px 0;
      font-size: 13px;
      line-height: 1.6;
    }
    ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
      font-size: 13px;
    }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #E2E8F0;
      font-size: 11px;
      color: #64748B;
      text-align: center;
    }
    .print-actions {
      margin-bottom: 24px;
      padding: 12px 16px;
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #E96746;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <span><strong>Printable PDF Export Ready:</strong> Click below to print or choose "Save as PDF" in your print dialog.</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header-bar">
    <div class="brand-title">FinLingo — Gamified Commerce & Finance Academy</div>
    <h1 class="doc-title">${doc.title}</h1>
    <div class="meta-strip">
      <span class="badge">${doc.jurisdiction}</span>
      <span><strong>Compliance:</strong> ${doc.badge}</span>
      <span><strong>Effective Date:</strong> ${doc.effectiveDate}</span>
      <span><strong>Last Audited:</strong> ${doc.lastUpdated}</span>
    </div>
  </div>

  <div class="summary-card">
    <strong>Executive Summary:</strong> ${doc.summary}
  </div>

  <div class="content-body">
    ${doc.sections.map(s => `
      <h2>${s.heading}</h2>
      ${s.content.map(p => `<p>${p}</p>`).join('')}
      ${s.subsections ? s.subsections.map(sub => `
        <h3>${sub.subheading}</h3>
        ${sub.paragraphs.map(p => `<p>${p}</p>`).join('')}
      `).join('') : ''}
    `).join('')}
  </div>

  <div class="footer">
    <p>FinLingo Legal & Privacy Operations · Contact: legal@finlingo.app · Grievance Officer: grievance@finlingo.app</p>
    <p>Document generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Official Academic Governance Record</p>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', function() {
      // Auto-trigger print dialog when opened in a new tab/window
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {}
      }, 400);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([formattedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `finlingo-${sanitizedTitle}-policy.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: `Printable file downloaded (${doc.title}). Open file to Print / Save as PDF.`
    };
  } catch (error) {
    console.error('Error generating printable document:', error);
    return {
      success: nativePrintInvoked,
      message: nativePrintInvoked
        ? 'Print dialog invoked.'
        : 'Unable to generate document. Please check browser permissions.'
    };
  }
}
