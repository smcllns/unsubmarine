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
  import {
    actionableResults,
    processedEmailCount,
    viewState,
    killSwitchOn,
    unsubLimit
  } from "./stores";

  let startUnsubmarine;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_extension_icon") {
      reset();
      document.addEventListener("keyup", handleShortcutKeys);
      viewState.moveToNextView("start");
    }
  });

  function reset() {
    killSwitchOn.set(false);
    viewState.reset();
    processedEmailCount.set(0);
    actionableResults.set([]);
    document.removeEventListener("keyup", handleShortcutKeys);
    unsubLimit.set(5); // Todo: make a micropayment to extend
  }

  function start() {
    viewState.moveToNextView("progress");
    startUnsubmarine();
  }

  function cancel() {
    killSwitchOn.set(true);
    viewState.moveToNextView(false);
    reset();
  }

  function hideUI() {
    viewState.moveToNextView(false);
  }

  function stop() {
    killSwitchOn.set(true);
    viewState.moveToNextView("review");
  }

  function handleShortcutKeys(e) {
    if (e.key === "Escape") cancel();
  }
</script>

<div id="unsubmarine">

  <Unsubmarine bind:startUnsubmarine {stop} {cancel} />

  {#if $viewState === 'start'}
    <Start {start} {cancel} {hideUI} />
  {/if}

  {#if $viewState === 'progress'}
    <Progress {cancel} {stop} />
  {/if}

  {#if $viewState === 'review'}
    <Review {cancel} />
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
