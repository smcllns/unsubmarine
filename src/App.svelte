<script>
  // FLOW:
  // Toggle AskUI
  // Ask for N; how many messages to loop over

  // Toggle ProgressUI
  // Scrape message list with unsub.start(n)

  // ToggleReviewUI
  // Select results and have extension background launch unsub links

  import Unsub from "./unsubmarine";
  import Tailwindcss from "./Tailwindcss.svelte";

  let isProgressState = false,
    isAskState = false,
    isReviewState = false;

  let actionableResults = [],
    n = 0,
    i = 0;

  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      isAskState = true;
      isReviewState = isProgressState = false;
      return true;
    }
  });

  async function handleStartConfirm() {
    isAskState = false;
    isProgressState = true;
    actionableResults = await getResults(n);
    console.log("actionable Results", actionableResults);
    isProgressState = false;
    isReviewState = true;
  }

  function handleLaunchUrl(url) {
    chrome.runtime.sendMessage({ message: "open_new_tab", url });
  }

  function handleReviewFinish() {
    actionableResults.length > 0
      ? chrome.runtime.sendMessage({
          message: "open_new_tabs",
          urls: actionableResults.map(i => i.m.unsubLink)
        })
      : console.log("no actionable results to open");
    isReviewState = isProgressState = false;
  }

  function getResults(n) {
    return new Promise(async (resolve, reject) => {
      let _results = [];

      const unsub = new Unsub();
      const scraper = unsub.start(n);

      let inProcess = true;
      i = 1; // updates UI ahead of first scrape

      while (inProcess) {
        const {
          done,
          value: { m, error, ...res }
        } = await scraper.next();

        // assigning explicitly bc destructuring doesn't trigger svelte reactivity
        i = res.i + 1;

        if (m && m.unsubLink && !error) {
          _results = [..._results, { m, error }];
          actionableResults = _results;
        }
        console.log(`tick: ${i}/${n}; actionable: ${_results.length}`);
        inProcess = !done;
      }
      resolve(_results);
    });
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
  {#if isAskState}
    <div
      id="unsubmarine-ask"
      class="flex flex-1 flex-col-reverse pointer-events-none">
      <div
        class="flex items-center justify-center bg-black text-white py-4 mx-4
        rounded-t-lg pointer-events-auto">
        <h1>How many emails to loop through?</h1>
        <input
          type="number"
          bind:value={n}
          placeholder={0}
          class="mx-4 text-black text-center w-12 rounded-sm"
          autofocus />
        <button
          on:click|preventDefault={e => handleStartConfirm(n)}
          class="bg-green-600 px-4 rounded-sm">
          Start
        </button>
      </div>
    </div>
  {/if}

  {#if isProgressState}
    <div
      id="unsubmarine-progress"
      class="flex flex-1 flex-col-reverse pointer-events-none">
      <div
        class="flex flex-col items-center justify-center bg-green-600 text-white
        py-4 mx-4 rounded-t-lg pointer-events-auto">
        <h1>Unsubmarine {i}/{n}</h1>
        <h2>Actionable: {actionableResults.length}</h2>
      </div>
    </div>
  {/if}

  {#if isReviewState}
    <div
      id="unsubmarine-review"
      class="flex flex-1 bg-green-400 text-white pointer-events-auto">
      <div class="flex flex-1 flex-col items-center justify-center">
        <h1>Click {actionableResults.length} unsubscribe links?</h1>
        <button
          on:click|preventDefault={handleReviewFinish}
          class="bg-green-800 px-4 my-4 rounded-sm">
          OK
        </button>
        <ul>
          {#each actionableResults as { m }}
            <li>
              {m.sender}
              <a href={m.url} on:click|preventDefault={handleLaunchUrl(m.url)}>
                {m.when}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

</div>

<Tailwindcss />
