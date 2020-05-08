<script>
  let name = "world!";
  console.log("running svelte app");
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

<h1 id="test-el">Hello {name}!</h1>
