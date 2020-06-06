<script>
  import Unsubmarine from "../lib/unsubmarine";
  export let actionableResults,
    killSwitch,
    i,
    startUnsubmarine,
    unsubLimit,
    stop,
    cancel;

  const unsubmarine = new Unsubmarine(unsubLimit);

  $: {
    console.log("$ Change killswitch", killSwitch);
    unsubmarine.killSwitch = killSwitch;
  }

  startUnsubmarine = async () => {
    actionableResults = [];
    i = 1; // update UI for first msg // doesn't work if navigating lists
    for await (const result of unsubmarine.start()) {
      console.log("value from unsub generator", result);

      i = i + 1;
      // explicit assignment to trigger svelte reactivity

      if (result.unsubLink && !result.error) {
        actionableResults = [...actionableResults, result];
      }

      if (result.error) {
        cancel();
        break;
      }
    }
    stop();
  };
</script>
