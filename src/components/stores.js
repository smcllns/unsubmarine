import { writable } from "svelte/store";

function createViewState() {
  const { subscribe, set, update } = writable(false);

  const viewStates = [false, "start", "progress", "review"];

  return {
    subscribe,
    moveToNextView: (val) => {
      switch (true) {
        case viewStates.includes(val):
          set(val);
          break;
        case Number.isInteger(val) && val < viewStates.length:
          set(viewStates[val]);
          break;
        case typeof val === undefined:
          update((curr) => viewStates[viewStates.indexOf(curr) + 1]);
          break;
        default:
          console.log("can't switch to viewState", val);
      }
    },
    reset: () => set(false),
  };
}

export const processedEmailCount = writable(0);
export const actionableResults = writable([]);
export const currentViewState = createViewState();
