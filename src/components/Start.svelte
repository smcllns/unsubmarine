<script>
  export let moveToNextView;
  import Dialog from "./Dialog.svelte";
</script>

<Dialog {moveToNextView}>
  <header class="pb-8 px-8 text-center">
    <h1 class="text-3xl font-bold">Welcome to Unsubmarine</h1>
    <p>A miniature adventure in making some automated tools for gmail.</p>
  </header>
  <div class="Btn Secondary p-4" on:click|preventDefault={moveToNextView}>
    <h3 class="text-lg font-semibold">Advanced mode</h3>
    <p class="font-normal">Run on the list of emails in current view</p>
  </div>
</Dialog>