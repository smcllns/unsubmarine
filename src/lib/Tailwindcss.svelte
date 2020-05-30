<style global>
  @tailwind base;

  .Btn {
    text-align: center;
    padding: 1rem 2rem;
    cursor: pointer;
    opacity: 0.95;
    position: relative;
  }
  .Btn:hover {
    opacity: 1;
    top: -1px;
  }
  .Btn:active {
    top: 1px;
  }
  .Btn.Primary {
    border: 2px solid transparent;
    background: tomato;
    color: #fff;
  }
  .Btn.Secondary {
    border: 2px solid #000;
    background: #fff;
    color: #000;
  }
  .Btn.Secondary:hover {
    @apply bg-gray-100;
  }
  .Btn.Tertiary {
    border: 0;
    background: transparent;
    color: #000;
  }

  @tailwind components;
  @tailwind utilities;
</style>
