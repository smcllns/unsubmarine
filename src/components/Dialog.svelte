<script>
  import { cancel } from "../actions";
  export let title, subtitle;
</script>

<div
  class="Dialog__Container flex flex-1 flex-col-reverse pointer-events-none
  items-center justify-center">
  <div
    class="Dialog flex flex-col justify-center px-4 md:px-16 py-8 m-4 bg-white
    text-black rounded-lg pointer-events-auto relative">
    <span on:click|preventDefault={cancel} class="Dialog__Close">&#x2716;</span>

    {#if title}
      <header class="pb-8 mx-auto max-w-lg text-center">
        <h1 class="text-3xl font-bold">{title}</h1>
        <p>{subtitle}</p>
      </header>
    {/if}

    <slot />

  </div>
</div>

<style>
  .Dialog {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.12),
      0 4px 4px rgba(0, 0, 0, 0.16), 0 8px 8px rgba(0, 0, 0, 0.2);
  }
  .Dialog__Container {
    background: rgb(0, 0, 0);
    background: radial-gradient(
      circle,
      rgba(0, 0, 0, 0.5) 33%,
      rgba(0, 0, 0, 0.9) 100%
    );
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
