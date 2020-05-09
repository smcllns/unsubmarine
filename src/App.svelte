<script>
  console.log("running svelte app");
  import Unsub from "./unsubmarine";
  let name = "world!";
  const handleClick = (e) => {
    const unsub = new Unsub();
    console.log("unsub", unsub);
  };
</script>

<style>
  #test-el {
    background: yellow;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 5rem 0;
    margin: 0;
    z-index: 999;
  }
</style>

<div id="test-el">
  <h1>Hello {name}!</h1>
  <button on:click|preventDefault="{handleClick}">Trigger Unsub()</button>
</div>
