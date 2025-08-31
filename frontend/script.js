const API_URL = 'https://hr-summary-app-50.vercel.app/api/generate'; // Update to your deployed function URL

const btn = document.getElementById('generateBtn');
const outputEl = document.getElementById('outputText');

btn.onclick = async () => {
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('Please enter incident details.');

  btn.disabled = true;
  btn.textContent = 'Generating...';
  outputEl.textContent = '';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('API error details:', json);
      outputEl.textContent = `Error: ${json.error || 'Unknown error'}` +
        (json.details ? `\nDetails: ${json.details}` : '');
    } else {
      outputEl.textContent = json.summary;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    outputEl.textContent = `Network or CORS error: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Summary';
  }
};




