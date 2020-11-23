#!/usr/bin/env node
"use strict";

var meow = require("meow");
var fs = require("fs");
var rollup = require("rollup");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var meow__default = /*#__PURE__*/ _interopDefaultLegacy(meow);

const DEFAULT_CONFIG = {
  name: "New Userscript",
  namespace: "http://tampermonkey.net/",
  version: "0.1",
  description: "Gorilla-built, rock-solid, Monkey script",
  updateURL: "",
  downloadURL: "",
  author: "You",
  include: [],
  match: ["http://*/*"],
  grant: [],
};
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
    .map(({ key, value }) => `// @${key}${value ? `   ${value}` : ""}`)
    .join("\n");
  return `
// ==UserScript==
${scriptLines}
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

const typescript = require("rollup-plugin-typescript");
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
const outputConfig = {
  file: output,
  banner: banner,
  format: "iife",
};
const rollupConfig = {
  input,
  output: outputConfig,
  plugins: [typescript()],
};
// Call rollup
rollup
  .rollup(rollupConfig)
  .then(async (bundle) => {
    await bundle.generate(outputConfig);
    return await bundle.write(outputConfig);
  })
  .then(() => console.log("Gorilla smash complete!"));
