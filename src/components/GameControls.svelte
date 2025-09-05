<script>
  import { gameState, gameActions, canSpin } from '../stores/gameStore.js';
  
  $: credits = $gameState.credits;
  $: currentBet = $gameState.currentBet;
  $: isSpinning = $gameState.isSpinning;
  $: spinEnabled = $canSpin;

  function increaseBet() {
    gameActions.increaseBet();
  }

  function decreaseBet() {
    gameActions.decreaseBet();
  }

  function spin() {
    if (!$canSpin) return;
    
    // Trigger spin event that will be handled by parent
    const event = new CustomEvent('spin', {
      detail: { bet: currentBet }
    });
    
    window.dispatchEvent(event);
  }
</script>

<div class="game-controls">
  <div class="bet-section">
    <h4 class="section-title">Bet Amount</h4>
    <div class="bet-controls">
      <button 
        class="bet-button btn-secondary" 
        on:click={decreaseBet} 
        disabled={currentBet <= 1 || isSpinning}
      >
        -
      </button>
      
      <div class="bet-display">
        <span class="bet-amount text-gold">${currentBet.toFixed(2)}</span>
      </div>
      
      <button 
        class="bet-button btn-secondary" 
        on:click={increaseBet} 
        disabled={currentBet >= 10 || isSpinning}
      >
        +
      </button>
    </div>
  </div>

  <div class="action-section">
    <button 
      class="spin-button btn-primary {isSpinning ? 'spinning' : ''}" 
      on:click={spin}
      disabled={!spinEnabled}
    >
      {#if isSpinning}
        🎰 SPINNING... 🎰
      {:else}
        🎰 SPIN (${currentBet.toFixed(2)}) 🎰
      {/if}
    </button>
    
    <button 
      class="autoplay-button" 
      disabled={true}
      title="Coming Soon!"
    >
      AUTO PLAY
    </button>
  </div>

  <div class="info-section">
    <div class="coins-display">
      🪙 Coins: {Math.floor(credits)}
    </div>
    
    <div class="turbo-info">
      ⚡ HOLD SPACE FOR TURBO SPIN
    </div>
  </div>
</div>

<style>
  .game-controls {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
    align-items: center;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  .section-title {
    color: #ffd700;
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .bet-section {
    text-align: center;
  }

  .bet-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .bet-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .bet-display {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    min-width: 80px;
    text-align: center;
  }

  .bet-amount {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .action-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .spin-button {
    font-size: 1.3rem;
    padding: 1rem 2rem;
    border-radius: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    min-width: 250px;
    position: relative;
    overflow: hidden;
  }

  .spin-button.spinning {
    animation: spinPulse 1s infinite;
    background: linear-gradient(45deg, #ff6b6b, #ee5a24, #ff6b6b);
    background-size: 200% 200%;
    animation: spinPulse 1s infinite, gradientShift 2s infinite;
  }

  .autoplay-button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #888;
    border-radius: 8px;
    cursor: not-allowed;
  }

  .info-section {
    text-align: center;
    font-size: 0.9rem;
    color: #b0b0b0;
  }

  .coins-display {
    margin-bottom: 0.5rem;
    color: #ffd700;
    font-weight: bold;
  }

  .turbo-info {
    font-size: 0.8rem;
    color: #888;
    font-style: italic;
  }

  @keyframes spinPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .game-controls {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      text-align: center;
    }

    .action-section {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .game-controls {
      padding: 1rem;
      gap: 1rem;
    }

    .spin-button {
      min-width: 200px;
      font-size: 1.1rem;
      padding: 0.8rem 1.5rem;
    }

    .bet-controls {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .game-controls {
      padding: 0.75rem;
    }

    .spin-button {
      min-width: 180px;
      font-size: 1rem;
      padding: 0.7rem 1rem;
    }

    .bet-button {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }

    .bet-amount {
      font-size: 1rem;
    }
  }
</style>
