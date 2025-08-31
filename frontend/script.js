const btn = document.getElementById('generateBtn');
btn.onclick = async () => {
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('Please enter incident details.');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const { summary } = await res.json();
    document.getElementById('outputText').textContent = summary;
  } catch (err) {
    document.getElementById('outputText').textContent = 'Error generating summary.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Summary';
  }
};
