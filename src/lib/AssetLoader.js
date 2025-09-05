import * as PIXI from 'pixi.js';

class AssetLoader {
  constructor() {
    this.textures = new Map();
    this.loaded = false;
  }

  async loadAssets() {
    if (this.loaded) {
      console.log('Assets already loaded');
      return;
    }

    console.log('Starting asset loading...');
    // Create symbol textures programmatically using Canvas
    await this.createSymbolTextures();
    
    this.loaded = true;
    console.log('Asset loading complete');
  }

  async createSymbolTextures() {
    const symbols = ['cherry', 'lemon', 'orange', 'grape', 'bell', 'star', 'diamond'];
    const size = 120;  // Match the new symbol width for better proportions

    console.log('Creating simple symbol textures...');

    for (const symbol of symbols) {
      console.log(`Creating simple texture for ${symbol}`);
      
      // Create canvas and draw symbol
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = 80;  // Use the actual symbol height
      const ctx = canvas.getContext('2d');
      
      // Clear canvas to transparent (no background)
      ctx.clearRect(0, 0, size, 80);
      
      // Add emoji symbol only (no background)
      ctx.font = 'bold 40px Arial';  // Adjusted font size for new dimensions
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this.getSymbolColorHex(symbol);  // Use symbol color for the emoji itself
      ctx.fillText(this.getSymbolEmoji(symbol), size / 2, 40);  // Center vertically in 80px height
      
      // Create PIXI texture from canvas
      const texture = PIXI.Texture.from(canvas);
      this.textures.set(symbol, texture);
      console.log(`✓ Simple texture created for ${symbol}`);
    }
    
    console.log('All simple symbol textures created');
  }

  getSymbolColor(symbol) {
    const colors = {
      cherry: 0xFF0000,
      lemon: 0xFFFF00,
      orange: 0xFF8C00,
      grape: 0x9932CC,
      bell: 0xFFD700,
      star: 0xFFFF00,
      diamond: 0x00FFFF
    };
    return colors[symbol] || 0x666666;
  }

  getSymbolColorHex(symbol) {
    const colors = {
      cherry: '#FF0000',
      lemon: '#FFFF00',
      orange: '#FF8C00',
      grape: '#9932CC',
      bell: '#FFD700',
      star: '#FFFF00',
      diamond: '#00FFFF'
    };
    return colors[symbol] || '#666666';
  }

  getSymbolEmoji(symbol) {
    const emojis = {
      cherry: '🍒',
      lemon: '🍋',
      orange: '🍊',
      grape: '🍇',
      bell: '🔔',
      star: '⭐',
      diamond: '💎'
    };
    return emojis[symbol] || '?';
  }

  getTexture(symbolName) {
    return this.textures.get(symbolName);
  }

  getAllSymbols() {
    return Array.from(this.textures.keys());
  }
}

export default AssetLoader;
