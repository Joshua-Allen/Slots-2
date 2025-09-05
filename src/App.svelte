<script>
  import IntroPage from './components/IntroPage.svelte';
  import SlotMachine from './components/SlotMachine.svelte';
  import { gameState } from './stores/gameStore.js';

  let currentScreen = 'intro'; // 'intro' or 'game'

  function startGame() {
    currentScreen = 'game';
    gameActions.initialize();
  }

  function returnToIntro() {
    currentScreen = 'intro';
  }
</script>

<main>
  {#if currentScreen === 'intro'}
    <IntroPage on:startGame={startGame} />
  {:else}
    <SlotMachine on:returnToIntro={returnToIntro} />
  {/if}
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    main {
      padding: 0.5rem;
    }
  }
</style>
