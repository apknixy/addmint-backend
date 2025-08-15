Usage:

Deploy to Vercel. Set ENV: GMAIL_USER = your.email@gmail.com GMAIL_PASS = HOOK_SECRET = some-long-random-string

From frontend: POST JSON to https:///api/withdrawal Headers: { 'x-addmint-secret': '<HOOK_SECRET>' } Body JSON: { userId, username, views, paymentId, contactEmailOrUPI, notes }

This function verifies the secret header, sends an email to GMAIL_USER, and returns status. It DOES NOT write to Firestore — the frontend should create the Firestore document first (so data is persisted). */

import nodemailer from 'nodemailer';

export default async function handler(req, res) { if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

const secret = req.headers['x-addmint-secret'] || req.headers['x-addmint_secret']; if (!process.env.HOOK_SECRET) return res.status(500).json({ error: 'Server misconfigured: HOOK_SECRET missing' }); if (!secret || secret !== process.env.HOOK_SECRET) return res.status(401).json({ error: 'Unauthorized' });

const { userId, username, views, paymentId, contact, notes } = req.body || {}; if (!userId || !username || (views == null) || !paymentId || !contact) { return res.status(400).json({ error: 'Missing required fields. Required: userId, username, views, paymentId, contact' }); }

// Prepare transporter const GMAIL_USER = process.env.GMAIL_USER; const GMAIL_PASS = process.env.GMAIL_PASS; // this should be an App Password if (!GMAIL_USER || !GMAIL_PASS) return res.status(500).json({ error: 'Mail credentials not configured' });

const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_PASS } });

const html = <h2>AddMint Withdrawal Request</h2> <p><strong>Username:</strong> ${escapeHtml(username)} (${escapeHtml(userId)})</p> <p><strong>Views at request:</strong> ${escapeHtml(String(views))}</p> <p><strong>Payment ID/UPI/PayPal:</strong> ${escapeHtml(paymentId)}</p> <p><strong>Contact (email/UPI shown by user):</strong> ${escapeHtml(contact)}</p> <p><strong>Notes:</strong> ${escapeHtml(notes || '-')}</p> <hr/> <p>Check Firestore /withdrawalRequests for the full document.</p>;

const mailOptions = { from: AddMint <${GMAIL_USER}>, to: GMAIL_USER, subject: Withdrawal request — ${username} (${userId}), html };

try { await transporter.sendMail(mailOptions); return res.status(200).json({ success: true, message: 'Email sent' }); } catch (err) { console.error('Mail error', err); return res.status(500).json({ error: 'Failed to send email', details: String(err) }); } }

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","":"`"})[c]); }
