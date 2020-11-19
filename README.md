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
    <img src="https://img.shields.io/github/repo-size/apsking/gorilla"></a>
  <br/>
  <a href="https://www.npmjs.com/package/prettier">
    <img alt="npm version" src="https://img.shields.io/npm/v/gorilla-build.svg?style=flat-square">
  </a>
  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
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
// @name    New Userscript
// @namespace    http://tampermonkey.net/
// @version    0.1
// @description    Gorilla-built, rock-solid, Monkey script
// @updateURL    
// @downloadURL    
// @author    You
// @match    http://*/*
// Created with love using Gorilla
// ==/UserScript==

var hello = function (name) {
    console.log("Hello " + name + "!");
};

hello('world');
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

JSON input Gorilla config including GreaseMonkey metablock data.

eg.

```
gorilla --config ./my-config.json ...
```

## Config

The config is based off of the officially supported MetaBlock items found here: https://wiki.greasespot.net/Metadata_Block

The following JSON keys are supported:

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

If no config is supplied, the following default config is used:

```
{
  "name": "New Userscript",
  "namespace": "http://tampermonkey.net/",
  "version": "0.1",
  "description": "Gorilla-built, rock-solid, Monkey script",
  "updateURL": "",
  "downloadURL": "",
  "author": "You",
  "include": [],
  "match": ["http://*/*"],
  "grant": [],
}
```
