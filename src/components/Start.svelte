<script>
  import Dialog from "./Dialog.svelte";
  import { waitForGmailPageChangeOnce } from "../lib/unsubmarine/observers";
  import { start, hideUI } from "../navigation";

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

<Dialog
  title="Welcome to Unsubmarine"
  subtitle="Automating unsubscribe for gmail">

  <div class="max-w-lg">
    <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={handleStandardMode}>
      <h3 class="text-lg font-semibold">Standard mode</h3>
      <p class="font-normal">
        Run on recent emails likely to have unsubscribe links.
        <span class="font-tomato">Recommended</span>
        if trying out Unsubmarine for the first time.
      </p>
    </div>

    <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={handleAdvancedMode}>
      <h3 class="text-lg font-semibold">Custom mode</h3>
      <p class="font-normal">Run on the message list in current view</p>
    </div>

    <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={e => alert('Coming soon!')}>
      <h3 class="text-lg font-semibold">Buy full version ($1.99)</h3>
      <p class="font-normal">
        Increase search limit from 10 to 1000, set search options, and help me
        understand how many people will pay for inbox automation :)
      </p>
    </div>

    <p class="mb-4">
      Read more about my thinking making automation for something as sensitive
      as an inbox. (TLDR: Strictly no email data leaves your browser, but that
      limits what features are possible.)
    </p>
  </div>
</Dialog>
