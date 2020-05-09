<script>
  console.log("running svelte app");
  import Unsub from "./unsubmarine";
  import { consoleDump } from "./utils";

  const unsub = new Unsub();

  const handleStart = async (e) => {
    console.log("starting submarine");
    const run = await unsub.start();
    const urls = run.results.actionable.map((i) => i.unsubLink);
    consoleDump(run.results);
    urls.length > 0
      ? chrome.runtime.sendMessage({ message: "open_new_tabs", urls })
      : console.log("no actionable results to open");
  };

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      handleStart();
      return true;
    }
  });
</script>

<style>
  #test-el {
    background: yellow;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 5rem 0;
    margin: 0;
    z-index: 999;
  }
</style>

<div id="test-el">
  <h1>Hello world!</h1>
  <button on:click|preventDefault="{handleStart}">Trigger Unsub()</button>
</div>
