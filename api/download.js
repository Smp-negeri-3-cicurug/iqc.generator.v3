export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt, jam, batre } = req.query;

  if (!prompt || !jam || !batre) {
    return res.status(400).json({ error: 'Parameter prompt, jam, dan batre wajib diisi.' });
  }

  try {
    const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${encodeURIComponent(prompt)}&jam=${encodeURIComponent(jam)}&batre=${encodeURIComponent(batre)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'Accept': 'image/*,*/*',
        'Referer': 'https://api-faa.my.id/',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="iqc-generated.png"');
    res.setHeader('Cache-Control', 'no-store');

    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    return res.status(500).json({ error: 'Gagal download gambar.', detail: err.message });
  }
      }
    
