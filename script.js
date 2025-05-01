const startBtn = document.getElementById("startBtn");
const questionEl = document.getElementById("question");
const responseEl = document.getElementById("response");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";

let currentQuestion = "Tell me about yourself.";
questionEl.textContent = currentQuestion;

startBtn.onclick = () => {
  speak(currentQuestion);
  recognition.start();
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  responseEl.textContent = `You said: "${transcript}"`;

  const nextQuestion = await fetchGPT(currentQuestion, transcript);
  currentQuestion = nextQuestion;
  questionEl.textContent = currentQuestion;
  speak(currentQuestion);
};

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}

async function fetchGPT(question, answer) {
  const prompt = `You're an interview coach. I asked: "${question}". The candidate said: "${answer}". What should I ask next?`;

  const res = await fetch("https://YOUR_VERCEL_URL.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content.trim();
}
