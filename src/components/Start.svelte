<script>
  import Dialog from "./Dialog.svelte";
  import { simulateTyping } from "../lib/utils";
  export let moveToNextView;

  const handleStandardMode = async e => {
    moveToNextView(false);
    const searchInput = document.querySelector("[name=q]");
    const parent = searchInput.closest("form");
    const defaultColor = parent.style.backgroundColor;
    parent.style.backgroundColor = "tomato";
    await simulateTyping(searchInput, "unsubscribe");
    parent.style.backgroundColor = defaultColor;
    window.location.hash = "#search/unsubscribe";
    setTimeout(() => {
      moveToNextView(1);
    }, 3000);
  };
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

    <div
      class="Btn Secondary p-4"
      on:click|preventDefault={e => moveToNextView(1)}>
      <h3 class="text-lg font-semibold">Advanced mode</h3>
      <p class="font-normal">Run on the message list in current view</p>
    </div>
  </div>
</Dialog>

<!-- document.querySelector('[name=q]') -->
<!-- window.location.hash = '#search/unsubscribe' -->
