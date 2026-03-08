const stream = document.getElementById('stream');
const distanceSlider = document.getElementById('distance');
const holdButton = document.getElementById('hold');
const form = document.getElementById('composer');
const input = document.getElementById('messageInput');

const messages = [
  'We talked until\n the sky turned pale.',
  'I replayed your laugh\n in the morning light.',
  'It felt like\n a beginning.',
  'Then the thread\n went quiet.',
  'The afterglow\n stayed with me.',
  'I still hear\n the typing dots.',
  'Somewhere,\n you are awake too.',
  'I hold the night\n between my hands.'
];

let heldBubble = null;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBubble(text) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  bubble.style.left = `${randomBetween(5, 70)}%`;
  bubble.style.top = `${randomBetween(5, 70)}%`;

  bubble.addEventListener('click', () => {
    if (bubble === heldBubble) return;
    bubble.classList.add('fade');
    spawnEcho(bubble);
    setTimeout(() => bubble.remove(), 500);
  });

  stream.appendChild(bubble);
  return bubble;
}

function spawnEcho(bubble) {
  const echo = document.createElement('div');
  echo.className = 'echo';
  echo.textContent = '…';
  echo.style.left = bubble.style.left;
  echo.style.top = bubble.style.top;
  stream.appendChild(echo);
  setTimeout(() => echo.remove(), 3000);
}

function applyDistance() {
  const distance = distanceSlider.value;
  const blur = distance / 25;
  stream.querySelectorAll('.bubble').forEach((bubble) => {
    if (bubble === heldBubble) {
      bubble.style.filter = 'blur(0px)';
      bubble.style.opacity = '1';
      return;
    }
    bubble.style.filter = `blur(${blur}px)`;
    bubble.style.opacity = `${1 - distance / 120}`;
  });
}

function seedBubbles() {
  messages.forEach((msg) => createBubble(msg));
  applyDistance();
}

holdButton.addEventListener('click', () => {
  const bubbles = Array.from(stream.querySelectorAll('.bubble'));
  if (!bubbles.length) return;
  if (heldBubble) {
    heldBubble.classList.remove('hold');
  }
  heldBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
  heldBubble.classList.add('hold');
  applyDistance();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const bubble = createBubble(text);
  input.value = '';
  setTimeout(() => {
    if (bubble === heldBubble) return;
    bubble.classList.add('fade');
    spawnEcho(bubble);
    setTimeout(() => bubble.remove(), 500);
  }, 5000);
  applyDistance();
});

distanceSlider.addEventListener('input', applyDistance);

seedBubbles();
