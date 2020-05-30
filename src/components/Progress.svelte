<script>
  import Unsub from "../lib/unsubmarine";
  export let i, actionableResults, killSwitch, moveToNextView;

  const limit = 3;

  (async () => {
    const unsub = new Unsub(limit);
    const scraper = unsub.start();
    let inProcess = true;

    actionableResults = [];
    i = 1; // update UI for first msg

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
      inProcess = !done && !killSwitch;
      // generators return {done:true} on return
      // and {done:false} on yield
    }
    moveToNextView();
  })();
</script>

<div
  class="ProgressTab__Container flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class="ProgressTab flex justify-between items-center p-4 mx-8 rounded-t-lg
    bg-black text-white pointer-events-auto">
    <span
      class="Btn Tertiary"
      on:click|preventDefault={e => moveToNextView(true)}>
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
      on:click|preventDefault={e => (killSwitch = !killSwitch)}>
      Finish
    </span>
  </div>
</div>

<style>
  .ProgressTab {
  }
  .Btn.Tertiary {
    color: #fff;
  }
</style>
