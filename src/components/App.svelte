<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Unsubmarine from "./Unsubmarine.svelte";
  import Tailwindcss from "../lib/Tailwindcss.svelte";

  let currentViewState, actionableResults, killSwitch, i, running;
  const viewStates = ["start", "progress", "review"];

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_extension_icon") {
      start();
      // return true;
      // // return true when using sendResponse async instead of sync
      // // https://developer.chrome.com/extensions/messaging
    }
  });

  function start() {
    reset();
    moveToNextView(0);
  }

  function reset() {
    killSwitch = false;
    i = 0;
    running = false;
    actionableResults = [];
    currentViewState = false;
    document.removeEventListener("keyup", handleShortcutKeys);
    document.addEventListener("keyup", handleShortcutKeys);
  }

  // A note on managing state through the components:
  // Kill Switch controls the Unsubmarine scraper which is controlling gmail, and feels scary when you can't stop it immediately
  // Changing/hiding UI layer is handled separately  with moveNextView

  function stopAndCancel() {
    killSwitch = true;
    moveToNextView(false);
    cleanup();
  }

  function stopAndReview() {
    running = false;
    moveToNextView(2);
  }

  function cleanup() {
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") exit();
  }

  function moveToNextView(flag) {
    if (flag === false) return (currentViewState = false);
    // hides all UI
    if (Number.isInteger(flag)) return (currentViewState = viewStates[flag]);
    // go to specific UI state
  }
</script>

<div id="unsubmarine">
  {#if currentViewState === viewStates[0]}
    <Start {moveToNextView} bind:running />
  {/if}

  {#if currentViewState === viewStates[1]}
    <Progress {actionableResults} {i} {stopAndCancel} {stopAndReview} />
  {/if}

  <Unsubmarine
    bind:actionableResults
    bind:i
    bind:running
    {killSwitch}
    {stopAndReview}
    {stopAndCancel} />

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
