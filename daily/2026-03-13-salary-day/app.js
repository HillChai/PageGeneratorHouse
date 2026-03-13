const paySlider = document.getElementById('paySlider');
const payValue = document.getElementById('payValue');
const jarCards = document.querySelectorAll('.jar');
const totalLabel = document.getElementById('percentTotal');
const budgetMessage = document.getElementById('budgetMessage');
const rainButton = document.getElementById('rainButton');
const rainCount = document.getElementById('rainCount');
const coinField = document.getElementById('coinField');
const perkButtons = document.querySelectorAll('.perk');
const perkNote = document.getElementById('perkNote');

let coinsDropped = 0;

const perkMessages = [
  'Perfect choice. Payday sparkle activated ✨',
  'Locked in. Treat yourself, responsibly 😌',
  'That vibe is immaculate. Enjoy!',
  'Payday ritual confirmed. Enjoy the moment!'
];

function formatCurrency(value) {
  return Math.round(value).toLocaleString('en-US');
}

function updateJars() {
  const pay = Number(paySlider.value);
  payValue.textContent = formatCurrency(pay);

  let total = 0;
  jarCards.forEach((jar) => {
    const slider = jar.querySelector('.jar-slider');
    const percent = Number(slider.value);
    total += percent;

    jar.querySelector('.jar-percent').textContent = `${percent}%`;
    jar.querySelector('.jar-amount').textContent = `￥${formatCurrency((pay * percent) / 100)}`;
  });

  totalLabel.textContent = `Total: ${total}%`;

  if (total === 100) {
    budgetMessage.textContent = 'Perfect split. Payday glow unlocked ✨';
    budgetMessage.style.color = '#2c1f1f';
  } else if (total < 100) {
    budgetMessage.textContent = 'You have some unassigned cash. Sprinkle it on savings or treats!';
    budgetMessage.style.color = '#6b4c4c';
  } else {
    budgetMessage.textContent = 'Oops, that is over 100%. Trim a jar to balance the budget.';
    budgetMessage.style.color = '#c0392b';
  }
}

function dropCoins(amount = 12) {
  for (let i = 0; i < amount; i += 1) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = `${Math.random() * 100}%`;
    coin.style.animationDelay = `${Math.random() * 0.4}s`;
    coinField.appendChild(coin);

    setTimeout(() => coin.remove(), 1500);
  }
}

function celebrate() {
  coinsDropped += 12;
  rainCount.textContent = coinsDropped;
  dropCoins();
}

paySlider.addEventListener('input', updateJars);
jarCards.forEach((jar) => jar.querySelector('.jar-slider').addEventListener('input', updateJars));

rainButton.addEventListener('click', () => {
  celebrate();
  if (perkNote.textContent.includes('Payday ritual')) {
    dropCoins(18);
  }
});

perkButtons.forEach((button) => {
  button.addEventListener('click', () => {
    perkButtons.forEach((btn) => btn.classList.remove('selected'));
    button.classList.add('selected');
    const message = perkMessages[Math.floor(Math.random() * perkMessages.length)];
    perkNote.textContent = message;
    perkNote.style.color = '#2c1f1f';
  });
});

updateJars();
