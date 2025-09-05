import * as PIXI from 'pixi.js';

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.ticker = PIXI.Ticker.shared;
  }

  // Play symbol win animation
  playSymbolWin(symbolSprite, animationType = 'bounce') {
    if (!symbolSprite) return;

    const originalScale = symbolSprite.scale.x;
    const animationId = `win_${symbolSprite.id || Math.random()}`;

    // Stop any existing animation on this sprite
    this.stopAnimation(animationId);

    let startTime = performance.now();
    const duration = 1000; // 1 second

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      switch (animationType) {
        case 'bounce':
          this.animateBounce(symbolSprite, progress, originalScale);
          break;
        case 'pulse':
          this.animatePulse(symbolSprite, progress, originalScale);
          break;
        case 'glow':
          this.animateGlow(symbolSprite, progress);
          break;
      }

      if (progress < 1) {
        this.animations.set(animationId, requestAnimationFrame(animate));
      } else {
        this.stopAnimation(animationId);
        // Reset to original state
        symbolSprite.scale.set(originalScale);
        symbolSprite.tint = 0xFFFFFF;
      }
    };

    this.animations.set(animationId, requestAnimationFrame(animate));
  }

  // Play reel spin animation
  playReelSpin(reelContainer, duration = 2000) {
    if (!reelContainer || !reelContainer.children) return;

    const animationId = `spin_${reelContainer.id || Math.random()}`;
    this.stopAnimation(animationId);

    let startTime = performance.now();
    const initialPositions = reelContainer.children.map(child => child.y);
    const spinDistance = 400; // Distance to spin

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      reelContainer.children.forEach((symbol, index) => {
        const originalY = initialPositions[index];
        symbol.y = originalY + (spinDistance * easeOut);
        
        // Wrap around when symbol goes too far down
        if (symbol.y > reelContainer.height + 100) {
          symbol.y = originalY - 100;
        }
      });

      if (progress < 1) {
        this.animations.set(animationId, requestAnimationFrame(animate));
      } else {
        this.stopAnimation(animationId);
        // Reset positions
        reelContainer.children.forEach((symbol, index) => {
          symbol.y = initialPositions[index];
        });
      }
    };

    this.animations.set(animationId, requestAnimationFrame(animate));
  }

  // Play winning line animation
  playWinningLine(lineGraphics, positions, color = 0xFFD700) {
    if (!lineGraphics || !positions || positions.length === 0) return;

    const animationId = `line_${Math.random()}`;
    this.stopAnimation(animationId);

    let startTime = performance.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Clear previous drawing
      lineGraphics.clear();
      
      // Draw the entire line at once (no progressive drawing)
      if (positions.length > 1) {
        lineGraphics.lineStyle(6, color, 0.8);
        
        // Draw line from first position
        const firstPos = this.getSymbolPosition(positions[0]);
        lineGraphics.moveTo(firstPos.x, firstPos.y);

        // Draw all segments of the line immediately
        for (let i = 1; i < positions.length; i++) {
          const pos = this.getSymbolPosition(positions[i]);
          lineGraphics.lineTo(pos.x, pos.y);
        }

        // Add pulsing effect for visual interest
        const pulse = 1 + Math.sin(elapsed * 0.01) * 0.3;
        lineGraphics.alpha = pulse * 0.8;
      }

      if (progress < 1) {
        this.animations.set(animationId, requestAnimationFrame(animate));
      } else {
        this.stopAnimation(animationId);
        // Keep line visible but static
        lineGraphics.alpha = 0.6;
      }
    };

    this.animations.set(animationId, requestAnimationFrame(animate));
  }

  // Individual animation functions
  animateBounce(sprite, progress, originalScale) {
    const bounceHeight = Math.sin(progress * Math.PI * 4) * 0.3;
    const scale = originalScale + bounceHeight;
    sprite.scale.set(scale);
  }

  animatePulse(sprite, progress, originalScale) {
    const pulse = Math.sin(progress * Math.PI * 6) * 0.2;
    const scale = originalScale + pulse;
    sprite.scale.set(scale);
    
    // Add color tinting
    const intensity = (Math.sin(progress * Math.PI * 6) + 1) * 0.5;
    sprite.tint = this.interpolateColor(0xFFFFFF, 0xFFD700, intensity);
  }

  animateGlow(sprite, progress) {
    const glow = Math.sin(progress * Math.PI * 4);
    const intensity = (glow + 1) * 0.5;
    sprite.tint = this.interpolateColor(0xFFFFFF, 0xFFFF00, intensity);
  }

  // Helper function to get symbol screen position
  getSymbolPosition(gridPos) {
    // Match the centering calculation from PixiSlotGame
    const cellWidth = 120;   // Updated to match new dimensions
    const cellHeight = 80;   // Updated to match new dimensions
    const totalGridWidth = 5 * cellWidth;
    const totalGridHeight = 5 * cellHeight;
    const gameWidth = 750;
    const gameHeight = 500;
    const startX = (gameWidth - totalGridWidth) / 2;
    const startY = (gameHeight - totalGridHeight) / 2;

    return {
      x: startX + (gridPos.col * cellWidth) + cellWidth / 2,
      y: startY + (gridPos.row * cellHeight) + cellHeight / 2
    };
  }

  // Easing functions
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Color interpolation
  interpolateColor(color1, color2, factor) {
    const r1 = (color1 >> 16) & 0xFF;
    const g1 = (color1 >> 8) & 0xFF;
    const b1 = color1 & 0xFF;

    const r2 = (color2 >> 16) & 0xFF;
    const g2 = (color2 >> 8) & 0xFF;
    const b2 = color2 & 0xFF;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return (r << 16) | (g << 8) | b;
  }

  // Stop specific animation
  stopAnimation(animationId) {
    if (this.animations.has(animationId)) {
      cancelAnimationFrame(this.animations.get(animationId));
      this.animations.delete(animationId);
    }
  }

  // Stop all animations
  stopAllAnimations() {
    this.animations.forEach((animationFrame) => {
      cancelAnimationFrame(animationFrame);
    });
    this.animations.clear();
  }

  // Cleanup
  destroy() {
    this.stopAllAnimations();
  }
}

export default AnimationManager;
