import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  if (req.headers["x-addmint-secret"] !== process.env.HOOK_SECRET)
    return res.status(403).send("Forbidden");

  const { email, amount } = req.body;
  if (!email || !amount) return res.status(400).send("Missing fields");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AddMint App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Withdrawal Request",
      text: `User: ${email}\nAmount: ${amount}`,
    });

    res.status(200).send({ status: "sent" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
