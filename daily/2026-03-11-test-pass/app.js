const celebrateBtn = document.getElementById("celebrateBtn");
const breatheBtn = document.getElementById("breatheBtn");
const confettiCanvas = document.getElementById("confetti");
const momentum = document.getElementById("momentum");
const meterFill = document.getElementById("meterFill");
const notes = document.getElementById("notes");
const sky = document.getElementById("sky");
const wins = document.getElementById("wins");
const addWin = document.getElementById("addWin");

const ctx = confettiCanvas.getContext("2d");
let confetti = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function spawnConfetti(count = 140) {
  for (let i = 0; i < count; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: confettiCanvas.height + Math.random() * 200,
      r: 4 + Math.random() * 6,
      c: `hsl(${Math.random() * 360}, 90%, 70%)`,
      v: 1 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 1.2,
      life: 120 + Math.random() * 80,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confetti = confetti.filter((p) => p.life > 0);
  confetti.forEach((p) => {
    p.y -= p.v;
    p.x += p.drift;
    p.life -= 1;
    ctx.beginPath();
    ctx.fillStyle = p.c;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawConfetti);
}

function updateMeter() {
  const value = momentum.value;
  meterFill.style.width = `${value}%`;
}

function dropNote(text) {
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = text;
  el.style.left = `${10 + Math.random() * 70}%`;
  el.style.bottom = "-20px";
  sky.appendChild(el);
  setTimeout(() => el.remove(), 10000);
}

celebrateBtn.addEventListener("click", () => {
  spawnConfetti(200);
});

breatheBtn.addEventListener("click", () => {
  document.body.classList.toggle("breathe");
  spawnConfetti(60);
});

momentum.addEventListener("input", updateMeter);

notes.addEventListener("click", (event) => {
  if (event.target.classList.contains("note")) {
    dropNote(event.target.textContent);
  }
});

addWin.addEventListener("click", () => {
  const text = prompt("Add a tiny win from tonight:");
  if (text) {
    const li = document.createElement("li");
    li.textContent = text;
    wins.appendChild(li);
  }
});

resizeCanvas();
updateMeter();
requestAnimationFrame(drawConfetti);

window.addEventListener("resize", resizeCanvas);
