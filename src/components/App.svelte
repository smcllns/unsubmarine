<script>
  // Known little bugs to cleanup:
  // - Unsub Limit = 5, it stops at 4
  // - Hitting Finish button, the background scraper continues through 2 more emails
  // - Hitting Cancel doesn't seem to cleanly kill (the review window popped up) --- should remove Cancel and just make Stop button and always review. Too hard to decide between Finish and Cancel.
  // - Need a solution to all the routing being here, and passed down as props (store?)

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
      document.addEventListener("keyup", handleShortcutKeys);
      moveToNextView(0);
    }
  });

  function reset() {
    killSwitch = false;
    currentViewState = false;
    i = 0;
    actionableResults = [];
    document.removeEventListener("keyup", handleShortcutKeys);
  }

  function start() {
    moveToNextView(1);
    startUnsubmarine();
  }

  function cancel() {
    killSwitch = true;
    moveToNextView(false);
    reset();
  }

  function hideUI() {
    moveToNextView(false);
  }

  function stop() {
    killSwitch = true;
    moveToNextView(2);
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") cancel();
  }

  function moveToNextView(flag) {
    if (flag === false) return (currentViewState = false);
    if (Number.isInteger(flag)) return (currentViewState = viewStates[flag]);
  }
</script>

<div id="unsubmarine">

  <Unsubmarine
    bind:actionableResults
    bind:i
    bind:startUnsubmarine
    {stop}
    {cancel}
    {unsubLimit}
    {killSwitch} />

  {#if currentViewState === viewStates[0]}
    <Start {start} {cancel} {hideUI} />
  {/if}

  {#if currentViewState === viewStates[1]}
    <Progress {actionableResults} {i} {cancel} {stop} />
  {/if}

  {#if currentViewState === viewStates[2]}
    <Review {actionableResults} {cancel} />
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
