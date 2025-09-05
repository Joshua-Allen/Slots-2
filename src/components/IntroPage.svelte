<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function startGame() {
    dispatch('startGame');
  }
</script>

<div class="intro-container">
  <div class="intro-content fade-in">
    <h1 class="game-title text-gold text-shadow pulse">
      🎰 SLOTS MACHINE 🎰
    </h1>
    
    <div class="subtitle">
      <p class="text-shadow">Experience the ultimate slot machine adventure!</p>
      <p class="text-shadow">5x5 Grid • Multiple Paylines • Big Wins</p>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">💰</div>
        <h3>Betting System</h3>
        <p>Bet from $1.00 to $10.00 per spin</p>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🎯</div>
        <h3>Multiple Paylines</h3>
        <p>Horizontal, vertical, and diagonal wins</p>
      </div>
      
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>High Performance</h3>
        <p>Smooth 60fps animations with WebGL</p>
      </div>
    </div>

    <div class="game-info">
      <div class="info-box">
        <h4>Starting Credits</h4>
        <div class="credits-display text-gold">$100.00</div>
      </div>
      
      <div class="info-box">
        <h4>Symbol Payouts</h4>
        <div class="payout-info">
          <div>3 symbols: 2x bet</div>
          <div>4 symbols: 5x bet</div>
          <div>5 symbols: 10x bet</div>
        </div>
      </div>
    </div>

    <button 
      class="start-button btn-primary pulse" 
      on:click={startGame}
    >
      🎰 START PLAYING 🎰
    </button>

    <div class="footer-text">
      <p>Good luck and may the reels be in your favor!</p>
    </div>
  </div>
</div>

<style>
  .intro-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  .intro-content {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 20px;
    padding: 3rem 2rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .game-title {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    letter-spacing: 3px;
  }

  .subtitle {
    margin-bottom: 2rem;
  }

  .subtitle p {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    color: #e0e0e0;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .feature {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .feature:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .feature h3 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .feature p {
    color: #e0e0e0;
    font-size: 0.9rem;
  }

  .game-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .info-box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .info-box h4 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .credits-display {
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  .payout-info {
    color: #e0e0e0;
  }

  .payout-info div {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  .start-button {
    font-size: 1.5rem;
    padding: 1rem 3rem;
    margin: 2rem 0 1rem 0;
    border-radius: 15px;
    font-weight: bold;
    letter-spacing: 2px;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  .start-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
  }

  .footer-text {
    margin-top: 1rem;
    color: #b0b0b0;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .intro-container {
      padding: 1rem;
    }

    .intro-content {
      padding: 2rem 1rem;
    }

    .game-title {
      font-size: 2.5rem;
      letter-spacing: 2px;
    }

    .features {
      grid-template-columns: 1fr;
    }

    .game-info {
      grid-template-columns: 1fr;
    }

    .start-button {
      font-size: 1.2rem;
      padding: 0.8rem 2rem;
    }
  }

  @media (max-width: 480px) {
    .game-title {
      font-size: 2rem;
      letter-spacing: 1px;
    }

    .feature-icon {
      font-size: 2rem;
    }

    .credits-display {
      font-size: 1.5rem;
    }
  }
</style>
