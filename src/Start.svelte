<script>
  export let n, currentViewState, viewStates;
</script>

<div
  id="unsubmarine-ask"
  class="flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class="flex items-center justify-center bg-black text-white py-4 mx-4
    rounded-t-lg pointer-events-auto">
    <h1>How many emails to loop through?</h1>
    <input
      type="number"
      bind:value={n}
      placeholder={10}
      class="mx-4 text-black text-center w-12 rounded-sm"
      autofocus />
    <button
      on:click|preventDefault={e => (currentViewState = viewStates[1])}
      class="bg-green-600 px-4 rounded-sm">
      Start
    </button>
  </div>
</div>
