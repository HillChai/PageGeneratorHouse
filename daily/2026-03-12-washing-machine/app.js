const waterLevel = document.getElementById('waterLevel');
const tempLevel = document.getElementById('tempLevel');
const waterValue = document.getElementById('waterValue');
const tempValue = document.getElementById('tempValue');
const water = document.getElementById('water');
const cycleButtons = document.querySelectorAll('.cycle');
const cycleName = document.getElementById('cycleName');
const timeLeft = document.getElementById('timeLeft');
const startBtn = document.getElementById('startBtn');
const laundry = document.getElementById('laundry');
const bubbles = document.getElementById('bubbles');
const progressBar = document.getElementById('progressBar');
const tipText = document.getElementById('tipText');

let spinning = false;
let angle = 0;
let cycleMinutes = 5;
let elapsed = 0;
let timerId = null;

const tips = [
  'Tiny reminder: empty pockets = happier wash.',
  'Spin slower when the cycle is deep and thoughtful.',
  'Warm water helps, but cold keeps colors bright.',
  'Fold right after — future you will smile.',
  'Listening to the rhythm makes the time feel shorter.'
];

function updateWater() {
  const value = waterLevel.value;
  waterValue.textContent = `${value}%`;
  water.style.height = `${value}%`;
}

function updateTemp() {
  tempValue.textContent = `${tempLevel.value}°C`;
}

function setCycle(button) {
  cycleButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  cycleMinutes = Number(button.dataset.time);
  cycleName.textContent = button.dataset.cycle;
  resetTimer();
}

function resetTimer() {
  elapsed = 0;
  updateTime();
  progressBar.style.width = '0%';
}

function updateTime() {
  const remaining = Math.max(cycleMinutes * 60 - elapsed, 0);
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  timeLeft.textContent = `${min}:${sec}`;
}

function spawnBubble() {
  const bubble = document.createElement('span');
  bubble.className = 'bubble';
  bubble.style.left = `${20 + Math.random() * 60}%`;
  bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
  bubbles.appendChild(bubble);
  setTimeout(() => bubble.remove(), 3000);
}

function spin() {
  if (!spinning) return;
  angle += 0.8 + (tempLevel.value - 20) * 0.01;
  laundry.style.transform = `rotate(${angle}deg)`;
  if (Math.random() > 0.6) spawnBubble();
  requestAnimationFrame(spin);
}

function tick() {
  if (!spinning) return;
  elapsed += 1;
  updateTime();
  const progress = Math.min((elapsed / (cycleMinutes * 60)) * 100, 100);
  progressBar.style.width = `${progress}%`;
  if (elapsed >= cycleMinutes * 60) {
    stopCycle(true);
  }
}

function stopCycle(completed = false) {
  spinning = false;
  startBtn.textContent = completed ? 'Done' : 'Start';
  if (timerId) clearInterval(timerId);
  timerId = null;
  if (completed) {
    tipText.textContent = 'Cycle complete. Toss in a dryer sheet if you like.';
  } else {
    tipText.textContent = 'Paused. The laundry is taking a breather.';
  }
}

startBtn.addEventListener('click', () => {
  if (!spinning) {
    if (startBtn.textContent === 'Done') resetTimer();
    spinning = true;
    startBtn.textContent = 'Pause';
    tipText.textContent = tips[Math.floor(Math.random() * tips.length)];
    timerId = setInterval(tick, 1000);
    requestAnimationFrame(spin);
  } else {
    stopCycle(false);
  }
});

cycleButtons.forEach((button) => {
  button.addEventListener('click', () => setCycle(button));
});

waterLevel.addEventListener('input', updateWater);
tempLevel.addEventListener('input', updateTemp);

updateWater();
updateTemp();
resetTimer();
