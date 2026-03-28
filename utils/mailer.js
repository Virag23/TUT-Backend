import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const COMPANY_EMAIL = process.env.COMPANY_EMAIL;
const FROM = `"Tirupati Road Lines" <${process.env.EMAIL_USER}>`;

// ── INQUIRY ───────────────────────────────────────────────────────────────────

export async function sendInquiryEmails({ senderName, email, phone, subject, message }) {
  // 1. To company
  await transporter.sendMail({
    from: FROM,
    to: COMPANY_EMAIL,
    subject: `New Inquiry: ${subject} — from ${senderName}`,
    replyTo: email,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f5f5f0;padding:32px;border-radius:12px;">
        <div style="border-bottom:2px solid #c9a227;padding-bottom:16px;margin-bottom:24px;">
          <h2 style="color:#c9a227;margin:0;">New Contact Inquiry</h2>
          <p style="color:#aaa;margin:4px 0 0;">Tirupati Road Lines — Website Contact Form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#aaa;width:140px;">Name</td><td style="padding:10px 0;color:#f5f5f0;font-weight:600;">${senderName}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Email</td><td style="padding:10px 0;color:#f5f5f0;">${email}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Phone</td><td style="padding:10px 0;color:#f5f5f0;">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Subject</td><td style="padding:10px 0;color:#c9a227;font-weight:600;">${subject}</td></tr>
        </table>
        <div style="margin-top:20px;background:#1a1a2e;padding:20px;border-radius:8px;border-left:3px solid #c9a227;">
          <p style="color:#aaa;margin:0 0 8px;font-size:13px;letter-spacing:1px;">MESSAGE</p>
          <p style="color:#f5f5f0;margin:0;line-height:1.7;">${message}</p>
        </div>
        <p style="color:#555;font-size:12px;margin-top:24px;">Hit Reply to respond directly to ${senderName} at ${email}.</p>
      </div>
    `,
  });

  // 2. Thank-you to user
  if (email) {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: 'Thank You for Contacting Tirupati Road Lines',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f5f5f0;padding:32px;border-radius:12px;">
          <div style="text-align:center;padding-bottom:24px;border-bottom:2px solid #c9a227;margin-bottom:28px;">
            <h1 style="color:#c9a227;margin:0;font-size:26px;">Tirupati Road Lines</h1>
            <p style="color:#aaa;margin:6px 0 0;font-size:13px;">EST. 2013 · NAGPUR, MAHARASHTRA</p>
          </div>
          <h2 style="color:#f5f5f0;margin:0 0 12px;">Thank You, ${senderName}!</h2>
          <p style="color:#ccc;line-height:1.8;margin:0 0 20px;">
            We have received your inquiry regarding <strong style="color:#c9a227;">${subject}</strong>.
            Our team will review your message and get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-bottom:24px;">
            <p style="color:#aaa;margin:0 0 8px;font-size:13px;letter-spacing:1px;">YOUR MESSAGE</p>
            <p style="color:#f5f5f0;margin:0;line-height:1.7;font-style:italic;">"${message}"</p>
          </div>
          <div style="background:rgba(201,162,39,0.08);padding:20px;border-radius:8px;border:1px solid rgba(201,162,39,0.3);margin-bottom:24px;">
            <p style="color:#c9a227;font-weight:700;margin:0 0 10px;">Need immediate assistance?</p>
            <p style="color:#ccc;margin:0;">📞 <a href="tel:+918446123777" style="color:#c9a227;">+91 84461 23777</a> / <a href="tel:+919371237770" style="color:#c9a227;">+91 93712 37770</a></p>
            <p style="color:#ccc;margin:8px 0 0;">✉️ <a href="mailto:tirupatiunion@gmail.com" style="color:#c9a227;">tirupatiunion@gmail.com</a></p>
            <p style="color:#ccc;margin:8px 0 0;">📍 Nagpur–Bhandara Road, Nagpur, Maharashtra – 440 035</p>
          </div>
          <p style="color:#555;font-size:12px;text-align:center;margin:0;">© 2025 Tirupati Road Lines Pvt. Ltd. · All Rights Reserved</p>
        </div>
      `,
    });
  }
}

// ── BOOKING ───────────────────────────────────────────────────────────────────

export async function sendBookingEmails({ customerName, email, phone, materialType, weight, pickupLocation, dropLocation, date }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // 1. To company
  await transporter.sendMail({
    from: FROM,
    to: COMPANY_EMAIL,
    subject: `🚛 New Booking — ${customerName} | ${materialType} | ${formattedDate}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f5f5f0;padding:32px;border-radius:12px;">
        <div style="border-bottom:2px solid #c9a227;padding-bottom:16px;margin-bottom:24px;">
          <h2 style="color:#c9a227;margin:0;">🚛 New Truck Booking Request</h2>
          <p style="color:#aaa;margin:4px 0 0;">Tirupati Road Lines — Website Booking Form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#aaa;width:160px;">Customer Name</td><td style="padding:10px 0;color:#f5f5f0;font-weight:600;">${customerName}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Phone</td><td style="padding:10px 0;color:#f5f5f0;font-weight:600;">${phone}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Email</td><td style="padding:10px 0;color:#f5f5f0;">${email || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Material Type</td><td style="padding:10px 0;color:#c9a227;font-weight:700;">${materialType}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Tonnage</td><td style="padding:10px 0;color:#f5f5f0;">${weight || 'Not specified'}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Pickup Location</td><td style="padding:10px 0;color:#f5f5f0;">${pickupLocation}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Drop Location</td><td style="padding:10px 0;color:#f5f5f0;">${dropLocation}</td></tr>
          <tr><td style="padding:10px 0;color:#aaa;">Shipment Date</td><td style="padding:10px 0;color:#c9a227;font-weight:700;">${formattedDate}</td></tr>
        </table>
        <div style="margin-top:20px;background:#1a1a2e;padding:16px 20px;border-radius:8px;border-left:3px solid #c9a227;">
          <p style="color:#aaa;margin:0;font-size:13px;">📞 Call <strong style="color:#f5f5f0;">${customerName}</strong> at <strong style="color:#c9a227;">${phone}</strong> to confirm this booking.</p>
        </div>
      </div>
    `,
  });

  // 2. Confirmation to user
  if (email) {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: 'Booking Request Received — Tirupati Road Lines',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f5f5f0;padding:32px;border-radius:12px;">
          <div style="text-align:center;padding-bottom:24px;border-bottom:2px solid #c9a227;margin-bottom:28px;">
            <h1 style="color:#c9a227;margin:0;font-size:26px;">Tirupati Road Lines</h1>
            <p style="color:#aaa;margin:6px 0 0;font-size:13px;">EST. 2013 · NAGPUR, MAHARASHTRA</p>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:48px;">🚛</div>
            <h2 style="color:#f5f5f0;margin:12px 0 8px;">Booking Request Received!</h2>
            <p style="color:#aaa;margin:0;">Dear ${customerName}, your request has been submitted successfully.</p>
          </div>
          <div style="background:#1a1a2e;padding:24px;border-radius:8px;margin-bottom:24px;">
            <p style="color:#c9a227;font-weight:700;margin:0 0 16px;font-size:13px;letter-spacing:1px;">BOOKING SUMMARY</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#aaa;width:140px;">Material</td><td style="padding:8px 0;color:#f5f5f0;font-weight:600;">${materialType}</td></tr>
              <tr><td style="padding:8px 0;color:#aaa;">Tonnage</td><td style="padding:8px 0;color:#f5f5f0;">${weight || 'Not specified'}</td></tr>
              <tr><td style="padding:8px 0;color:#aaa;">From</td><td style="padding:8px 0;color:#f5f5f0;">${pickupLocation}</td></tr>
              <tr><td style="padding:8px 0;color:#aaa;">To</td><td style="padding:8px 0;color:#f5f5f0;">${dropLocation}</td></tr>
              <tr><td style="padding:8px 0;color:#aaa;">Date</td><td style="padding:8px 0;color:#c9a227;font-weight:700;">${formattedDate}</td></tr>
            </table>
          </div>
          <div style="background:rgba(201,162,39,0.08);padding:24px;border-radius:8px;border:1px solid rgba(201,162,39,0.3);margin-bottom:24px;">
            <p style="color:#c9a227;font-weight:700;margin:0 0 14px;">What happens next?</p>
            <p style="color:#ccc;margin:0 0 10px;line-height:1.7;">✅ Our logistics team has received your booking request.</p>
            <p style="color:#ccc;margin:0 0 10px;line-height:1.7;">📞 Our team will call you at <strong style="color:#f5f5f0;">${phone}</strong> within <strong>2 hours</strong> to confirm availability and finalize your shipment details.</p>
            <p style="color:#ccc;margin:0;line-height:1.7;">🛰️ Once confirmed, your cargo will be GPS-tracked from pickup to delivery.</p>
          </div>
          <div style="padding:20px;border-radius:8px;background:#111;margin-bottom:24px;">
            <p style="color:#aaa;margin:0 0 10px;font-size:13px;">Need to reach us directly?</p>
            <p style="color:#ccc;margin:0;">📞 <a href="tel:+918446123777" style="color:#c9a227;">+91 84461 23777</a> / <a href="tel:+919371237770" style="color:#c9a227;">+91 93712 37770</a></p>
            <p style="color:#ccc;margin:6px 0 0;">✉️ <a href="mailto:tirupatiunion@gmail.com" style="color:#c9a227;">tirupatiunion@gmail.com</a></p>
            <p style="color:#ccc;margin:6px 0 0;">📍 Nagpur–Bhandara Road, Nagpur, Maharashtra – 440 035</p>
          </div>
          <p style="color:#555;font-size:12px;text-align:center;margin:0;">© 2025 Tirupati Road Lines Pvt. Ltd. · All Rights Reserved</p>
        </div>
      `,
    });
  }
}
