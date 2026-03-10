let lastRequestTime = 0;
const COOLDOWN_MS = 60000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const now = Date.now();
  const elapsed = now - lastRequestTime;
  const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
  const ready = elapsed >= COOLDOWN_MS;

  if (req.method === 'POST') {
    if (!ready) {
      return res.status(429).json({ ready: false, remainingSeconds: remaining });
    }
    lastRequestTime = now;
    return res.status(200).json({ ready: true, remainingSeconds: 0 });
  }

  // GET - just check
  return res.status(200).json({ ready, remainingSeconds: remaining });
}
