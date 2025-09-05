<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function returnToIntro() {
    dispatch('returnToIntro');
  }
</script>

<header class="game-header">
  <button class="back-button btn-secondary" on:click={returnToIntro}>
    ← Back to Menu
  </button>
  
  <h1 class="game-title text-gold text-shadow">
    🎰 SLOTS MACHINE 🎰
  </h1>
  
  <div class="spacer"></div>
</header>

<style>
  .game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
  }

  .game-title {
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 0;
    text-align: center;
    flex: 1;
  }

  .back-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .spacer {
    width: 120px; /* Same width as back button to center the title */
  }

  @media (max-width: 768px) {
    .game-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .game-title {
      font-size: 2rem;
      letter-spacing: 1px;
    }

    .spacer {
      display: none;
    }

    .back-button {
      order: -1;
      align-self: flex-start;
    }
  }

  @media (max-width: 480px) {
    .game-title {
      font-size: 1.5rem;
    }
  }
</style>
