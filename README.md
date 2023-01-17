<h2 align="center">🦍 Gorilla 🦍</h2>
<h3 align="center">Stop monkeying around and write better scripts</h3>

<p align="center">
  <span>
    🙈 🙉 🙊
  </span><br/>
  <em>
    🍌 GreaseMonkey · TamperMonkey 🍌
  </em>
</p>

<p align="center">
  <a href="https://twitter.com/acdlite/status/974390255393505280">
    <img alt="Blazing Fast" src="https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg?style=flat-square">
    </a>
    <img src="https://img.shields.io/github/repo-size/apsking/gorilla?style=flat-square"></a>
  <br/>
  <a href="https://www.npmjs.com/package/gorilla-build">
    <img alt="npm version" src="https://img.shields.io/npm/v/gorilla-build.svg?style=flat-square">
  </a>
  <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  <a href="https://github.com/apsking/gorilla/actions?query=workflow%3A%22Node.js+CI%22"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/apsking/gorilla/Node.js%20CI?style=flat-square"></a>
  </br>
  </br>
  <a href="https://www.buymeacoffee.com/apsking">
    <img alt="buy me a coffee" src="https://img.shields.io/badge/-Buy%20me%20a%20%E2%98%95-blue?style=flat-square"/>
  </a>
</p>

## Intro

Gorilla is a blazing fast, TypeScript build tool for creating better
GreaseMonkey scripts. It handles the complex build chain, so you don't
have to.

## Get started

### Input

`helper.ts`

<!-- prettier-ignore -->
```js
export const hello = (name:string) => {
    console.log(`Hello ${name}!`);
}
```

`main.ts`

<!-- prettier-ignore -->
```js
import { hello } from './helper';

hello('world');
```

`package.json`

<!-- prettier-ignore -->
```js
...
"scripts": {
    "build": "gorilla --input ./main.ts --output ./script.user.js"
  },
...
```

### Output

`script.user.js`

<!-- prettier-ignore -->
```js
// ==UserScript==
// @name            New Userscript
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description    Gorilla-built, rock-solid, Monkey script
// @updateURL
// @downloadURL
// @author          You
// @include         https://**
//
// Created with love using Gorilla
// ==/UserScript==

(function () {
  'use strict';

  function greet(name) {
      console.log(`Hello, ${name}!`);
  }

  greet("This is a greeting");

}());
```

## Samples

You can find a [collection of samples, here](https://github.com/apsking/gorilla-samples).

## Options

### Help (`--help`)

Display help menu.

eg.

```
gorilla --help
```

### Input (`--input, -i`)

The input handler for your script.

**Note:** While not required, Gorilla recommends writing your scripts in `TypeScript`.

eg.

```
gorilla --input ./my-input-file.ts ...
```

### Output (`--output, -o`)

The input handler for your script.

**Note:** While not required, GreaseMonkey scripts should end with `.user.js`.

eg.

```
gorilla --output ./my-script.user.js ...
```

### Config (`--config, -c`)

JSON input Gorilla config including GreaseMonkey metadata block data.

eg.

```
gorilla --config ./my-config.json ...
```

### Quiet (`--quiet, -q`)

Hide all warning messages.

eg.

```
gorilla --quiet true ...
```

### Minify (`--minify, -m`)

Minify the output code.

eg.

```
gorilla --minify ...
```

## Config

The config is based off of the officially supported Metadata Block items found here: https://wiki.greasespot.net/Metadata_Block

The following JSON keys are supported by GreaseMonkey:

- `author` - (`string`) - Author of the script
- `description` - (`string`) - Description of the script
- `exclude` - (`string[]`) - URLs to exclude the script from
- `grant` - (`string[]`) - Permissions to grant to the script
- `icon` - (`string`) - Icon for the script
- `include` - (`string[]`) - URLs to include the script in
- `match` - (`string[]`) - URLs to match the script in
- `name` - (`string`) - Name of the script
- `namespace` - (`string`) - Namespace of the script
- `noframes` - (`string`) - Whether or not to run in frames
- `require` - (`string[]`) - Scripts to include within the script
- `resource` - (`string[]`) - Resources to include within the script
- `version` - (`string`) - Version number of the script
- `updateURL` - (`string`) - URL location for script updates
- `downloadURL` - (`string`) - URL location for script download

The config will be constructed by both the optional `config` argument and with information from the `package.json` file for
your current project. Some information will be take from the root of your `package.json` (eg. `author`, `name`, etc.). Other information can be defined in a `gorilla` key in your `package.json`. For example:

```
...
"name": "This is my awesome script package.json!",
...
"gorilla": {
  "include": ["this_key", "and this one"],
  "updateURL": "this_url"
}
```

NOTE - any valid keys in the `gorilla` will override anything else from the root `package.json`!
