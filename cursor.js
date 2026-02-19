// White fire cursor — canvas-based flame particles with tadpole trail
(function () {

  // --- Setup canvas ---
  const canvas = document.createElement('canvas');
  canvas.id = 'fire-cursor-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // --- Setup dot ---
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Mouse state ---
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let prevX = mouseX;
  let prevY = mouseY;
  let velX = 0;
  let velY = 0;

  document.addEventListener('mousemove', (e) => {
    prevX = mouseX;
    prevY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    velX = mouseX - prevX;
    velY = mouseY - prevY;

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  }, { passive: true });

  // --- Particle pool ---
  const particles = [];

  class Particle {
    constructor() { this.reset(); }

    reset() {
      // spawn at cursor
      this.x = mouseX;
      this.y = mouseY;

      const speed = Math.random() * 1.8 + 0.5;

      // Trail direction: opposite to movement (tadpole tail behind cursor)
      const angle = Math.atan2(velY, velX) + Math.PI; // reverse direction
      const spread = (Math.random() - 0.5) * 0.9;     // spread angle

      this.vx = Math.cos(angle + spread) * speed + (Math.random() - 0.5) * 0.4;
      this.vy = Math.sin(angle + spread) * speed + (Math.random() - 0.5) * 0.4;

      // If barely moving, spread in a ring (idle flicker)
      const moving = Math.sqrt(velX * velX + velY * velY);
      if (moving < 1.5) {
        const a = Math.random() * Math.PI * 2;
        this.vx = Math.cos(a) * Math.random() * 0.8;
        this.vy = Math.sin(a) * Math.random() * 0.8 - 0.5;
      }

      this.life = Math.random() * 0.6 + 0.4;   // 0.4 – 1.0
      this.decay = Math.random() * 0.035 + 0.02;
      this.size = Math.random() * 6 + 3;
      this.alive = true;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.93;
      this.vy *= 0.93;
      this.life -= this.decay;
      this.size *= 0.97;
      if (this.life <= 0 || this.size < 0.5) this.alive = false;
    }

    draw() {
      const alpha = Math.max(0, this.life);

      // Layered glow: blue-white core fading to transparent
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0,   `rgba(220, 255, 255, ${alpha})`);
      grad.addColorStop(0.3, `rgba(0, 194, 222, ${alpha * 0.85})`);
      grad.addColorStop(0.7, `rgba(0, 150, 180, ${alpha * 0.35})`);
      grad.addColorStop(1,   `rgba(0, 100, 140, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // Pre-fill pool
  const POOL_SIZE = 80;
  for (let i = 0; i < POOL_SIZE; i++) particles.push(new Particle());

  // How many particles to emit per frame (more = denser fire)
  const EMIT_PER_FRAME = 5;

  let emitIndex = 0;

  function emit() {
    for (let i = 0; i < EMIT_PER_FRAME; i++) {
      const p = particles[emitIndex % POOL_SIZE];
      if (!p.alive) {
        p.reset();
      } else {
        // Force reset on older particles if pool is full
        if (Math.random() < 0.3) p.reset();
      }
      emitIndex++;
    }
  }

  // --- Render loop ---
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    emit();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // additive blend = glow on dark bg
    for (const p of particles) {
      if (p.alive) {
        p.update();
        p.draw();
      }
    }
    ctx.restore();

    requestAnimationFrame(loop);
  }

  loop();

})();