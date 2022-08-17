<script>
  import Start from "./Start.svelte";
  import Review from "./Review.svelte";
  import Progress from "./Progress.svelte";
  import Tailwindcss from "./Tailwindcss.svelte";

  import { viewState } from "../stores";
  import { handleExtensionClick } from "../actions";

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_extension_icon")
      handleExtensionClick();
  });
</script>

<div id="unsubmarine">
  {#if $viewState === "start"}
    <!-- <Progress /> -->
    <Start />
  {/if}

  {#if $viewState === "progress"}
    <Review />
    <!-- <Progress /> -->
  {/if}

  {#if $viewState === "review"}
    <Review />
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
