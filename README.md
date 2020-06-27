# Unsubmarine

Hacking an auto-unsubscribe into gmail. Also exploring the limitations of safely running third party code somewhere as sensitive as your primary inbox. Read more: [https://smcllns.com/memo/unsubmarine](https://smcllns.com/memo/unsubmarine)

## Usage

1. Install the [Chrome Extension](https://chrome.google.com/webstore/detail/unsubmarine/pjghmcgcepbikjblbmlhicdldmhjljhm)
1. Visit gmail (which is the only URL this extension works on: [mail.google.com](mail.google.com))
1. Click the extension button to launch Unsubmarine

## Dev setup

The only runtime dependency is babel for es6. There is a small amount of home-rolled browser automation specific to gmail's web app. Any Unsubmarine UI rendered inside gmail is implemented with [svelte](https://svelte.dev/).

1. Install dependencies: `npm i`
1. Compile svelte app and watch for changes: `npm run dev`
1. Load unpacked extension into Chrome: [https://developer.chrome.com/extensions/getstarted#manifest](https://developer.chrome.com/extensions/getstarted#manifest)

## Distribute extension or install locally

1. Install dependencies: `npm i`
1. Build files for extension: `npm run build`
1. After building, distribute/install the `/extension` directory

## License

[MIT](https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licences#:~:text=MIT)
