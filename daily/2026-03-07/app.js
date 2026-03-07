const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sizeInput = document.getElementById("size");
const blurInput = document.getElementById("blur");
const paletteSelect = document.getElementById("palette");
const clearBtn = document.getElementById("clear");
const randomizeBtn = document.getElementById("randomize");
const downloadBtn = document.getElementById("download");

const palettes = {
  neon: ["#7df9ff", "#ff4fd8", "#7b61ff", "#44ff9a", "#ffd24c"],
  pastel: ["#c6f6ff", "#fbc8ff", "#ffe1a8", "#c7f9cc", "#cdb4db"],
  mono: ["#f8f9fa", "#adb5bd", "#495057", "#dee2e6"],
  sunset: ["#ff9f1c", "#ff4d6d", "#ffb3c1", "#6a4c93", "#2ec4b6"],
};

let blobs = [];
let dragging = null;
let hoverPoint = null;

function resize() {
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function getPalette() {
  return palettes[paletteSelect.value] || palettes.neon;
}

function createBlob(x, y) {
  const palette = getPalette();
  const radius = Number(sizeInput.value);
  const blur = Number(blurInput.value);
  return {
    x,
    y,
    radius,
    blur,
    color: palette[Math.floor(Math.random() * palette.length)],
    alpha: 0.9,
  };
}

function drawBlob(blob) {
  const gradient = ctx.createRadialGradient(
    blob.x,
    blob.y,
    0,
    blob.x,
    blob.y,
    blob.radius
  );
  gradient.addColorStop(0, `${blob.color}${Math.floor(blob.alpha * 255).toString(16).padStart(2, "0")}`);
  gradient.addColorStop(1, `${blob.color}00`);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = `blur(${blob.blur}px)`;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHover() {
  if (!hoverPoint) return;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(hoverPoint.x, hoverPoint.y, Number(sizeInput.value), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function draw() {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  blobs.forEach(drawBlob);
  drawHover();
}

function getPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function hitTest(point) {
  return blobs.findIndex(
    (blob) => Math.hypot(point.x - blob.x, point.y - blob.y) <= blob.radius
  );
}

canvas.addEventListener("pointerdown", (event) => {
  const point = getPointer(event);
  const hitIndex = hitTest(point);
  if (hitIndex >= 0) {
    dragging = hitIndex;
  } else {
    blobs.push(createBlob(point.x, point.y));
  }
  draw();
});

canvas.addEventListener("pointermove", (event) => {
  const point = getPointer(event);
  hoverPoint = point;
  if (dragging !== null) {
    blobs[dragging].x = point.x;
    blobs[dragging].y = point.y;
  }
  draw();
});

canvas.addEventListener("pointerup", () => {
  dragging = null;
});

canvas.addEventListener("dblclick", (event) => {
  const point = getPointer(event);
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    const radius = Number(sizeInput.value) * 0.8;
    blobs.push(
      createBlob(point.x + Math.cos(angle) * radius, point.y + Math.sin(angle) * radius)
    );
  }
  draw();
});

clearBtn.addEventListener("click", () => {
  blobs = [];
  draw();
});

randomizeBtn.addEventListener("click", () => {
  const keys = Object.keys(palettes);
  paletteSelect.value = keys[Math.floor(Math.random() * keys.length)];
  blobs = blobs.map((blob) => ({ ...blob, color: getPalette()[Math.floor(Math.random() * getPalette().length)] }));
  draw();
});

paletteSelect.addEventListener("change", () => {
  const palette = getPalette();
  blobs = blobs.map((blob) => ({
    ...blob,
    color: palette[Math.floor(Math.random() * palette.length)],
  }));
  draw();
});

sizeInput.addEventListener("input", () => {
  blobs = blobs.map((blob) => ({ ...blob, radius: Number(sizeInput.value) }));
  draw();
});

blurInput.addEventListener("input", () => {
  blobs = blobs.map((blob) => ({ ...blob, blur: Number(blurInput.value) }));
  draw();
});

downloadBtn.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  exportCtx.fillStyle = "#05070f";
  exportCtx.fillRect(0, 0, exportCanvas.width / dpr, exportCanvas.height / dpr);
  blobs.forEach((blob) => {
    const gradient = exportCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
    gradient.addColorStop(0, `${blob.color}ee`);
    gradient.addColorStop(1, `${blob.color}00`);
    exportCtx.save();
    exportCtx.globalCompositeOperation = "lighter";
    exportCtx.filter = `blur(${blob.blur}px)`;
    exportCtx.fillStyle = gradient;
    exportCtx.beginPath();
    exportCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
    exportCtx.fill();
    exportCtx.restore();
  });
  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = "glow-composer.png";
  link.click();
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    blobs = [];
    draw();
  }
});

window.addEventListener("resize", () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  resize();
});

resize();
