export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { prompt, jam, batre } = req.query;

    if (!prompt || !jam || !batre) {
      return res.status(400).json({ error: 'Parameter prompt, jam, dan batre wajib diisi.' });
    }

    const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${encodeURIComponent(prompt)}&jam=${encodeURIComponent(jam)}&batre=${encodeURIComponent(batre)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'Accept': 'image/*,*/*',
        'Referer': 'https://api-faa.my.id/',
        'Origin': 'https://api-faa.my.id',
      },
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="iqc-generated.png"');
    res.setHeader('Cache-Control', 'no-store');

    return res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to generate image',
      message: error.message
    });
  }
}
