const nodemailer = require('nodemailer')

let _transporter = null

const getTransporter = () => {
  if (_transporter) return _transporter
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com') return null
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return _transporter
}

const baseHtml = (content) => `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F7F8FC;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:500px;background:#fff;border-radius:16px;border:1px solid #E4E6EF;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#5B50F8,#A855F7);padding:28px 40px;text-align:center;">
  <div style="font-size:22px;font-weight:700;color:#fff;">⚡ TaskFlow AI</div>
</td></tr>
<tr><td style="padding:32px 40px;">${content}</td></tr>
<tr><td style="padding:16px 40px;border-top:1px solid #E4E6EF;background:#F7F8FC;text-align:center;">
  <p style="margin:0;font-size:12px;color:#8B91A8;">© 2026 TaskFlow AI</p>
</td></tr>
</table></td></tr></table></body></html>`

const devLog = (type, to, data) => {
  console.log('\n══════════════════════════════════════')
  console.log(`  📧 ${type} (dev mode — no SMTP)`)
  console.log(`  To: ${to}`)
  Object.entries(data).forEach(([k, v]) => console.log(`  ${k}: ${v}`))
  console.log('══════════════════════════════════════\n')
}

const sendOTPEmail = async ({ to, name, otp }) => {
  const content = `
    <h2 style="color:#0F1320;font-size:18px;margin:0 0 12px;">Verify your email</h2>
    <p style="color:#4B5168;font-size:14px;line-height:1.6;margin:0 0 24px;">Hi ${name}, use the code below to complete registration. Expires in <strong>10 minutes</strong>.</p>
    <div style="background:#F7F8FC;border:1.5px solid #E4E6EF;border-radius:12px;padding:24px;text-align:center;margin:0 0 20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8B91A8;">Verification code</p>
      <div style="font-size:40px;font-weight:800;letter-spacing:0.18em;color:#5B50F8;font-family:monospace;">${otp}</div>
    </div>
    <p style="color:#8B91A8;font-size:13px;">If you didn't sign up for TaskFlow AI, ignore this email.</p>`

  const t = getTransporter()
  if (!t) { devLog('OTP EMAIL', to, { Name: name, OTP: otp }); return }
  await t.sendMail({ from: process.env.EMAIL_FROM || 'TaskFlow AI <noreply@taskflow.ai>', to, subject: `${otp} — Verify your TaskFlow AI account`, html: baseHtml(content) })
}

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const content = `
    <h2 style="color:#0F1320;font-size:18px;margin:0 0 12px;">Reset your password</h2>
    <p style="color:#4B5168;font-size:14px;line-height:1.6;margin:0 0 24px;">Hi ${name}, click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${resetUrl}" style="display:inline-block;background:#5B50F8;color:#fff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:10px;text-decoration:none;">Reset password</a>
    </div>
    <p style="color:#8B91A8;font-size:13px;">Or copy this link:<br/><span style="color:#5B50F8;word-break:break-all;">${resetUrl}</span></p>
    <p style="color:#8B91A8;font-size:13px;margin-top:16px;">If you didn't request a reset, ignore this email. Your password won't change.</p>`

  const t = getTransporter()
  if (!t) { devLog('RESET EMAIL', to, { Name: name, 'Reset URL': resetUrl }); return }
  await t.sendMail({ from: process.env.EMAIL_FROM || 'TaskFlow AI <noreply@taskflow.ai>', to, subject: 'Reset your TaskFlow AI password', html: baseHtml(content) })
}

module.exports = { sendOTPEmail, sendPasswordResetEmail }
