class WinChecker {
  constructor() {
    this.paylines = this.generatePaylines();
  }

  generatePaylines() {
    const paylines = [];

    // Horizontal lines (5 rows)
    for (let row = 0; row < 5; row++) {
      const line = [];
      for (let col = 0; col < 5; col++) {
        line.push({ row, col });
      }
      paylines.push(line);
    }

    // Vertical lines (5 columns)  
    for (let col = 0; col < 5; col++) {
      const line = [];
      for (let row = 0; row < 5; row++) {
        line.push({ row, col });
      }
      paylines.push(line);
    }

    // Main diagonal (top-left to bottom-right)
    const mainDiag = [];
    for (let i = 0; i < 5; i++) {
      mainDiag.push({ row: i, col: i });
    }
    paylines.push(mainDiag);

    // Anti-diagonal (top-right to bottom-left)
    const antiDiag = [];
    for (let i = 0; i < 5; i++) {
      antiDiag.push({ row: i, col: 4 - i });
    }
    paylines.push(antiDiag);

    // Additional shorter diagonal patterns (3+ symbols)
    // Top row starting diagonals
    for (let startCol = 1; startCol <= 2; startCol++) {
      if (startCol <= 2) { // Minimum 3 symbols
        const line = [];
        for (let i = 0; i < 5 - startCol; i++) {
          line.push({ row: i, col: startCol + i });
        }
        if (line.length >= 3) paylines.push(line);
      }
    }

    // Left column starting diagonals
    for (let startRow = 1; startRow <= 2; startRow++) {
      if (startRow <= 2) { // Minimum 3 symbols
        const line = [];
        for (let i = 0; i < 5 - startRow; i++) {
          line.push({ row: startRow + i, col: i });
        }
        if (line.length >= 3) paylines.push(line);
      }
    }

    // Anti-diagonal variations
    // Top row starting anti-diagonals
    for (let startCol = 3; startCol >= 2; startCol--) {
      if (startCol >= 2) { // Minimum 3 symbols
        const line = [];
        for (let i = 0; i < startCol + 1; i++) {
          line.push({ row: i, col: startCol - i });
        }
        if (line.length >= 3) paylines.push(line);
      }
    }

    // Right column starting anti-diagonals
    for (let startRow = 1; startRow <= 2; startRow++) {
      if (startRow <= 2) { // Minimum 3 symbols
        const line = [];
        for (let i = 0; i < 5 - startRow; i++) {
          line.push({ row: startRow + i, col: 4 - i });
        }
        if (line.length >= 3) paylines.push(line);
      }
    }

    return paylines;
  }

  checkWins(grid) {
    const wins = [];
    const allWinningLines = [];

    for (let lineIndex = 0; lineIndex < this.paylines.length; lineIndex++) {
      const payline = this.paylines[lineIndex];
      const symbols = payline.map(pos => grid[pos.row][pos.col]);
      
      // Check for consecutive matching symbols (minimum 3)
      const consecutiveMatches = this.findConsecutiveMatches(symbols, payline);
      
      if (consecutiveMatches.length > 0) {
        consecutiveMatches.forEach(match => {
          const { count, positions, symbol } = match;
          const multiplier = this.getMultiplier(count);
          
          wins.push({
            symbol,
            count,
            multiplier,
            positions,
            lineIndex
          });

          allWinningLines.push({
            positions,
            lineIndex,
            symbol,
            count
          });
        });
      }
    }

    return {
      wins,
      winningLines: allWinningLines,
      totalMultiplier: wins.reduce((sum, win) => sum + win.multiplier, 0)
    };
  }

  findConsecutiveMatches(symbols, positions) {
    const matches = [];
    
    // Check from start of line
    if (symbols.length >= 3) {
      for (let startIndex = 0; startIndex <= symbols.length - 3; startIndex++) {
        const startSymbol = symbols[startIndex];
        if (!startSymbol) continue;

        let count = 1;
        for (let i = startIndex + 1; i < symbols.length; i++) {
          if (symbols[i] === startSymbol) {
            count++;
          } else {
            break;
          }
        }

        if (count >= 3) {
          matches.push({
            symbol: startSymbol,
            count,
            positions: positions.slice(startIndex, startIndex + count)
          });
          break; // Only take the longest match from each starting position
        }
      }
    }

    return matches;
  }

  getMultiplier(symbolCount) {
    switch (symbolCount) {
      case 3: return 2;
      case 4: return 5;
      case 5: return 10;
      default: return 0;
    }
  }

  calculatePayout(wins, betAmount) {
    const totalMultiplier = wins.reduce((sum, win) => sum + win.multiplier, 0);
    return totalMultiplier * betAmount;
  }
}

export default WinChecker;
