<script>
  import Unsub from "./unsubmarine";
  export let n, i, viewStates, currentViewState, actionableResults;
  (async () => {
    actionableResults = await getResults(n);
    currentViewState = viewStates[2];
  })();

  function getResults(n) {
    return new Promise(async (resolve, reject) => {
      let _results = [];

      const unsub = new Unsub();
      const scraper = unsub.start(n);

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
          actionableResults = _results;
        }
        inProcess = !done;
        // generator returns {done:true} when complete and {done:false} for each yield
      }
      resolve(_results);
    });
  }
</script>

<div
  id="unsubmarine-progress"
  class="flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class="flex flex-col items-center justify-center bg-green-600 text-white
    py-4 mx-4 rounded-t-lg pointer-events-auto">
    <h1>Unsubmarine {i}/{n}</h1>
    <h2>Actionable: {actionableResults.length}</h2>
  </div>
</div>
