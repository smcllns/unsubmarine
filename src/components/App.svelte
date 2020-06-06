<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Unsubmarine from "./Unsubmarine.svelte";
  import Tailwindcss from "./Tailwindcss.svelte";

  const unsubLimit = 5; // Todo: make a micropayment to extend

  let currentViewState = false,
    actionableResults = [],
    killSwitch = false,
    i = 0,
    startUnsubmarine;

  const viewStates = ["start", "progress", "review"];

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_extension_icon") {
      reset();
      moveToNextView(0);
    }
  });

  function reset() {
    killSwitch = false;
    i = 0;
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
    killSwitch = true;
    moveToNextView(2);
  }

  function cleanup() {
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") stopAndCancel();
  }

  function moveToNextView(flag) {
    if (flag === false) return (currentViewState = false);
    if (Number.isInteger(flag)) return (currentViewState = viewStates[flag]);
    // go to specific UI state
  }
</script>

<div id="unsubmarine">

  <Unsubmarine
    bind:actionableResults
    bind:i
    bind:startUnsubmarine
    {unsubLimit}
    {killSwitch}
    {stopAndReview}
    {stopAndCancel} />

  {#if currentViewState === viewStates[0]}
    <Start {moveToNextView} {startUnsubmarine} />
  {/if}

  {#if currentViewState === viewStates[1]}
    <Progress {actionableResults} {i} {stopAndCancel} {stopAndReview} />
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
