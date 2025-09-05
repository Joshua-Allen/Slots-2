<script>
  // Left panel with game rules and information
</script>

<aside class="left-panel">
  <div class="panel-section">
    <h3 class="section-title text-gold">🎯 Game Rules</h3>
    <div class="rules-content">
      <div class="rule-item">
        <strong>Objective:</strong> Match 3 or more symbols in a line to win!
      </div>
      
      <div class="rule-item">
        <strong>Grid:</strong> 5×5 grid with multiple paylines
      </div>
      
      <div class="rule-item">
        <strong>Winning Lines:</strong>
        <ul>
          <li>Horizontal (5 lines)</li>
          <li>Vertical (5 lines)</li>
          <li>Diagonal (2 main + variations)</li>
        </ul>
      </div>
      
      <div class="rule-item">
        <strong>Minimum Win:</strong> 3 consecutive matching symbols
      </div>
    </div>
  </div>

  <div class="panel-section">
    <h3 class="section-title text-gold">💰 Paytable</h3>
    <div class="paytable">
      <div class="payout-row">
        <span class="symbol-count">3 Symbols:</span>
        <span class="multiplier">2x Bet</span>
      </div>
      
      <div class="payout-row">
        <span class="symbol-count">4 Symbols:</span>
        <span class="multiplier">5x Bet</span>
      </div>
      
      <div class="payout-row">
        <span class="symbol-count">5 Symbols:</span>
        <span class="multiplier">10x Bet</span>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <h3 class="section-title text-gold">🎲 Symbols</h3>
    <div class="symbols-info">
      <div class="symbol-grid">
        <div class="symbol-item">🍒 Cherry</div>
        <div class="symbol-item">🍋 Lemon</div>
        <div class="symbol-item">🍊 Orange</div>
        <div class="symbol-item">🍇 Grape</div>
        <div class="symbol-item">🔔 Bell</div>
        <div class="symbol-item">⭐ Star</div>
        <div class="symbol-item">💎 Diamond</div>
      </div>
    </div>
  </div>

  <div class="panel-section">
    <h3 class="section-title text-gold">ℹ️ Tips</h3>
    <div class="tips-content">
      <div class="tip-item">
        • Higher bets = bigger potential wins
      </div>
      <div class="tip-item">
        • Watch for multiple line wins
      </div>
      <div class="tip-item">
        • Diagonal wins can be very rewarding
      </div>
      <div class="tip-item">
        • Manage your credits wisely
      </div>
    </div>
  </div>
</aside>

<style>
  .left-panel {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    height: fit-content;
    max-height: 600px;
    overflow-y: auto;
  }

  .panel-section {
    margin-bottom: 2rem;
  }

  .panel-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    padding-bottom: 0.5rem;
  }

  .rules-content {
    color: #e0e0e0;
    font-size: 0.9rem;
  }

  .rule-item {
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .rule-item strong {
    color: #ffd700;
  }

  .rule-item ul {
    margin: 0.5rem 0 0 1rem;
    padding: 0;
  }

  .rule-item li {
    margin: 0.25rem 0;
  }

  .paytable {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .payout-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 215, 0, 0.2);
  }

  .symbol-count {
    color: #e0e0e0;
    font-weight: 500;
  }

  .multiplier {
    color: #ffd700;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .symbols-info {
    color: #e0e0e0;
  }

  .symbol-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .symbol-item {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tips-content {
    color: #e0e0e0;
    font-size: 0.9rem;
  }

  .tip-item {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  /* Custom scrollbar */
  .left-panel::-webkit-scrollbar {
    width: 6px;
  }

  .left-panel::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .left-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
  }

  .left-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.5);
  }

  @media (max-width: 1024px) {
    .left-panel {
      order: 2;
      max-height: none;
      height: auto;
    }

    .panel-section {
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .left-panel {
      padding: 1rem;
    }

    .section-title {
      font-size: 1.1rem;
    }

    .symbol-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
