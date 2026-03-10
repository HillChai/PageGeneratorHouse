const speedEl = document.getElementById('speed');
const distanceEl = document.getElementById('distance');
const moodEl = document.getElementById('mood');
const pedalBtn = document.getElementById('pedalBtn');
const bellBtn = document.getElementById('bellBtn');
const playfulToggle = document.getElementById('playfulToggle');
const meterFill = document.getElementById('meterFill');
const bike = document.getElementById('bike');
let speed = 0;
let distance = 0;
let pedaling = false;
let playful = true;
let wobble = 0;

let audioContext;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

const ringBell = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const carrier = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const modGain = ctx.createGain();
  const gain = ctx.createGain();

  carrier.type = 'sine';
  modulator.type = 'triangle';

  carrier.frequency.setValueAtTime(1200, now);
  modulator.frequency.setValueAtTime(32, now);
  modGain.gain.setValueAtTime(140, now);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  carrier.connect(gain).connect(ctx.destination);

  carrier.start(now);
  modulator.start(now);
  carrier.stop(now + 1.25);
  modulator.stop(now + 1.25);
};

const moods = ['Ready', 'Cruising', 'Gliding', 'Focused', 'Joyful'];

const setMood = () => {
  const idx = Math.min(moods.length - 1, Math.floor(speed / 8));
  moodEl.textContent = moods[idx];
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const tick = () => {
  if (pedaling) {
    speed = clamp(speed + 0.35, 0, 28);
  } else {
    speed = clamp(speed - 0.18, 0, 28);
  }

  distance += speed / 3600;

  speedEl.textContent = speed.toFixed(1);
  distanceEl.textContent = distance.toFixed(2);
  meterFill.style.width = `${(speed / 28) * 100}%`;
  setMood();

  const wheelSpin = speed * 10;
  document.documentElement.style.setProperty('--spin', `${wheelSpin}deg`);

  if (playful) {
    wobble += speed * 0.02;
    const offset = Math.sin(wobble) * (speed / 8);
    bike.style.transform = `translateY(${offset}px)`;
  } else {
    bike.style.transform = 'translateY(0px)';
  }

  requestAnimationFrame(tick);
};

const playWhoosh = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(540, now);
  filter.Q.setValueAtTime(0.45, now);

  const air = ctx.createBiquadFilter();
  air.type = 'highpass';
  air.frequency.setValueAtTime(300, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  noise.connect(filter).connect(air).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.6);
};

const startPedal = () => {
  pedaling = true;
  playWhoosh();
};

const stopPedal = () => {
  pedaling = false;
};

pedalBtn.addEventListener('mousedown', startPedal);
pedalBtn.addEventListener('touchstart', startPedal, { passive: true });

window.addEventListener('mouseup', stopPedal);
window.addEventListener('touchend', stopPedal);

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    startPedal();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    stopPedal();
  }
});

bellBtn.addEventListener('click', ringBell);

playfulToggle.addEventListener('change', (event) => {
  playful = event.target.checked;
});

const wheelStyle = document.createElement('style');
wheelStyle.textContent = `
  .wheel { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
`;

const updateSpin = () => {
  const duration = speed > 0 ? (40 / speed).toFixed(2) : 2.5;
  wheelStyle.textContent = `
    .wheel { animation: spin ${duration}s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
  `;
};

setInterval(updateSpin, 200);

if (!document.head.contains(wheelStyle)) {
  document.head.appendChild(wheelStyle);
}

playfulToggle.dispatchEvent(new Event('change'));
requestAnimationFrame(tick);
