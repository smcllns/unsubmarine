<script>
  import Unsubmarine from "../lib/unsubmarine";
  export let killSwitch, startUnsubmarine, unsubLimit, stop, cancel;
  import { actionableResults, processedEmailCount } from "./stores";

  const unsubmarine = new Unsubmarine(unsubLimit);

  $: {
    console.log("$ Change killswitch", killSwitch);
    unsubmarine.killSwitch = killSwitch;
  }

  startUnsubmarine = async () => {
    actionableResults.set([]);
    for await (const result of unsubmarine.start()) {
      console.log("value from unsub generator", result);

      processedEmailCount.update(n => n + 1);

      if (result.unsubLink && !result.error) {
        actionableResults.update(prev => [...prev, result]);
      }

      if (result.error) {
        cancel();
        break;
      }
    }
    stop();
  };
</script>
