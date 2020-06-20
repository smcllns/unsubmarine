<script>
  import { actionableResults, processedEmailCount } from "../stores";
  import { stop } from "../actions";
</script>

<div class="flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class="flex justify-between items-center py-4 px-6 mx-8 rounded-t-lg
    bg-black text-white pointer-events-auto">
    <div class="text-sm">
      <p class="font-bold font-tomato">
        Looking for emails with unsubscribe links...
      </p>
      <p>
        Clicked through {$processedEmailCount} emails; collected {$actionableResults.length}
        unsubscribe links
      </p>
    </div>
    <span class="Btn Primary" on:click|preventDefault={stop}>Finish</span>
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
