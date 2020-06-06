<script>
  import Unsubmarine from "../lib/unsubmarine";
  export let actionableResults,
    killSwitch,
    running,
    i,
    stopAndReview,
    stopAndCancel,
    startUnsubmarine;

  const limit = 10;
  const unsubmarine = new Unsubmarine(limit);
  $: {
    console.log("$ CHANGE killswitch", killSwitch);
    unsubmarine.killSwitch = killSwitch;
    // if (running) startUnsubmarine();
    // if (!running) unsubmarine.killSwitch = true;
  }

  startUnsubmarine = async () => {
    console.log("startUnsubmarine()");
    const scraper = unsubmarine.start();

    actionableResults = [];
    i = 1; // update UI for first msg // doesn't work if navigating lists
    running = true;
    while (running) {
      const { done, value } = await scraper.next();
      const { m, error } = value;
      console.log("await scrape", m);

      i = i + 1; // explicit assignment to trigger svelte reactivity

      if (m && m.unsubLink && !error) {
        // optional chaining not supported in .svelte
        // due to ordering of svelte vs babel parsing in rollup
        // which I've just spent enough time on and am leaving for now
        // https://github.com/rollup/plugins/tree/master/packages/babel

        actionableResults = [...actionableResults, { m, error }];
        // explicit assignment to trigger svelte reactivity
      }
      running = !done;
      // generators return {done:true} on return
      // and {done:false} on yield

      // console.log(
      //   "done:",
      //   done,
      //   "value:",
      //   value,
      //   "running:",
      //   running,
      //   "i:",
      //   i,
      //   "killSwitch:",
      //   killSwitch,
      //   "unsubmarine.killSwitch:",
      //   unsubmarine.killSwitch
      // );

      if (done) {
        if (error) stopAndCancel();
        else stopAndReview();
      }
    }
    stopAndReview();
  };
</script>
