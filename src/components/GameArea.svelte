<script>
  import { onMount, onDestroy } from 'svelte';
  import { gameState, gameActions } from '../stores/gameStore.js';
  import PixiSlotGame from '../lib/PixiSlotGame.js';

  let canvasContainer;
  let pixiGame;
  let isInitialized = false;

  onMount(async () => {
    if (canvasContainer) {
      try {
        // Initialize PIXI game
        pixiGame = new PixiSlotGame(canvasContainer);
        
        // Set up event callbacks
        pixiGame.setSpinCompleteCallback(handleSpinComplete);
        pixiGame.setWinDetectedCallback(handleWinDetected);
        
        // Initialize the game
        const success = await pixiGame.initialize();
        
        if (success) {
          isInitialized = true;
          console.log('Game area initialized successfully');
          
          // Listen for spin events from controls
          window.addEventListener('spin', handleSpinRequest);
        } else {
          console.error('Failed to initialize game area');
        }
      } catch (error) {
        console.error('Error initializing game area:', error);
      }
    }
  });

  onDestroy(() => {
    if (pixiGame) {
      pixiGame.destroy();
    }
    
    window.removeEventListener('spin', handleSpinRequest);
  });

  function handleSpinRequest(event) {
    if (!isInitialized || !pixiGame) return;
    
    const { bet } = event.detail;
    
    // Deduct bet from credits
    gameActions.deductBet();
    gameActions.setSpinning(true);
    
    // Start the spin
    pixiGame.spin();
  }

  function handleSpinComplete(result) {
    // Update game state with results
    gameActions.updateGrid(result.grid);
    gameActions.setSpinning(false);
    
    // Calculate and add winnings
    const payout = result.totalMultiplier * $gameState.currentBet;
    if (payout > 0) {
      gameActions.addWin(payout);
    } else {
      gameActions.addWin(0);
    }
    
    console.log('Spin complete:', result);
  }

  function handleWinDetected(winResult) {
    console.log('Win detected:', winResult);
    // Additional win handling can be added here
    // e.g., sound effects, special animations, etc.
  }
</script>

<div class="game-area">
  <div class="canvas-container" bind:this={canvasContainer}>
    {#if !isInitialized}
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading game...</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .game-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    min-height: 400px;  /* Reduced height for better mobile fit */
  }

  .canvas-container {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 215, 0, 0.3);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #ffd700;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 215, 0, 0.3);
    border-top: 4px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  .loading-spinner p {
    font-size: 1.1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive canvas scaling */
  :global(.game-area canvas) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
  }
  
  /* Scale down canvas on mobile */
  @media (max-width: 768px) {
    :global(.game-area canvas) {
      max-width: 90%;
      transform: scale(0.8);
      transform-origin: center;
    }
  }
  
  @media (max-width: 480px) {
    :global(.game-area canvas) {
      max-width: 95%;
      transform: scale(0.65);
      transform-origin: center;
    }
  }

  @media (max-width: 768px) {
    .game-area {
      padding: 0.5rem;
      min-height: 280px;  /* Much smaller for mobile */
    }
    
    .canvas-container {
      width: 100%;
      max-width: 500px;  /* Smaller max width */
    }
  }

  @media (max-width: 480px) {
    .game-area {
      min-height: 250px;  /* Even smaller for very narrow screens */
      padding: 0.25rem;
    }
    
    .canvas-container {
      max-width: 400px;  /* Even smaller for phones */
    }
  }
</style>
