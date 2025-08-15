addmint-backend (Vercel)

Simple Vercel serverless webhook that sends an email via Gmail (Nodemailer) when a withdrawal request is posted from the frontend.

Files

api/withdrawal.js — serverless POST endpoint

package.json — project deps

How to deploy (step-by-step)

Create a new GitHub repo (e.g., addmint-backend) and push these files.

Go to https://vercel.com and import the repo. 

Set Framework Preset: Other (or keep default)

Root Directory: / (repo root)

Add Environment Variables in Vercel Project Settings: 

GMAIL_USER = your Gmail address (e.g., apknixy@gmail.com)

GMAIL_PASS = Gmail App Password (create in Google Account > Security > App passwords)

HOOK_SECRET = a long random string you generate (keep secret)

Deploy. After deployment you will get a URL like https://addmint-backend.vercel.app. The webhook URL will be: https://<your-deploy>/api/withdrawal

How frontend should call the webhook

First, create a Firestore document in withdrawalRequests collection with fields: 

userId, username, views, paymentId, contact, timestamp (serverTimestamp), emailStatus: 'pending'

Then call the webhook (replace URL & secret):

fetch('https://<your-deploy>/api/withdrawal', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-addmint-secret': 'your_hook_secret' }, body: JSON.stringify({ userId, username, views, paymentId, contact, notes }) }) .then(r=>r.json()).then(console.log).catch(console.error); 

If email sends successfully, you can update the Firestore doc's emailStatus to 'sent'.

Security notes

Never commit GMAIL_PASS to GitHub. Use Vercel env variables.

Use HOOK_SECRET to prevent public abuse.

