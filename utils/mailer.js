import { BrevoClient } from '@getbrevo/brevo';

const LOGO    = 'https://res.cloudinary.com/djoafwyhn/image/upload/v1774711669/tut_vn6j0w.png';
const ADDRESS = 'Plot No. 189/190, Kapsi (Khurd), Near Pardi Naka, Bhandara Road, Nagpur - 441108 (MH)';

// ── Brevo v4 client (lazy-initialized) ───────────────────────────────────────
let _client = null;
function getClient() {
  if (!_client) {
    _client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  }
  return _client;
}

const COMPANY_EMAIL = () => process.env.COMPANY_EMAIL;
const SENDER_EMAIL  = () => process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME   = () => process.env.BREVO_SENDER_NAME || 'Tirupati Road Lines Pvt. Ltd.';

// ── SHARED LAYOUT ─────────────────────────────────────────────────────────────

const header = `
  <div style="background:#0d0d1a;padding:28px 40px;border-bottom:3px solid #c9a227;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="width:60px;vertical-align:middle;">
          <img src="${LOGO}" alt="TRL" style="height:52px;width:52px;object-fit:contain;display:block;" />
        </td>
        <td style="vertical-align:middle;padding-left:16px;">
          <div style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#c9a227;letter-spacing:1px;line-height:1.2;">TIRUPATI ROAD LINES PVT. LTD.</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:2px;margin-top:3px;">EST. 2013 &nbsp;·&nbsp; NAGPUR, MAHARASHTRA</div>
        </td>
      </tr>
    </table>
  </div>
`;

const footer = `
  <div style="background:#080810;padding:24px 40px;border-top:1px solid #1e1e32;text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:13px;margin:0 0 5px;">
      <span style="color:#f5f5f0;font-weight:600;">Email:</span>
      <a href="mailto:tirupatiunion@gmail.com" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;"> tirupatiunion@gmail.com</a>
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;margin:0 0 5px;">
      <span style="color:#f5f5f0;font-weight:600;">Phone 1:</span>
      <a href="tel:+918446123777" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;"> +91 8446123777</a>
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;margin:0 0 5px;">
      <span style="color:#f5f5f0;font-weight:600;">Phone 2:</span>
      <a href="tel:+919371237770" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;"> +91 9371237770</a>
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;margin:0 0 16px;">
      <span style="color:#f5f5f0;font-weight:600;">Address:</span>
      <span style="color:#c9a227;"> ${ADDRESS}</span>
    </p>
    <p style="font-family:Arial,sans-serif;color:#444;font-size:11px;margin:0;border-top:1px solid #1e1e32;padding-top:14px;">
      &copy; 2025 Tirupati Road Lines Pvt. Ltd. All Rights Reserved.
    </p>
  </div>
`;

const wrap = (body) => `<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#e8e8e8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.25);">
    ${header}
    <div style="background:#0d0d1a;padding:32px 40px;">
      ${body}
    </div>
    ${footer}
  </div>
</body>
</html>`;

// ── ROW helper ────────────────────────────────────────────────────────────────
const row = (label, value, gold = false) => `
  <tr style="border-bottom:1px solid #1e1e32;">
    <td style="padding:11px 0;font-family:Arial,sans-serif;color:#888;font-size:13px;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:11px 0;font-family:Arial,sans-serif;color:${gold ? '#c9a227' : '#f5f5f0'};font-size:13px;font-weight:${gold ? '700' : '400'};">${value}</td>
  </tr>
`;

// ── Brevo send helper ─────────────────────────────────────────────────────────
async function sendEmail({ to, toName, subject, htmlContent, replyTo }) {
  const payload = {
    sender:      { name: SENDER_NAME(), email: SENDER_EMAIL() },
    to:          [{ email: to, name: toName || to }],
    subject,
    htmlContent,
  };
  if (replyTo) payload.replyTo = { email: replyTo };

  return getClient().transactionalEmails.sendTransacEmail(payload);
}

// ── INQUIRY (Contact Us) ──────────────────────────────────────────────────────

export async function sendInquiryEmails({ senderName, email, phone, subject, message }) {

  // 1. Alert to company with full inquiry details
  try {
    await sendEmail({
      to: COMPANY_EMAIL(),
      toName: 'Tirupati Road Lines',
      subject: `New Inquiry: ${subject} — ${senderName}`,
      replyTo: email,
      htmlContent: wrap(`
        <div style="display:inline-block;background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.3);border-radius:6px;padding:5px 14px;margin-bottom:24px;">
          <span style="font-family:Arial,sans-serif;color:#c9a227;font-size:11px;font-weight:700;letter-spacing:2px;">NEW CONTACT INQUIRY</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${row('Name', `<strong>${senderName}</strong>`)}
          ${row('Email', `<a href="mailto:${email}" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;">${email}</a>`)}
          ${row('Phone', phone || '—')}
          ${row('Subject', subject, true)}
        </table>
        <div style="background:#1a1a2e;border-left:4px solid #c9a227;padding:18px 22px;border-radius:0 8px 8px 0;margin-bottom:20px;">
          <p style="font-family:Arial,sans-serif;color:#888;font-size:11px;letter-spacing:2px;margin:0 0 8px;text-transform:uppercase;">Message</p>
          <p style="font-family:Arial,sans-serif;color:#f5f5f0;font-size:14px;line-height:1.8;margin:0;">${message}</p>
        </div>
        <p style="font-family:Arial,sans-serif;color:#666;font-size:12px;margin:0;">
          Reply to this email to respond directly to ${senderName}.
        </p>
      `),
    });
    console.log('✅ Company inquiry alert sent to', COMPANY_EMAIL());
  } catch (err) { console.error('❌ Company inquiry email failed:', err.message); }

  // 2. Thank-you confirmation to the user
  if (email) {
    try {
      await sendEmail({
        to: email,
        toName: senderName,
        subject: 'Thank You for Contacting Tirupati Road Lines Pvt. Ltd.',
        htmlContent: wrap(`
          <h2 style="font-family:Arial,sans-serif;color:#f5f5f0;font-size:20px;font-weight:700;margin:0 0 10px;">Thank You, ${senderName}!</h2>
          <p style="font-family:Arial,sans-serif;color:#aaa;font-size:14px;line-height:1.8;margin:0 0 24px;">
            We have received your inquiry regarding
            <span style="color:#c9a227;font-weight:700;">${subject}</span>.
            Our team will review your message and get back to you within
            <span style="color:#f5f5f0;font-weight:700;">24 hours</span>.
          </p>
          <div style="background:#1a1a2e;border-radius:8px;padding:20px 24px;border:1px solid #2a2a3e;margin-bottom:24px;">
            <p style="font-family:Arial,sans-serif;color:#888;font-size:11px;letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;">Your Message</p>
            <p style="font-family:Arial,sans-serif;color:#ccc;font-size:14px;line-height:1.8;margin:0;font-style:italic;">"${message}"</p>
          </div>
          <div style="background:#111827;border:1px solid rgba(201,162,39,0.25);border-radius:8px;padding:20px 24px;">
            <p style="font-family:Arial,sans-serif;color:#c9a227;font-weight:700;font-size:13px;margin:0 0 10px;">What's Next?</p>
            <p style="font-family:Arial,sans-serif;color:#aaa;font-size:13px;line-height:1.8;margin:0;">
              A member of our team will personally reach out to you via email or phone to address your query.
              In the meantime, feel free to call us at
              <a href="tel:+918446123777" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;">+91 8446123777</a>.
            </p>
          </div>
        `),
      });
      console.log('✅ Thank-you email sent to', email);
    } catch (err) { console.error('❌ User inquiry email failed:', err.message); }
  }
}

// ── BOOKING (Book Truck) ──────────────────────────────────────────────────────

export async function sendBookingEmails({ customerName, email, phone, materialType, weight, pickupLocation, dropLocation, date }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // 1. New booking alert to company
  try {
    await sendEmail({
      to: COMPANY_EMAIL(),
      toName: 'Tirupati Road Lines',
      subject: `New Booking — ${customerName} | ${materialType} | ${formattedDate}`,
      htmlContent: wrap(`
        <div style="display:inline-block;background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.3);border-radius:6px;padding:5px 14px;margin-bottom:24px;">
          <span style="font-family:Arial,sans-serif;color:#c9a227;font-size:11px;font-weight:700;letter-spacing:2px;">NEW TRUCK BOOKING</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${row('Customer', `<strong>${customerName}</strong>`)}
          ${row('Phone', `<a href="tel:${phone}" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;">${phone}</a>`)}
          ${row('Email', email ? `<a href="mailto:${email}" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;">${email}</a>` : '—')}
          ${row('Material', materialType, true)}
          ${row('Tonnage', weight || 'Not specified')}
          ${row('Pickup', pickupLocation)}
          ${row('Drop', dropLocation)}
          ${row('Date', formattedDate, true)}
        </table>
        <div style="background:#1a1a2e;border-left:4px solid #c9a227;padding:16px 20px;border-radius:0 8px 8px 0;">
          <p style="font-family:Arial,sans-serif;color:#aaa;font-size:13px;margin:0;">
            Call <strong style="color:#f5f5f0;">${customerName}</strong> at
            <a href="tel:${phone}" style="color:#c9a227;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;">${phone}</a>
            to confirm this booking.
          </p>
        </div>
      `),
    });
    console.log('✅ Company booking alert sent to', COMPANY_EMAIL());
  } catch (err) { console.error('❌ Company booking email failed:', err.message); }

  // 2. Booking confirmation to user
  if (email) {
    try {
      await sendEmail({
        to: email,
        toName: customerName,
        subject: 'Booking Request Received — Tirupati Road Lines Pvt. Ltd.',
        htmlContent: wrap(`
          <h2 style="font-family:Arial,sans-serif;color:#f5f5f0;font-size:20px;font-weight:700;margin:0 0 6px;">Booking Request Received!</h2>
          <p style="font-family:Arial,sans-serif;color:#aaa;font-size:14px;margin:0 0 28px;">
            Dear <span style="color:#f5f5f0;font-weight:700;">${customerName}</span>, your request has been submitted successfully.
          </p>
          <div style="background:#1a1a2e;border-radius:8px;padding:24px;margin-bottom:24px;border:1px solid #2a2a3e;">
            <p style="font-family:Arial,sans-serif;color:#c9a227;font-weight:700;font-size:11px;letter-spacing:2px;margin:0 0 16px;text-transform:uppercase;">Booking Summary</p>
            <table style="width:100%;border-collapse:collapse;">
              ${row('Material', `<strong>${materialType}</strong>`, true)}
              ${row('Tonnage', weight || 'Not specified')}
              ${row('From', pickupLocation)}
              ${row('To', dropLocation)}
              ${row('Date', formattedDate, true)}
            </table>
          </div>
          <div style="background:#111827;border:1px solid rgba(201,162,39,0.25);border-radius:8px;padding:20px 24px;">
            <p style="font-family:Arial,sans-serif;color:#c9a227;font-weight:700;font-size:13px;margin:0 0 14px;">What happens next?</p>
            <p style="font-family:Arial,sans-serif;color:#aaa;font-size:13px;line-height:1.8;margin:0 0 8px;">
              Our logistics team has received your booking request.
            </p>
            <p style="font-family:Arial,sans-serif;color:#aaa;font-size:13px;line-height:1.8;margin:0 0 8px;">
              We will call you at <span style="color:#f5f5f0;font-weight:700;">${phone}</span> within
              <span style="color:#f5f5f0;font-weight:700;">2 hours</span> to confirm availability and finalize shipment details.
            </p>
            <p style="font-family:Arial,sans-serif;color:#aaa;font-size:13px;line-height:1.8;margin:0;">
              Once confirmed, your cargo will be GPS-tracked from pickup to delivery.
            </p>
          </div>
        `),
      });
      console.log('✅ Booking confirmation sent to', email);
    } catch (err) { console.error('❌ User booking email failed:', err.message); }
  }
}
