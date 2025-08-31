const btn = document.getElementById('generateBtn');
btn.onclick = async () => {
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('Please enter incident details.');
  btn.disabled = true;
  btn.textContent = 'Generating...';
  // frontend/script.js
const API_URL = 'https://hr-summary-app.vercel.app/api/generate';

btn.onclick = async () => {
  // …
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input })
  });
  // …
};


  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });

    const json = await res.json();
    if (!res.ok) {
      // Display error details
      console.error('API error details:', json);
      document.getElementById('outputText').textContent =
        `Error: ${json.error || 'Unknown error'}` +
        (json.details ? `\nDetails: ${json.details}` : '');
    } else {
      document.getElementById('outputText').textContent = json.summary;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    document.getElementById('outputText').textContent =
      `Network or CORS error: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Summary';
  }
};

