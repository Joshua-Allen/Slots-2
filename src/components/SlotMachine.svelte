<script>
  import { createEventDispatcher } from 'svelte';
  import Header from './Header.svelte';
  import LeftPanel from './LeftPanel.svelte';
  import GameArea from './GameArea.svelte';
  import GameStats from './GameStats.svelte';
  import GameControls from './GameControls.svelte';
  import { gameState, gameActions } from '../stores/gameStore.js';

  const dispatch = createEventDispatcher();

  function returnToIntro() {
    dispatch('returnToIntro');
  }
</script>

<div class="slot-machine-container">
  <Header on:returnToIntro={returnToIntro} />
  
  <div class="main-content">
    <LeftPanel />
    
    <div class="game-section">
      <GameStats />
      <GameArea />
      <GameControls />
    </div>
  </div>
</div>

<style>
  .slot-machine-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    padding: 1rem;
    min-height: 750px;  /* Increased to accommodate larger game area */
  }

  .main-content {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    height: 100%;
    align-items: start;
  }

  .game-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  @media (max-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .slot-machine-container {
      padding: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    .slot-machine-container {
      border-radius: 10px;
      margin: 0.5rem;
    }
  }
</style>
