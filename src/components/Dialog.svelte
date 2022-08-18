<script>
  import { cancel } from "../actions";
  let imgSrc = chrome.runtime.getURL("images/icon128.png");
</script>

<div
  class="Dialog__Container flex flex-1 flex-col-reverse pointer-events-none
  items-end justify-start"
>
  <div
    class="Dialog flex flex-col justify-center p-4 mx-4 bg-white
    text-black pointer-events-auto relative rounded-t-md w-full max-w-xl"
  >
    <div class="Dialog__Shadow" />
    <div class="Dialog__Close" on:click|preventDefault={cancel}>&#x2716;</div>

    <header class="pb-2 mx-auto text-center">
      <img
        alt="unsubmarine logo"
        src={imgSrc}
        width="64px"
        height="auto"
        class="mx-auto pb-2"
      />
      <h1 class="text-3xl font-bold">Unsubmarine</h1>
      <p>Bulk Unsubscribe in Gmail</p>
    </header>

    <slot />
  </div>
</div>

<style>
  .Dialog {
    /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.12),
      0 4px 4px rgba(0, 0, 0, 0.16), 0 8px 8px rgba(0, 0, 0, 0.2); */
    position: relative;
    max-height: 98vh;
  }
  .Dialog__Container {
    background: rgb(0, 0, 0);
    background: radial-gradient(
      circle,
      rgba(0, 0, 0, 0.5) 33%,
      rgba(0, 0, 0, 0.9) 100%
    );
  }
  .Dialog__Shadow {
    position: absolute;
    background: #fff;
    bottom: 0;
    width: 80%;
    left: 10%;
    height: 5rem;
    box-shadow: 0 20px 20px 20px rgba(0, 0, 0, 0.5);
    z-index: -1;
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
    opacity: 0.7;
  }
  .Dialog__Close:hover {
    opacity: 1;
  }
</style>
