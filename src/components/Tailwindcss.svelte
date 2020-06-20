<style global>
  @tailwind base;

  #unsubmarine {
    @apply font-sans;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
  .font-tomato {
    color: tomato;
  }

  .Btn {
    text-align: center;
    font-weight: bold;
    padding: 0.25rem 1.5rem;
    cursor: pointer;
    opacity: 0.95;
    position: relative;
    border-radius: 2px;
  }
  .Btn.Primary {
    border: 2px solid transparent;
    background: tomato;
    color: #fff;
  }
  .Btn.Secondary {
    /* border: 2px solid #000; */
    @apply bg-gray-200;
    color: #000;
  }
  .Btn.Tertiary {
    border: 0;
    background: transparent;
    color: #000;
  }
  .Btn:hover {
    opacity: 1;
    top: -1px;
  }
  .Btn:active {
    top: 1px;
  }
  .Btn.Secondary:hover {
    @apply bg-gray-300;
  }
  .Btn.Tertiary:hover {
    @apply bg-gray-200;
  }
  .Btn.Primary:disabled {
    @apply bg-gray-400;
  }
  .Btn.Secondary:disabled,
  .Btn.Tertiary:disabled {
    display: none;
  }

  @tailwind components;
  @tailwind utilities;
</style>
