<script>
  import { gameState } from '../stores/gameStore.js';
  
  $: credits = $gameState.credits;
  $: lastWin = $gameState.lastWin;
  $: currentBet = $gameState.currentBet;
</script>

<div class="game-stats">
  <div class="stat-item">
    <div class="stat-label">Credits</div>
    <div class="stat-value text-gold">${credits.toFixed(2)}</div>
  </div>
  
  <div class="stat-item">
    <div class="stat-label">Current Bet</div>
    <div class="stat-value">${currentBet.toFixed(2)}</div>
  </div>
  
  <div class="stat-item">
    <div class="stat-label">Last Win</div>
    <div class="stat-value {lastWin > 0 ? 'win-amount' : ''}">${lastWin.toFixed(2)}</div>
  </div>
</div>

<style>
  .game-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  .stat-item {
    text-align: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #b0b0b0;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  .win-amount {
    color: #00ff88;
    animation: winPulse 2s infinite;
  }

  @keyframes winPulse {
    0%, 100% { 
      transform: scale(1);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    }
    50% { 
      transform: scale(1.1);
      text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
    }
  }

  @media (max-width: 768px) {
    .game-stats {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 0.75rem;
    }

    .stat-value {
      font-size: 1.3rem;
    }

    .stat-label {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .game-stats {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .stat-item {
      padding: 0.3rem;
    }

    .stat-value {
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.7rem;
    }
  }
</style>
