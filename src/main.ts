const typescript = require("rollup-plugin-typescript");
import { rollup, RollupOptions, OutputOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import validate from "./validate";
import { getConfig, getBanner } from "./config";

//Validate config input
const { input, output, config, quiet } = validate();

// Get config values
const configJSON = getConfig(config);

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
