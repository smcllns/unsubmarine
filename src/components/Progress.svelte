<script>
  import { afterUpdate } from "svelte";
  import Unsub from "../lib/unsubmarine";
  export let i, actionableResults, killSwitch, moveToNextView, active;

  const limit = 3;
  const unsub = new Unsub(limit);

  $: {
    if (active) unsubRun();
    unsub.killSwitch = killSwitch;
  }

  const unsubRun = async () => {
    const scraper = unsub.start();

    actionableResults = [];
    i = 1; // update UI for first msg

    let inProcess = true;
    while (inProcess) {
      const { done, value } = await scraper.next();
      const { m, error } = value;

      i = i + 1; // explicit assignment to trigger svelte reactivity

      if (m && m.unsubLink && !error) {
        // optional chaining not supported in .svelte
        // due to ordering of svelte vs babel parsing in rollup
        // which I've just spent enough time on and am leaving for now
        // https://github.com/rollup/plugins/tree/master/packages/babel

        actionableResults = [...actionableResults, { m, error }];
        // explicit assignment to trigger svelte reactivity
      }
      inProcess = !done;
      // generators return {done:true} on return
      // and {done:false} on yield
    }
    if (!killSwitch) moveToNextView(2);
  };
</script>

{#if active}

  <div class="flex flex-1 flex-col-reverse pointer-events-none">
    <div
      class="flex justify-between items-center p-4 mx-8 rounded-t-lg bg-black
      text-white pointer-events-auto">
      <span
        class="Btn Tertiary"
        on:click|preventDefault={e => moveToNextView('exit')}>
        Cancel
      </span>
      <div class="text-center text-sm">
        <p class="font-bold">Searching for unsubscribe links...</p>
        <p>
          {i} email searched; {actionableResults.length} unsubscribe links found
        </p>
      </div>
      <span
        class="Btn Primary"
        on:click|preventDefault={e => (killSwitch = true)}>
        Finish
      </span>
    </div>
  </div>

{/if}

<style>
  .Btn.Tertiary {
    color: #fff;
  }
</style>
