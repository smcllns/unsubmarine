<script>
  import Dialog from "./Dialog.svelte";
  import { waitForGmailPageChangeOnce } from "../lib/unsubmarine/observers";
  import { start, hideUI } from "../actions";
  let imgSrc = chrome.runtime.getURL("images/icon128.png");

  const handleAdvancedMode = e => {
    start();
  };

  const handleStandardMode = async e => {
    hideUI();
    await navigateToSearchPageAnimatedly();
    start();
  };

  async function navigateToSearchPageAnimatedly() {
    const searchInput = document.querySelector("[name=q]");
    const parent = searchInput.closest("form");
    const defaultColor = parent.style.backgroundColor;
    parent.style.backgroundColor = "tomato";
    parent.style.color = "white";
    await simulateTyping(searchInput, "unsubscribe");
    parent.style.backgroundColor = defaultColor;
    parent.style.color = "inherit";
    if (window.location.hash !== "#search/unsubscribe") {
      window.location.hash = "#search/unsubscribe";
      await waitForGmailPageChangeOnce();
    }
  }

  function simulateTyping(input, string) {
    return new Promise((resolve, reject) => {
      string.split("").forEach((char, index) => {
        setTimeout(() => {
          input.value = string.slice(0, index + 1);
          if (index === string.length - 1) resolve();
        }, 200 * index + 100 * Math.random());
      });
    });
  }
</script>

<Dialog title={false} subtitle={false}>

  <header class="pb-8 mx-auto max-w-lg text-center">
    <img
      alt="unsubmarine logo"
      src={imgSrc}
      width="64px"
      height="auto"
      class="mx-auto pb-2" />
    <h1 class="text-3xl font-bold">Unsubmarine</h1>
    <p>Automated unsubscribe in gmail with total privacy*</p>
  </header>

  <div class="max-w-lg">
    <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={handleStandardMode}>
      <h3 class="text-lg font-semibold">Start in Standard Mode</h3>
      <p class="font-normal">
        Run on recent emails likely to have unsubscribe links. Recommended for a
        first-time test drive.
      </p>
    </div>

    <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={handleAdvancedMode}>
      <h3 class="text-lg font-semibold">Start in Custom Mode</h3>
      <p class="font-normal">
        Run on the search results/messages currently displayed. Useful for
        running on custom searches.
      </p>
    </div>

    <!-- <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={e => alert('Coming soon!')}>
      <h3 class="text-lg font-semibold">Buy full version ($2.00)</h3>
      <ul class="font-normal">
        <li>Increase unsubscribe limit from 5 to 100</li>
        <li>Unlock Custom Mode to run on any search/message list</li>
        <li>Support bug fixes and enhancements</li>
      </ul>
    </div> -->

    <p class="py-4 text-center text-sm">
      * Designed to run in the most sensitive inboxes. No data ever leaves your
      browser&mdash;this automation is all local.
      <a href="//smcllns.com/memo/unsubmarine?ref=svelte" target="_blank">
        Read blog post for more.
      </a>
    </p>
  </div>
</Dialog>
