import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;

const outputDir = "extension/content/";

export default {
  input: "src/index.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: outputDir + "bundle.js",
    globals: {
      "@babel/runtime/regenerator": "regeneratorRuntime",
    },
  },
  plugins: [
    babel({
      presets: ["@babel/env"],
      babelHelpers: "runtime",
      babelrc: false,
      plugins: [["@babel/transform-runtime"]],
      exclude: "node_modules/**",
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write(outputDir + "bundle.css");
      },
      preprocess: sveltePreprocess({ postcss: true }),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
