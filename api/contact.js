// Vercel Serverless Function — POST /api/contact
// Receives the Connect page form and relays it to Resend.
// The API key lives ONLY in Vercel's environment variables, never in the repo.
//
// Required env vars (Vercel dashboard → Settings → Environment Variables):
//   RESEND_API_KEY   re_xxxxxxxxxxxxxxxx
//   TO_EMAIL         pulsenettz@gmail.com
//   FROM_EMAIL       website@pulsenettz.com   (domain must be verified in Resend)
//
// CommonJS on purpose: this repo has no package.json, so Vercel's zero-config
// Node runtime treats .js as CommonJS. Don't switch to `export default` unless
// you also add a package.json with "type": "module".

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

const INTERESTS = [
  'Partnership', 'Volunteering', 'Funding', 'Training',
  'Internship', 'Community initiative', 'Other',
];

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Strip CR/LF and clamp length — nothing from the form should ever reach a
// mail header intact enough to inject a second header.
function headerSafe(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max || 120);
}

function row(label, value) {
  return `<tr>
    <td style="padding:6px 20px 6px 0;color:#7A857C;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:6px 0;color:#22302A;font-size:14px">${esc(value) || '&mdash;'}</td>
  </tr>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = ['RESEND_API_KEY', 'TO_EMAIL', 'FROM_EMAIL'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing environment variables:', missing.join(', '));
    return res.status(500).json({ error: 'The form is not configured yet. Please email us directly.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot. Bots fill hidden fields; humans can't see this one.
  // Return 200 so scrapers never learn the form rejected them.
  if (body.website) return res.status(200).json({ ok: true });

  const name = headerSafe(body.name, 120);
  const email = headerSafe(body.email, 200);
  const phone = headerSafe(body.phone, 60);
  const organization = headerSafe(body.organization, 160);
  const message = String(body.message == null ? '' : body.message).trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email and message.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look right." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: 'That message is too long — please keep it under 5000 characters.' });
  }

  // Only accept interests the form actually offers.
  const raw = Array.isArray(body.interests) ? body.interests : body.interests ? [body.interests] : [];
  const interests = raw.filter((i) => INTERESTS.includes(i));

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px">
    <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7A857C;margin:0 0 4px">pulsenettz.com</p>
    <h2 style="font-size:19px;color:#22302A;margin:0 0 20px">New enquiry from the website</h2>
    <table style="border-collapse:collapse;width:100%">
      ${row('Name', name)}
      ${row('Email', email)}
      ${row('Phone', phone)}
      ${row('Organization', organization)}
      ${row('Interested in', interests.join(', '))}
    </table>
    <div style="margin-top:22px;padding-top:18px;border-top:1px solid #E4E8E5">
      <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7A857C;margin:0 0 8px">Message</p>
      <p style="font-size:15px;line-height:1.65;color:#22302A;white-space:pre-wrap;margin:0">${esc(message)}</p>
    </div>
    <p style="margin-top:24px;font-size:12px;color:#9AA39C">Hit Reply to respond directly to ${esc(name)}.</p>
  </div>`;

  const text = [
    'New enquiry from pulsenettz.com',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '-'}`,
    `Organization: ${organization || '-'}`,
    `Interested in: ${interests.join(', ') || '-'}`,
    '',
    message,
  ].join('\n');

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Pulse Network Website <${process.env.FROM_EMAIL}>`,
        to: [process.env.TO_EMAIL],
        reply_to: email,
        subject: `Website enquiry — ${name}`,
        html,
        text,
      }),
    });

    if (!resend.ok) {
      // Log the real reason for you; show the visitor something human.
      console.error('Resend rejected the send:', resend.status, await resend.text());
      return res.status(502).json({ error: 'We could not send that just now. Please email pulsenettz@gmail.com directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form failure:', err);
    return res.status(500).json({ error: 'Something went wrong on our side. Please email pulsenettz@gmail.com directly.' });
  }
};
