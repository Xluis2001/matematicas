/**
 * mini-confetti-clasico-flex.js
 * 🎉 Versión clásica reutilizable con soporte para:
 * Confetti.launch(type, x, y, particleCount, spread)
 * 
 * USO RÁPIDO (CLÁSICO):
 * -----------------------
 * <script src="mini-confetti-clasico-flex.js"></script>
 * <script>
 *   Confetti.launch();                     // Cuadrado desde el centro
 *   Confetti.launch(1);                    // Círculo desde el centro
 *   Confetti.launch(2, 0.5, 0.2);          // Emoji desde arriba centro
 *   Confetti.launch(1, 0.1, 0.1, 300, 90); // Círculo, esquina sup izq
 * </script>
 */

const Confetti = (() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const defaultEmojis = ['🎉', '😄', '🎈', '😎'];
  const colors = ['#FFD700', '#FF4500', '#7CFC00', '#1E90FF', '#FF1493', '#FFFF00', '#9400D3'];

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function launch(a = 0, b = 0.5, c = 0.5, d = 400, e = 360) {
    let type = 0, x = 0.5, y = 0.5, particleCount = 400, spread = 360, emojis = defaultEmojis;

    if (typeof a === 'object') {
      type = a.type ?? 0;
      x = a.x ?? 0.5;
      y = a.y ?? 0.5;
      particleCount = a.particleCount ?? 400;
      spread = a.spread ?? 360;
      if (a.emojis && Array.isArray(a.emojis)) emojis = a.emojis;
    } else {
      type = a ?? 0;
      x = b ?? 0.5;
      y = c ?? 0.5;
      particleCount = d ?? 400;
      spread = e ?? 360;
    }

    const centerX = canvas.width * x;
    const centerY = canvas.height * y;

    for (let i = 0; i < particleCount; i++) {
      const angle = randomBetween(0, spread) * (Math.PI / 180);
      const speed = randomBetween(5, 15);
      const direction = Math.random() * 2 * Math.PI;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        size: randomBetween(4, 12),
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        life: 120,
        type
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      if (p.type === 1) {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 2) {
        ctx.font = (p.size * 1.8) + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, p.x, p.y);

      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    });
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  return { launch };
})();

window.Confetti = Confetti;
