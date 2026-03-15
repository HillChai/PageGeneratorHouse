const orbit = document.getElementById("orbit");
const sky = document.getElementById("sky");
const glowInput = document.getElementById("glow");
const breezeInput = document.getElementById("breeze");
const lanternBtn = document.getElementById("lantern");

const COLORS = ["cool", "warm"];

const createOrb = () => {
  const orb = document.createElement("div");
  const size = 8 + Math.random() * 18;
  const duration = 12 + Math.random() * 18;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const variant = COLORS[Math.floor(Math.random() * COLORS.length)];

  orb.className = `orb ${variant === "warm" ? "warm" : ""}`;
  orb.style.setProperty("--size", `${size}px`);
  orb.style.setProperty("--duration", `${duration}s`);
  orb.style.left = `${x}%`;
  orb.style.top = `${y}%`;
  orb.style.animationDelay = `${Math.random() * 6}s`;

  return orb;
};

const seedOrbs = (count = 40) => {
  orbit.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    orbit.appendChild(createOrb());
  }
};

const setGlow = (value) => {
  document.documentElement.style.setProperty("--glow", value);
};

const setBreeze = (value) => {
  document.documentElement.style.setProperty("--breeze", value);
};

const plantSeed = (event) => {
  const rect = sky.getBoundingClientRect();
  const seed = document.createElement("div");
  seed.className = "seed";
  seed.style.left = `${event.clientX - rect.left - 6}px`;
  seed.style.top = `${event.clientY - rect.top - 6}px`;
  sky.appendChild(seed);
  setTimeout(() => seed.remove(), 3200);
};

const releaseLantern = () => {
  const lantern = document.createElement("div");
  lantern.className = "lantern";
  lantern.style.left = `${10 + Math.random() * 80}%`;
  lantern.style.bottom = "-30px";
  sky.appendChild(lantern);
  setTimeout(() => lantern.remove(), 8200);
};

const handleMove = (event) => {
  const rect = sky.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  const depth = 12 + Number(breezeInput.value) / 6;
  orbit.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
};

seedOrbs(45);
setGlow(glowInput.value);
setBreeze(breezeInput.value);

sky.addEventListener("click", plantSeed);
sky.addEventListener("mousemove", handleMove);

lanternBtn.addEventListener("click", releaseLantern);

[glowInput, breezeInput].forEach((input) => {
  input.addEventListener("input", (event) => {
    if (event.target === glowInput) {
      setGlow(event.target.value);
    }
    if (event.target === breezeInput) {
      setBreeze(event.target.value);
    }
  });
});
