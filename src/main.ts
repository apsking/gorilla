const typescript = require("rollup-plugin-typescript");
import meow from "meow";
import * as fs from "fs";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import getBanner, { DEFAULT_CONFIG } from "./banner";
import { HELP_MENU } from "./constants";

//Use Meow for arg parsing and validation
const cli = meow(HELP_MENU, {
  flags: {
    config: {
      type: "string",
      alias: "c",
    },
    input: {
      type: "string",
      alias: "i",
      isRequired: true,
    },
    output: {
      type: "string",
      alias: "o",
      isRequired: true,
    },
  },
});

const { config, output, input } = cli.flags;

//Provide warning on ouput
if (!output.includes("user.js")) {
  console.warn(
    "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file."
  );
}

// Default to config, if not provided
const configJSON =
  config && config !== ""
    ? JSON.parse(fs.readFileSync(config, "utf8"))
    : DEFAULT_CONFIG;

// Create banner text from config
const banner = getBanner(configJSON);

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
