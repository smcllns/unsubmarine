<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Tailwindcss from "../lib/Tailwindcss.svelte";

  const viewStates = ["ask", "progress", "review"];
  let currentViewState, actionableResults, n, i, killSwitch;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      start();
      return true;
    }
  });

  function reset() {
    currentViewState = false;
    actionableResults = [];
    n = 100;
    i = 0;
    killSwitch = false;
  }

  function start() {
    reset();
    document.removeEventListener("keyup", handleShortcutKeys);
    document.addEventListener("keyup", handleShortcutKeys);
    moveToNextView();
  }

  function quit() {
    currentViewState = false;
    killSwitch = true;
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function moveToNextView(quitFlag) {
    // Handle Quit
    if (quitFlag === true) return quit();
    // Handle Start
    if (!currentViewState) return (currentViewState = viewStates[0]);
    // Handle Finish
    if (currentViewState === viewStates[viewStates.length - 1])
      return (currentViewState = false);
    // Handle Next Step
    return (currentViewState =
      viewStates[viewStates.indexOf(currentViewState) + 1]);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") quit();
  }
</script>

<div id="unsubmarine">
  {#if currentViewState === viewStates[0]}
    <Start {moveToNextView} />
  {/if}

  {#if currentViewState === viewStates[1]}
    <Progress bind:i bind:actionableResults bind:killSwitch {moveToNextView} />
  {/if}

  {#if currentViewState === viewStates[2]}
    <Review {actionableResults} {moveToNextView} />
  {/if}
</div>

<Tailwindcss />

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
    pointer-events: none;
  }
</style>
