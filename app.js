(() => {
  const avatar = document.getElementById("avatar");
  const mouth = document.getElementById("mouth");
  const statusText = document.getElementById("status-text");
  const messages = document.getElementById("messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const particlesEl = document.getElementById("particles");
  const head = document.querySelector(".avatar-head");
  const eyes = document.querySelectorAll(".eye");

  let currentMood = "happy";

  // Eye tracking
  document.addEventListener("mousemove", (e) => {
    const pupils = document.querySelectorAll(".pupil");
    pupils.forEach((pupil) => {
      const eye = pupil.parentElement;
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = 4;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });

  // Blinking
  function blink() {
    eyes.forEach((eye) => eye.classList.add("blink"));
    setTimeout(() => eyes.forEach((eye) => eye.classList.remove("blink")), 150);
  }

  function scheduleBlink() {
    const delay = 2000 + Math.random() * 4000;
    setTimeout(() => {
      blink();
      scheduleBlink();
    }, delay);
  }
  scheduleBlink();

  // Particles
  function spawnParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = 30 + Math.random() * 140 + "px";
    p.style.top = 60 + Math.random() * 120 + "px";
    p.style.animationDuration = 2 + Math.random() * 2 + "s";
    p.style.animationDelay = Math.random() * 0.5 + "s";
    particlesEl.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }

  setInterval(spawnParticle, 600);

  // Mood
  function setMood(mood) {
    currentMood = mood;
    head.className = "avatar-head";
    mouth.className = "mouth";

    if (mood === "happy") {
      mouth.classList.add("happy");
      statusText.textContent = "嬉しい気分です！";
      statusText.style.color = "rgba(0, 255, 150, 0.8)";
    } else if (mood === "thinking") {
      head.classList.add("thinking");
      mouth.classList.add("thinking");
      statusText.textContent = "うーん、考え中...";
      statusText.style.color = "rgba(255, 200, 0, 0.8)";
    } else if (mood === "excited") {
      head.classList.add("excited");
      mouth.classList.add("excited");
      statusText.textContent = "ワクワクしています！";
      statusText.style.color = "rgba(255, 100, 200, 0.8)";
    } else if (mood === "sleepy") {
      head.classList.add("sleepy");
      mouth.classList.add("sleepy");
      statusText.textContent = "zzZ... ちょっと眠い...";
      statusText.style.color = "rgba(100, 100, 200, 0.6)";
    }
  }

  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => setMood(btn.dataset.mood));
  });

  // Chat responses
  const responses = {
    greeting: [
      "こんにちは！元気ですか？",
      "やあ！今日はどんな一日でしたか？",
      "いらっしゃい！何かお手伝いできることはありますか？",
    ],
    question: [
      "いい質問ですね！一緒に考えましょう。",
      "なるほど...それは興味深い問題ですね。",
      "うーん、難しいですが挑戦してみましょう！",
    ],
    thanks: [
      "どういたしまして！嬉しいです。",
      "お役に立てて光栄です！",
      "いつでもどうぞ！",
    ],
    default: [
      "なるほど！もっと教えてください。",
      "面白いですね！続けてください。",
      "わかりました！他に何かありますか？",
      "それは素晴らしいですね！",
      "ふむふむ、興味深いです。",
    ],
  };

  function getCategory(text) {
    if (/こんにちは|やあ|おはよう|こんばんは|ハロー|hello|hi/i.test(text)) return "greeting";
    if (/\?|？|教えて|何|どう|なぜ|いつ/i.test(text)) return "question";
    if (/ありがとう|感謝|サンキュー|thanks/i.test(text)) return "thanks";
    return "default";
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTalking() {
    mouth.className = "mouth talking";
  }

  function stopTalking() {
    mouth.className = "mouth";
    if (currentMood) setMood(currentMood);
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    showTalking();
    statusText.textContent = "考えています...";
    statusText.style.color = "rgba(0, 212, 255, 0.8)";

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const category = getCategory(text);
      const reply = pickRandom(responses[category]);
      addMessage(reply, "ai");
      stopTalking();
    }, delay);
  });

  // Initial mood
  setMood("happy");
})();
