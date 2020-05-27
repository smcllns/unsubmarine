<script>
  export let actionableResults, quit;

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
    quit();
  }
</script>

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
    <button on:click|preventDefault={quit} class="px-4 my-4 rounded-sm">
      Cancel
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
