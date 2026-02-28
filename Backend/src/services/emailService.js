import nodemailer from "nodemailer";

/* ---------- transporter ---------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ---------- WARRANTY CREATED ---------- */
export const sendWarrantyEmail = async (to, product, expiry) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "✅ Warranty Registered Successfully",
    html: `
      <h2>🎉 Warranty Added</h2>
      <p><b>Product:</b> ${product}</p>
      <p><b>Expires:</b> ${expiry}</p>
      <p>We will remind you before expiry.</p>
    `
  });
};

/* ---------- 30 DAY REMINDER ---------- */
export const sendWarrantyReminder30Days = async (to, product, expiry) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "⏳ Warranty Expiring in 30 Days",
    html: `
      <h2>⏳ 30 Day Reminder</h2>
      <p>Your warranty for <b>${product}</b> expires on ${expiry}</p>
      <p>Plan your service or claim.</p>
    `
  });
};

/* ---------- 7 DAY REMINDER ---------- */
export const sendWarrantyReminder7Days = async (to, product, expiry) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "⚠ URGENT — Warranty Expiring Soon",
    html: `
      <h2>⚠ URGENT: 7 Days Left</h2>
      <p>Your warranty for <b>${product}</b> expires on ${expiry}</p>
      <p>Please take action immediately.</p>
    `
  });
};
/* ================= EXPIRED ================= */
export const sendWarrantyExpiredEmail = async (email, product) => {
  await transporter.sendMail({
    from: `"Warranty Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "❌ Warranty Expired",
    html: `
      <h2>Warranty Expired</h2>
      <p>Your warranty for <strong>${product}</strong> has expired.</p>
    `
  });
};

/* ================= WELCOME EMAIL ================= */
export const sendWelcomeEmail = async (email) => {
  await transporter.sendMail({
    from: `"WarrantyGuard" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to WarrantyGuard! 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4F46E5;">Welcome to WarrantyGuard!</h1>
        <p>Hi there,</p>
        <p>Thank you for joining <b>WarrantyGuard</b>. We are excited to help you manage your product warranties effortlessly.</p>
        <p>You can now:</p>
        <ul>
          <li>📦 Add your products</li>
          <li>🧾 Scan receipts instantly</li>
          <li>🔔 Get warranty expiry reminders</li>
        </ul>
        <p>Start by logging in to your dashboard.</p>
        <br>
        <p>Best regards,<br>The WarrantyGuard Team</p>
      </div>
    `
  });
};