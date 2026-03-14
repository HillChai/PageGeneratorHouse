const petalButton = document.getElementById('petalButton');
const glowButton = document.getElementById('glowButton');
const petalField = document.getElementById('petalField');
const poemLines = document.querySelectorAll('.lines p');
const memoryInput = document.getElementById('memoryInput');
const saveMemory = document.getElementById('saveMemory');
const memoryEcho = document.getElementById('memoryEcho');

const storedMemory = localStorage.getItem('tulipMemory');
if (storedMemory) {
  memoryEcho.textContent = `Saved: "${storedMemory}"`;
  memoryInput.value = storedMemory;
}

function spawnPetals(count = 18) {
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const left = Math.random() * 100;
    const size = 12 + Math.random() * 16;
    const delay = Math.random() * 1.5;
    const duration = 6 + Math.random() * 6;

    petal.style.left = `${left}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;

    petalField.appendChild(petal);

    petal.addEventListener('animationend', () => petal.remove());
  }
}

petalButton.addEventListener('click', () => {
  spawnPetals(26);
});

poemLines.forEach((line) => {
  line.addEventListener('click', () => {
    line.classList.toggle('active');
  });
});

glowButton.addEventListener('click', () => {
  document.body.classList.toggle('glow');
});

saveMemory.addEventListener('click', () => {
  const value = memoryInput.value.trim();
  if (!value) {
    memoryEcho.textContent = 'Write a little something first.';
    return;
  }
  localStorage.setItem('tulipMemory', value);
  memoryEcho.textContent = `Saved: "${value}"`;
});

// Gentle ambient petals on load
setTimeout(() => spawnPetals(12), 800);
