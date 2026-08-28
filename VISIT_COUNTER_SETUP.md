# Visit Counter Setup

This adds a private visit counter to your portfolio, viewable only by you at `/stats.html`.

## Files added
- `api/track.js` — pings on every page load, saves a counter to `counts.json` in this repo
- `api/stats.js` — private endpoint that reads the counter (needs a password)
- `stats.html` — the page you visit to see your numbers (not linked in the nav)
- A small script at the bottom of `index.html` that calls `/api/track`

## One-time setup after uploading to GitHub

1. **Create a GitHub token**
   GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   Scope it to this repo, with **Contents: Read and write** permission. Copy the token.

2. **Add environment variables in Vercel**
   Project → Settings → Environment Variables → add all three:
   - `GH_TOKEN` = the token from step 1
   - `GH_REPO` = `yourGithubUsername/your-repo-name`
   - `STATS_SECRET` = any password you make up (this protects your stats page)

3. **Redeploy** (Vercel usually redeploys automatically after you connect the repo, or click "Redeploy" in the dashboard once the env vars are saved).

4. **Check your numbers**
   Visit `yourdomain.com/stats.html`, enter the password you set as `STATS_SECRET`, and you'll see Today / This Month / All Time views.

Note: page refreshes count as views too — this is a simple page-load counter, not unique-visitor tracking.
