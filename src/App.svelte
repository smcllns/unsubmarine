<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";

  const viewStates = ["ask", "progress", "review"];

  let currentViewState = false,
    actionableResults = [],
    n = 0,
    i = 0;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      currentViewState = viewStates[0];
      return true;
    }
  });
</script>

<style>
  #unsubmarine {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    z-index: 999;
    display: flex;
    flex: 1;
  }
</style>

<div id="unsubmarine" class="pointer-events-none">
  {#if currentViewState === viewStates[0]}
    <Start bind:n bind:currentViewState {viewStates} />
  {/if}

  {#if currentViewState === viewStates[1]}
    <Progress
      bind:n
      bind:i
      bind:actionableResults
      bind:currentViewState
      {viewStates} />
  {/if}

  {#if currentViewState === viewStates[2]}
    <Review {actionableResults} bind:currentViewState />
  {/if}
</div>

<Tailwindcss />
