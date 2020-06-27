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

MIT License

Copyright (c) 2020 Sam Collins

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
