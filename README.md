# Macroc Consultants — Website (Vercel-ready)

This is a Next.js project (with Tailwind) tailored for *Macroc Consultants*.
Color scheme: **Green & Gold**.

## Quick local setup
1. Install dependencies:
   ```
   npm install
   ```
2. Run locally:
   ```
   npm run dev
   ```
   Open http://localhost:3000

## Deploy to Vercel (recommended)
1. Create a GitHub repository (e.g., `macroc-consultants-site`) and push these files.
2. On https://vercel.com, click **Add New Project** → Import your GitHub repo → Deploy.
3. After deployment, add your domain `macroc.in` in the Vercel project settings → Domains.
4. Vercel will show DNS records (A / CNAME) to add in your Zoho domain DNS settings.

## Formspree contact form (easy)
1. Go to https://formspree.io and sign up for a free account.
2. Create a new form and set the destination email to `info@macroc.in`.
3. Copy the provided form ID (it looks like `f/xxxxx`) and replace the placeholder in `pages/index.js`:
   ```
   const FORM_ENDPOINT = "https://formspree.io/f/your-form-id";
   ```
4. Redeploy the site on Vercel (or push to GitHub) — submissions will then go to your Zoho inbox.

## Notes
- Tailwind is already configured. Vercel will build the site automatically.
- If you want the contact form submissions stored in a database or to receive a Slack notification, we can add that later.

If you'd like, I can now:
- upload this ZIP for you to download, **or**
- directly create a GitHub repo and push these files (I can provide the exact commands).

Which do you prefer?