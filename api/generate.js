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
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://api-faa.my.id/",
        "Origin": "https://api-faa.my.id",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
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
