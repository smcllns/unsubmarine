<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Tailwindcss from "../lib/Tailwindcss.svelte";

  const viewStates = ["start", "progress", "review"];
  let currentViewState, actionableResults, n, i, killSwitch;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      start();
      return true;
    }
  });

  function reset() {
    killSwitch = false;
    actionableResults = [];
    currentViewState = false;
    document.removeEventListener("keyup", handleShortcutKeys);
    document.addEventListener("keyup", handleShortcutKeys);
  }

  function exit() {
    killSwitch = true;
    currentViewState = false;
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function start() {
    reset();
    moveToNextView(0);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") exit();
  }

  function moveToNextView(flag) {
    // Handle Quit
    if (flag === "exit") return exit();

    // Handle Explicit View
    if (flag === false) return (currentViewState = false);
    if (Number.isInteger(flag)) return (currentViewState = viewStates[flag]);
  }
</script>

<div id="unsubmarine">
  {#if currentViewState === viewStates[0]}
    <Start {moveToNextView} />
  {/if}

  <Progress
    bind:actionableResults
    {killSwitch}
    {moveToNextView}
    active={currentViewState === viewStates[1]} />
  <!-- Needed to use active this way instead of wrapping in conditional bc otherwise the code couldn't get the killSwitch update -->

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
