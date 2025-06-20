//Some Constants
const responseDiv = document.getElementById("response_text");

let ai_response = "";
let i = 0;

async function fetchOllamaResponse(topic) {
  i = 0;
  responseDiv.innerHTML = "";
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: topic,
        stream: true,
        options: { temperature: 1 },
      }),
    });
    if (!response.ok) {
      throw new Error("Server responded with status: " + response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.trim().split("\n");

      for (let line of lines) {
        if (!line) continue;
        try {
          const json = JSON.parse(line);
          if (json.response) {
            ai_response += json.response;
          }
        } catch (err) {
          console.error("Failed to parse JSON:", err);
        }
      }
    }

  } catch (err) {
    console.error("Fetch error:", err);
    return "Error fetching response from model.";
  }
}

async function fetchGeminiResponse(topic) {
  i = 0;
  responseDiv.innerHTML = "fetching....";
  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: topic,
    }),
  });
  const data = await response.json();
  responseDiv.innerHTML = '';
  return data.output;
}

document.getElementById("fetch_button").addEventListener("click", async () => {
  const topic = document.getElementById("topic").value.trim();
  ai_response = "";

  if (!topic) {
    return;
  }

  const model_selected = document.getElementById("model_selector").value;

  if (model_selected === "ollama") {
    await fetchOllamaResponse(topic);
  }
  if (model_selected === "gemini" && window.navigator.onLine) {
    ai_response = await fetchGeminiResponse(topic);
  } else {
    alert('User Offline, Use Offline Model');
  }

});

document.addEventListener("keydown", (event) => {
  if (document.activeElement === document.getElementById("topic")) return;
  const responseDiv = document.getElementById("response_text");

  if (ai_response && i < ai_response.length) {
    const remaining = ai_response.length - i;
    const chunkSize = Math.min(5, remaining);
    const chunk = ai_response.substr(i, chunkSize);
    if (remaining != 0) {
      responseDiv.innerHTML += chunk;
      i += chunkSize;
    }

    responseDiv.scrollTop = responseDiv.scrollHeight;
  }
});
