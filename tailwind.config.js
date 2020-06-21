module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    content: ["src/**/*.svelte", "src/**/*.js"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
