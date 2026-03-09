const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekGrid = document.getElementById('weekGrid');
const daysLeft = document.getElementById('daysLeft');
const countdownNote = document.getElementById('countdownNote');
const meterFill = document.getElementById('meterFill');
const planForm = document.getElementById('planForm');
const planInput = document.getElementById('planInput');
const planList = document.getElementById('planList');

function getDaysUntilWeekend() {
  const today = new Date();
  const dayIndex = (today.getDay() + 6) % 7; // convert Sun=0 to Sun=6, Mon=0
  const saturdayIndex = 5; // Mon=0, Sat=5
  const daysRemaining = (saturdayIndex - dayIndex + 7) % 7;
  return { dayIndex, daysRemaining };
}

function renderWeek() {
  const { dayIndex } = getDaysUntilWeekend();
  weekGrid.innerHTML = '';
  days.forEach((day, index) => {
    const cell = document.createElement('div');
    cell.className = 'day';
    if (index === dayIndex) {
      cell.classList.add('current');
    }
    if (index >= 5) {
      cell.classList.add('weekend');
    }
    cell.innerHTML = `<strong>${day}</strong><span>${index >= 5 ? 'Weekend' : 'Work'}</span>`;
    weekGrid.appendChild(cell);
  });
}

function updateCountdown() {
  const { daysRemaining } = getDaysUntilWeekend();
  daysLeft.textContent = daysRemaining;
  if (daysRemaining === 0) {
    countdownNote.textContent = 'It is the weekend. You made it.';
  } else if (daysRemaining === 1) {
    countdownNote.textContent = 'One sleep away from slow mornings.';
  } else {
    countdownNote.textContent = `${daysRemaining} days of "almost there."`;
  }
}

function setMeter(value) {
  const clamped = Math.max(8, Math.min(92, value));
  meterFill.style.width = `${clamped}%`;
}

function handlePointer(event) {
  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const percent = (x / window.innerWidth) * 100;
  setMeter(percent);
}

function addPlan(text) {
  const item = document.createElement('div');
  item.className = 'plan-item';
  item.textContent = text;
  item.addEventListener('click', () => {
    item.classList.toggle('glow');
  });
  planList.appendChild(item);
}

planForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = planInput.value.trim();
  if (!value) return;
  addPlan(value);
  planInput.value = '';
});

window.addEventListener('mousemove', handlePointer);
window.addEventListener('touchmove', handlePointer);

renderWeek();
updateCountdown();
setMeter(35);

addPlan('Slow coffee, no alarms');
addPlan('Long walk with music');
