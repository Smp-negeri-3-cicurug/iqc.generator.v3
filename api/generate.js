export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { prompt, jam, batre } = req.query;

  if (!prompt || !jam || !batre) {
    return res.status(400).json({ error: "Parameter prompt, jam, dan batre wajib diisi." });
  }

  try {
    const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${encodeURIComponent(prompt)}&jam=${encodeURIComponent(jam)}&batre=${encodeURIComponent(batre)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*,*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `API error: ${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "Gagal menghubungi API.", detail: err.message });
  }
      }
