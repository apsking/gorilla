const typescript = require("rollup-plugin-typescript");
import * as fs from "fs";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import getBanner from "./banner";
import { DEFAULT_CONFIG } from "./constants";
import validate from "./validate";

//Validate config input
const { input, output, config } = validate();

// Default to config, if not provided
const configJSON =
  config && config !== ""
    ? JSON.parse(fs.readFileSync(config, "utf8"))
    : DEFAULT_CONFIG;

// Create banner text from config
const banner = getBanner(configJSON);

// Create Rollup config
const outputConfig: OutputOptions = {
  file: output,
  banner: banner,
  format: "iife",
};
const rollupConfig: RollupOptions = {
  input,
  output: outputConfig,
  plugins: [typescript(), nodeResolve()],
};

// Call rollup
rollup(rollupConfig)
  .then(async (bundle) => {
    await bundle.generate(outputConfig);
    return await bundle.write(outputConfig);
  })
  .then(() => console.log("Gorilla smash complete!"));
