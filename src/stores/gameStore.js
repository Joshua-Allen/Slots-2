import { writable } from 'svelte/store';

// Game state store
export const gameState = writable({
  credits: 100,
  currentBet: 1,
  lastWin: 0,
  isSpinning: false,
  gameGrid: Array(5).fill(null).map(() => Array(5).fill(null)),
  winningLines: []
});

// Game methods
export const gameActions = {
  initialize() {
    gameState.set({
      credits: 100,
      currentBet: 1,
      lastWin: 0,
      isSpinning: false,
      gameGrid: Array(5).fill(null).map(() => Array(5).fill(null)),
      winningLines: []
    });
  },

  setBet(amount) {
    gameState.update(state => ({
      ...state,
      currentBet: Math.max(1, Math.min(10, amount))
    }));
  },

  increaseBet() {
    gameState.update(state => ({
      ...state,
      currentBet: Math.min(10, state.currentBet + 1)
    }));
  },

  decreaseBet() {
    gameState.update(state => ({
      ...state,
      currentBet: Math.max(1, state.currentBet - 1)
    }));
  },

  deductBet() {
    gameState.update(state => ({
      ...state,
      credits: state.credits - state.currentBet
    }));
  },

  addWin(amount) {
    gameState.update(state => ({
      ...state,
      credits: state.credits + amount,
      lastWin: amount
    }));
  },

  setSpinning(spinning) {
    gameState.update(state => ({
      ...state,
      isSpinning: spinning
    }));
  },

  updateGrid(grid) {
    gameState.update(state => ({
      ...state,
      gameGrid: grid
    }));
  },

  setWinningLines(lines) {
    gameState.update(state => ({
      ...state,
      winningLines: lines
    }));
  }
};

// Derived stores
import { derived } from 'svelte/store';

export const canSpin = derived(
  gameState,
  $gameState => $gameState.credits >= $gameState.currentBet && !$gameState.isSpinning
);

export const gameOver = derived(
  gameState,
  $gameState => $gameState.credits < 1
);
