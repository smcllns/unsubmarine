<script>
  export let quit;
</script>

<div
  class="Dialog__Container flex flex-1 flex-col-reverse pointer-events-none
  items-center justify-center">
  <div
    class="Dialog flex flex-col justify-center py-12 px-16 m-4 bg-white
    text-black rounded-lg pointer-events-auto relative">
    <span on:click|preventDefault={quit} class="Dialog__Close">&#x2716;</span>

    <slot />
  </div>
</div>

<style>
  .Dialog {
  }
  .Dialog__Container {
    background: rgba(0, 0, 0, 0.8);
  }
  .Dialog__Close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    min-width: 2rem;
    min-height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100rem;
  }
</style>
