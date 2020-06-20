import Unsubmarine from "./lib/unsubmarine/index";
import { get } from "svelte/store";
import {
  actionableResults,
  processedEmailCount,
  viewState,
  killSwitchOn,
  userLimit,
} from "./stores";

export function handleExtensionClick() {
  document.removeEventListener("keyup", handleShortcutKeys);
  document.addEventListener("keyup", handleShortcutKeys);
  viewState.moveToNextView("start");
  console.log("extension click");
}

export function start() {
  runUnsubmarine();
  viewState.moveToNextView("progress");
}

export function cancel() {
  killSwitchOn.set(true);
  viewState.moveToNextView(false);
}

export function stop() {
  killSwitchOn.set(true);
  viewState.moveToNextView("review");
}

export function hideUI() {
  viewState.moveToNextView(false);
}

function handleShortcutKeys(e) {
  if (e.key === "Escape") cancel();
}

async function runUnsubmarine() {
  const unsubmarine = new Unsubmarine();
  processedEmailCount.set(0);
  actionableResults.set([]);
  killSwitchOn.set(false);
  const maxUnsubCount = get(userLimit);
  let unsubCount = 0;
  const unlistenKillSwitch = killSwitchOn.subscribe(
    (status) => (unsubmarine.killSwitch = status)
  );

  for await (const result of unsubmarine.run()) {
    processedEmailCount.update((n) => n + 1);

    if (result.unsubLink) {
      actionableResults.update((prev) => {
        unsubCount = prev.length + 1;
        return [...prev, result];
      });
    }

    console.log(
      "result from unsub generator",
      unsubCount,
      maxUnsubCount,
      result
    );

    if (result.error || unsubmarine.killSwitch) {
      stop();
      break;
    }

    if (unsubCount >= maxUnsubCount) {
      stop();
      break;
    }
  }
  unlistenKillSwitch();
}
