let ai_response = '';
let i = 0;
let is_fetching = false;

async function fetchOllamaResponse(topic) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gemma3:4b', prompt: topic, stream: true })
    });

    if (!response.ok) {
      throw new Error('Server responded with status: ' + response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.trim().split('\n');

      for (let line of lines) {
        if (!line) continue;
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullText += json.response;
          }
        } catch (err) {
          console.error('Failed to parse JSON:', err);
        }
      }
    }

    return fullText;
  } catch (err) {
    console.error('Fetch error:', err);
    return 'Error fetching response from model.';
  }
}

document.getElementById('fetch_button').addEventListener('click', async () => {
  const topic = document.getElementById('topic').value.trim();
  const responseDiv = document.getElementById('response_text');

  if (!topic || is_fetching) {
    return;
  }

  is_fetching = true;
  responseDiv.innerHTML = 'Fetching response...';

  ai_response = await fetchOllamaResponse(topic);
  i = 0;
  responseDiv.innerHTML = '';
  is_fetching = false;
});

document.addEventListener('keydown', (event) => {
  if (document.activeElement === document.getElementById('topic')) return;
  const responseDiv = document.getElementById('response_text');

  if (ai_response && i < ai_response.length) {
    responseDiv.innerHTML += ai_response[i];
    i++;
    responseDiv.scrollTop = responseDiv.scrollHeight;
  }
});
