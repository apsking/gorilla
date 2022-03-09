#!/usr/bin/env node
'use strict';

var rollup = require('rollup');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var M = require('meow');
var fs = require('fs');

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
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var M__default = /*#__PURE__*/_interopDefaultLegacy(M);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

const meow = M__default["default"];

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
const ERROR_MSG = {
    EXPECT_JSON_FILE: "Gorilla configs must be a JSON file",
    EXPECT_VALID_KEY: "Invalid gorilla config key(s):",
};
const WARN_MSG = {
    EXPECT_TYPESCRIPT: "Gorilla recommends that your input files be written in TypeScript",
    EXPECT_GM_EXTENSION: "GreaseMonkey scripts must end in '.user.js'. Consider renaming your output file.",
    EXPECT_GM_KEYS: "GreaseMonkey script includes keys that GreaseMonkey does not support: ",
};

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
    if (!quiet && !input.endsWith(".ts")) {
        console.warn(WARN_MSG.EXPECT_TYPESCRIPT);
    }
    //Provide warning on output
    if (!quiet && !output.endsWith("user.js")) {
        console.warn(WARN_MSG.EXPECT_GM_EXTENSION);
    }
    return cli.flags;
};

const PACKAGE_JSON_LOCATION = "./package.json";
const PACKAGE_JSON_GORILLA_KEY = "gorilla";
const PACKAGE_JSON_KEYS = [
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "copyright",
    "license",
];
const VALID_GORILLA_CONFIG_KEYS = [
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
/**
 * Priority:
 * 1. Input config
 * 2. package.json
 * @returns current GorillaConfig
 */
const getConfig = (inputConfigLocation) => {
    const tmpConfig = {};
    // Config passed in by input
    if (inputConfigLocation && inputConfigLocation !== "") {
        try {
            const inputConfig = JSON.parse(fs__namespace.readFileSync(inputConfigLocation, "utf8"));
            Object.keys(inputConfig).forEach((key) => {
                tmpConfig[key] = inputConfig[key];
            });
        }
        catch (err) {
            console.error("Failed to parse input config", err);
        }
    }
    // Read `package.json`
    if (fs__namespace.existsSync(PACKAGE_JSON_LOCATION)) {
        const packageJSON = JSON.parse(fs__namespace.readFileSync(PACKAGE_JSON_LOCATION, "utf8"));
        // Read common keys
        PACKAGE_JSON_KEYS.forEach((key) => {
            if (packageJSON[key]) {
                if (!tmpConfig[key]) {
                    tmpConfig[key] = packageJSON[key];
                }
            }
        });
        // Read valid Gorilla keys
        if (packageJSON[PACKAGE_JSON_GORILLA_KEY]) {
            VALID_GORILLA_CONFIG_KEYS.forEach((key) => {
                if (packageJSON[PACKAGE_JSON_GORILLA_KEY][key]) {
                    tmpConfig[key] = packageJSON[PACKAGE_JSON_GORILLA_KEY][key];
                }
            });
        }
    }
    return tmpConfig;
};
/*
 * Fetch a GreaseMonkey-formatted banner text, which will
 * prepend the script itself.
 */
const getBanner = (config, quiet = false) => {
    const invalidItems = Object.keys(config).filter((key) => !VALID_GORILLA_CONFIG_KEYS.includes(key));
    if (invalidItems.length > 0 && !quiet) {
        const msg = `${WARN_MSG.EXPECT_GM_KEYS} ${invalidItems.join(", ")}`;
        console.warn(msg);
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

const typescript = require("rollup-plugin-typescript");
//Validate config input
const { input, output, config, quiet } = validate();
// Get config values
const configJSON = getConfig(config);
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
