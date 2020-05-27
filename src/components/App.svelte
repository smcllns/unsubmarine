<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Tailwindcss from "../lib/Tailwindcss.svelte";

  const viewStates = ["ask", "progress", "review"];

  let currentViewState, actionableResults, n, i, killSwitch;

  function reset() {
    (currentViewState = false),
      (actionableResults = []),
      (n = 100),
      (i = 0),
      (killSwitch = false);
  }

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      start();
      return true;
    }
  });

  function start() {
    reset();
    currentViewState = viewStates[0];
    document.removeEventListener("keyup", handleShortcutKeys);
    document.addEventListener("keyup", handleShortcutKeys);
  }

  function quit() {
    currentViewState = false;
    killSwitch = true;
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") quit();
  }
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
  <!-- {#if currentViewState === viewStates[0]}
    <Start bind:n bind:currentViewState {viewStates} />
  {/if} -->

  {#if currentViewState === viewStates[0]}
    <!-- {#if currentViewState === viewStates[1]} -->
    <Progress
      bind:n
      bind:i
      bind:actionableResults
      bind:currentViewState
      bind:killSwitch
      {viewStates}
      {quit} />
  {/if}

  {#if currentViewState === viewStates[2]}
    <Review {actionableResults} {quit} />
  {/if}
</div>

<Tailwindcss />
