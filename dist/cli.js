#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const rollup_1 = require("rollup");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const plugin_typescript_1 = tslib_1.__importDefault(require("@rollup/plugin-typescript"));
const banner_1 = tslib_1.__importDefault(require("./banner"));
const constants_1 = require("./constants");
const validate_1 = tslib_1.__importDefault(require("./validate"));
//Validate config input
const { input, output, config } = validate_1.default();
// Default to config, if not provided
const configJSON = config && config !== ""
    ? JSON.parse(fs.readFileSync(config, "utf8"))
    : constants_1.DEFAULT_CONFIG;
// Create banner text from config
const banner = banner_1.default(configJSON);
// Create Rollup config
const outputConfig = {
    file: output,
    banner: banner,
    format: "iife",
};
const rollupConfig = {
    input,
    output: outputConfig,
    plugins: [plugin_typescript_1.default(), plugin_node_resolve_1.nodeResolve()],
};
// Call rollup
rollup_1.rollup(rollupConfig)
    .then(async (bundle) => {
    await bundle.generate(outputConfig);
    return await bundle.write(outputConfig);
})
    .then(() => console.log("Gorilla smash complete!"));
