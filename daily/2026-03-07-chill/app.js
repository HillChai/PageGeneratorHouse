const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const warmth = document.getElementById("warmth");
const glow = document.getElementById("glow");
const breeze = document.getElementById("breeze");
const brew = document.getElementById("brew");
const dim = document.getElementById("dim");
const reset = document.getElementById("reset");

let sun = { x: 0.25, y: 0.25 };
let puffs = [];
let dimmed = false;

function resize() {
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function warmthColor() {
  const t = Number(warmth.value) / 100;
  const r = Math.floor(220 + t * 30);
  const g = Math.floor(180 + t * 50);
  const b = Math.floor(140 + t * 40);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawSunlight() {
  const { width, height } = canvas.getBoundingClientRect();
  const glowSize = Number(glow.value);
  const color = warmthColor();
  const x = width * sun.x;
  const y = height * sun.y;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const gradient = ctx.createRadialGradient(x, y, 20, x, y, glowSize * 2.2);
  gradient.addColorStop(0, `${color}dd`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, glowSize * 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCurtains() {
  const { width, height } = canvas.getBoundingClientRect();
  const shade = dimmed ? "rgba(120, 90, 70, 0.25)" : "rgba(255, 245, 230, 0.12)";
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
}

function drawPuffs() {
  const { width, height } = canvas.getBoundingClientRect();
  puffs = puffs.filter((puff) => puff.life > 0);

  puffs.forEach((puff) => {
    puff.y -= puff.drift;
    puff.x += Math.sin(puff.seed + puff.life * 0.03) * puff.wiggle;
    puff.life -= 1;

    const alpha = Math.max(puff.life / puff.maxLife, 0);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
    ctx.beginPath();
    ctx.arc(puff.x, puff.y, puff.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  if (puffs.length === 0) {
    ctx.fillStyle = "rgba(0,0,0,0)";
  }
}

function drawFloorGlow() {
  const { width, height } = canvas.getBoundingClientRect();
  const gradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  gradient.addColorStop(0, "rgba(255, 230, 200, 0.0)");
  gradient.addColorStop(1, "rgba(255, 200, 160, 0.35)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
}

function draw() {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  drawFloorGlow();
  drawSunlight();
  drawCurtains();
  drawPuffs();
}

function addPuff(x, y) {
  const base = Number(breeze.value) / 100;
  puffs.push({
    x,
    y,
    size: 18 + Math.random() * 20,
    life: 120 + Math.random() * 40,
    maxLife: 160,
    drift: 0.4 + base * 0.9,
    wiggle: 0.4 + base * 1.2,
    seed: Math.random() * Math.PI * 2,
  });
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  sun = {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
  draw();
});

canvas.addEventListener("pointerdown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  for (let i = 0; i < 3; i += 1) {
    addPuff(x + Math.random() * 18 - 9, y + Math.random() * 18 - 9);
  }
  draw();
});

warmth.addEventListener("input", draw);

glow.addEventListener("input", draw);

breeze.addEventListener("input", draw);

brew.addEventListener("click", () => {
  const { width, height } = canvas.getBoundingClientRect();
  const x = width * 0.2 + Math.random() * width * 0.6;
  const y = height * 0.6 + Math.random() * height * 0.25;
  for (let i = 0; i < 8; i += 1) {
    addPuff(x + Math.random() * 24 - 12, y + Math.random() * 24 - 12);
  }
  draw();
});

dim.addEventListener("click", () => {
  dimmed = !dimmed;
  dim.textContent = dimmed ? "Brighten" : "Dim room";
  draw();
});

reset.addEventListener("click", () => {
  puffs = [];
  dimmed = false;
  dim.textContent = "Dim room";
  warmth.value = 68;
  glow.value = 120;
  breeze.value = 25;
  sun = { x: 0.25, y: 0.25 };
  draw();
});

window.addEventListener("resize", () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  resize();
});

resize();

let last = performance.now();
function animate(now) {
  const delta = now - last;
  last = now;
  if (delta > 0) {
    draw();
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
