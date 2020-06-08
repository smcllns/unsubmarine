import Unsubmarine from "../lib/unsubmarine/index";
import { get } from "svelte/store";
import {
  actionableResults,
  processedEmailCount,
  viewState,
  killSwitchOn,
  unsubLimit,
} from "./stores";

export function reset() {
  killSwitchOn.set(false);
  viewState.reset();
  processedEmailCount.set(0);
  actionableResults.set([]);
  document.removeEventListener("keyup", handleShortcutKeys);
  unsubLimit.set(5); // Todo: make a micropayment to extend
}

export function handleExtensionClick() {
  reset();
  document.addEventListener("keyup", handleShortcutKeys);
  viewState.moveToNextView("start");
}

export function start() {
  viewState.moveToNextView("progress");
  startUnsubmarine();
}

export function cancel() {
  killSwitchOn.set(true);
  viewState.moveToNextView(false);
  reset();
}

export function hideUI() {
  viewState.moveToNextView(false);
}

export function stop() {
  killSwitchOn.set(true);
  viewState.moveToNextView("review");
}

export function handleShortcutKeys(e) {
  if (e.key === "Escape") cancel();
}

export async function startUnsubmarine() {
  const max = get(unsubLimit);
  const unsubmarine = new Unsubmarine(max);
  actionableResults.set([]);
  const killSwitchUnsubscribe = killSwitchOn.subscribe(
    (status) => (unsubmarine.killSwitch = status)
  );

  for await (const result of unsubmarine.start()) {
    console.log("value from unsub generator", result);

    processedEmailCount.update((n) => n + 1);

    if (result.unsubLink && !result.error) {
      actionableResults.update((prev) => [...prev, result]);
    }

    if (result.error) {
      cancel();
      break;
    }
  }
  stop();
  killSwitchUnsubscribe();
}
