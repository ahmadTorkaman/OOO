/**
 * Particle Flow Animation
 * Creates flowing particles from employees -> OZONE -> outputs
 */

export class ParticleFlow {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;

    // Flow points (will be set by setFlowPoints)
    this.sources = []; // Employee nodes
    this.center = { x: 0, y: 0 }; // OZONE core
    this.outputs = []; // Output nodes

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  setFlowPoints(sources, center, outputs) {
    this.sources = sources;
    this.center = center;
    this.outputs = outputs;
  }

  createParticle(source) {
    const colors = {
      designer: '#3498db',
      engineer: '#2ecc71',
      operator: '#f39c12',
      manager: '#9b59b6'
    };

    return {
      x: source.x,
      y: source.y,
      targetX: this.center.x,
      targetY: this.center.y,
      speed: 0.01 + Math.random() * 0.02,
      progress: 0,
      phase: 'toCenter', // toCenter, processing, toOutput
      color: colors[source.type] || '#4c62ba',
      size: 3 + Math.random() * 3,
      opacity: 0.7 + Math.random() * 0.3,
      outputIndex: Math.floor(Math.random() * this.outputs.length),
      processingTime: 0
    };
  }

  updateParticle(particle) {
    switch (particle.phase) {
      case 'toCenter':
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          particle.progress = 0;
          particle.phase = 'processing';
          particle.processingTime = 0;
        } else {
          // Ease in-out interpolation
          const eased = this.easeInOutCubic(particle.progress);
          particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * 2;
          particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * 2;
        }
        break;

      case 'processing':
        // Swirl around the center
        particle.processingTime += 0.05;
        const radius = 30;
        const angle = particle.processingTime * 2;
        particle.x = this.center.x + Math.cos(angle) * radius;
        particle.y = this.center.y + Math.sin(angle) * radius;

        if (particle.processingTime > Math.PI) {
          particle.phase = 'toOutput';
          particle.progress = 0;
          const output = this.outputs[particle.outputIndex];
          particle.targetX = output.x;
          particle.targetY = output.y;

          // Transform color based on output
          if (particle.outputIndex === 0) {
            particle.color = '#e74c3c'; // Company benefits - red
          } else {
            particle.color = '#27ae60'; // Employee benefits - green
          }
        }
        break;

      case 'toOutput':
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          // Particle reached output, mark for removal
          particle.dead = true;
        } else {
          const eased = this.easeInOutCubic(particle.progress);
          particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * 2;
          particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * 2;

          // Fade out as it approaches output
          particle.opacity = 1 - particle.progress;
        }
        break;
    }
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fill();

    // Add glow effect
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = particle.color;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    this.ctx.globalAlpha = 1;
  }

  animate() {
    if (!this.isRunning) return;

    // Clear canvas with slight trail effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn new particles randomly
    if (Math.random() < 0.1 && this.sources.length > 0) {
      const randomSource = this.sources[Math.floor(Math.random() * this.sources.length)];
      this.particles.push(this.createParticle(randomSource));
    }

    // Update and draw particles
    this.particles = this.particles.filter(particle => {
      if (particle.dead) return false;

      this.updateParticle(particle);
      this.drawParticle(particle);

      return true;
    });

    // Limit particle count for performance
    if (this.particles.length > 100) {
      this.particles.shift();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', () => this.resize());
  }
}
