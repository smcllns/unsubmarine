<script>
  import Unsub from "../lib/unsubmarine";
  export let i, actionableResults, killSwitch, moveToNextView;

  (async () => {
    await getResults();
    moveToNextView();
  })();

  function getResults() {
    return new Promise(async (resolve, reject) => {
      let _results = [];

      const unsub = new Unsub();
      const scraper = unsub.start();

      let inProcess = true;
      i = 1; // updates UI ahead of first scrape

      while (inProcess) {
        const {
          done,
          value: { m, error, ...res }
        } = await scraper.next();

        // assigning explicitly bc destructuring doesn't trigger svelte reactivity
        i = res.i + 1;

        if (m && m.unsubLink && !error) {
          _results = [..._results, { m, error }];
        }
        actionableResults = _results;
        inProcess = !done && !killSwitch;
        // generator returns {done:true} when complete and {done:false} for each yield
      }
      resolve(_results);
    });
  }
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
