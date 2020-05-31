<script>
  export let actionableResults, i, stopAndCancel, stopAndReview;
</script>

<div class="flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class="flex justify-between items-center p-4 mx-8 rounded-t-lg bg-black
    text-white pointer-events-auto">
    <span class="Btn Tertiary" on:click|preventDefault={stopAndCancel}>
      Cancel
    </span>
    <div class="text-center text-sm">
      <p class="font-bold">Searching for unsubscribe links...</p>
      <p>
        {i} email searched; {actionableResults.length} unsubscribe links found
      </p>
    </div>
    <span class="Btn Primary" on:click|preventDefault={stopAndReview}>
      Finish
    </span>
  </div>
</div>

<style>
  .Btn.Tertiary {
    color: #fff;
  }
  .Btn.Tertiary:hover {
    color: #000;
  }
</style>
