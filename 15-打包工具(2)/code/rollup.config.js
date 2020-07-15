import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import html from "@rollup/plugin-html";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/main.js",
  output: {
    entryFileNames: isProduction
      ? "bundle.min-[hash].js"
      : "bundle.[hash].js",
    dir: 'dist',
    format: "iife",
    name: "app",
    plugins: [terser()],
  },
  plugins: [
    commonjs(),
    json(),
    resolve(),
    babel({
      exclude: "node_modules/**", // 只编译我们的源代码
    }),
    html({
      files: "./src/index.html",
    }),
  ],
};
