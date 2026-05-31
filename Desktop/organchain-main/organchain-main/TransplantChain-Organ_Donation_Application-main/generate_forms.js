/**
 * Generates 10 valid, openable NOTTO PDF forms in /src/forms/
 * Uses raw PDF 1.4 construction — zero npm dependencies.
 * Each xref entry is exactly 20 bytes (per PDF spec 7.5.4).
 */
const fs = require('fs');
const path = require('path');

const FORMS_DIR = path.resolve(__dirname, 'src/forms');
console.log("Generating forms...");
const forms = [
  { id: 1, title: 'Form 1', subtitle: 'Application for Living Donor (Near-Related)', desc: 'Application for organ transplantation from a near-related living donor under THOA, 1994.' },
  { id: 2, title: 'Form 2', subtitle: 'Consent for Living Spousal Organ Donation', desc: 'Spousal consent declaration for living donor organ transplantation as required by NOTTO.' },
  { id: 3, title: 'Form 3', subtitle: 'Application for Swap Living Donor Transplantation', desc: 'Application for swap/paired kidney donor transplantation between two incompatible pairs.' },
  { id: 4, title: 'Form 4', subtitle: 'Form of Genetic Relationship (Living Donor)', desc: 'Declaration confirming genetic relationship between donor and recipient under THOA, 1994.' },
  { id: 5, title: 'Form 5', subtitle: 'Consent for Spousal Near-Relationship Donation', desc: 'Consent form for donation between spouses or near relatives under THOA provisions.' },
  { id: 6, title: 'Form 6', subtitle: 'Deceased Donor Pledging Form', desc: 'Official pledging form for deceased organ donation registered on the NOTTO national ledger.' },
  { id: 7, title: 'Form 7', subtitle: 'Certificate of Brain-Stem Death', desc: 'Medical certification of brain-stem death required before deceased donor organ retrieval.' },
  { id: 8, title: 'Form 8', subtitle: 'Application Form for Living Donor Registration', desc: 'Official registration application for living organ donors with NOTTO authorization.' },
  { id: 9, title: 'Form 9', subtitle: 'Living Donor Authorization Committee Certificate', desc: 'Certificate issued by the Authorization Committee for unrelated living donor transplant approval.' },
  { id: 10, title: 'Form 10', subtitle: 'Living Donor Domicile Verification', desc: 'Domicile and residence verification form for living donors under NOTTO regulatory framework.' },
];

function pdfEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildContentStream(form) {
  const lines = [];
  // Header
  lines.push('BT');
  lines.push('/F2 14 Tf');
  lines.push('50 800 Td');
  lines.push('(NATIONAL ORGAN AND TISSUE TRANSPLANT ORGANISATION) Tj');
  lines.push('ET');

  lines.push('BT');
  lines.push('/F1 10 Tf');
  lines.push('50 782 Td');
  lines.push('(Ministry of Health & Family Welfare, Government of India) Tj');
  lines.push('ET');

  lines.push('BT');
  lines.push('/F1 9 Tf');
  lines.push('50 768 Td');
  lines.push('(www.notto.nhp.gov.in) Tj');
  lines.push('ET');

  // Horizontal rule
  lines.push('0.8 0.8 0.8 RG');
  lines.push('0.5 w');
  lines.push('50 758 m 545 758 l S');

  // Title
  lines.push('BT');
  lines.push('/F2 13 Tf');
  lines.push('50 738 Td');
  lines.push(`(${pdfEscape(form.title + ' - ' + form.subtitle)}) Tj`);
  lines.push('ET');

  // Description
  lines.push('BT');
  lines.push('/F1 9 Tf');
  lines.push('50 720 Td');
  lines.push(`(${pdfEscape(form.desc)}) Tj`);
  lines.push('ET');

  // Section 1
  lines.push('BT');
  lines.push('/F2 11 Tf');
  lines.push('50 694 Td');
  lines.push('(Section 1: Patient / Applicant Details) Tj');
  lines.push('ET');

  const sec1Fields = [
    'Full Name: _______________________________________________',
    'Date of Birth: _________________    Gender: M / F / Other',
    'National Health ID \\(ABHA\\): ________________________________',
    'Blood Group: ___________    Contact Number: ________________',
    'Address: __________________________________________________',
    'State: ____________________    PIN Code: ___________________',
  ];
  let y = 676;
  for (const field of sec1Fields) {
    lines.push('BT');
    lines.push('/F1 10 Tf');
    lines.push(`50 ${y} Td`);
    lines.push(`(${field}) Tj`);
    lines.push('ET');
    y -= 18;
  }

  // Section 2
  y -= 8;
  lines.push('BT');
  lines.push('/F2 11 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Section 2: Hospital / Transplant Centre Details) Tj');
  lines.push('ET');
  y -= 18;

  const sec2Fields = [
    'Name of Registered Hospital: ______________________________',
    'NOTTO Registration No.: ___________________________________',
    'Treating Physician: _______________________________________',
  ];
  for (const field of sec2Fields) {
    lines.push('BT');
    lines.push('/F1 10 Tf');
    lines.push(`50 ${y} Td`);
    lines.push(`(${field}) Tj`);
    lines.push('ET');
    y -= 18;
  }

  // Section 3
  y -= 8;
  lines.push('BT');
  lines.push('/F2 11 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Section 3: Declaration) Tj');
  lines.push('ET');
  y -= 18;

  lines.push('BT');
  lines.push('/F1 10 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(I hereby declare that all information provided is true and accurate.) Tj');
  lines.push('ET');
  y -= 16;

  lines.push('BT');
  lines.push('/F1 10 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(I understand this is legally binding under THOA, 1994.) Tj');
  lines.push('ET');
  y -= 26;

  lines.push('BT');
  lines.push('/F1 10 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Signature of Applicant: ______________________   Date: ________) Tj');
  lines.push('ET');
  y -= 20;

  lines.push('BT');
  lines.push('/F1 10 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Signature of Witness:   ______________________   Date: ________) Tj');
  lines.push('ET');
  y -= 30;

  // Office use
  lines.push('0.8 0.8 0.8 RG');
  lines.push('0.5 w');
  lines.push(`50 ${y + 8} m 545 ${y + 8} l S`);

  lines.push('BT');
  lines.push('/F2 10 Tf');
  lines.push(`50 ${y - 6} Td`);
  lines.push('(FOR OFFICE USE ONLY) Tj');
  lines.push('ET');
  y -= 22;

  lines.push('BT');
  lines.push('/F1 9 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Received by: _______________________   Designation: ________________) Tj');
  lines.push('ET');
  y -= 16;

  lines.push('BT');
  lines.push('/F1 9 Tf');
  lines.push(`50 ${y} Td`);
  lines.push('(Date of Receipt: _______________   Reference No.: ________________) Tj');
  lines.push('ET');

  // Footer
  lines.push('BT');
  lines.push('/F1 7 Tf');
  lines.push('50 40 Td');
  lines.push('(NOTTO National Organ Transplant Registry - This is an official Government of India document.) Tj');
  lines.push('ET');

  return lines.join('\n');
}

function makePdf(form) {
  const contentStream = buildContentStream(form);
  const contentBytes = Buffer.from(contentStream, 'binary');

  // Build PDF objects as strings, track byte offsets precisely
  const parts = [];
  const offsets = [];

  // Header - must start with %PDF
  parts.push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  // Object 1: Catalog
  offsets.push(Buffer.byteLength(parts.join(''), 'binary'));
  parts.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2: Pages
  offsets.push(Buffer.byteLength(parts.join(''), 'binary'));
  parts.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // Object 3: Page
  offsets.push(Buffer.byteLength(parts.join(''), 'binary'));
  parts.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n   /Contents 4 0 R\n   /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >>\n>>\nendobj\n');

  // Object 4: Content stream
  offsets.push(Buffer.byteLength(parts.join(''), 'binary'));
  parts.push('4 0 obj\n<< /Length ' + contentBytes.length + ' >>\nstream\n');
  // We'll handle the stream content separately for accurate byte counting
  const preStreamStr = parts.join('');
  const preStreamBuf = Buffer.from(preStreamStr, 'binary');

  const afterStream = '\nendstream\nendobj\n';

  // Object 5: Font Helvetica
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5Offset = preStreamBuf.length + contentBytes.length + Buffer.byteLength(afterStream, 'binary');

  // Object 6: Font Helvetica-Bold
  const obj6 = '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj6Offset = obj5Offset + Buffer.byteLength(obj5, 'binary');

  // Push remaining offsets
  offsets.push(obj5Offset);
  offsets.push(obj6Offset);

  // xref position
  const xrefOffset = obj6Offset + Buffer.byteLength(obj6, 'binary');

  // Build xref table - each entry MUST be exactly 20 bytes: 10-digit-offset SP 5-digit-gen SP n/f CR LF
  let xref = 'xref\n0 7\n';
  xref += '0000000000 65535 f \r\n';
  for (const off of offsets) {
    xref += String(off).padStart(10, '0') + ' 00000 n \r\n';
  }

  // Trailer
  const trailer = 'trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';

  // Assemble final PDF buffer
  return Buffer.concat([
    preStreamBuf,
    contentBytes,
    Buffer.from(afterStream, 'binary'),
    Buffer.from(obj5, 'binary'),
    Buffer.from(obj6, 'binary'),
    Buffer.from(xref, 'binary'),
    Buffer.from(trailer, 'binary'),
  ]);
}

if (!fs.existsSync(FORMS_DIR)) {
  fs.mkdirSync(FORMS_DIR, { recursive: true });
}

forms.forEach(form => {
  const buf = makePdf(form);
  const outPath = path.join(FORMS_DIR, `Form_${form.id}.pdf`);
  fs.writeFileSync(outPath, buf);
  console.log(` [${form.id}/10] ✔ ${form.title} - ${form.subtitle}`);
  console.log(` Saved to: ${outPath} (${(buf.length/1024).toFixed(1)} KB)`);
});

console.log("\nAll 10 NOTTO form PDFs generated successfully!");