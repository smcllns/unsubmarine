<script>
  import Unsubmarine from "../lib/unsubmarine";
  export let startUnsubmarine, stop, cancel;
  import {
    actionableResults,
    processedEmailCount,
    killSwitchOn,
    unsubLimit
  } from "./stores";

  const unsubmarine = new Unsubmarine($unsubLimit);

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
      unsubmarine.killSwitch = $killSwitchOn;
    }
    stop();
  };
</script>
