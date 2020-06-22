# Unsubmarine

Hacking an auto-unsubscribe into gmail.

## Dev setup

The only runtime dependency is babel for es6. There is a small amount of home-rolled browser automation specific to gmail's web app. Any Unsubmarine UI rendered inside gmail is implemented with [svelte](https://svelte.dev/).

1. Install dependencies: `npm i`
2. Compile svelte app and watch for changes: `npm run dev`
3. Load unpacked extension into Chrome: [https://developer.chrome.com/extensions/getstarted#manifest](https://developer.chrome.com/extensions/getstarted#manifest)
4. Visit gmail (which is the only URL this extension works on: [mail.google.com](mail.google.com))
5. Click the extension button to launch Unsubmarine

## Distribute extension or install locally

1. Install dependencies: `npm i`
2. Build files for extension: `npm run build`
3. After building, distribute/install the `/extension` directory
