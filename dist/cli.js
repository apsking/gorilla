#!/usr/bin/env node
'use strict';

var fs = require('fs');
var rollup = require('rollup');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var M = require('meow');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var M__default = /*#__PURE__*/_interopDefaultLegacy(M);

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
    EXPECT_VALID_KEY: "Invalid gorilla config key(s):",
};
const WARN_MSG = {
    EXPECT_TYPESCRIPT: "Gorilla recommends that your input files be written in TypeScript",
    EXPECT_GM_EXTENSION: "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
};

const VALID_KEYS = [
    "author",
    "description",
    "exclude",
    "grant",
    "icon",
    "include",
    "match",
    "name",
    "namespace",
    "noframes",
    "require",
    "resource",
    "version",
    "updateURL",
    "downloadURL",
];
/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
const getBanner = (config) => {
    const invalidItems = Object.keys(config).filter((key) => !VALID_KEYS.includes(key));
    if (invalidItems.length > 0) {
        const msg = `${ERROR_MSG.EXPECT_VALID_KEY} ${invalidItems.join(", ")}`;
        throw msg;
    }
    const items = Object.keys(config)
        .map((key) => ({ key, value: config[key] }))
        .map((item) => Array.isArray(item.value)
        ? item.value.map((inner) => ({ key: item.key, value: inner }))
        : item)
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

const meow = M__default['default'];

const validate = () => {
    //Use Meow for arg parsing and validation
    const cli = meow(HELP_MENU, {
        flags: {
            config: {
                type: "string",
                alias: "c",
            },
            quiet: {
                type: "boolean",
                alias: "q",
                default: false,
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
    const { input, output, config, quiet } = cli.flags;
    // Validate expected filetypes
    if (config && !config.endsWith(".json")) {
        throw ERROR_MSG.EXPECT_JSON_FILE;
    }
    if (!quiet && !input.endsWith(".ts") && !quiet) {
        console.warn(WARN_MSG.EXPECT_TYPESCRIPT);
    }
    //Provide warning on output
    if (!quiet && !output.endsWith("user.js")) {
        console.warn(WARN_MSG.EXPECT_GM_EXTENSION);
    }
    return cli.flags;
};

const typescript = require("rollup-plugin-typescript");
//Validate config input
const { input, output, config } = validate();
// Default to config, if not provided
const configJSON = config && config !== ""
    ? JSON.parse(fs__namespace.readFileSync(config, "utf8"))
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
rollup.rollup(rollupConfig)
    .then(async (bundle) => {
    await bundle.generate(outputConfig);
    return await bundle.write(outputConfig);
})
    .then(() => console.log("Gorilla smash complete!"));
