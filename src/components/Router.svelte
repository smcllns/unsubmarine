<script>
  // Not being used
  export let currentViewState, killSwitch;
  const viewStates = ["prompt", "progress", "review"];

  export let moveToNextView = flag => {
    if (flag === false) return (currentViewState = false);
    if (Number.isInteger(flag)) return (currentViewState = viewStates[flag]);
  };

  export let isViewState = num => currentViewState === viewStates[num];

  export let handleExtensionClick = () => {
    reset();
    document.addEventListener("keyup", handleShortcutKeys);
    moveToNextView(0);
  };

  export let start = () => {
    moveToNextView(1);
    startUnsubmarine();
  };
  export let cancel = () => {
    killSwitch = true;
    moveToNextView(false);
    cleanup();
  };
  export let stop = () => {
    killSwitch = true;
    moveToNextView(2);
  };

  export let reset = () => {
    cleanup();
    killSwitch = false;
    moveToNextView(false);
  };

  function cleanup() {
    document.removeEventListener("keyup", handleShortcutKeys);
  }
  function handleShortcutKeys(e) {
    if (e.key === "Escape") stopAndCancel();
  }
</script>
