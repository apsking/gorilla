<h2 align="center">Gorilla</h2>
<h3 align="center">Stop monkeying around and write better scripts</h3>

<p align="center">
  <em>
    GreaseMonkey · TamperMonkey
  </em>
</p>

## Intro

Gorilla is a blazing fast, TypeScript build tool for creating better
GreaseMonkey scripts. It handles the complex build chain, so you don't
have to.

### Input

`package.json`

<!-- prettier-ignore -->
```js
...
"scripts": {
    "build": "gorilla --input ./main.ts --output ./script.user.js"
  },
...
```

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
