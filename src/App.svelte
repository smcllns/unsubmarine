<script>
  console.log("running svelte app");
  import Unsub from "./unsubmarine";
  import { consoleDump } from "./utils";

  const unsub = new Unsub();
  let results = [],
    actionable = [],
    n = 0,
    i = 0,
    running = false;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      handleStart();
      return true;
    }
  });

  const handleStart = async (e) => {
    results = [];
    actionable = [];
    n = 0;
    i = 0;
    running = true;

    const scraper = unsub.start();

    while (running) {
      const {
        done,
        value: { m, error, ...res },
      } = await scraper.next();

      n = res.n;
      i = res.i + 1;

      if (m && !error) {
        results = [...results, { m, error }];
        if (m.unsubLink) actionable = [...actionable, m];
      }
      console.log(`tick: ${i}/${n}; actionable: ${actionable.length}`);
      running = !done;
    }
    handleResults(results, actionable);
  };

  const handleResults = (results, actionable) => {
    console.log("all results", results, actionable);
    actionable.length > 0
      ? chrome.runtime.sendMessage({
          message: "open_new_tabs",
          urls: actionable.map((i) => i.unsubLink),
        })
      : console.log("no actionable results to open");
  };
</script>

<style>
  #test-el {
    background: #d63447;
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 5rem 0;
    margin: 0;
    z-index: 999;
  }
</style>

{#if running}
<div id="test-el">
  <h1>Unsubmarine {i}/{n}</h1>
  <h2>Actionable: {actionable.length}</h2>
</div>
{/if}
