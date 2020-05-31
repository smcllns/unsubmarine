<script>
  import Dialog from "./Dialog.svelte";
  import { simulateTyping } from "../lib/utils";
  export let moveToNextView, running;

  const delay = 1000;

  const handleAdvancedMode = e => {
    moveToNextView(1);
    setTimeout(() => {
      running = true;
    }, delay * 1);
  };

  const handleStandardMode = e => {
    moveToNextView(1);
    navigateToSearchPageAnimatedly();
    setTimeout(() => {
      running = true;
    }, delay * 3);
  };

  async function navigateToSearchPageAnimatedly() {
    const searchInput = document.querySelector("[name=q]");
    const parent = searchInput.closest("form");
    const defaultColor = parent.style.backgroundColor;
    parent.style.backgroundColor = "tomato";
    await simulateTyping(searchInput, "unsubscribe");
    parent.style.backgroundColor = defaultColor;
    window.location.hash = "#search/unsubscribe";
  }
</script>

<Dialog
  {moveToNextView}
  title="Welcome to Unsubmarine"
  subtitle="An miniature adventure in automating inbox management.">

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

    <div class="Btn Secondary p-4" on:click|preventDefault={handleAdvancedMode}>
      <h3 class="text-lg font-semibold">Advanced mode</h3>
      <p class="font-normal">Run on the message list in current view</p>
    </div>
  </div>
</Dialog>
