#!/usr/bin/env node
"use strict";

var fs = require("fs");
var rollup = require("rollup");
var pluginNodeResolve = require("@rollup/plugin-node-resolve");
var meow = require("meow");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var meow__default = /*#__PURE__*/ _interopDefaultLegacy(meow);

/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
const getBanner = (config) => {
  const items = Object.keys(config)
    .map((key) => ({ key, value: config[key] }))
    .map((item) =>
      Array.isArray(item.value)
        ? item.value.map((inner) => ({ key: item.key, value: inner }))
        : item
    )
    .flatMap((i) => i);
  const scriptLines = items
    .map(({ key, value }) => {
      const tabs = key.length < 8 ? "\t\t\t" : "\t\t";
      return `// @${key}${value ? `${tabs}${value}` : ""}`;
    })
    .join("\n");
  return `
// ==UserScript==
${scriptLines}
//
// Created with love using Gorilla
// ==/UserScript==
`;
};

const HELP_MENU = `
  Usage
    $ gorilla

  Options
 --config, -c  Custom GreaseMonkey config
 --input, -i  (required) Input filename
    --output, -o  (required) Output filename

  Examples
    $ gorilla --input ./my-script.ts --output ./my-script.user.js
`;
const DEFAULT_CONFIG = {
  name: "New Userscript",
  namespace: "http://tampermonkey.net/",
  version: "0.1",
  description: "Gorilla-built, rock-solid, Monkey script",
  updateURL: "",
  downloadURL: "",
  author: "You",
  include: ["https://**"],
};
const ERROR_MSG = {
  EXPECT_JSON_FILE: "Gorilla configs must be a JSON file",
};
const WARN_MSG = {
  EXPECT_TYPESCRIPT:
    "Gorilla recommends that your input files be written in TypeScript",
  EXPECT_GM_EXTENSION:
    "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
};

const validate = () => {
  //Use Meow for arg parsing and validation
  const cli = meow__default["default"](HELP_MENU, {
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
  const { input, output, config } = cli.flags;
  // Validate expected filetypes
  console.log("validating JSON");
  if (config && !config.endsWith(".json")) {
    console.error("validating JSON inside");
    throw ERROR_MSG.EXPECT_JSON_FILE;
  }
  if (input.endsWith(".ts")) {
    console.warn(WARN_MSG.EXPECT_TYPESCRIPT);
  }
  //Provide warning on ouput
  if (!output.endsWith("user.js")) {
    console.warn(WARN_MSG.EXPECT_GM_EXTENSION);
  }
  return cli.flags;
};

const typescript = require("rollup-plugin-typescript");
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
const outputConfig = {
  file: output,
  banner: banner,
  format: "iife",
};
const rollupConfig = {
  input,
  output: outputConfig,
  plugins: [typescript(), pluginNodeResolve.nodeResolve()],
};
// Call rollup
rollup
  .rollup(rollupConfig)
  .then(async (bundle) => {
    await bundle.generate(outputConfig);
    return await bundle.write(outputConfig);
  })
  .then(() => console.log("Gorilla smash complete!"));
