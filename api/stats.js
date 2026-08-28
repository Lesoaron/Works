// /api/stats.js
// Returns { today, thisMonth, total } visit counts.
// Only responds if the request includes the correct secret key,
// so only you can see your numbers.
//
// Required Vercel environment variables:
//   GH_TOKEN     -> same GitHub token used by track.js (needs Contents: read)
//   GH_REPO      -> "yourGithubUsername/your-repo"
//   GH_BRANCH    -> optional, defaults to "main"
//   STATS_SECRET -> a password you make up, e.g. "leso-only-2026"

const FILE_PATH = 'counts.json';

export default async function handler(req, res) {
  try {
    const key = req.query.key || req.headers['x-stats-key'];

    if (!process.env.STATS_SECRET || key !== process.env.STATS_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!process.env.GH_TOKEN || !process.env.GH_REPO) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const repo = process.env.GH_REPO;
    const branch = process.env.GH_BRANCH || 'main';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`;

    const ghRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });

    let days = {};
    if (ghRes.status === 200) {
      const fileJson = await ghRes.json();
      const decoded = Buffer.from(fileJson.content, 'base64').toString('utf-8');
      try {
        days = (JSON.parse(decoded) || {}).days || {};
      } catch {
        days = {};
      }
    } else if (ghRes.status !== 404) {
      const errText = await ghRes.text();
      console.error('GitHub GET error:', errText);
      return res.status(500).json({ error: 'Failed to read stats' });
    }

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10); // "2026-08-28"
    const monthPrefix = now.toISOString().slice(0, 7); // "2026-08"

    const today = days[todayKey] || 0;
    const thisMonth = Object.entries(days)
      .filter(([d]) => d.startsWith(monthPrefix))
      .reduce((sum, [, v]) => sum + v, 0);
    const total = Object.values(days).reduce((sum, v) => sum + v, 0);

    return res.status(200).json({ today, thisMonth, total, days });
  } catch (err) {
    console.error('stats.js error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
