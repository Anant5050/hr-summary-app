import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Received text for summary:', text);
    console.log('API key loaded:', !!process.env.OPENAI_API_KEY);

    // Call OpenAI API
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert human rights researcher.' },
          {
            role: 'user',
            content: `Summarize the following incident as a concise human rights violation summary:\n\n${text}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('OpenAI API error:', apiRes.status, errorText);
      return res.status(502).json({ error: 'OpenAI API error', details: errorText });
    }

    const data = await apiRes.json();
    const summary = data.choices?.[0]?.message?.content?.trim() || 'No summary generated';

    console.log('Generated summary:', summary);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
