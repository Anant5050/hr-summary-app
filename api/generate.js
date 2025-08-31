import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Call OpenAI (or similar)
  const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert human rights researcher.' },
        { role: 'user', content:
          `Summarize the following incident as a concise human rights violation summary:\n\n${text}`
        }
      ],
      temperature: 0.7
    })
  });

  const data = await apiRes.json();
  const summary = data.choices?.[0]?.message?.content || 'No summary generated';
  res.status(200).json({ summary });
}
