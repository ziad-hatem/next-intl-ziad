import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

const external = ["react", "react/jsx-runtime", "next", "js-cookie"];

export default [
  // Main bundle
  {
    input: "src/index.ts",
    external,
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"],
      }),
    ],
  },
  // Middleware bundle
  {
    input: "src/middleware.ts",
    external,
    output: [
      {
        file: "dist/middleware.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/middleware.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"],
      }),
    ],
  },
  // Type definitions
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
  {
    input: "src/middleware.ts",
    output: {
      file: "dist/middleware.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
