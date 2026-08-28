// /api/track.js
// Increments a simple visit counter on every page load, storing the data
// as counts.json inside your GitHub repo (used as free, simple storage).
//
// Required Vercel environment variables:
//   GH_TOKEN  -> GitHub Personal Access Token with "Contents: read & write" on the repo
//   GH_REPO   -> "yourGithubUsername/your-repo"   (can be a private repo)
//   GH_BRANCH -> optional, defaults to "main"

const FILE_PATH = 'counts.json';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-08-28"
}

async function githubRequest(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    if (!process.env.GH_TOKEN || !process.env.GH_REPO) {
      console.error('Missing GH_TOKEN or GH_REPO env vars');
      return res.status(200).json({ ok: false });
    }

    const repo = process.env.GH_REPO;
    const branch = process.env.GH_BRANCH || 'main';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`;

    // 1. Get current file (if it exists) to read its sha + contents
    let sha = null;
    let data = { days: {} };

    const getRes = await githubRequest(apiUrl);
    if (getRes.status === 200) {
      const fileJson = await getRes.json();
      sha = fileJson.sha;
      const decoded = Buffer.from(fileJson.content, 'base64').toString('utf-8');
      try {
        data = JSON.parse(decoded);
      } catch {
        data = { days: {} };
      }
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      console.error('GitHub GET error:', errText);
      return res.status(200).json({ ok: false });
    }

    // 2. Increment today's count
    const key = todayKey();
    data.days = data.days || {};
    data.days[key] = (data.days[key] || 0) + 1;

    // 3. Write it back
    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const putRes = await githubRequest(
      `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: `visit ${key}`,
          content: newContent,
          branch,
          ...(sha ? { sha } : {}),
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error('GitHub PUT error:', errText);
      return res.status(200).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track.js error:', err);
    return res.status(200).json({ ok: false });
  }
}
