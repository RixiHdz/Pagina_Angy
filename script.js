const CONFIG = {
  recipientName: "Para la persona mas enojana y hermosa del mundo",
  senderInitial: "Ricardo",
  recipientInitial: "Angy",
  invitation: "Perdon por tardar tanto",
  starMessages: [
    "Aunque a veces hago malas bromas",
    "Me encanta pasar el tiempo contigo",
    "Me encantas y adoro pasar el timepo riendome contigo",
    "Gracias por existir",
    "Siempre me encanta verte sonreir"
  ],
  finalMessage: "No importa cuántas estrellas existan, tu eres la lucecita que me llena el corazon.",
  musicPath: "assets/music.mp3"
};

const STAR_POSITIONS = [
  { left: 22, top: 31, x: 220, y: 190 },
  { left: 36.5, top: 18, x: 365, y: 95 },
  { left: 50, top: 32, x: 500, y: 175 },
  { left: 63.5, top: 18, x: 635, y: 95 },
  { left: 78, top: 31, x: 780, y: 190 }
];

const els = {
  invitationStage: document.querySelector("#invitation-stage"),
  skyStage: document.querySelector("#sky-stage"),
  startButton: document.querySelector("#start-button"),
  recipient: document.querySelector("#invitation-title"),
  invitation: document.querySelector("#invitation-copy"),
  stars: document.querySelector("#guide-stars"),
  segments: document.querySelector("#segment-layer"),
  phraseCard: document.querySelector("#phrase-card"),
  phraseText: document.querySelector("#phrase-text"),
  progressText: document.querySelector("#progress-text"),
  progressHint: document.querySelector("#progress-hint"),
  progressFill: document.querySelector("#progress-fill"),
  heartPath: document.querySelector("#heart-path"),
  finale: document.querySelector("#finale"),
  initials: document.querySelector("#initials"),
  finalMessage: document.querySelector("#final-message"),
  replayButton: document.querySelector("#replay-button"),
  shootingStars: document.querySelector("#shooting-stars"),
  music: document.querySelector("#background-music"),
  soundButton: document.querySelector("#sound-button"),
  soundLabel: document.querySelector("#sound-label")
};

let collectedCount = 0;
let phraseTimer;

function createAmbientStars() {
  const container = document.querySelector("#ambient-stars");
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 105; index += 1) {
    const star = document.createElement("span");
    star.className = "ambient-star";
    star.style.left = `${(index * 47.13) % 100}%`;
    star.style.top = `${(index * 73.71) % 100}%`;
    star.style.setProperty("--size", `${1 + (index % 3) * 0.65}px`);
    star.style.setProperty("--opacity", `${0.25 + (index % 6) * 0.1}`);
    star.style.setProperty("--duration", `${1.8 + (index % 5) * 0.55}s`);
    star.style.setProperty("--delay", `${-(index % 8) * 0.35}s`);
    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

function applyConfig() {
  els.recipient.textContent = CONFIG.recipientName;
  els.invitation.textContent = CONFIG.invitation;
  els.initials.innerHTML = `${escapeHtml(CONFIG.senderInitial)}<span>✦</span>${escapeHtml(CONFIG.recipientInitial)}`;
  els.finalMessage.textContent = CONFIG.finalMessage;
  els.music.src = CONFIG.musicPath;
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML;
}

function createGuideStars() {
  els.stars.replaceChildren();

  STAR_POSITIONS.forEach((position, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-star";
    button.style.left = `${position.left}%`;
    button.style.top = `${position.top}%`;
    button.setAttribute("aria-label", `Descubrir estrella ${index + 1} de ${STAR_POSITIONS.length}`);
    button.innerHTML = "<span aria-hidden=\"true\"></span>";
    button.addEventListener("click", () => collectStar(button, index));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      }
    });
    els.stars.appendChild(button);
  });
}

function collectStar(button, index) {
  if (button.classList.contains("is-collected") || collectedCount >= STAR_POSITIONS.length) return;

  button.classList.add("is-collected");
  button.setAttribute("aria-disabled", "true");
  collectedCount += 1;

  showPhrase(CONFIG.starMessages[index] || "Una estrella brilla para ti");
  addSegment(index);
  updateProgress();

  if (collectedCount === STAR_POSITIONS.length) {
    window.setTimeout(showFinale, 1150);
  }
}

function addSegment(index) {
  if (index === 0) return;

  const previous = STAR_POSITIONS[index - 1];
  const current = STAR_POSITIONS[index];
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", previous.x);
  line.setAttribute("y1", previous.y);
  line.setAttribute("x2", current.x);
  line.setAttribute("y2", current.y);
  line.setAttribute("class", "constellation-segment");
  els.segments.appendChild(line);
}

function showPhrase(message) {
  window.clearTimeout(phraseTimer);
  els.phraseCard.classList.remove("is-visible");
  void els.phraseCard.offsetWidth;
  els.phraseText.textContent = message;
  els.phraseCard.classList.add("is-visible");
  phraseTimer = window.setTimeout(() => els.phraseCard.classList.remove("is-visible"), 2250);
}

function updateProgress() {
  els.progressText.textContent = `${collectedCount} de ${STAR_POSITIONS.length} estrellas`;
  els.progressFill.style.width = `${(collectedCount / STAR_POSITIONS.length) * 100}%`;
  els.progressHint.textContent = collectedCount === STAR_POSITIONS.length
    ? "La constelación está completa"
    : "Toca una estrella dorada";
}

function showFinale() {
  els.phraseCard.classList.remove("is-visible");
  els.stars.setAttribute("aria-hidden", "true");
  els.heartPath.classList.add("is-drawing");
  els.finale.hidden = false;
  els.finale.classList.add("is-visible");
  els.finale.setAttribute("aria-hidden", "false");
  createShootingStars();
  window.setTimeout(() => els.replayButton.focus({ preventScroll: true }), 3000);
}

function createShootingStars() {
  els.shootingStars.replaceChildren();
  [
    { top: "12%", left: "4%", delay: "0.2s" },
    { top: "28%", left: "62%", delay: "1.05s" },
    { top: "5%", left: "35%", delay: "1.75s" }
  ].forEach((settings) => {
    const star = document.createElement("span");
    star.className = "shooting-star";
    star.style.setProperty("--top", settings.top);
    star.style.setProperty("--left", settings.left);
    star.style.setProperty("--delay", settings.delay);
    els.shootingStars.appendChild(star);
  });
}

function resetExperience() {
  collectedCount = 0;
  window.clearTimeout(phraseTimer);
  els.phraseCard.classList.remove("is-visible");
  els.segments.replaceChildren();
  els.heartPath.classList.remove("is-drawing");
  els.finale.classList.remove("is-visible");
  els.finale.setAttribute("aria-hidden", "true");
  els.finale.hidden = true;
  els.shootingStars.replaceChildren();
  els.stars.removeAttribute("aria-hidden");
  createGuideStars();
  updateProgress();
  requestAnimationFrame(() => els.stars.querySelector("button")?.focus());
}

function enterSky() {
  els.invitationStage.classList.add("is-leaving");

  window.setTimeout(() => {
    els.invitationStage.hidden = true;
    els.skyStage.hidden = false;
    window.scrollTo(0, 0);
    document.querySelector("#app").scrollTo(0, 0);
    requestAnimationFrame(() => {
      els.skyStage.classList.add("is-visible");
      window.setTimeout(() => els.stars.querySelector("button")?.focus({ preventScroll: true }), 700);
    });
  }, 650);

  // Forzamos la música al presionar el botón sin preguntar
  playMusic();
}

async function playMusic() {
  try {
    els.soundButton.hidden = false;
    await els.music.play();
    els.soundButton.classList.add("is-playing");
    els.soundButton.setAttribute("aria-label", "Pausar música");
    els.soundLabel.textContent = "Pausar";
  } catch (err) {
    console.log("No se pudo reproducir la música:", err);
    els.soundButton.classList.remove("is-playing");
    els.soundButton.setAttribute("aria-label", "Reproducir música");
    els.soundLabel.textContent = "Música";
  }
}

function toggleMusic() {
  if (els.music.paused) {
    playMusic();
  } else {
    els.music.pause();
    els.soundButton.classList.remove("is-playing");
    els.soundButton.setAttribute("aria-label", "Reproducir música");
    els.soundLabel.textContent = "Música";
  }
}

applyConfig();
createAmbientStars();
createGuideStars();
updateProgress();

els.startButton.addEventListener("click", enterSky);
els.replayButton.addEventListener("click", resetExperience);
els.soundButton.addEventListener("click", toggleMusic);