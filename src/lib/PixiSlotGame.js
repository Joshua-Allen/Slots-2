import * as PIXI from 'pixi.js';
import AssetLoader from './AssetLoader.js';
import PixiSlotReel from './PixiSlotReel.js';
import WinChecker from './WinChecker.js';
import AnimationManager from './AnimationManager.js';

class PixiSlotGame {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.app = null;
    this.assetLoader = new AssetLoader();
    this.winChecker = new WinChecker();
    this.animationManager = new AnimationManager();
    this.reels = [];
    this.gameContainer = null;
    this.winLinesContainer = null;
    this.isSpinning = false;
    this.currentGrid = Array(5).fill(null).map(() => Array(5).fill(null));
    
    // Game dimensions - optimized for 5x5 grid
    this.gameWidth = 750;
    this.gameHeight = 500;  // Increased height for better proportions
    this.symbolWidth = 120;  // Slightly smaller for better fit
    this.symbolHeight = 80;  // Reduced height for better proportions
    
    // Event callbacks
    this.onSpinComplete = null;
    this.onWinDetected = null;
  }

  async initialize() {
    try {
      console.log('Starting PIXI initialization...');
      
      // Create PIXI Application
      this.app = new PIXI.Application({
        width: this.gameWidth,
        height: this.gameHeight,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      console.log('PIXI Application created');

      // Append canvas to DOM element
      if (this.canvasElement) {
        this.canvasElement.appendChild(this.app.view);
        console.log('Canvas appended to DOM');
      }

      // Load assets
      console.log('Loading assets...');
      await this.assetLoader.loadAssets();
      console.log('Assets loaded successfully');

      // Setup game containers
      this.setupContainers();
      console.log('Containers setup complete');
      
      // Create reels
      this.createReels();
      console.log('Reels created');
      
      // Setup initial game state
      this.generateInitialGrid();
      console.log('Initial grid generated');

      console.log('PIXI Slot Game initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize PIXI Slot Game:', error);
      console.error('Error stack:', error.stack);
      return false;
    }
  }

  setupContainers() {
    // Main game container
    this.gameContainer = new PIXI.Container();
    this.app.stage.addChild(this.gameContainer);

    // Container for winning lines
    this.winLinesContainer = new PIXI.Container();
    this.app.stage.addChild(this.winLinesContainer);

    // Background
    const background = new PIXI.Graphics();
    background.beginFill(0x001122, 0.8);
    background.drawRoundedRect(10, 10, this.gameWidth - 20, this.gameHeight - 20, 15);
    background.endFill();
    
    // Border
    background.lineStyle(3, 0x4A90E2, 1);
    background.drawRoundedRect(10, 10, this.gameWidth - 20, this.gameHeight - 20, 15);
    
    this.gameContainer.addChild(background);

    // Grid lines for visual guidance
    this.drawGridLines();
  }

  drawGridLines() {
    const gridGraphics = new PIXI.Graphics();
    gridGraphics.lineStyle(1, 0x333333, 0.5);

    // Center the grid within the game area
    const totalGridWidth = 5 * this.symbolWidth;  // 600px
    const totalGridHeight = 5 * this.symbolHeight; // 400px
    const startX = (this.gameWidth - totalGridWidth) / 2;  // 75px for centering
    const startY = (this.gameHeight - totalGridHeight) / 2; // 50px for centering

    // Vertical lines
    for (let col = 0; col <= 5; col++) {
      const x = startX + col * this.symbolWidth;
      gridGraphics.moveTo(x, startY);
      gridGraphics.lineTo(x, startY + 5 * this.symbolHeight);
    }

    // Horizontal lines
    for (let row = 0; row <= 5; row++) {
      const y = startY + row * this.symbolHeight;
      gridGraphics.moveTo(startX, y);
      gridGraphics.lineTo(startX + 5 * this.symbolWidth, y);
    }

    this.gameContainer.addChild(gridGraphics);
  }

  createReels() {
    this.reels = [];
    // Use the same centering calculation as grid lines
    const totalGridWidth = 5 * this.symbolWidth;
    const totalGridHeight = 5 * this.symbolHeight;
    const startX = (this.gameWidth - totalGridWidth) / 2;
    const startY = (this.gameHeight - totalGridHeight) / 2;

    console.log(`Grid positioning: startX=${startX}, startY=${startY}`);
    console.log(`Symbol dimensions: ${this.symbolWidth}x${this.symbolHeight}`);

    for (let col = 0; col < 5; col++) {
      const reel = new PixiSlotReel(this.assetLoader, col);
      const reelX = startX + col * this.symbolWidth;
      reel.setPosition(reelX, startY);
      
      console.log(`Reel ${col} positioned at: x=${reelX}, y=${startY}`);
      
      this.reels.push(reel);
      this.gameContainer.addChild(reel.container);
    }
  }

  generateInitialGrid() {
    const availableSymbols = this.assetLoader.getAllSymbols();
    console.log('Available symbols:', availableSymbols);
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const randomIndex = Math.floor(Math.random() * availableSymbols.length);
        this.currentGrid[row][col] = availableSymbols[randomIndex];
      }
    }

    console.log('Generated grid:', this.currentGrid);

    // Update reels with initial grid
    for (let col = 0; col < 5; col++) {
      const columnSymbols = [];
      for (let row = 0; row < 5; row++) {
        columnSymbols.push(this.currentGrid[row][col]);
      }
      console.log(`Column ${col} symbols:`, columnSymbols);
      this.reels[col].finalizeSpin(columnSymbols);
    }
  }

  async spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.clearWinningLines();

    // Don't generate predetermined results - let reels determine their own results
    
    // Create spin promises for all reels
    const spinPromises = [];
    
    for (let col = 0; col < 5; col++) {
      // All reels start spinning immediately, but stop at different times
      const baseDuration = 2000; // Faster base duration (2 seconds)
      const stopDelay = col * 200; // Slightly reduced stagger delay
      const randomVariation = Math.random() * 400 - 200; // ±200ms random variation
      const totalDuration = baseDuration + stopDelay + randomVariation;
      
      const promise = this.reels[col].spin(null, Math.max(1500, totalDuration)); // Minimum 1.5s duration
      spinPromises.push(promise);
    }

    // Wait for all reels to complete
    await Promise.all(spinPromises);

    // Update current grid based on what the reels actually landed on
    for (let col = 0; col < 5; col++) {
      const reelSymbols = this.reels[col].symbols;
      for (let row = 0; row < 5; row++) {
        if (reelSymbols[row]) {
          this.currentGrid[row][col] = reelSymbols[row];
        }
      }
    }

    console.log('Final grid after spin:', this.currentGrid);

    // Check for wins
    const winResult = this.winChecker.checkWins(this.currentGrid);
    
    if (winResult.wins.length > 0) {
      this.handleWins(winResult);
    }

    this.isSpinning = false;

    // Notify completion
    if (this.onSpinComplete) {
      this.onSpinComplete({
        grid: this.currentGrid,
        wins: winResult.wins,
        totalMultiplier: winResult.totalMultiplier
      });
    }
  }

  generateRandomGrid() {
    const availableSymbols = this.assetLoader.getAllSymbols();
    const grid = Array(5).fill(null).map(() => Array(5).fill(null));
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const randomIndex = Math.floor(Math.random() * availableSymbols.length);
        grid[row][col] = availableSymbols[randomIndex];
      }
    }
    
    return grid;
  }

  handleWins(winResult) {
    // Highlight winning symbols
    winResult.winningLines.forEach((line, index) => {
      line.positions.forEach(pos => {
        const reel = this.reels[pos.col];
        if (reel) {
          reel.highlightSymbol(pos.row, 0xFFD700);
          
          // Add win animation
          const sprite = reel.getSpriteAt(pos.row);
          if (sprite) {
            this.animationManager.playSymbolWin(sprite, 'pulse');
          }
        }
      });

      // Draw winning line
      this.drawWinningLine(line.positions, index);
    });

    // Notify win detection
    if (this.onWinDetected) {
      this.onWinDetected(winResult);
    }
  }

  drawWinningLine(positions, lineIndex) {
    const lineGraphics = new PIXI.Graphics();
    
    // Different colors for different lines
    const colors = [0xFFD700, 0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECEA8];
    const color = colors[lineIndex % colors.length];

    this.animationManager.playWinningLine(lineGraphics, positions, color);
    this.winLinesContainer.addChild(lineGraphics);
  }

  clearWinningLines() {
    this.winLinesContainer.removeChildren();
    
    // Clear reel highlights
    this.reels.forEach(reel => {
      reel.clearHighlights();
    });
  }

  // Public API methods
  setSpinCompleteCallback(callback) {
    this.onSpinComplete = callback;
  }

  setWinDetectedCallback(callback) {
    this.onWinDetected = callback;
  }

  getCurrentGrid() {
    return this.currentGrid;
  }

  getIsSpinning() {
    return this.isSpinning;
  }

  resize(width, height) {
    if (this.app) {
      this.app.renderer.resize(width, height);
    }
  }

  destroy() {
    if (this.animationManager) {
      this.animationManager.destroy();
    }
    
    if (this.reels) {
      this.reels.forEach(reel => reel.destroy());
    }
    
    if (this.app) {
      this.app.destroy(true);
    }
  }
}

export default PixiSlotGame;
