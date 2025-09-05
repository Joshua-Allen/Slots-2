import * as PIXI from 'pixi.js';

class PixiSlotReel {
  constructor(assetLoader, col, symbols = []) {
    this.assetLoader = assetLoader;
    this.col = col;
    this.container = new PIXI.Container();
    this.symbols = [];
    this.symbolSprites = [];
    this.isSpinning = false;
    
    this.symbolHeight = 80;  // Match PixiSlotGame dimensions
    this.symbolWidth = 120;  // Match PixiSlotGame dimensions
    this.visibleSymbols = 5;
    
    this.initializeReel(symbols);
  }

  initializeReel(symbols) {
    // Clear existing sprites
    this.container.removeChildren();
    this.symbolSprites = [];
    
    // Generate symbols if not provided
    if (symbols.length === 0) {
      symbols = this.generateRandomSymbols();
    }
    
    this.symbols = symbols;
    
    // Create sprite for each symbol - limit to visible symbols for now
    for (let i = 0; i < Math.min(this.symbols.length, this.visibleSymbols); i++) {
      const symbolName = this.symbols[i];
      const texture = this.assetLoader.getTexture(symbolName);
      
      if (texture) {
        const sprite = new PIXI.Sprite(texture);
        
        // Scale sprite to fit cell properly
        sprite.width = this.symbolWidth - 4; // Minimal padding for clean look
        sprite.height = this.symbolHeight - 4;
        
        // Center the sprite in its cell
        sprite.anchor.set(0.5);
        sprite.x = this.symbolWidth / 2;
        sprite.y = (i * this.symbolHeight) + (this.symbolHeight / 2);
        
        console.log(`Reel ${this.col}, Sprite ${i}: x=${sprite.x}, y=${sprite.y}, symbol=${symbolName}`);
        
        // Add identifier for animations
        sprite.symbolName = symbolName;
        sprite.reelIndex = i;
        sprite.id = `${this.col}_${i}`;
        
        this.symbolSprites.push(sprite);
        this.container.addChild(sprite);
      }
    }
    
    // Set container properties (don't set x position here - it will be set by setPosition)
    this.container.width = this.symbolWidth;
    this.container.height = this.visibleSymbols * this.symbolHeight;
    
    console.log(`Reel ${this.col}: container dimensions ${this.symbolWidth}x${this.container.height}`);
    
    // Create mask for the reel to hide overflow
    const mask = new PIXI.Graphics();
    mask.beginFill(0x000000);
    mask.drawRect(0, 0, this.symbolWidth, this.visibleSymbols * this.symbolHeight);
    mask.endFill();
    
    console.log(`Reel ${this.col}: mask dimensions ${this.symbolWidth}x${this.visibleSymbols * this.symbolHeight}`);
    
    this.container.mask = mask;
    this.container.addChild(mask);
  }

  generateRandomSymbols() {
    const availableSymbols = this.assetLoader.getAllSymbols();
    const symbols = [];
    
    // Generate more symbols than visible for smooth spinning
    const totalSymbols = this.visibleSymbols + 3;
    
    for (let i = 0; i < totalSymbols; i++) {
      const randomIndex = Math.floor(Math.random() * availableSymbols.length);
      symbols.push(availableSymbols[randomIndex]);
    }
    
    return symbols;
  }

  ensureSpinningSprites() {
    // We need extra sprites for smooth spinning animation
    const neededSprites = this.visibleSymbols + 3; // 5 visible + 3 extra for smooth spin
    
    // Clear and recreate extra sprites each time for more randomness
    while (this.symbolSprites.length > this.visibleSymbols) {
      const sprite = this.symbolSprites.pop();
      this.container.removeChild(sprite);
    }
    
    while (this.symbolSprites.length < neededSprites) {
      const availableSymbols = this.assetLoader.getAllSymbols();
      const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
      const texture = this.assetLoader.getTexture(randomSymbol);
      
      if (texture) {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.width = this.symbolWidth - 4;
        sprite.height = this.symbolHeight - 4;
        sprite.x = this.symbolWidth / 2;
        
        // Position the new sprite above the visible area
        const spriteIndex = this.symbolSprites.length;
        sprite.y = (spriteIndex * this.symbolHeight) + (this.symbolHeight / 2);
        
        sprite.symbolName = randomSymbol;
        sprite.reelIndex = spriteIndex;
        sprite.id = `${this.col}_${spriteIndex}`;
        sprite.visible = true; // Make sure it's visible during spinning
        
        this.symbolSprites.push(sprite);
        this.container.addChild(sprite);
        
        console.log(`Added extra sprite ${spriteIndex} for reel ${this.col}: ${randomSymbol} at y=${sprite.y}`);
      }
    }
  }

  spin(newSymbols, duration = 2500) {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    
    // Create extra sprites for spinning animation if needed
    this.ensureSpinningSprites();
    
    return new Promise((resolve) => {
      // Generate spin animation with random final offset
      const startTime = performance.now();
      const spinDistance = this.symbolHeight * 20; // Much more distance for dramatic effect
      
      // Add random offset to make each spin land differently
      const randomOffset = Math.random() * this.symbolHeight * this.symbolSprites.length;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Three-phase easing: instant start, constant speed, quick deceleration
        let easeValue;
        if (progress < 0.05) {
          // Phase 1: Very quick start (first 5% of time)
          easeValue = progress * 20; // Very quick ramp to full speed
        } else if (progress < 0.80) {
          // Phase 2: Constant full speed (75% of time)
          const constantProgress = (progress - 0.05) / 0.75;
          easeValue = 1.0 + constantProgress * 12; // High constant speed with gradual increase
        } else {
          // Phase 3: Quick deceleration (last 20% of time)
          const decelerationProgress = (progress - 0.80) / 0.20;
          const deceleration = 1 - Math.pow(decelerationProgress, 3); // Quick but smooth stop
          easeValue = 13.0 + (1.0 - 13.0) * (1 - deceleration);
        }
        
        // Move all symbols down
        const currentOffset = (spinDistance + randomOffset) * easeValue;
        this.symbolSprites.forEach((sprite, index) => {
          const baseY = (index * this.symbolHeight) + (this.symbolHeight / 2);
          sprite.y = baseY + currentOffset;
          
          // Wrap around sprites that go below the visible area
          const totalHeight = this.symbolSprites.length * this.symbolHeight;
          const visibleBottom = this.visibleSymbols * this.symbolHeight;
          
          while (sprite.y > visibleBottom + this.symbolHeight) {
            // Move sprite to top
            sprite.y -= totalHeight;
            
            // Give the sprite a new random symbol when it wraps to the top
            const availableSymbols = this.assetLoader.getAllSymbols();
            const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
            const newTexture = this.assetLoader.getTexture(randomSymbol);
            
            if (newTexture) {
              sprite.texture = newTexture;
              sprite.symbolName = randomSymbol;
              console.log(`Reel ${this.col}: Sprite wrapped to top, new symbol: ${randomSymbol}`);
            }
          }
          
          // Also handle sprites that might wrap too far up
          while (sprite.y < -this.symbolHeight) {
            sprite.y += totalHeight;
            
            // Also randomize when wrapping upward (though this should be rare)
            const availableSymbols = this.assetLoader.getAllSymbols();
            const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
            const newTexture = this.assetLoader.getTexture(randomSymbol);
            
            if (newTexture) {
              sprite.texture = newTexture;
              sprite.symbolName = randomSymbol;
              console.log(`Reel ${this.col}: Sprite wrapped to bottom, new symbol: ${randomSymbol}`);
            }
          }
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Spin complete - log final positions before finalizing
          console.log(`Reel ${this.col} spin complete. Final sprite positions:`);
          this.symbolSprites.forEach((sprite, i) => {
            console.log(`  Sprite ${i}: ${sprite.symbolName} at y=${sprite.y.toFixed(1)}`);
          });
          
          // Spin complete - determine final symbols based on current positions
          this.finalizeSpinBasedOnPosition();
          this.isSpinning = false;
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  finalizeSpinBasedOnPosition() {
    // Find which sprites are currently in the visible positions
    const finalSymbols = [];
    
    console.log(`Finalizing reel ${this.col} with ${this.symbolSprites.length} sprites`);
    
    // Sort sprites by their current Y position
    const sortedSprites = [...this.symbolSprites].sort((a, b) => a.y - b.y);
    
    console.log('Sprite positions:', sortedSprites.map(s => `${s.symbolName}:${s.y.toFixed(1)}`));
    
    // For each visible position, find the best sprite or create one
    for (let row = 0; row < this.visibleSymbols; row++) {
      const targetY = (row * this.symbolHeight) + (this.symbolHeight / 2);
      
      // Find the sprite closest to this target position (relaxed distance requirement)
      let closestSprite = null;
      let minDistance = Infinity;
      
      for (const sprite of sortedSprites) {
        if (sprite.visible === false) continue; // Skip already hidden sprites
        
        const distance = Math.abs(sprite.y - targetY);
        if (distance < minDistance) {
          minDistance = distance;
          closestSprite = sprite;
        }
      }
      
      if (closestSprite) {
        finalSymbols.push(closestSprite.symbolName);
        
        // Snap the sprite to the exact grid position
        closestSprite.y = targetY;
        closestSprite.visible = true;
        
        // Mark this sprite as used by hiding it from future selections
        const spriteIndex = sortedSprites.indexOf(closestSprite);
        if (spriteIndex > -1) {
          sortedSprites.splice(spriteIndex, 1);
        }
        
        console.log(`Row ${row}: using symbol ${closestSprite.symbolName} at y=${targetY} (distance: ${minDistance.toFixed(1)})`);
      } else {
        // This shouldn't happen, but create a fallback
        const availableSymbols = this.assetLoader.getAllSymbols();
        const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
        finalSymbols.push(randomSymbol);
        
        console.log(`Row ${row}: ERROR - no sprite found, using fallback symbol ${randomSymbol}`);
      }
    }
    
    // Hide all remaining sprites that aren't in the final visible positions
    for (const sprite of this.symbolSprites) {
      let isVisible = false;
      for (let row = 0; row < this.visibleSymbols; row++) {
        const targetY = (row * this.symbolHeight) + (this.symbolHeight / 2);
        if (Math.abs(sprite.y - targetY) < 1) { // Allow small floating point differences
          isVisible = true;
          break;
        }
      }
      sprite.visible = isVisible;
    }
    
    // Update the symbols array
    this.symbols = finalSymbols;
    
    console.log(`Reel ${this.col} final symbols:`, finalSymbols);
  }

  finalizeSpin(newSymbols) {
    if (newSymbols && newSymbols.length >= this.visibleSymbols) {
      // Update symbols array with the new results
      this.symbols = newSymbols.slice();
      
      console.log(`Reel ${this.col} finalizeSpin: received ${newSymbols.length} symbols, will update ${this.visibleSymbols} sprites`);
      
      // Reset all sprites to their proper positions and update the visible ones
      for (let i = 0; i < this.symbolSprites.length; i++) {
        if (this.symbolSprites[i]) {
          // Reset position
          this.symbolSprites[i].y = (i * this.symbolHeight) + (this.symbolHeight / 2);
          
          // Update texture for visible symbols
          if (i < this.visibleSymbols && this.symbols[i]) {
            const texture = this.assetLoader.getTexture(this.symbols[i]);
            if (texture) {
              this.symbolSprites[i].texture = texture;
              this.symbolSprites[i].symbolName = this.symbols[i];
              console.log(`  Sprite ${i}: symbol=${this.symbols[i]}, y=${this.symbolSprites[i].y}`);
            }
          } else if (i >= this.visibleSymbols) {
            // Hide extra sprites that are outside visible area
            this.symbolSprites[i].visible = false;
          }
        }
      }
      
      // Make sure visible sprites are visible
      for (let i = 0; i < this.visibleSymbols; i++) {
        if (this.symbolSprites[i]) {
          this.symbolSprites[i].visible = true;
        }
      }
    }
  }

  getVisibleSymbols() {
    return this.symbols.slice(0, this.visibleSymbols);
  }

  getSymbolAt(row) {
    if (row >= 0 && row < this.symbols.length) {
      return this.symbols[row];
    }
    return null;
  }

  getSpriteAt(row) {
    // Find the sprite that's actually positioned at the visual row
    const targetY = (row * this.symbolHeight) + (this.symbolHeight / 2);
    
    // Find sprite closest to the target Y position
    let closestSprite = null;
    let minDistance = Infinity;
    
    for (const sprite of this.symbolSprites) {
      if (sprite.visible) {
        const distance = Math.abs(sprite.y - targetY);
        if (distance < minDistance && distance < this.symbolHeight / 2) {
          minDistance = distance;
          closestSprite = sprite;
        }
      }
    }
    
    return closestSprite;
  }

  highlightSymbol(row, color = 0xFFD700) {
    const sprite = this.getSpriteAt(row);
    if (sprite) {
      sprite.tint = color;
    }
  }

  clearHighlights() {
    this.symbolSprites.forEach(sprite => {
      sprite.tint = 0xFFFFFF;
    });
  }

  setPosition(x, y) {
    this.container.x = x;
    this.container.y = y;
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}

export default PixiSlotReel;
