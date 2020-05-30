<script>
  export let n, currentViewState, viewStates;
  const initFocus = el => el.focus();
</script>

<div
  id="unsubmarine-ask"
  class="flex flex-1 flex-col-reverse pointer-events-none items-center
  justify-center Dialog__Container">
  <div
    class="flex flex-col justify-center bg-black text-white px-12 py-6
    rounded-lg pointer-events-auto Dialog">
    <h1>Start Unsubmarine?</h1>
    <input
      type="number"
      bind:value={n}
      placeholder={100}
      class="text-black text-center px-2 rounded-sm mt-2"
      use:initFocus />
    <button
      on:click|preventDefault={e => (currentViewState = viewStates[1])}
      class="bg-green-600 px-4 rounded-sm mt-2">
      Start
    </button>
  </div>
</div>

<style>
  .Dialog__Container {
    background: rgba(0, 0, 0, 0.8);
  }
  .Dialog {
    background: tomato;
    min-height: 10rem;
  }
</style>
